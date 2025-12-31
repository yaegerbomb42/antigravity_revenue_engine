// ============================================================================
// Script Generation API Route
// ============================================================================
// Main API endpoint for generating viral short-form scripts from YouTube URLs
// Integrates NLP analysis, virality scoring, and content generation engines

import { NextResponse } from 'next/server';
import { tokenizer, tokenize, getWordFrequencies } from '@/lib/nlp/tokenizer';
import { sentenceSplitter, splitIntoSentences } from '@/lib/nlp/sentence-splitter';
import { sentimentAnalyzer, analyzeSentiment, analyzeEmotions } from '@/lib/nlp/sentiment-analyzer';
import { nerRecognizer, recognizeEntities, extractPeople, extractOrganizations } from '@/lib/nlp/named-entity-recognizer';
import { keywordExtractor, extractKeywords } from '@/lib/nlp/keyword-extractor';
import { transcriptExtractor } from '@/lib/youtube/transcript-extractor';
import { viralityScorer, scoreVirality } from '@/lib/algorithms/virality-scorer';
import { scriptGenerator, generateScripts } from '@/lib/content/script-generator';
import { engagementPredictor, predictEngagement } from '@/lib/analytics/engagement-predictor';
import { Script, SentimentScore, EmotionAnalysis, NamedEntity, Sentence, TopicCluster } from '@/types';
import type { ViralityScore } from '@/lib/algorithms/virality-scorer';
import type { GeneratedScript } from '@/lib/content/script-generator';
import type { ExtractedKeywords } from '@/lib/nlp/keyword-extractor';

// ============================================================================
// Types
// ============================================================================

interface GenerationRequest {
  url: string;
  platform?: 'tiktok' | 'reels' | 'shorts' | 'all';
  scriptCount?: number;
  duration?: number;
  tone?: string;
  includeHashtags?: boolean;
  includeMusic?: boolean;
}

interface GenerationResponse {
  scripts: GeneratedScript[];
  viralityScore: ViralityScore;
  analysis: ContentAnalysis;
  predictions: EngagementPredictions;
  metadata: GenerationMetadata;
}

interface ContentAnalysis {
  sentiment: SentimentScore;
  emotions: EmotionAnalysis;
  keywords: ExtractedKeywords;
  entities: NamedEntity[];
  topics: string[];
  complexity: ComplexityMetrics;
}

interface ComplexityMetrics {
  readingLevel: string;
  avgSentenceLength: number;
  lexicalDiversity: number;
  technicalTerms: number;
}

interface EngagementPredictions {
  estimatedViews: { min: number; expected: number; max: number };
  estimatedEngagementRate: number;
  viralProbability: number;
  bestPostingTimes: string[];
  growthTrajectory: string;
}

interface GenerationMetadata {
  processingTime: number;
  videoId: string;
  videoTitle: string;
  transcriptLength: number;
  generatedAt: string;
}

// ============================================================================
// Main Route Handler
// ============================================================================

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await req.json() as GenerationRequest;
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      );
    }

    // Configuration
    const config = {
      platform: body.platform || 'all',
      scriptCount: Math.min(Math.max(body.scriptCount || 3, 1), 5),
      duration: Math.min(Math.max(body.duration || 30, 15), 60),
      tone: body.tone || 'conversational',
      includeHashtags: body.includeHashtags ?? true,
      includeMusic: body.includeMusic ?? true
    };

    // Extract transcript and metadata
    const transcript = await transcriptExtractor.extract(url);
    
    if (!transcript || !transcript.fullText || transcript.fullText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract sufficient content from video' },
        { status: 422 }
      );
    }

    // Perform comprehensive NLP analysis
    const analysis = analyzeContent(transcript.fullText);

    // Calculate virality score
    const viralityInput = {
      text: transcript.fullText,
      sentences: analysis.sentences.map((s: Sentence) => s.text),
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      entities: analysis.entities,
      topics: analysis.keywords.topics || [],
      keywords: analysis.keywords.keywords.map(k => k.keyword)
    };

    const viralityScore = viralityScorer.score(viralityInput);

    // Generate scripts using content generation engine
    const scripts = generateViralScripts(
      transcript.fullText,
      analysis,
      viralityScore,
      config
    );

    // Predict engagement for each script
    const predictions = generatePredictions(scripts[0], config.platform);

    // Build response
    const response: GenerationResponse = {
      scripts,
      viralityScore,
      analysis: {
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        keywords: analysis.keywords,
        entities: analysis.entities.slice(0, 20),
        topics: analysis.keywords.topics?.map((c: TopicCluster) => c.label) || [],
        complexity: analysis.complexity
      },
      predictions,
      metadata: {
        processingTime: Date.now() - startTime,
        videoId,
        videoTitle: transcript.metadata?.title || 'Unknown',
        transcriptLength: transcript.fullText.length,
        generatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate scripts',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Content Analysis
// ============================================================================

interface FullAnalysis {
  sentiment: SentimentScore;
  emotions: EmotionAnalysis;
  keywords: ExtractedKeywords;
  entities: NamedEntity[];
  sentences: ReturnType<typeof splitIntoSentences>;
  complexity: ComplexityMetrics;
}

function analyzeContent(text: string): FullAnalysis {
  // Tokenize and split into sentences
  const tokens = tokenize(text);
  const sentences = splitIntoSentences(text);

  // Sentiment and emotion analysis
  const sentiment = analyzeSentiment(text);
  const emotions = analyzeEmotions(text);

  // Extract keywords and entities
  const keywords = extractKeywords(text);
  const entities = recognizeEntities(text);

  // Calculate complexity metrics
  const complexity = calculateComplexity(text, sentences, tokens);

  return {
    sentiment,
    emotions,
    keywords,
    entities,
    sentences,
    complexity
  };
}

function calculateComplexity(
  text: string,
  sentences: ReturnType<typeof splitIntoSentences>,
  tokens: ReturnType<typeof tokenize>
): ComplexityMetrics {
  const words = tokens.filter(t => !t.isStopWord);
  const uniqueWords = new Set(words.map(w => w.lemma));
  
  // Average sentence length
  const avgSentenceLength = sentences.length > 0
    ? text.split(/\s+/).length / sentences.length
    : 0;

  // Lexical diversity (type-token ratio)
  const lexicalDiversity = words.length > 0 
    ? uniqueWords.size / words.length 
    : 0;

  // Count technical/complex terms (words with > 3 syllables)
  const technicalTerms = words.filter(w => countSyllables(w.text) > 3).length;

  // Determine reading level
  const readingLevel = determineReadingLevel(avgSentenceLength, lexicalDiversity);

  return {
    readingLevel,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    lexicalDiversity: Math.round(lexicalDiversity * 100) / 100,
    technicalTerms
  };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function determineReadingLevel(avgSentenceLength: number, lexicalDiversity: number): string {
  const score = (avgSentenceLength * 0.5) + (lexicalDiversity * 50);
  
  if (score < 10) return 'Very Easy';
  if (score < 15) return 'Easy';
  if (score < 20) return 'Moderate';
  if (score < 25) return 'Challenging';
  return 'Advanced';
}

// ============================================================================
// Hook Extraction
// ============================================================================

function extractBestHook(text: string, analysis: FullAnalysis): string {
  const sentences = analysis.sentences;
  
  if (sentences.length === 0) {
    return text.slice(0, 100);
  }

  // Score each sentence as a potential hook
  const scoredSentences = sentences.slice(0, 10).map((sentence, index) => {
    let score = 0;

    // Position bonus (first few sentences preferred)
    score += Math.max(0, (5 - index) * 0.1);

    // Sentiment strength bonus (handle both number and object format)
    const rawSentiment = (sentence as unknown as { sentiment: number | SentimentScore }).sentiment;
    const sentimentStrength = typeof rawSentiment === 'number' 
      ? Math.abs(rawSentiment)
      : Math.abs(rawSentiment?.compound ?? 0);
    score += sentimentStrength * 0.3;

    // Question bonus (handle both type and isQuestion format)
    const sentenceType = (sentence as unknown as { type?: string }).type;
    if (sentenceType === 'question' || sentence.isQuestion) {
      score += 0.25;
    }

    // Exclamation bonus
    if (sentenceType === 'exclamation' || sentence.isExclamation) {
      score += 0.15;
    }

    // Length penalty (too short or too long)
    const wordCount = sentence.text.split(/\s+/).length;
    if (wordCount >= 5 && wordCount <= 20) {
      score += 0.2;
    } else if (wordCount < 5) {
      score -= 0.2;
    } else if (wordCount > 30) {
      score -= 0.3;
    }

    // Hook word patterns
    const hookPatterns = [
      /^(you|your|you're|you've)/i,
      /^(this|here|here's)/i,
      /^(stop|wait|listen|watch)/i,
      /^(why|what|how|when|where)/i,
      /^(i|i'm|i've|i'll)/i,
      /never|always|most|every/i,
      /secret|truth|mistake|hack|tip/i,
      /\d+/
    ];

    for (const pattern of hookPatterns) {
      if (pattern.test(sentence.text)) {
        score += 0.1;
      }
    }

    return { sentence: sentence.text, score };
  });

  // Sort by score and return best
  scoredSentences.sort((a, b) => b.score - a.score);
  
  return scoredSentences[0]?.sentence || text.slice(0, 100);
}

// ============================================================================
// Script Generation
// ============================================================================

interface ScriptConfig {
  platform: string;
  scriptCount: number;
  duration: number;
  tone: string;
  includeHashtags: boolean;
  includeMusic: boolean;
}

function generateViralScripts(
  transcript: string,
  analysis: FullAnalysis,
  viralityScore: ViralityScore,
  config: ScriptConfig
): GeneratedScript[] {
  const scripts: GeneratedScript[] = [];
  const platforms = config.platform === 'all' 
    ? ['tiktok', 'reels', 'shorts'] as const
    : [config.platform as 'tiktok' | 'reels' | 'shorts'];

  // Determine content type based on analysis
  const contentType = determineContentType(analysis);

  // Generate scripts for each platform
  for (const platform of platforms) {
    const platformScripts = scriptGenerator.generate({
      text: transcript,
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      entities: analysis.entities,
      keywords: analysis.keywords.keywords.map(k => k.keyword),
      keyphrases: analysis.keywords.keyphrases?.map(kp => kp.phrase) || [],
      topics: analysis.keywords.topics || [],
      segments: [],
      chapters: []
    }, {
      platform,
      contentType,
      targetDuration: config.duration,
      tone: (config.tone === 'conversational' ? 'casual' : config.tone) as 'professional' | 'casual' | 'humorous' | 'dramatic' | 'educational',
      includeCallToAction: true
    }, Math.ceil(config.scriptCount / platforms.length));

    scripts.push(...platformScripts.map(script => transformScript(script, platform, viralityScore)));
  }

  // Ensure we have the requested number of scripts
  return scripts.slice(0, config.scriptCount);
}

function determineContentType(analysis: FullAnalysis): 'educational' | 'entertainment' | 'promotional' | 'storytelling' {
  const { emotions, sentiment, keywords } = analysis;

  // Check for educational indicators
  const educationalKeywords = ['how', 'why', 'what', 'learn', 'tip', 'hack', 'guide', 'tutorial'];
  const hasEducationalKeywords = keywords.keywords.some(k => 
    educationalKeywords.some(ek => k.keyword.toLowerCase().includes(ek))
  );

  if (hasEducationalKeywords && sentiment.confidence > 0.5) {
    return 'educational';
  }

  // Check for entertainment indicators (handle both primary and dominant property names)
  const dominantEmotion = (emotions as unknown as { primary?: string; dominant?: string }).primary || 
                          (emotions as unknown as { dominant?: string }).dominant;
  if (dominantEmotion === 'joy' || dominantEmotion === 'surprise') {
    return 'entertainment';
  }

  // Check for promotional indicators
  const promotionalKeywords = ['buy', 'sale', 'offer', 'discount', 'limited', 'exclusive'];
  const hasPromotionalKeywords = keywords.keywords.some(k =>
    promotionalKeywords.some(pk => k.keyword.toLowerCase().includes(pk))
  );

  if (hasPromotionalKeywords) {
    return 'promotional';
  }

  // Default to storytelling
  return 'storytelling';
}

function transformScript(
  script: ReturnType<typeof scriptGenerator.generate>[0],
  platform: 'tiktok' | 'reels' | 'shorts',
  viralityScore: ViralityScore
): GeneratedScript {
  return {
    ...script,
    id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    platform,
    viralityScore: viralityScore.overall
  };
}

// ============================================================================
// Engagement Predictions
// ============================================================================

function generatePredictions(script: GeneratedScript, platform: string): EngagementPredictions {
  const prediction = engagementPredictor.predict({
    hook: script.hook,
    content: script.fullScript,
    duration: script.duration,
    platform: (platform === 'all' ? 'tiktok' : platform) as 'tiktok' | 'reels' | 'shorts',
    hashtags: script.hashtags,
    sentiment: undefined,
    emotions: undefined
  });

  return {
    estimatedViews: {
      min: prediction.estimatedViews.minimum,
      expected: prediction.estimatedViews.expected,
      max: prediction.estimatedViews.maximum
    },
    estimatedEngagementRate: prediction.estimatedLikes.rate + prediction.estimatedComments.rate,
    viralProbability: prediction.viralProbability,
    bestPostingTimes: prediction.peakPerformanceWindow.bestPostingTimes
      .slice(0, 3)
      .map(t => `${t.day} at ${t.hour}:00`),
    growthTrajectory: prediction.growthTrajectory.type
  };
}

// ============================================================================
// URL Validation
// ============================================================================

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// ============================================================================
// GET Handler (Health Check)
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'GravityClip AI Script Generator',
    version: '2.0.0',
    endpoints: {
      POST: 'Generate viral scripts from YouTube URL'
    },
    timestamp: new Date().toISOString()
  });
}
