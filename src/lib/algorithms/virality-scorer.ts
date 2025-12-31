// ============================================================================
// Advanced Virality Scoring Engine
// ============================================================================
// Comprehensive algorithm for predicting viral potential of short-form content
// Uses multiple factors: hook strength, emotional resonance, trend alignment,
// engagement prediction, and platform-specific optimization

import { SentimentScore, EmotionAnalysis, NamedEntity, TopicCluster } from '@/types';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface ViralityFactors {
  hookStrength: number;
  emotionalResonance: number;
  trendAlignment: number;
  engagementPotential: number;
  shareability: number;
  watchTimeRetention: number;
  controversyIndex: number;
  relatabilityScore: number;
  curiosityGap: number;
  urgencyFactor: number;
}

export interface ViralityScore {
  overall: number;
  factors: ViralityFactors;
  confidence: number;
  platformScores: PlatformScores;
  recommendations: ViralityRecommendation[];
  predictedPerformance: PerformancePrediction;
}

export interface PlatformScores {
  tiktok: number;
  reels: number;
  youtubeShorts: number;
  twitter: number;
  linkedin: number;
}

export interface ViralityRecommendation {
  category: 'hook' | 'emotion' | 'trend' | 'structure' | 'cta' | 'timing';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  expectedImpact: number;
}

export interface PerformancePrediction {
  estimatedViews: { min: number; max: number; expected: number };
  estimatedEngagement: { likes: number; comments: number; shares: number };
  viralProbability: number;
  peakPerformanceWindow: string;
}

export interface ContentAnalysis {
  text: string;
  sentences: string[];
  sentiment: SentimentScore;
  emotions: EmotionAnalysis;
  entities: NamedEntity[];
  topics: TopicCluster[];
  keywords: string[];
}

export interface HookAnalysis {
  score: number;
  type: HookType;
  strength: 'weak' | 'moderate' | 'strong' | 'exceptional';
  elements: HookElement[];
  suggestions: string[];
}

export type HookType = 
  | 'question'
  | 'shock'
  | 'curiosity'
  | 'controversy'
  | 'promise'
  | 'story'
  | 'challenge'
  | 'secret'
  | 'comparison'
  | 'transformation';

export interface HookElement {
  type: string;
  text: string;
  score: number;
  position: number;
}

// ============================================================================
// Hook Analysis Patterns
// ============================================================================

const HOOK_PATTERNS: Record<HookType, RegExp[]> = {
  question: [
    /^(what|why|how|when|where|who|which|whose|would|could|should|did|do|does|is|are|was|were|can|will|have|has)\s/i,
    /\?$/,
    /ever wondered/i,
    /have you (ever|noticed|thought|seen)/i,
  ],
  shock: [
    /\b(shocking|unbelievable|incredible|insane|crazy|wild|mindblowing|mind-blowing)\b/i,
    /\b(can't believe|won't believe|never believe)\b/i,
    /\b(exposed|revealed|uncovered)\b/i,
    /^(holy|oh my|omg|wtf)/i,
  ],
  curiosity: [
    /\b(secret|hidden|unknown|mysterious|strange|weird)\b/i,
    /\b(nobody knows|few people know|most people don't)\b/i,
    /\b(truth about|real reason|actual)\b/i,
    /\b(you (need to|have to|must) (see|know|hear|watch))\b/i,
  ],
  controversy: [
    /\b(controversial|debate|argument|unpopular opinion)\b/i,
    /\b(hot take|against|vs\.?|versus)\b/i,
    /\b(wrong|mistake|lie|myth|fake)\b/i,
    /\b(overrated|underrated|overhyped)\b/i,
  ],
  promise: [
    /\b(guaranteed|promise|will (help|change|transform|make))\b/i,
    /\b(in (just )?(\d+|one|two|three|five|ten) (minute|second|day|step)s?)\b/i,
    /\b(easy|simple|quick|fast) (way|method|trick|hack)\b/i,
    /\b(finally|at last)\b/i,
  ],
  story: [
    /\b(story|happened|once upon|let me tell)\b/i,
    /\b(so (this|there|i)|this is how)\b/i,
    /\b(last (week|month|year)|yesterday|today)\b/i,
    /^(i|we|they|he|she) (was|were|went|saw|found|discovered)/i,
  ],
  challenge: [
    /\b(challenge|try|attempt|dare|bet)\b/i,
    /\b(can you|try this|test yourself)\b/i,
    /\b(impossible|difficult|hard|tough)\b/i,
    /\b(proof|prove|evidence)\b/i,
  ],
  secret: [
    /\b(secret|insider|exclusive|confidential)\b/i,
    /\b(they don't want you|nobody tells you|hidden)\b/i,
    /\b(leaked|behind the scenes|backstage)\b/i,
    /\b(private|unreleased|unseen)\b/i,
  ],
  comparison: [
    /\b(vs\.?|versus|compared to|better than|worse than)\b/i,
    /\b(difference between|which is better)\b/i,
    /\b(battle|showdown|face-off|comparison)\b/i,
    /\b(before and after|then and now)\b/i,
  ],
  transformation: [
    /\b(transform|transformation|changed|change|evolution)\b/i,
    /\b(glow up|level up|upgrade|improvement)\b/i,
    /\b(from .* to|became|turned into)\b/i,
    /\b(journey|progress|growth)\b/i,
  ],
};

// ============================================================================
// Emotional Trigger Words
// ============================================================================

const EMOTIONAL_TRIGGERS: Record<string, { weight: number; emotions: string[] }> = {
  // High-arousal positive
  amazing: { weight: 0.9, emotions: ['joy', 'surprise'] },
  incredible: { weight: 0.9, emotions: ['surprise', 'joy'] },
  awesome: { weight: 0.85, emotions: ['joy', 'excitement'] },
  fantastic: { weight: 0.85, emotions: ['joy', 'admiration'] },
  brilliant: { weight: 0.8, emotions: ['admiration', 'joy'] },
  extraordinary: { weight: 0.85, emotions: ['surprise', 'admiration'] },
  magnificent: { weight: 0.8, emotions: ['admiration', 'joy'] },
  spectacular: { weight: 0.85, emotions: ['surprise', 'joy'] },
  wonderful: { weight: 0.8, emotions: ['joy', 'gratitude'] },
  phenomenal: { weight: 0.85, emotions: ['surprise', 'admiration'] },
  
  // High-arousal negative
  shocking: { weight: 0.9, emotions: ['surprise', 'fear'] },
  terrifying: { weight: 0.85, emotions: ['fear', 'anxiety'] },
  devastating: { weight: 0.85, emotions: ['sadness', 'fear'] },
  horrifying: { weight: 0.85, emotions: ['fear', 'disgust'] },
  outrageous: { weight: 0.8, emotions: ['anger', 'surprise'] },
  disturbing: { weight: 0.75, emotions: ['fear', 'disgust'] },
  infuriating: { weight: 0.8, emotions: ['anger', 'frustration'] },
  heartbreaking: { weight: 0.85, emotions: ['sadness', 'empathy'] },
  
  // Curiosity triggers
  secret: { weight: 0.8, emotions: ['curiosity', 'intrigue'] },
  mystery: { weight: 0.75, emotions: ['curiosity', 'intrigue'] },
  hidden: { weight: 0.7, emotions: ['curiosity', 'intrigue'] },
  revealed: { weight: 0.75, emotions: ['surprise', 'curiosity'] },
  discovered: { weight: 0.7, emotions: ['surprise', 'curiosity'] },
  unknown: { weight: 0.65, emotions: ['curiosity', 'fear'] },
  unexplained: { weight: 0.7, emotions: ['curiosity', 'mystery'] },
  
  // Urgency triggers
  now: { weight: 0.6, emotions: ['urgency'] },
  immediately: { weight: 0.7, emotions: ['urgency'] },
  urgent: { weight: 0.75, emotions: ['urgency', 'anxiety'] },
  breaking: { weight: 0.8, emotions: ['urgency', 'excitement'] },
  limited: { weight: 0.65, emotions: ['urgency', 'scarcity'] },
  exclusive: { weight: 0.7, emotions: ['exclusivity', 'desire'] },
  
  // Social proof
  everyone: { weight: 0.6, emotions: ['social_proof'] },
  viral: { weight: 0.75, emotions: ['social_proof', 'curiosity'] },
  trending: { weight: 0.7, emotions: ['social_proof', 'fomo'] },
  popular: { weight: 0.55, emotions: ['social_proof'] },
  famous: { weight: 0.6, emotions: ['social_proof', 'admiration'] },
  celebrity: { weight: 0.65, emotions: ['social_proof', 'curiosity'] },
  millionaire: { weight: 0.7, emotions: ['aspiration', 'curiosity'] },
  billionaire: { weight: 0.75, emotions: ['aspiration', 'curiosity'] },
  
  // Fear of missing out
  miss: { weight: 0.6, emotions: ['fomo', 'anxiety'] },
  last: { weight: 0.55, emotions: ['urgency', 'scarcity'] },
  final: { weight: 0.6, emotions: ['urgency', 'finality'] },
  ending: { weight: 0.55, emotions: ['urgency', 'fomo'] },
  running: { weight: 0.5, emotions: ['urgency'] },
  
  // Value proposition
  free: { weight: 0.7, emotions: ['desire', 'excitement'] },
  save: { weight: 0.6, emotions: ['desire', 'relief'] },
  easy: { weight: 0.55, emotions: ['relief', 'desire'] },
  simple: { weight: 0.5, emotions: ['relief'] },
  quick: { weight: 0.55, emotions: ['desire', 'efficiency'] },
  fast: { weight: 0.55, emotions: ['desire', 'efficiency'] },
  guaranteed: { weight: 0.65, emotions: ['trust', 'confidence'] },
  proven: { weight: 0.6, emotions: ['trust', 'confidence'] },
};

// ============================================================================
// Trending Topics Database (would be updated in real-time in production)
// ============================================================================

const TRENDING_TOPICS: Map<string, number> = new Map([
  ['ai', 0.95],
  ['artificial intelligence', 0.95],
  ['chatgpt', 0.9],
  ['openai', 0.85],
  ['machine learning', 0.8],
  ['crypto', 0.7],
  ['bitcoin', 0.7],
  ['nft', 0.5],
  ['metaverse', 0.55],
  ['web3', 0.6],
  ['climate', 0.75],
  ['sustainability', 0.7],
  ['electric vehicles', 0.75],
  ['tesla', 0.8],
  ['space', 0.7],
  ['spacex', 0.75],
  ['health', 0.65],
  ['mental health', 0.8],
  ['wellness', 0.65],
  ['fitness', 0.6],
  ['productivity', 0.7],
  ['remote work', 0.65],
  ['side hustle', 0.75],
  ['passive income', 0.7],
  ['investing', 0.65],
  ['stocks', 0.6],
  ['real estate', 0.6],
  ['travel', 0.65],
  ['food', 0.6],
  ['cooking', 0.55],
  ['fashion', 0.6],
  ['beauty', 0.6],
  ['skincare', 0.65],
  ['relationships', 0.7],
  ['dating', 0.65],
  ['parenting', 0.6],
  ['education', 0.6],
  ['career', 0.65],
  ['entrepreneurship', 0.75],
  ['startup', 0.7],
  ['motivation', 0.65],
  ['self improvement', 0.7],
  ['psychology', 0.65],
  ['science', 0.6],
  ['technology', 0.7],
  ['gaming', 0.65],
  ['movies', 0.55],
  ['music', 0.55],
  ['sports', 0.6],
  ['news', 0.5],
  ['politics', 0.6],
  ['comedy', 0.65],
  ['pets', 0.6],
  ['diy', 0.55],
  ['life hacks', 0.7],
]);

// ============================================================================
// Platform-Specific Optimization Factors
// ============================================================================

interface PlatformFactors {
  optimalLength: { min: number; max: number; ideal: number };
  hookTimeWindow: number;
  hashtagWeight: number;
  trendingBonus: number;
  engagementFactors: Record<string, number>;
  audienceDemographics: { ageRange: string; interests: string[] };
}

const PLATFORM_FACTORS: Record<string, PlatformFactors> = {
  tiktok: {
    optimalLength: { min: 15, max: 60, ideal: 30 },
    hookTimeWindow: 3,
    hashtagWeight: 0.3,
    trendingBonus: 0.4,
    engagementFactors: {
      entertainment: 1.2,
      education: 1.0,
      controversy: 1.3,
      transformation: 1.4,
      challenge: 1.3,
      duet: 1.5,
      trend: 1.4,
    },
    audienceDemographics: { ageRange: '16-34', interests: ['entertainment', 'trends', 'music'] },
  },
  reels: {
    optimalLength: { min: 15, max: 90, ideal: 45 },
    hookTimeWindow: 3,
    hashtagWeight: 0.25,
    trendingBonus: 0.3,
    engagementFactors: {
      aesthetic: 1.3,
      lifestyle: 1.2,
      transformation: 1.4,
      education: 1.1,
      behind_scenes: 1.2,
    },
    audienceDemographics: { ageRange: '18-44', interests: ['lifestyle', 'fashion', 'travel'] },
  },
  youtubeShorts: {
    optimalLength: { min: 30, max: 60, ideal: 50 },
    hookTimeWindow: 5,
    hashtagWeight: 0.15,
    trendingBonus: 0.25,
    engagementFactors: {
      education: 1.3,
      howto: 1.2,
      entertainment: 1.1,
      reaction: 1.2,
      compilation: 1.1,
    },
    audienceDemographics: { ageRange: '18-49', interests: ['education', 'entertainment', 'how-to'] },
  },
  twitter: {
    optimalLength: { min: 10, max: 140, ideal: 60 },
    hookTimeWindow: 2,
    hashtagWeight: 0.2,
    trendingBonus: 0.5,
    engagementFactors: {
      news: 1.4,
      opinion: 1.3,
      controversy: 1.5,
      humor: 1.2,
      thread: 1.3,
    },
    audienceDemographics: { ageRange: '25-54', interests: ['news', 'politics', 'tech'] },
  },
  linkedin: {
    optimalLength: { min: 30, max: 120, ideal: 60 },
    hookTimeWindow: 4,
    hashtagWeight: 0.1,
    trendingBonus: 0.2,
    engagementFactors: {
      professional: 1.3,
      career: 1.2,
      leadership: 1.3,
      industry_insights: 1.4,
      success_story: 1.3,
    },
    audienceDemographics: { ageRange: '25-54', interests: ['career', 'business', 'leadership'] },
  },
};

// ============================================================================
// Virality Scorer Class
// ============================================================================

export class ViralityScorer {
  private cache: Map<string, ViralityScore> = new Map();
  private readonly cacheMaxSize = 500;

  constructor() {}

  // Main scoring method
  public score(analysis: ContentAnalysis): ViralityScore {
    const cacheKey = this.generateCacheKey(analysis);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const factors = this.calculateFactors(analysis);
    const platformScores = this.calculatePlatformScores(analysis, factors);
    const recommendations = this.generateRecommendations(analysis, factors);
    const predictedPerformance = this.predictPerformance(factors, platformScores);
    
    const overall = this.calculateOverallScore(factors);
    const confidence = this.calculateConfidence(analysis);

    const result: ViralityScore = {
      overall,
      factors,
      confidence,
      platformScores,
      recommendations,
      predictedPerformance,
    };

    this.addToCache(cacheKey, result);
    return result;
  }

  // Calculate all virality factors
  private calculateFactors(analysis: ContentAnalysis): ViralityFactors {
    const hookAnalysis = this.analyzeHook(analysis);
    const emotionalAnalysis = this.analyzeEmotionalResonance(analysis);
    const trendScore = this.analyzeTrendAlignment(analysis);
    
    return {
      hookStrength: hookAnalysis.score,
      emotionalResonance: emotionalAnalysis.score,
      trendAlignment: trendScore,
      engagementPotential: this.calculateEngagementPotential(analysis),
      shareability: this.calculateShareability(analysis),
      watchTimeRetention: this.calculateWatchTimeRetention(analysis),
      controversyIndex: this.calculateControversyIndex(analysis),
      relatabilityScore: this.calculateRelatability(analysis),
      curiosityGap: this.calculateCuriosityGap(analysis),
      urgencyFactor: this.calculateUrgencyFactor(analysis),
    };
  }

  // Analyze hook strength and type
  public analyzeHook(analysis: ContentAnalysis): HookAnalysis {
    const firstSentence = analysis.sentences[0] || analysis.text.slice(0, 100);
    const firstWords = analysis.text.split(/\s+/).slice(0, 15).join(' ');
    
    const elements: HookElement[] = [];
    let detectedType: HookType = 'story';
    let maxScore = 0;

    // Check each hook pattern type
    for (const [type, patterns] of Object.entries(HOOK_PATTERNS)) {
      for (const pattern of patterns) {
        const match = firstWords.match(pattern);
        if (match) {
          const patternScore = this.getPatternScore(type as HookType, match[0]);
          elements.push({
            type,
            text: match[0],
            score: patternScore,
            position: match.index || 0,
          });
          if (patternScore > maxScore) {
            maxScore = patternScore;
            detectedType = type as HookType;
          }
        }
      }
    }

    // Analyze emotional triggers in hook
    const hookEmotionalScore = this.analyzeHookEmotions(firstSentence);
    
    // Calculate length penalty/bonus
    const lengthScore = this.calculateHookLengthScore(firstSentence);
    
    // Calculate specificity (numbers, names, etc.)
    const specificityScore = this.calculateSpecificity(firstSentence);
    
    // Combine scores
    const baseScore = Math.max(maxScore, 0.3); // Minimum baseline
    const combinedScore = (
      baseScore * 0.35 +
      hookEmotionalScore * 0.25 +
      lengthScore * 0.2 +
      specificityScore * 0.2
    );

    const finalScore = Math.min(combinedScore, 1);
    
    const strength = this.categorizeHookStrength(finalScore);
    const suggestions = this.generateHookSuggestions(analysis, detectedType, finalScore);

    return {
      score: finalScore,
      type: detectedType,
      strength,
      elements,
      suggestions,
    };
  }

  private getPatternScore(type: HookType, matchedText: string): number {
    const baseScores: Record<HookType, number> = {
      question: 0.65,
      shock: 0.85,
      curiosity: 0.8,
      controversy: 0.9,
      promise: 0.7,
      story: 0.6,
      challenge: 0.75,
      secret: 0.8,
      comparison: 0.7,
      transformation: 0.75,
    };

    let score = baseScores[type];
    
    // Bonus for specific high-performing patterns
    if (/\b(never|nobody|secret|shocking|unbelievable)\b/i.test(matchedText)) {
      score += 0.1;
    }
    
    return Math.min(score, 1);
  }

  private analyzeHookEmotions(hook: string): number {
    const words = hook.toLowerCase().split(/\s+/);
    let totalWeight = 0;
    let matchCount = 0;

    for (const word of words) {
      const trigger = EMOTIONAL_TRIGGERS[word];
      if (trigger) {
        totalWeight += trigger.weight;
        matchCount++;
      }
    }

    if (matchCount === 0) return 0.3;
    return Math.min(totalWeight / matchCount + (matchCount * 0.05), 1);
  }

  private calculateHookLengthScore(hook: string): number {
    const wordCount = hook.split(/\s+/).length;
    
    // Optimal hook length: 5-15 words
    if (wordCount >= 5 && wordCount <= 15) return 1;
    if (wordCount < 5) return 0.6 + (wordCount / 5) * 0.4;
    if (wordCount <= 20) return 1 - ((wordCount - 15) * 0.1);
    return 0.5;
  }

  private calculateSpecificity(text: string): number {
    let score = 0.3;
    
    // Numbers increase specificity
    if (/\d+/.test(text)) score += 0.2;
    
    // Specific timeframes
    if (/\b(today|yesterday|this (week|month|year)|in \d+)\b/i.test(text)) score += 0.15;
    
    // Proper nouns
    if (/[A-Z][a-z]+\s[A-Z][a-z]+/.test(text)) score += 0.15;
    
    // Specific amounts
    if (/\$[\d,]+|\d+%|\d+x/i.test(text)) score += 0.2;
    
    return Math.min(score, 1);
  }

  private categorizeHookStrength(score: number): 'weak' | 'moderate' | 'strong' | 'exceptional' {
    if (score >= 0.85) return 'exceptional';
    if (score >= 0.65) return 'strong';
    if (score >= 0.45) return 'moderate';
    return 'weak';
  }

  private generateHookSuggestions(
    analysis: ContentAnalysis,
    currentType: HookType,
    score: number
  ): string[] {
    const suggestions: string[] = [];

    if (score < 0.7) {
      suggestions.push('Start with a more compelling opening question or statement');
    }

    if (currentType === 'story' && score < 0.6) {
      suggestions.push('Consider starting with a shocking statistic or bold claim');
      suggestions.push('Try using a curiosity gap like "You won\'t believe what happened..."');
    }

    if (!analysis.sentences[0]?.match(/\d/)) {
      suggestions.push('Add specific numbers to increase credibility (e.g., "7 secrets" or "increased by 300%")');
    }

    if (analysis.text.length > 0 && analysis.text[0] === analysis.text[0].toLowerCase()) {
      suggestions.push('Start with a capitalized power word for stronger impact');
    }

    const emotionScore = this.analyzeHookEmotions(analysis.sentences[0] || '');
    if (emotionScore < 0.5) {
      suggestions.push('Add emotional trigger words like "shocking," "secret," or "unbelievable"');
    }

    return suggestions.slice(0, 3);
  }

  // Analyze emotional resonance
  private analyzeEmotionalResonance(analysis: ContentAnalysis): { score: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    
    // Base score from sentiment analysis
    const sentimentScore = analysis.sentiment.confidence * 
      Math.abs(analysis.sentiment.overall) * 0.8;
    
    // Emotion intensity from emotion analysis
    const primaryEmotionScore = analysis.emotions.primary.confidence;
    const emotionDiversity = analysis.emotions.secondary.length * 0.1;
    
    // Calculate emotional word density
    const words = analysis.text.toLowerCase().split(/\s+/);
    let emotionalWordCount = 0;
    let totalEmotionalWeight = 0;
    
    for (const word of words) {
      const trigger = EMOTIONAL_TRIGGERS[word];
      if (trigger) {
        emotionalWordCount++;
        totalEmotionalWeight += trigger.weight;
      }
    }
    
    const emotionalDensity = emotionalWordCount / Math.max(words.length, 1);
    const avgEmotionalWeight = emotionalWordCount > 0 
      ? totalEmotionalWeight / emotionalWordCount 
      : 0;
    
    breakdown.sentiment = sentimentScore;
    breakdown.primaryEmotion = primaryEmotionScore;
    breakdown.emotionDiversity = emotionDiversity;
    breakdown.emotionalDensity = emotionalDensity;
    breakdown.avgEmotionalWeight = avgEmotionalWeight;
    
    // Combined score with weights
    const score = Math.min(
      sentimentScore * 0.2 +
      primaryEmotionScore * 0.25 +
      emotionDiversity * 0.15 +
      emotionalDensity * 2 * 0.2 +
      avgEmotionalWeight * 0.2,
      1
    );
    
    return { score, breakdown };
  }

  // Analyze trend alignment
  private analyzeTrendAlignment(analysis: ContentAnalysis): number {
    let maxTrendScore = 0;
    let trendMatches = 0;
    const textLower = analysis.text.toLowerCase();
    
    // Check keywords against trending topics
    for (const keyword of analysis.keywords) {
      const trendScore = TRENDING_TOPICS.get(keyword.toLowerCase());
      if (trendScore) {
        maxTrendScore = Math.max(maxTrendScore, trendScore);
        trendMatches++;
      }
    }
    
    // Check full text for trending topics
    for (const [topic, score] of TRENDING_TOPICS) {
      if (textLower.includes(topic)) {
        maxTrendScore = Math.max(maxTrendScore, score);
        trendMatches++;
      }
    }
    
    // Check topics from analysis
    for (const topicCluster of analysis.topics) {
      const trendScore = TRENDING_TOPICS.get(topicCluster.name.toLowerCase());
      if (trendScore) {
        maxTrendScore = Math.max(maxTrendScore, trendScore * topicCluster.coherenceScore);
        trendMatches++;
      }
    }
    
    // Combined score considering both max relevance and breadth
    const breadthBonus = Math.min(trendMatches * 0.05, 0.2);
    return Math.min(maxTrendScore + breadthBonus, 1);
  }

  // Calculate engagement potential
  private calculateEngagementPotential(analysis: ContentAnalysis): number {
    let score = 0.3; // Base score
    
    // Question presence boosts comments
    if (analysis.text.includes('?')) {
      score += 0.15;
    }
    
    // Call to action patterns
    if (/\b(comment|share|like|follow|tag|let me know|what do you think)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Relatable content
    if (/\b(you|your|we|our|us)\b/i.test(analysis.text)) {
      score += 0.1;
    }
    
    // Controversial or opinion-based content
    if (/\b(unpopular opinion|hot take|controversial|fight me|change my mind)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // List/number format
    if (/\b(\d+)\s+(things|ways|reasons|tips|secrets|mistakes)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    // Emotional intensity
    score += analysis.emotions.primary.confidence * 0.15;
    
    return Math.min(score, 1);
  }

  // Calculate shareability
  private calculateShareability(analysis: ContentAnalysis): number {
    let score = 0.3;
    
    // Practical value (how-to, tips, etc.)
    if (/\b(how to|tip|trick|hack|secret|method|strategy)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Entertainment value
    if (/\b(funny|hilarious|amazing|incredible|unbelievable|crazy)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    // Social currency (makes sharer look good)
    if (/\b(inspiring|motivational|important|must.?(see|read|know)|everyone should)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Trigger emotions that drive sharing (awe, anxiety, anger)
    const shareEmotions = ['awe', 'anxiety', 'anger', 'surprise', 'joy'];
    for (const emotion of shareEmotions) {
      if (analysis.emotions.primary.emotion.toLowerCase() === emotion) {
        score += 0.15;
        break;
      }
    }
    
    // Universal appeal
    if (/\b(everyone|anyone|people|humans|world)\b/i.test(analysis.text)) {
      score += 0.1;
    }
    
    return Math.min(score, 1);
  }

  // Calculate watch time retention prediction
  private calculateWatchTimeRetention(analysis: ContentAnalysis): number {
    let score = 0.4;
    
    // Hook strength affects early retention
    const hookAnalysis = this.analyzeHook(analysis);
    score += hookAnalysis.score * 0.2;
    
    // Multiple hooks/peaks
    const sentenceCount = analysis.sentences.length;
    let hooks = 0;
    for (const sentence of analysis.sentences) {
      for (const patterns of Object.values(HOOK_PATTERNS)) {
        for (const pattern of patterns) {
          if (pattern.test(sentence)) {
            hooks++;
            break;
          }
        }
      }
    }
    const hookDensity = hooks / Math.max(sentenceCount, 1);
    score += Math.min(hookDensity * 0.5, 0.2);
    
    // Pacing - varied sentence length
    const sentenceLengths = analysis.sentences.map(s => s.split(/\s+/).length);
    if (sentenceLengths.length > 2) {
      const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
      const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
      const stdDev = Math.sqrt(variance);
      // Good pacing has moderate variance
      if (stdDev > 3 && stdDev < 10) {
        score += 0.1;
      }
    }
    
    // Cliffhanger or payoff structure
    if (/\b(but then|however|here's (the thing|what happened)|wait|plot twist)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    return Math.min(score, 1);
  }

  // Calculate controversy index
  private calculateControversyIndex(analysis: ContentAnalysis): number {
    let score = 0;
    
    // Explicit controversy markers
    if (/\b(controversial|debate|unpopular opinion|hot take|fight me)\b/i.test(analysis.text)) {
      score += 0.4;
    }
    
    // Negative sentiment with high confidence
    if (analysis.sentiment.overall < -0.3 && analysis.sentiment.confidence > 0.6) {
      score += 0.2;
    }
    
    // Comparison/vs content
    if (/\b(vs\.?|versus|better than|worse than|overrated|underrated)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Challenging common beliefs
    if (/\b(myth|lie|wrong|mistake|actually|truth is|reality is)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Political or social topics (entities)
    for (const entity of analysis.entities) {
      if (entity.type === 'ORGANIZATION' && /\b(government|party|congress|senate)\b/i.test(entity.text)) {
        score += 0.15;
        break;
      }
    }
    
    return Math.min(score, 1);
  }

  // Calculate relatability
  private calculateRelatability(analysis: ContentAnalysis): number {
    let score = 0.3;
    
    // First person usage
    if (/\b(i|me|my|we|our)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    // Second person (direct address)
    if (/\b(you|your|you're|you've)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    // Common experiences
    if (/\b(everyone|we all|nobody|someone|people always|ever notice)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    // Everyday topics
    const everydayTopics = ['morning', 'work', 'home', 'family', 'friends', 'coffee', 'sleep', 'food', 'money'];
    for (const topic of everydayTopics) {
      if (analysis.text.toLowerCase().includes(topic)) {
        score += 0.05;
      }
    }
    
    // Emotional vulnerability
    if (/\b(struggle|anxiety|stress|worried|scared|honest|admit|confession)\b/i.test(analysis.text)) {
      score += 0.15;
    }
    
    return Math.min(score, 1);
  }

  // Calculate curiosity gap
  private calculateCuriosityGap(analysis: ContentAnalysis): number {
    let score = 0;
    
    // Explicit curiosity patterns
    if (/\b(secret|hidden|unknown|mystery|discover|reveal|truth)\b/i.test(analysis.text)) {
      score += 0.3;
    }
    
    // Questions create curiosity
    const questionCount = (analysis.text.match(/\?/g) || []).length;
    score += Math.min(questionCount * 0.15, 0.3);
    
    // Incomplete information patterns
    if (/\b(you won't believe|here's why|this is how|the reason|what happened)\b/i.test(analysis.text)) {
      score += 0.25;
    }
    
    // Numbers promise specificity
    if (/\b\d+\s+(ways|things|reasons|secrets|tips|steps)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Teaser language
    if (/\b(finally|at last|wait for it|stay till the end|watch till|until the end)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  // Calculate urgency factor
  private calculateUrgencyFactor(analysis: ContentAnalysis): number {
    let score = 0;
    
    // Time-sensitive language
    if (/\b(now|today|immediately|urgent|breaking|just happened)\b/i.test(analysis.text)) {
      score += 0.3;
    }
    
    // Scarcity
    if (/\b(limited|exclusive|only|last chance|ending soon|running out)\b/i.test(analysis.text)) {
      score += 0.25;
    }
    
    // FOMO triggers
    if (/\b(don't miss|before it's|while you can|everyone is)\b/i.test(analysis.text)) {
      score += 0.25;
    }
    
    // News/current events
    if (/\b(breaking|just (in|announced)|latest|update|new)\b/i.test(analysis.text)) {
      score += 0.2;
    }
    
    // Exclamation marks add urgency
    const exclamationCount = (analysis.text.match(/!/g) || []).length;
    score += Math.min(exclamationCount * 0.05, 0.15);
    
    return Math.min(score, 1);
  }

  // Calculate platform-specific scores
  private calculatePlatformScores(analysis: ContentAnalysis, factors: ViralityFactors): PlatformScores {
    const scores: PlatformScores = {
      tiktok: 0,
      reels: 0,
      youtubeShorts: 0,
      twitter: 0,
      linkedin: 0,
    };

    for (const [platform, platformFactors] of Object.entries(PLATFORM_FACTORS)) {
      let platformScore = 0;
      
      // Base score from overall factors
      platformScore += factors.hookStrength * 0.2;
      platformScore += factors.emotionalResonance * 0.15;
      platformScore += factors.trendAlignment * platformFactors.trendingBonus;
      platformScore += factors.engagementPotential * 0.15;
      platformScore += factors.shareability * 0.15;
      
      // Platform-specific adjustments
      const textLower = analysis.text.toLowerCase();
      for (const [factor, weight] of Object.entries(platformFactors.engagementFactors)) {
        if (textLower.includes(factor) || this.matchesContentType(analysis, factor)) {
          platformScore += weight * 0.1;
        }
      }
      
      // Length optimization
      const wordCount = analysis.text.split(/\s+/).length;
      const { min, max, ideal } = platformFactors.optimalLength;
      if (wordCount >= min && wordCount <= max) {
        const lengthScore = 1 - Math.abs(wordCount - ideal) / (max - min);
        platformScore += lengthScore * 0.1;
      }
      
      scores[platform as keyof PlatformScores] = Math.min(platformScore, 1);
    }

    return scores;
  }

  private matchesContentType(analysis: ContentAnalysis, contentType: string): boolean {
    const contentPatterns: Record<string, RegExp> = {
      entertainment: /\b(funny|hilarious|amazing|crazy|wild)\b/i,
      education: /\b(learn|teach|explain|how to|tip|guide)\b/i,
      transformation: /\b(transform|before|after|journey|progress)\b/i,
      challenge: /\b(challenge|try|attempt|test)\b/i,
      howto: /\b(how to|step|guide|tutorial)\b/i,
      lifestyle: /\b(day in|routine|life|living)\b/i,
      professional: /\b(career|business|work|leadership|success)\b/i,
      news: /\b(breaking|update|latest|just happened)\b/i,
    };
    
    const pattern = contentPatterns[contentType];
    return pattern ? pattern.test(analysis.text) : false;
  }

  // Generate recommendations
  private generateRecommendations(
    analysis: ContentAnalysis,
    factors: ViralityFactors
  ): ViralityRecommendation[] {
    const recommendations: ViralityRecommendation[] = [];

    // Hook recommendations
    if (factors.hookStrength < 0.6) {
      recommendations.push({
        category: 'hook',
        priority: 'high',
        suggestion: 'Strengthen opening with a bold claim, shocking statistic, or compelling question',
        expectedImpact: 0.2,
      });
    }

    // Emotion recommendations
    if (factors.emotionalResonance < 0.5) {
      recommendations.push({
        category: 'emotion',
        priority: 'high',
        suggestion: 'Add more emotional trigger words to create stronger audience connection',
        expectedImpact: 0.15,
      });
    }

    // Trend recommendations
    if (factors.trendAlignment < 0.4) {
      recommendations.push({
        category: 'trend',
        priority: 'medium',
        suggestion: 'Connect your content to trending topics like AI, self-improvement, or current events',
        expectedImpact: 0.15,
      });
    }

    // Structure recommendations
    if (factors.watchTimeRetention < 0.5) {
      recommendations.push({
        category: 'structure',
        priority: 'medium',
        suggestion: 'Add multiple hooks throughout to maintain attention, vary sentence length for pacing',
        expectedImpact: 0.12,
      });
    }

    // CTA recommendations
    if (factors.engagementPotential < 0.5) {
      recommendations.push({
        category: 'cta',
        priority: 'medium',
        suggestion: 'Include a clear call-to-action: ask a question, invite comments, or prompt sharing',
        expectedImpact: 0.1,
      });
    }

    // Curiosity recommendations
    if (factors.curiosityGap < 0.4) {
      recommendations.push({
        category: 'hook',
        priority: 'medium',
        suggestion: 'Create a stronger curiosity gap by teasing information or using "you won\'t believe" patterns',
        expectedImpact: 0.12,
      });
    }

    // Urgency recommendations
    if (factors.urgencyFactor < 0.3) {
      recommendations.push({
        category: 'timing',
        priority: 'low',
        suggestion: 'Add time-sensitive elements if appropriate to create urgency',
        expectedImpact: 0.08,
      });
    }

    // Sort by priority and expected impact
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.expectedImpact - a.expectedImpact;
    });

    return recommendations.slice(0, 5);
  }

  // Predict performance
  private predictPerformance(
    factors: ViralityFactors,
    platformScores: PlatformScores
  ): PerformancePrediction {
    const avgPlatformScore = Object.values(platformScores).reduce((a, b) => a + b, 0) / 5;
    const overallScore = this.calculateOverallScore(factors);
    
    // View estimates based on score tiers
    let baseViews: number;
    if (overallScore >= 0.8) {
      baseViews = 100000;
    } else if (overallScore >= 0.6) {
      baseViews = 25000;
    } else if (overallScore >= 0.4) {
      baseViews = 5000;
    } else {
      baseViews = 1000;
    }
    
    const variance = 0.5;
    const estimatedViews = {
      min: Math.round(baseViews * (1 - variance)),
      max: Math.round(baseViews * (1 + variance * 2)),
      expected: Math.round(baseViews * (1 + (overallScore - 0.5) * 0.5)),
    };
    
    // Engagement estimates
    const engagementRate = 0.03 + (factors.engagementPotential * 0.07);
    const shareRate = 0.005 + (factors.shareability * 0.015);
    const commentRate = 0.008 + (factors.controversyIndex * 0.012);
    
    const estimatedEngagement = {
      likes: Math.round(estimatedViews.expected * engagementRate),
      comments: Math.round(estimatedViews.expected * commentRate),
      shares: Math.round(estimatedViews.expected * shareRate),
    };
    
    // Viral probability
    let viralProbability = overallScore * 0.3;
    if (overallScore >= 0.8) viralProbability += 0.2;
    if (factors.trendAlignment >= 0.7) viralProbability += 0.15;
    if (factors.hookStrength >= 0.8) viralProbability += 0.1;
    viralProbability = Math.min(viralProbability, 0.75);
    
    // Peak performance window
    const peakWindows = [
      { condition: factors.urgencyFactor > 0.6, window: '0-6 hours' },
      { condition: factors.trendAlignment > 0.7, window: '0-24 hours' },
      { condition: overallScore > 0.7, window: '24-72 hours' },
      { condition: true, window: '48-96 hours' },
    ];
    
    const peakPerformanceWindow = peakWindows.find(p => p.condition)?.window || '48-96 hours';
    
    return {
      estimatedViews,
      estimatedEngagement,
      viralProbability,
      peakPerformanceWindow,
    };
  }

  // Calculate overall virality score
  private calculateOverallScore(factors: ViralityFactors): number {
    const weights = {
      hookStrength: 0.2,
      emotionalResonance: 0.15,
      trendAlignment: 0.12,
      engagementPotential: 0.12,
      shareability: 0.1,
      watchTimeRetention: 0.1,
      controversyIndex: 0.05,
      relatabilityScore: 0.08,
      curiosityGap: 0.05,
      urgencyFactor: 0.03,
    };

    let weightedSum = 0;
    for (const [factor, weight] of Object.entries(weights)) {
      weightedSum += factors[factor as keyof ViralityFactors] * weight;
    }

    return Math.min(weightedSum, 1);
  }

  // Calculate confidence in the scoring
  private calculateConfidence(analysis: ContentAnalysis): number {
    let confidence = 0.5;
    
    // More text = more confidence
    const wordCount = analysis.text.split(/\s+/).length;
    confidence += Math.min(wordCount / 200, 0.2);
    
    // More sentences = better structure analysis
    confidence += Math.min(analysis.sentences.length / 10, 0.1);
    
    // Entities provide context
    confidence += Math.min(analysis.entities.length / 10, 0.1);
    
    // Keywords indicate clear topics
    confidence += Math.min(analysis.keywords.length / 10, 0.1);
    
    return Math.min(confidence, 0.95);
  }

  // Cache management
  private generateCacheKey(analysis: ContentAnalysis): string {
    return `${analysis.text.slice(0, 100)}_${analysis.keywords.slice(0, 3).join('_')}`;
  }

  private addToCache(key: string, score: ViralityScore): void {
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, score);
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================================
// Singleton Export and Helper Functions
// ============================================================================

export const viralityScorer = new ViralityScorer();

export function scoreVirality(analysis: ContentAnalysis): ViralityScore {
  return viralityScorer.score(analysis);
}

export function analyzeHook(text: string): HookAnalysis {
  const mockAnalysis: ContentAnalysis = {
    text,
    sentences: text.split(/[.!?]+/).filter(s => s.trim()),
    sentiment: { overall: 0, positive: 0, negative: 0, neutral: 1, confidence: 0.5 },
    emotions: { primary: { emotion: 'neutral', confidence: 0.5 }, secondary: [], valence: 0, arousal: 0 },
    entities: [],
    topics: [],
    keywords: [],
  };
  return viralityScorer.analyzeHook(mockAnalysis);
}

export function getPlatformOptimization(platform: keyof PlatformScores): PlatformFactors {
  return PLATFORM_FACTORS[platform];
}

export function getTrendingTopics(): { topic: string; score: number }[] {
  return Array.from(TRENDING_TOPICS.entries())
    .map(([topic, score]) => ({ topic, score }))
    .sort((a, b) => b.score - a.score);
}

export function getEmotionalTriggers(): typeof EMOTIONAL_TRIGGERS {
  return EMOTIONAL_TRIGGERS;
}
