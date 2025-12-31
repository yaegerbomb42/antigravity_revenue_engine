// ============================================================================
// Generation Hook
// ============================================================================
// React hook for managing the script generation process
// Provides state management, progress tracking, and error handling

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GeneratedScript, ViralityScore } from '@/types';

// ============================================================================
// Types
// ============================================================================

export type GenerationStatus = 
  | 'idle' 
  | 'extracting' 
  | 'analyzing' 
  | 'generating' 
  | 'complete' 
  | 'error';

export interface GenerationState {
  status: GenerationStatus;
  progress: number;
  progressMessage: string;
  scripts: GeneratedScript[];
  viralityScore: ViralityScore | null;
  error: string | null;
  url: string;
  startedAt: number | null;
  completedAt: number | null;
}

export interface GenerationOptions {
  platform?: 'tiktok' | 'reels' | 'shorts' | 'all';
  scriptCount?: number;
  duration?: number;
  tone?: string;
  includeHashtags?: boolean;
  includeMusic?: boolean;
}

export interface UseGenerationReturn {
  // State
  state: GenerationState;
  isGenerating: boolean;
  isComplete: boolean;
  hasError: boolean;
  duration: number;
  
  // Actions
  generate: (url: string, options?: GenerationOptions) => Promise<void>;
  reset: () => void;
  retry: () => Promise<void>;
  
  // Script Actions
  copyScript: (index: number) => Promise<boolean>;
  downloadScript: (index: number, format: 'txt' | 'json') => void;
  
  // Utilities
  getProgressPercentage: () => number;
  getEstimatedTimeRemaining: () => number;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: GenerationState = {
  status: 'idle',
  progress: 0,
  progressMessage: '',
  scripts: [],
  viralityScore: null,
  error: null,
  url: '',
  startedAt: null,
  completedAt: null
};

// ============================================================================
// Progress Messages
// ============================================================================

const PROGRESS_STAGES: Record<GenerationStatus, { message: string; progress: number }> = {
  idle: { message: '', progress: 0 },
  extracting: { message: 'Extracting video transcript...', progress: 15 },
  analyzing: { message: 'Analyzing content for virality...', progress: 45 },
  generating: { message: 'Generating viral scripts...', progress: 75 },
  complete: { message: 'Generation complete!', progress: 100 },
  error: { message: 'An error occurred', progress: 0 }
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useGeneration(): UseGenerationReturn {
  const [state, setState] = useState<GenerationState>(initialState);
  const lastOptionsRef = useRef<GenerationOptions | undefined>();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Derived state
  const isGenerating = ['extracting', 'analyzing', 'generating'].includes(state.status);
  const isComplete = state.status === 'complete';
  const hasError = state.status === 'error';
  const duration = state.startedAt 
    ? (state.completedAt || Date.now()) - state.startedAt 
    : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<GenerationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set generation stage
   */
  const setStage = useCallback((status: GenerationStatus) => {
    const stage = PROGRESS_STAGES[status];
    updateState({
      status,
      progress: stage.progress,
      progressMessage: stage.message
    });
  }, [updateState]);

  /**
   * Generate scripts from YouTube URL
   */
  const generate = useCallback(async (url: string, options?: GenerationOptions) => {
    // Validate URL
    if (!url || !isValidYouTubeUrl(url)) {
      updateState({
        status: 'error',
        error: 'Please enter a valid YouTube URL'
      });
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastOptionsRef.current = options;

    try {
      // Initialize generation
      updateState({
        ...initialState,
        status: 'extracting',
        progress: 5,
        progressMessage: 'Starting generation...',
        url,
        startedAt: Date.now()
      });

      // Simulate progress stages for better UX
      await simulateProgress(
        () => setStage('extracting'),
        () => setStage('analyzing'),
        () => setStage('generating'),
        abortControllerRef.current.signal
      );

      // Make API request
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url,
          platform: options?.platform || 'all',
          scriptCount: options?.scriptCount || 3,
          duration: options?.duration || 30,
          tone: options?.tone || 'conversational',
          includeHashtags: options?.includeHashtags ?? true,
          includeMusic: options?.includeMusic ?? true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate scripts`);
      }

      const data = await response.json();

      // Validate response
      if (!data.scripts || !Array.isArray(data.scripts)) {
        throw new Error('Invalid response format from server');
      }

      // Update state with results
      updateState({
        status: 'complete',
        progress: 100,
        progressMessage: 'Generation complete!',
        scripts: data.scripts,
        viralityScore: data.viralityScore || null,
        completedAt: Date.now()
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      updateState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        completedAt: Date.now()
      });
    }
  }, [updateState, setStage]);

  /**
   * Reset generation state
   */
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(initialState);
  }, []);

  /**
   * Retry last generation
   */
  const retry = useCallback(async () => {
    if (state.url) {
      await generate(state.url, lastOptionsRef.current);
    }
  }, [state.url, generate]);

  /**
   * Copy script to clipboard
   */
  const copyScript = useCallback(async (index: number): Promise<boolean> => {
    const script = state.scripts[index];
    if (!script) return false;

    try {
      const text = formatScriptForCopy(script);
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy script:', error);
      return false;
    }
  }, [state.scripts]);

  /**
   * Download script as file
   */
  const downloadScript = useCallback((index: number, format: 'txt' | 'json') => {
    const script = state.scripts[index];
    if (!script) return;

    const content = format === 'json' 
      ? JSON.stringify(script, null, 2)
      : formatScriptForCopy(script);

    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `viral-script-${index + 1}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state.scripts]);

  /**
   * Get current progress percentage
   */
  const getProgressPercentage = useCallback((): number => {
    return state.progress;
  }, [state.progress]);

  /**
   * Get estimated time remaining in milliseconds
   */
  const getEstimatedTimeRemaining = useCallback((): number => {
    if (!state.startedAt || state.progress === 0 || state.progress >= 100) {
      return 0;
    }

    const elapsed = Date.now() - state.startedAt;
    const estimatedTotal = (elapsed / state.progress) * 100;
    return Math.max(0, estimatedTotal - elapsed);
  }, [state.startedAt, state.progress]);

  return {
    state,
    isGenerating,
    isComplete,
    hasError,
    duration,
    generate,
    reset,
    retry,
    copyScript,
    downloadScript,
    getProgressPercentage,
    getEstimatedTimeRemaining
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate YouTube URL
 */
function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
}

/**
 * Simulate progress stages for better UX
 */
async function simulateProgress(
  onExtract: () => void,
  onAnalyze: () => void,
  onGenerate: () => void,
  signal: AbortSignal
): Promise<void> {
  const delays = [500, 800, 600];
  
  onExtract();
  await delay(delays[0], signal);
  
  onAnalyze();
  await delay(delays[1], signal);
  
  onGenerate();
  await delay(delays[2], signal);
}

/**
 * Delay with abort support
 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}

/**
 * Format script for clipboard copy
 */
function formatScriptForCopy(script: GeneratedScript): string {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════');
  lines.push(`📱 ${script.platform.toUpperCase()} VIRAL SCRIPT`);
  lines.push('═══════════════════════════════════════');
  lines.push('');
  
  // Hook
  lines.push('🎣 HOOK:');
  lines.push(script.hook);
  lines.push('');
  
  // Full script
  lines.push('📝 SCRIPT:');
  lines.push(script.fullScript);
  lines.push('');
  
  // Call to action
  if (script.callToAction) {
    lines.push('🎯 CALL TO ACTION:');
    lines.push(script.callToAction);
    lines.push('');
  }
  
  // Hashtags
  if (script.hashtags && script.hashtags.length > 0) {
    lines.push('🏷️ HASHTAGS:');
    lines.push(script.hashtags.join(' '));
    lines.push('');
  }
  
  // Thumbnail
  if (script.thumbnailSuggestion) {
    lines.push('🖼️ THUMBNAIL SUGGESTION:');
    lines.push(script.thumbnailSuggestion);
    lines.push('');
  }
  
  // Music
  if (script.musicSuggestion) {
    lines.push('🎵 MUSIC SUGGESTION:');
    lines.push(script.musicSuggestion);
    lines.push('');
  }
  
  // Stats
  lines.push('───────────────────────────────────────');
  lines.push(`⏱️ Duration: ${script.estimatedDuration}s`);
  if (script.viralityScore) {
    lines.push(`🔥 Virality Score: ${Math.round(script.viralityScore.overall * 100)}%`);
  }
  lines.push('───────────────────────────────────────');
  lines.push('');
  lines.push('Generated by GravityClip AI');
  
  return lines.join('\n');
}

// ============================================================================
// Additional Hooks
// ============================================================================

/**
 * Hook for tracking generation history
 */
export function useGenerationHistory(maxItems: number = 50) {
  const [history, setHistory] = useState<GenerationState[]>([]);

  const addToHistory = useCallback((state: GenerationState) => {
    if (state.status === 'complete' && state.scripts.length > 0) {
      setHistory(prev => {
        const newHistory = [state, ...prev].slice(0, maxItems);
        // Persist to localStorage
        try {
          localStorage.setItem('generation_history', JSON.stringify(newHistory));
        } catch (e) {
          console.warn('Failed to persist history:', e);
        }
        return newHistory;
      });
    }
  }, [maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('generation_history');
  }, []);

  const loadHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem('generation_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    addToHistory,
    clearHistory,
    loadHistory
  };
}

/**
 * Hook for generation statistics
 */
export function useGenerationStats() {
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalScripts: 0,
    avgViralityScore: 0,
    avgDuration: 0,
    platformBreakdown: {} as Record<string, number>
  });

  const updateStats = useCallback((generations: GenerationState[]) => {
    const completed = generations.filter(g => g.status === 'complete');
    
    if (completed.length === 0) {
      return;
    }

    const allScripts = completed.flatMap(g => g.scripts);
    const platformCounts: Record<string, number> = {};
    let totalVirality = 0;
    let totalDuration = 0;
    let viralityCount = 0;

    allScripts.forEach(script => {
      platformCounts[script.platform] = (platformCounts[script.platform] || 0) + 1;
      totalDuration += script.estimatedDuration || 0;
      if (script.viralityScore) {
        totalVirality += script.viralityScore.overall;
        viralityCount++;
      }
    });

    setStats({
      totalGenerations: completed.length,
      totalScripts: allScripts.length,
      avgViralityScore: viralityCount > 0 ? totalVirality / viralityCount : 0,
      avgDuration: allScripts.length > 0 ? totalDuration / allScripts.length : 0,
      platformBreakdown: platformCounts
    });
  }, []);

  return { stats, updateStats };
}

export default useGeneration;
