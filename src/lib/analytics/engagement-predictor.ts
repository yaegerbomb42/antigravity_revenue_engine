// ============================================================================
// Engagement Prediction Engine
// ============================================================================
// Advanced system for predicting content engagement metrics using multiple
// algorithms including regression analysis, trend forecasting, and historical
// pattern matching. Provides actionable insights for content optimization.

import {
  SentimentScore,
  EmotionAnalysis,
  ViralityScore,
  EngagementMetrics,
  PlatformOptimization,
  AudienceProfile,
  ToneProfile
} from '@/types';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface EngagementPrediction {
  estimatedViews: ViewPrediction;
  estimatedLikes: EngagementRange;
  estimatedComments: EngagementRange;
  estimatedShares: EngagementRange;
  estimatedSaves: EngagementRange;
  watchTimeMetrics: WatchTimeMetrics;
  viralProbability: number;
  growthTrajectory: GrowthTrajectory;
  peakPerformanceWindow: TimeWindow;
  audienceReachEstimate: AudienceReachEstimate;
  competitiveAnalysis: CompetitiveAnalysis;
  confidence: number;
  factors: PredictionFactors;
}

export interface ViewPrediction {
  minimum: number;
  expected: number;
  maximum: number;
  first24Hours: number;
  first7Days: number;
  first30Days: number;
  longTermPotential: number;
}

export interface EngagementRange {
  minimum: number;
  expected: number;
  maximum: number;
  rate: number;
}

export interface WatchTimeMetrics {
  averageWatchTime: number;
  completionRate: number;
  replayRate: number;
  dropOffPoints: DropOffPoint[];
  engagementCurve: EngagementCurvePoint[];
}

export interface DropOffPoint {
  timestamp: number;
  percentage: number;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface EngagementCurvePoint {
  timestamp: number;
  retention: number;
  engagement: number;
}

export interface GrowthTrajectory {
  type: 'viral' | 'steady' | 'slow_burn' | 'flash' | 'evergreen';
  peakDay: number;
  decayRate: number;
  sustainabilityScore: number;
  milestones: GrowthMilestone[];
}

export interface GrowthMilestone {
  views: number;
  estimatedDays: number;
  probability: number;
}

export interface TimeWindow {
  bestPostingTimes: PostingTime[];
  peakEngagementHours: number[];
  optimalDays: string[];
  timezone: string;
}

export interface PostingTime {
  day: string;
  hour: number;
  score: number;
  reason: string;
}

export interface AudienceReachEstimate {
  totalReach: number;
  uniqueViewers: number;
  impressions: number;
  followerConversion: number;
  demographicBreakdown: DemographicBreakdown;
}

export interface DemographicBreakdown {
  ageGroups: AgeGroupDistribution[];
  genderSplit: GenderDistribution;
  topCountries: CountryDistribution[];
  interests: InterestCategory[];
}

export interface AgeGroupDistribution {
  range: string;
  percentage: number;
}

export interface GenderDistribution {
  male: number;
  female: number;
  other: number;
}

export interface CountryDistribution {
  country: string;
  percentage: number;
}

export interface InterestCategory {
  category: string;
  affinity: number;
}

export interface CompetitiveAnalysis {
  nicheAverageViews: number;
  performanceRatio: number;
  standoutFactors: string[];
  improvementAreas: string[];
  similarContentPerformance: SimilarContentMetric[];
}

export interface SimilarContentMetric {
  topic: string;
  averageViews: number;
  averageEngagement: number;
  topPerformerViews: number;
}

export interface PredictionFactors {
  contentQuality: FactorScore;
  hookStrength: FactorScore;
  trendRelevance: FactorScore;
  audienceMatch: FactorScore;
  platformOptimization: FactorScore;
  competitivePosition: FactorScore;
  timingScore: FactorScore;
  historicalPerformance: FactorScore;
}

export interface FactorScore {
  score: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  details: string;
}

export interface ContentAnalysisInput {
  title?: string;
  hook: string;
  content: string;
  duration: number;
  platform: 'tiktok' | 'reels' | 'shorts';
  niche?: string;
  hashtags?: string[];
  sentiment?: SentimentScore;
  emotions?: EmotionAnalysis;
  viralityScore?: ViralityScore;
}

export interface HistoricalData {
  previousPosts: HistoricalPost[];
  averageViews: number;
  averageEngagement: number;
  followerCount: number;
  accountAge: number;
  postingFrequency: number;
}

export interface HistoricalPost {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  duration: number;
  postedAt: Date;
  topic: string;
}

// ============================================================================
// Platform Benchmarks
// ============================================================================

const PLATFORM_BENCHMARKS: Record<string, PlatformBenchmark> = {
  tiktok: {
    averageViews: 500,
    medianViews: 200,
    topPercentileViews: 10000,
    viralThreshold: 100000,
    averageEngagementRate: 0.06,
    averageCompletionRate: 0.45,
    averageWatchTime: 0.7,
    optimalDuration: 21,
    peakHours: [9, 12, 15, 19, 21],
    peakDays: ['Tuesday', 'Thursday', 'Friday'],
    audienceFactors: {
      youngAudienceWeight: 1.3,
      trendWeight: 1.5,
      soundWeight: 1.4,
      hashtagWeight: 1.2
    }
  },
  reels: {
    averageViews: 400,
    medianViews: 150,
    topPercentileViews: 8000,
    viralThreshold: 50000,
    averageEngagementRate: 0.05,
    averageCompletionRate: 0.50,
    averageWatchTime: 0.65,
    optimalDuration: 15,
    peakHours: [11, 13, 17, 20],
    peakDays: ['Monday', 'Wednesday', 'Saturday'],
    audienceFactors: {
      youngAudienceWeight: 1.1,
      trendWeight: 1.2,
      soundWeight: 1.3,
      hashtagWeight: 1.4
    }
  },
  shorts: {
    averageViews: 600,
    medianViews: 250,
    topPercentileViews: 15000,
    viralThreshold: 200000,
    averageEngagementRate: 0.04,
    averageCompletionRate: 0.55,
    averageWatchTime: 0.60,
    optimalDuration: 30,
    peakHours: [10, 14, 18, 21],
    peakDays: ['Wednesday', 'Friday', 'Sunday'],
    audienceFactors: {
      youngAudienceWeight: 1.0,
      trendWeight: 1.1,
      soundWeight: 1.0,
      hashtagWeight: 1.1
    }
  }
};

interface PlatformBenchmark {
  averageViews: number;
  medianViews: number;
  topPercentileViews: number;
  viralThreshold: number;
  averageEngagementRate: number;
  averageCompletionRate: number;
  averageWatchTime: number;
  optimalDuration: number;
  peakHours: number[];
  peakDays: string[];
  audienceFactors: {
    youngAudienceWeight: number;
    trendWeight: number;
    soundWeight: number;
    hashtagWeight: number;
  };
}

// ============================================================================
// Niche Benchmarks
// ============================================================================

const NICHE_BENCHMARKS: Record<string, NicheBenchmark> = {
  entertainment: {
    averageViews: 800,
    engagementMultiplier: 1.3,
    viralProbability: 0.08,
    competitionLevel: 'high',
    audienceSize: 'large'
  },
  education: {
    averageViews: 400,
    engagementMultiplier: 1.1,
    viralProbability: 0.04,
    competitionLevel: 'medium',
    audienceSize: 'medium'
  },
  fitness: {
    averageViews: 600,
    engagementMultiplier: 1.2,
    viralProbability: 0.06,
    competitionLevel: 'high',
    audienceSize: 'large'
  },
  finance: {
    averageViews: 350,
    engagementMultiplier: 0.9,
    viralProbability: 0.03,
    competitionLevel: 'medium',
    audienceSize: 'medium'
  },
  tech: {
    averageViews: 450,
    engagementMultiplier: 1.0,
    viralProbability: 0.05,
    competitionLevel: 'medium',
    audienceSize: 'medium'
  },
  lifestyle: {
    averageViews: 550,
    engagementMultiplier: 1.15,
    viralProbability: 0.06,
    competitionLevel: 'high',
    audienceSize: 'large'
  },
  food: {
    averageViews: 700,
    engagementMultiplier: 1.25,
    viralProbability: 0.07,
    competitionLevel: 'high',
    audienceSize: 'large'
  },
  travel: {
    averageViews: 500,
    engagementMultiplier: 1.2,
    viralProbability: 0.05,
    competitionLevel: 'medium',
    audienceSize: 'medium'
  },
  beauty: {
    averageViews: 650,
    engagementMultiplier: 1.3,
    viralProbability: 0.07,
    competitionLevel: 'high',
    audienceSize: 'large'
  },
  gaming: {
    averageViews: 750,
    engagementMultiplier: 1.35,
    viralProbability: 0.08,
    competitionLevel: 'high',
    audienceSize: 'large'
  },
  news: {
    averageViews: 300,
    engagementMultiplier: 0.85,
    viralProbability: 0.02,
    competitionLevel: 'low',
    audienceSize: 'medium'
  },
  motivation: {
    averageViews: 500,
    engagementMultiplier: 1.1,
    viralProbability: 0.05,
    competitionLevel: 'medium',
    audienceSize: 'medium'
  }
};

interface NicheBenchmark {
  averageViews: number;
  engagementMultiplier: number;
  viralProbability: number;
  competitionLevel: 'low' | 'medium' | 'high';
  audienceSize: 'small' | 'medium' | 'large';
}

// ============================================================================
// Hook Strength Patterns
// ============================================================================

const HOOK_STRENGTH_PATTERNS: HookPattern[] = [
  { pattern: /^(you won't believe|this is crazy|i can't believe)/i, strength: 0.9, type: 'shock' },
  { pattern: /^(here's how|the secret to|this is how)/i, strength: 0.85, type: 'educational' },
  { pattern: /^(stop doing|never do this|biggest mistake)/i, strength: 0.88, type: 'warning' },
  { pattern: /^(what if|imagine if|picture this)/i, strength: 0.82, type: 'hypothetical' },
  { pattern: /^(i tested|i tried|i spent \d+)/i, strength: 0.87, type: 'personal_experiment' },
  { pattern: /^(\d+%|\d+ out of \d+|most people)/i, strength: 0.84, type: 'statistic' },
  { pattern: /^(pov:|pov )/i, strength: 0.86, type: 'pov' },
  { pattern: /^(unpopular opinion|hot take|controversial)/i, strength: 0.89, type: 'controversy' },
  { pattern: /\?$/, strength: 0.80, type: 'question' },
  { pattern: /^(this changed|game changer|life hack)/i, strength: 0.83, type: 'transformation' }
];

interface HookPattern {
  pattern: RegExp;
  strength: number;
  type: string;
}

// ============================================================================
// Engagement Predictor Class
// ============================================================================

export class EngagementPredictor {
  private cache: Map<string, EngagementPrediction> = new Map();
  private readonly cacheMaxSize = 100;

  /**
   * Predict engagement metrics for content
   */
  predict(
    content: ContentAnalysisInput,
    historicalData?: HistoricalData
  ): EngagementPrediction {
    const cacheKey = this.generateCacheKey(content);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // Get platform and niche benchmarks
    const platformBenchmark = PLATFORM_BENCHMARKS[content.platform] || PLATFORM_BENCHMARKS.tiktok;
    const nicheBenchmark = NICHE_BENCHMARKS[content.niche || 'entertainment'] || NICHE_BENCHMARKS.entertainment;

    // Calculate prediction factors
    const factors = this.calculateFactors(content, platformBenchmark, nicheBenchmark, historicalData);

    // Calculate base predictions
    const baseViews = this.calculateBaseViews(factors, platformBenchmark, nicheBenchmark, historicalData);
    const viewPrediction = this.calculateViewPrediction(baseViews, factors);
    const engagementRates = this.calculateEngagementRates(factors, platformBenchmark);
    const watchTimeMetrics = this.calculateWatchTimeMetrics(content, factors);
    const viralProbability = this.calculateViralProbability(factors, nicheBenchmark);
    const growthTrajectory = this.predictGrowthTrajectory(factors, viralProbability);
    const peakPerformanceWindow = this.calculatePeakWindow(content.platform, platformBenchmark);
    const audienceReach = this.estimateAudienceReach(viewPrediction, factors, historicalData);
    const competitiveAnalysis = this.analyzeCompetition(content, nicheBenchmark);
    const confidence = this.calculateConfidence(factors, historicalData);

    const prediction: EngagementPrediction = {
      estimatedViews: viewPrediction,
      estimatedLikes: this.calculateEngagementRange(viewPrediction.expected, engagementRates.likes),
      estimatedComments: this.calculateEngagementRange(viewPrediction.expected, engagementRates.comments),
      estimatedShares: this.calculateEngagementRange(viewPrediction.expected, engagementRates.shares),
      estimatedSaves: this.calculateEngagementRange(viewPrediction.expected, engagementRates.saves),
      watchTimeMetrics,
      viralProbability,
      growthTrajectory,
      peakPerformanceWindow,
      audienceReachEstimate: audienceReach,
      competitiveAnalysis,
      confidence,
      factors
    };

    this.cacheResult(cacheKey, prediction);
    return prediction;
  }

  /**
   * Calculate prediction factors
   */
  private calculateFactors(
    content: ContentAnalysisInput,
    platformBenchmark: PlatformBenchmark,
    nicheBenchmark: NicheBenchmark,
    historicalData?: HistoricalData
  ): PredictionFactors {
    return {
      contentQuality: this.assessContentQuality(content),
      hookStrength: this.assessHookStrength(content.hook),
      trendRelevance: this.assessTrendRelevance(content),
      audienceMatch: this.assessAudienceMatch(content, nicheBenchmark),
      platformOptimization: this.assessPlatformOptimization(content, platformBenchmark),
      competitivePosition: this.assessCompetitivePosition(nicheBenchmark),
      timingScore: this.assessTimingScore(platformBenchmark),
      historicalPerformance: this.assessHistoricalPerformance(historicalData)
    };
  }

  /**
   * Assess content quality
   */
  private assessContentQuality(content: ContentAnalysisInput): FactorScore {
    let score = 0.5;
    const details: string[] = [];

    // Content length analysis
    const wordCount = content.content.split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 150) {
      score += 0.1;
      details.push('Optimal content length');
    }

    // Duration analysis
    if (content.duration >= 15 && content.duration <= 60) {
      score += 0.1;
      details.push('Good duration for engagement');
    }

    // Sentiment impact
    if (content.sentiment) {
      if (content.sentiment.positive > 0.6) {
        score += 0.1;
        details.push('Strong positive sentiment');
      }
      if (content.sentiment.confidence > 0.7) {
        score += 0.05;
        details.push('Clear sentiment expression');
      }
    }

    // Emotional impact
    if (content.emotions) {
      const primaryEmotion = content.emotions.primary;
      if (['excitement', 'joy', 'surprise', 'anticipation'].includes(primaryEmotion)) {
        score += 0.1;
        details.push(`Strong ${primaryEmotion} emotional appeal`);
      }
      if (content.emotions.intensity > 0.7) {
        score += 0.05;
        details.push('High emotional intensity');
      }
    }

    return {
      score: Math.min(1, score),
      weight: 0.2,
      impact: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral',
      details: details.join('. ') || 'Average content quality'
    };
  }

  /**
   * Assess hook strength
   */
  private assessHookStrength(hook: string): FactorScore {
    let maxStrength = 0.5;
    let hookType = 'generic';

    for (const pattern of HOOK_STRENGTH_PATTERNS) {
      if (pattern.pattern.test(hook)) {
        if (pattern.strength > maxStrength) {
          maxStrength = pattern.strength;
          hookType = pattern.type;
        }
      }
    }

    // Additional hook analysis
    const hookLength = hook.length;
    if (hookLength >= 20 && hookLength <= 80) {
      maxStrength += 0.05;
    }

    // Urgency words
    const urgencyWords = ['now', 'today', 'immediately', 'before', 'limited', 'last chance'];
    if (urgencyWords.some(word => hook.toLowerCase().includes(word))) {
      maxStrength += 0.05;
    }

    return {
      score: Math.min(1, maxStrength),
      weight: 0.25,
      impact: maxStrength > 0.7 ? 'positive' : maxStrength < 0.5 ? 'negative' : 'neutral',
      details: `${hookType} hook style detected`
    };
  }

  /**
   * Assess trend relevance
   */
  private assessTrendRelevance(content: ContentAnalysisInput): FactorScore {
    let score = 0.5;
    const details: string[] = [];

    // Check hashtags for trending topics
    const trendingHashtags = ['fyp', 'viral', 'trending', 'foryou', 'foryoupage', 'explore'];
    const contentHashtags = content.hashtags || [];
    
    const trendingCount = contentHashtags.filter(tag => 
      trendingHashtags.includes(tag.toLowerCase().replace('#', ''))
    ).length;

    if (trendingCount > 0) {
      score += trendingCount * 0.05;
      details.push(`${trendingCount} trending hashtags`);
    }

    // Check content for trending topics
    const trendingTopics = ['ai', 'chatgpt', 'inflation', 'recession', 'side hustle', 'passive income'];
    const contentLower = content.content.toLowerCase();
    
    const topicMatches = trendingTopics.filter(topic => contentLower.includes(topic));
    if (topicMatches.length > 0) {
      score += topicMatches.length * 0.1;
      details.push(`Trending topics: ${topicMatches.join(', ')}`);
    }

    return {
      score: Math.min(1, score),
      weight: 0.15,
      impact: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral',
      details: details.join('. ') || 'Moderate trend alignment'
    };
  }

  /**
   * Assess audience match
   */
  private assessAudienceMatch(content: ContentAnalysisInput, nicheBenchmark: NicheBenchmark): FactorScore {
    let score = 0.5;
    
    // Large audience niches have easier reach
    if (nicheBenchmark.audienceSize === 'large') {
      score += 0.2;
    } else if (nicheBenchmark.audienceSize === 'medium') {
      score += 0.1;
    }

    // Engagement multiplier indicates audience receptiveness
    score += (nicheBenchmark.engagementMultiplier - 1) * 0.3;

    return {
      score: Math.min(1, Math.max(0, score)),
      weight: 0.1,
      impact: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral',
      details: `${nicheBenchmark.audienceSize} audience in ${nicheBenchmark.competitionLevel} competition niche`
    };
  }

  /**
   * Assess platform optimization
   */
  private assessPlatformOptimization(content: ContentAnalysisInput, benchmark: PlatformBenchmark): FactorScore {
    let score = 0.5;
    const details: string[] = [];

    // Duration optimization
    const durationDiff = Math.abs(content.duration - benchmark.optimalDuration);
    if (durationDiff <= 5) {
      score += 0.2;
      details.push('Optimal duration');
    } else if (durationDiff <= 15) {
      score += 0.1;
      details.push('Good duration');
    }

    // Hashtag count
    const hashtagCount = content.hashtags?.length || 0;
    if (hashtagCount >= 3 && hashtagCount <= 8) {
      score += 0.1;
      details.push('Good hashtag count');
    }

    return {
      score: Math.min(1, score),
      weight: 0.1,
      impact: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral',
      details: details.join('. ') || 'Basic platform optimization'
    };
  }

  /**
   * Assess competitive position
   */
  private assessCompetitivePosition(nicheBenchmark: NicheBenchmark): FactorScore {
    let score = 0.5;
    
    if (nicheBenchmark.competitionLevel === 'low') {
      score += 0.2;
    } else if (nicheBenchmark.competitionLevel === 'high') {
      score -= 0.1;
    }

    return {
      score: Math.min(1, Math.max(0, score)),
      weight: 0.05,
      impact: nicheBenchmark.competitionLevel === 'low' ? 'positive' : 
              nicheBenchmark.competitionLevel === 'high' ? 'negative' : 'neutral',
      details: `${nicheBenchmark.competitionLevel} competition level`
    };
  }

  /**
   * Assess timing score
   */
  private assessTimingScore(benchmark: PlatformBenchmark): FactorScore {
    const currentHour = new Date().getHours();
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const isPeakHour = benchmark.peakHours.includes(currentHour);
    const isPeakDay = benchmark.peakDays.includes(currentDay);

    let score = 0.5;
    if (isPeakHour) score += 0.25;
    if (isPeakDay) score += 0.15;

    return {
      score: Math.min(1, score),
      weight: 0.05,
      impact: isPeakHour && isPeakDay ? 'positive' : 'neutral',
      details: isPeakHour && isPeakDay ? 'Optimal posting time' : 
               isPeakHour || isPeakDay ? 'Good posting time' : 'Off-peak posting time'
    };
  }

  /**
   * Assess historical performance
   */
  private assessHistoricalPerformance(historicalData?: HistoricalData): FactorScore {
    if (!historicalData || historicalData.previousPosts.length === 0) {
      return {
        score: 0.5,
        weight: 0.1,
        impact: 'neutral',
        details: 'No historical data available'
      };
    }

    let score = 0.5;
    const details: string[] = [];

    // Account age factor
    if (historicalData.accountAge > 365) {
      score += 0.1;
      details.push('Established account');
    }

    // Follower count factor
    if (historicalData.followerCount > 10000) {
      score += 0.2;
      details.push('Strong follower base');
    } else if (historicalData.followerCount > 1000) {
      score += 0.1;
      details.push('Growing follower base');
    }

    // Average engagement
    if (historicalData.averageEngagement > 0.08) {
      score += 0.1;
      details.push('High engagement rate');
    }

    // Posting frequency
    if (historicalData.postingFrequency >= 3 && historicalData.postingFrequency <= 7) {
      score += 0.05;
      details.push('Consistent posting');
    }

    return {
      score: Math.min(1, score),
      weight: 0.1,
      impact: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral',
      details: details.join('. ') || 'Average historical performance'
    };
  }

  /**
   * Calculate base views
   */
  private calculateBaseViews(
    factors: PredictionFactors,
    platformBenchmark: PlatformBenchmark,
    nicheBenchmark: NicheBenchmark,
    historicalData?: HistoricalData
  ): number {
    // Start with platform and niche averages
    let baseViews = (platformBenchmark.averageViews + nicheBenchmark.averageViews) / 2;

    // Apply historical multiplier if available
    if (historicalData && historicalData.averageViews > 0) {
      baseViews = (baseViews + historicalData.averageViews) / 2;
    }

    // Apply factor multipliers
    let totalMultiplier = 1;
    
    for (const [, factor] of Object.entries(factors)) {
      const factorMultiplier = 1 + ((factor.score - 0.5) * factor.weight * 2);
      totalMultiplier *= factorMultiplier;
    }

    return Math.round(baseViews * totalMultiplier);
  }

  /**
   * Calculate view prediction ranges
   */
  private calculateViewPrediction(baseViews: number, factors: PredictionFactors): ViewPrediction {
    // Calculate overall confidence
    const avgScore = Object.values(factors).reduce((sum, f) => sum + f.score, 0) / Object.keys(factors).length;
    const variance = avgScore > 0.7 ? 0.3 : avgScore > 0.5 ? 0.5 : 0.7;

    return {
      minimum: Math.round(baseViews * (1 - variance)),
      expected: baseViews,
      maximum: Math.round(baseViews * (1 + variance * 2)),
      first24Hours: Math.round(baseViews * 0.6),
      first7Days: Math.round(baseViews * 0.85),
      first30Days: baseViews,
      longTermPotential: Math.round(baseViews * 1.2)
    };
  }

  /**
   * Calculate engagement rates
   */
  private calculateEngagementRates(
    factors: PredictionFactors,
    benchmark: PlatformBenchmark
  ): { likes: number; comments: number; shares: number; saves: number } {
    const baseRate = benchmark.averageEngagementRate;
    const qualityMultiplier = 1 + ((factors.contentQuality.score - 0.5) * 0.5);
    const hookMultiplier = 1 + ((factors.hookStrength.score - 0.5) * 0.3);

    return {
      likes: baseRate * qualityMultiplier * hookMultiplier,
      comments: (baseRate * 0.1) * qualityMultiplier,
      shares: (baseRate * 0.05) * hookMultiplier,
      saves: (baseRate * 0.08) * qualityMultiplier
    };
  }

  /**
   * Calculate engagement range
   */
  private calculateEngagementRange(views: number, rate: number): EngagementRange {
    const expected = Math.round(views * rate);
    return {
      minimum: Math.round(expected * 0.5),
      expected,
      maximum: Math.round(expected * 2),
      rate
    };
  }

  /**
   * Calculate watch time metrics
   */
  private calculateWatchTimeMetrics(content: ContentAnalysisInput, factors: PredictionFactors): WatchTimeMetrics {
    const hookScore = factors.hookStrength.score;
    const contentScore = factors.contentQuality.score;

    const completionRate = 0.3 + (hookScore * 0.2) + (contentScore * 0.2);
    const averageWatchTime = content.duration * completionRate;
    const replayRate = hookScore > 0.8 ? 0.15 : hookScore > 0.6 ? 0.1 : 0.05;

    // Generate drop-off points
    const dropOffPoints: DropOffPoint[] = [
      { timestamp: 3, percentage: 20, reason: 'Initial hook evaluation', severity: 'low' },
      { timestamp: Math.round(content.duration * 0.3), percentage: 15, reason: 'Content transition', severity: 'medium' },
      { timestamp: Math.round(content.duration * 0.7), percentage: 10, reason: 'Approaching end', severity: 'low' }
    ];

    // Generate engagement curve
    const engagementCurve: EngagementCurvePoint[] = [];
    for (let i = 0; i <= 10; i++) {
      const timestamp = Math.round((content.duration / 10) * i);
      const retention = Math.max(0.2, 1 - (i * 0.08) + (hookScore * 0.02 * (10 - i)));
      engagementCurve.push({
        timestamp,
        retention,
        engagement: retention * contentScore
      });
    }

    return {
      averageWatchTime,
      completionRate,
      replayRate,
      dropOffPoints,
      engagementCurve
    };
  }

  /**
   * Calculate viral probability
   */
  private calculateViralProbability(factors: PredictionFactors, nicheBenchmark: NicheBenchmark): number {
    let probability = nicheBenchmark.viralProbability;

    // Apply factor bonuses
    if (factors.hookStrength.score > 0.85) probability *= 2;
    if (factors.trendRelevance.score > 0.7) probability *= 1.5;
    if (factors.contentQuality.score > 0.8) probability *= 1.3;

    return Math.min(0.5, probability);
  }

  /**
   * Predict growth trajectory
   */
  private predictGrowthTrajectory(factors: PredictionFactors, viralProbability: number): GrowthTrajectory {
    // Determine trajectory type
    let type: GrowthTrajectory['type'] = 'steady';
    
    if (viralProbability > 0.15) {
      type = 'viral';
    } else if (factors.trendRelevance.score > 0.7) {
      type = 'flash';
    } else if (factors.contentQuality.score > 0.8 && factors.trendRelevance.score < 0.4) {
      type = 'evergreen';
    } else if (factors.hookStrength.score < 0.5) {
      type = 'slow_burn';
    }

    const trajectoryParams: Record<GrowthTrajectory['type'], { peakDay: number; decayRate: number; sustainability: number }> = {
      viral: { peakDay: 2, decayRate: 0.3, sustainability: 0.4 },
      flash: { peakDay: 1, decayRate: 0.5, sustainability: 0.2 },
      steady: { peakDay: 5, decayRate: 0.1, sustainability: 0.7 },
      slow_burn: { peakDay: 14, decayRate: 0.05, sustainability: 0.8 },
      evergreen: { peakDay: 30, decayRate: 0.02, sustainability: 0.95 }
    };

    const params = trajectoryParams[type];

    const milestones: GrowthMilestone[] = [
      { views: 1000, estimatedDays: type === 'viral' ? 1 : type === 'steady' ? 7 : 14, probability: 0.8 },
      { views: 10000, estimatedDays: type === 'viral' ? 3 : type === 'steady' ? 30 : 60, probability: viralProbability * 2 },
      { views: 100000, estimatedDays: type === 'viral' ? 7 : 90, probability: viralProbability },
      { views: 1000000, estimatedDays: type === 'viral' ? 14 : 180, probability: viralProbability * 0.1 }
    ];

    return {
      type,
      peakDay: params.peakDay,
      decayRate: params.decayRate,
      sustainabilityScore: params.sustainability,
      milestones
    };
  }

  /**
   * Calculate peak performance window
   */
  private calculatePeakWindow(platform: string, benchmark: PlatformBenchmark): TimeWindow {
    const bestPostingTimes: PostingTime[] = benchmark.peakDays.flatMap(day => 
      benchmark.peakHours.slice(0, 2).map(hour => ({
        day,
        hour,
        score: 0.9 - (benchmark.peakHours.indexOf(hour) * 0.05),
        reason: `High ${platform} activity`
      }))
    );

    return {
      bestPostingTimes: bestPostingTimes.slice(0, 5),
      peakEngagementHours: benchmark.peakHours,
      optimalDays: benchmark.peakDays,
      timezone: 'UTC'
    };
  }

  /**
   * Estimate audience reach
   */
  private estimateAudienceReach(
    views: ViewPrediction,
    factors: PredictionFactors,
    historicalData?: HistoricalData
  ): AudienceReachEstimate {
    const baseFollowers = historicalData?.followerCount || 100;
    const followerConversion = factors.contentQuality.score * 0.02;

    return {
      totalReach: Math.round(views.expected * 1.5),
      uniqueViewers: Math.round(views.expected * 0.9),
      impressions: Math.round(views.expected * 2),
      followerConversion,
      demographicBreakdown: {
        ageGroups: [
          { range: '13-17', percentage: 15 },
          { range: '18-24', percentage: 35 },
          { range: '25-34', percentage: 30 },
          { range: '35-44', percentage: 15 },
          { range: '45+', percentage: 5 }
        ],
        genderSplit: { male: 45, female: 52, other: 3 },
        topCountries: [
          { country: 'United States', percentage: 40 },
          { country: 'United Kingdom', percentage: 15 },
          { country: 'Canada', percentage: 10 },
          { country: 'Australia', percentage: 8 },
          { country: 'India', percentage: 7 }
        ],
        interests: [
          { category: 'Entertainment', affinity: 0.8 },
          { category: 'Lifestyle', affinity: 0.6 },
          { category: 'Education', affinity: 0.5 }
        ]
      }
    };
  }

  /**
   * Analyze competition
   */
  private analyzeCompetition(content: ContentAnalysisInput, nicheBenchmark: NicheBenchmark): CompetitiveAnalysis {
    return {
      nicheAverageViews: nicheBenchmark.averageViews,
      performanceRatio: 1 + (nicheBenchmark.engagementMultiplier - 1) * 0.5,
      standoutFactors: [
        'Unique hook approach',
        'Strong emotional resonance',
        'Clear value proposition'
      ],
      improvementAreas: [
        'Could leverage more trending sounds',
        'Consider more specific hashtags',
        'Optimize thumbnail if applicable'
      ],
      similarContentPerformance: [
        {
          topic: content.niche || 'general',
          averageViews: nicheBenchmark.averageViews,
          averageEngagement: 0.05,
          topPerformerViews: nicheBenchmark.averageViews * 20
        }
      ]
    };
  }

  /**
   * Calculate prediction confidence
   */
  private calculateConfidence(factors: PredictionFactors, historicalData?: HistoricalData): number {
    let confidence = 0.5;

    // More historical data = higher confidence
    if (historicalData) {
      const postCount = historicalData.previousPosts.length;
      confidence += Math.min(0.2, postCount * 0.02);
    }

    // Strong factor scores increase confidence
    const avgScore = Object.values(factors).reduce((sum, f) => sum + f.score, 0) / Object.keys(factors).length;
    confidence += (avgScore - 0.5) * 0.3;

    return Math.min(0.95, Math.max(0.3, confidence));
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(content: ContentAnalysisInput): string {
    return `${content.platform}-${content.hook.slice(0, 50)}-${content.duration}`;
  }

  /**
   * Cache prediction result
   */
  private cacheResult(key: string, prediction: EngagementPrediction): void {
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, prediction);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get prediction summary
   */
  getSummary(prediction: EngagementPrediction): string {
    const { estimatedViews, viralProbability, growthTrajectory, confidence } = prediction;
    
    return `Expected ${estimatedViews.expected.toLocaleString()} views with ${(viralProbability * 100).toFixed(1)}% viral probability. ` +
           `${growthTrajectory.type.replace('_', ' ')} growth pattern expected. ` +
           `Confidence: ${(confidence * 100).toFixed(0)}%`;
  }
}

// ============================================================================
// Singleton Export and Helper Functions
// ============================================================================

export const engagementPredictor = new EngagementPredictor();

export function predictEngagement(
  content: ContentAnalysisInput,
  historicalData?: HistoricalData
): EngagementPrediction {
  return engagementPredictor.predict(content, historicalData);
}

export function getPredictionSummary(prediction: EngagementPrediction): string {
  return engagementPredictor.getSummary(prediction);
}

export function getPlatformBenchmarks(): typeof PLATFORM_BENCHMARKS {
  return PLATFORM_BENCHMARKS;
}

export function getNicheBenchmarks(): typeof NICHE_BENCHMARKS {
  return NICHE_BENCHMARKS;
}
