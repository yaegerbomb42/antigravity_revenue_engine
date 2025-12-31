// ============================================================================
// Script Card Component
// ============================================================================
// Displays generated viral scripts with copy, download, and share functionality
// Features platform-specific styling and virality score visualization

'use client';

import React, { useState, useCallback } from 'react';
import type { GeneratedScript } from '@/lib/content/script-generator';
import type { ViralityScore } from '@/lib/algorithms/virality-scorer';

// ============================================================================
// Types
// ============================================================================

export interface ScriptCardProps {
  script: GeneratedScript;
  index: number;
  onCopy?: (index: number) => Promise<boolean>;
  onDownload?: (index: number, format: 'txt' | 'json') => void;
  onShare?: (index: number) => void;
  onEdit?: (index: number) => void;
  isExpanded?: boolean;
  className?: string;
}

// ============================================================================
// Platform Configuration
// ============================================================================

const PLATFORM_CONFIG: Record<string, PlatformTheme> = {
  tiktok: {
    name: 'TikTok',
    color: '#00f2ea',
    bgColor: 'rgba(0, 242, 234, 0.1)',
    borderColor: 'rgba(0, 242, 234, 0.3)',
    icon: '📱',
    maxDuration: 180
  },
  reels: {
    name: 'Reels',
    color: '#e4405f',
    bgColor: 'rgba(228, 64, 95, 0.1)',
    borderColor: 'rgba(228, 64, 95, 0.3)',
    icon: '📸',
    maxDuration: 90
  },
  shorts: {
    name: 'Shorts',
    color: '#ff0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: 'rgba(255, 0, 0, 0.3)',
    icon: '▶️',
    maxDuration: 60
  }
};

interface PlatformTheme {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  maxDuration: number;
}

// ============================================================================
// Component
// ============================================================================

export function ScriptCard({
  script,
  index,
  onCopy,
  onDownload,
  onShare,
  onEdit,
  isExpanded: initialExpanded = false,
  className = ''
}: ScriptCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isCopied, setIsCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const platform = PLATFORM_CONFIG[script.platform] || PLATFORM_CONFIG.tiktok;

  // Handle copy action
  const handleCopy = useCallback(async () => {
    if (onCopy) {
      const success = await onCopy(index);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  }, [onCopy, index]);

  // Handle download action
  const handleDownload = useCallback((format: 'txt' | 'json') => {
    if (onDownload) {
      onDownload(index, format);
    }
    setShowDownloadMenu(false);
  }, [onDownload, index]);

  // Calculate virality display
  const viralityPercent = script.viralityScore 
    ? Math.round(script.viralityScore.overall * 100) 
    : 0;

  const viralityLevel = getViralityLevel(viralityPercent);

  return (
    <div 
      className={`script-card ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        border: `1px solid ${platform.borderColor}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div 
        className="script-card-header"
        style={{
          padding: '16px 20px',
          background: platform.bgColor,
          borderBottom: `1px solid ${platform.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{platform.icon}</span>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 600,
              color: platform.color 
            }}>
              {platform.name} Script #{index + 1}
            </h3>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.6)' 
            }}>
              {script.estimatedDuration}s • {script.tone || 'conversational'} tone
            </p>
          </div>
        </div>

        {/* Virality Score Badge */}
        <div 
          className="virality-badge"
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: viralityLevel.bgColor,
            border: `1px solid ${viralityLevel.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '14px' }}>{viralityLevel.icon}</span>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: viralityLevel.color 
          }}>
            {viralityPercent}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="script-card-content" style={{ padding: '20px' }}>
        {/* Hook Section */}
        <div className="script-section" style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '8px' 
          }}>
            <span style={{ fontSize: '16px' }}>🎣</span>
            <h4 style={{ 
              margin: 0, 
              fontSize: '12px', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'rgba(255, 255, 255, 0.5)' 
            }}>
              Hook
            </h4>
          </div>
          <p style={{ 
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.4,
            color: '#fff',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            borderLeft: `3px solid ${platform.color}`
          }}>
            {script.hook}
          </p>
        </div>

        {/* Full Script Section */}
        <div className="script-section" style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📝</span>
              <h4 style={{ 
                margin: 0, 
                fontSize: '12px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                Full Script
              </h4>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: 'none',
                border: 'none',
                color: platform.color,
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
          <div 
            style={{ 
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              maxHeight: isExpanded ? 'none' : '120px',
              overflow: 'hidden',
              position: 'relative',
              whiteSpace: 'pre-wrap'
            }}
          >
            {script.fullScript}
            {!isExpanded && script.fullScript.length > 200 && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))'
              }} />
            )}
          </div>
        </div>

        {/* Call to Action */}
        {script.callToAction && (
          <div className="script-section" style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '8px' 
            }}>
              <span style={{ fontSize: '16px' }}>🎯</span>
              <h4 style={{ 
                margin: 0, 
                fontSize: '12px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                Call to Action
              </h4>
            </div>
            <p style={{ 
              margin: 0,
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              padding: '12px 16px',
              background: `linear-gradient(135deg, ${platform.bgColor}, transparent)`,
              borderRadius: '8px'
            }}>
              {script.callToAction}
            </p>
          </div>
        )}

        {/* Hashtags */}
        {script.hashtags && script.hashtags.length > 0 && (
          <div className="script-section" style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '8px' 
            }}>
              <span style={{ fontSize: '16px' }}>🏷️</span>
              <h4 style={{ 
                margin: 0, 
                fontSize: '12px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                Hashtags
              </h4>
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px' 
            }}>
              {script.hashtags.map((tag, i) => (
                <span 
                  key={i}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: platform.color
                  }}
                >
                  #{tag.replace('#', '')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* Thumbnail Suggestion */}
          {script.thumbnailSuggestion && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                marginBottom: '4px' 
              }}>
                <span style={{ fontSize: '14px' }}>🖼️</span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)' 
                }}>
                  Thumbnail
                </span>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.75)'
              }}>
                {script.thumbnailSuggestion}
              </p>
            </div>
          )}

          {/* Music Suggestion */}
          {script.musicSuggestion && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                marginBottom: '4px' 
              }}>
                <span style={{ fontSize: '14px' }}>🎵</span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)' 
                }}>
                  Music
                </span>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.75)'
              }}>
                {script.musicSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Virality Breakdown */}
        {script.viralityScore && (
          <ViralityBreakdown score={script.viralityScore} platformColor={platform.color} />
        )}
      </div>

      {/* Actions Footer */}
      <div 
        className="script-card-footer"
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: isCopied ? '#22c55e' : platform.color,
              color: '#000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {isCopied ? '✓ Copied!' : '📋 Copy Script'}
          </button>

          {/* Download Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                border: `1px solid ${platform.borderColor}`,
                background: 'transparent',
                color: platform.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ⬇️ Download
            </button>

            {showDownloadMenu && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '8px',
                background: '#1a1a1a',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                zIndex: 10
              }}>
                <button
                  onClick={() => handleDownload('txt')}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 20px',
                    fontSize: '14px',
                    border: 'none',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  📄 Text File (.txt)
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 20px',
                    fontSize: '14px',
                    border: 'none',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  📊 JSON File (.json)
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(index)}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit
            </button>
          )}
          {onShare && (
            <button
              onClick={() => onShare(index)}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer'
              }}
            >
              🔗 Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Virality Breakdown Component
// ============================================================================

interface ViralityBreakdownProps {
  score: ViralityScore;
  platformColor: string;
}

function ViralityBreakdown({ score, platformColor }: ViralityBreakdownProps) {
  const factors = [
    { key: 'hookStrength', label: 'Hook Strength', icon: '🎣' },
    { key: 'emotionalResonance', label: 'Emotional Impact', icon: '💖' },
    { key: 'trendAlignment', label: 'Trend Alignment', icon: '📈' },
    { key: 'engagementPotential', label: 'Engagement', icon: '💬' },
    { key: 'shareability', label: 'Shareability', icon: '🔄' },
    { key: 'watchTimeRetention', label: 'Watch Time', icon: '⏱️' }
  ];

  return (
    <div style={{
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      marginTop: '8px'
    }}>
      <h4 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '12px', 
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🔥</span> Virality Breakdown
      </h4>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px' 
      }}>
        {factors.map(({ key, label, icon }) => {
          const value = (score as Record<string, number>)[key] || 0;
          const percent = Math.round(value * 100);
          
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <span>{icon} {label}</span>
                <span style={{ fontWeight: 600 }}>{percent}%</span>
              </div>
              <div style={{
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: platformColor,
                  borderRadius: '2px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

interface ViralityLevel {
  level: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function getViralityLevel(percent: number): ViralityLevel {
  if (percent >= 90) {
    return {
      level: 'Viral',
      icon: '🔥',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.2)',
      borderColor: 'rgba(249, 115, 22, 0.4)'
    };
  }
  if (percent >= 75) {
    return {
      level: 'High',
      icon: '⚡',
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 0.4)'
    };
  }
  if (percent >= 60) {
    return {
      level: 'Good',
      icon: '✨',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 0.4)'
    };
  }
  if (percent >= 40) {
    return {
      level: 'Moderate',
      icon: '📊',
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.2)',
      borderColor: 'rgba(234, 179, 8, 0.4)'
    };
  }
  return {
    level: 'Low',
    icon: '📉',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)'
  };
}

// ============================================================================
// Export
// ============================================================================

export default ScriptCard;
