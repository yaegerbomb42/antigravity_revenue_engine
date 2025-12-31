// ============================================================================
// Advanced Viral Script Generation Engine
// ============================================================================
// Generates optimized short-form video scripts using NLP analysis, virality
// scoring, and platform-specific templates. Produces hook-driven narratives
// designed for maximum engagement across TikTok, Reels, and YouTube Shorts.

import { 
  SentimentScore, 
  EmotionAnalysis, 
  NamedEntity, 
  TopicCluster,
  TranscriptSegment,
  VideoChapter 
} from '@/types';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface ScriptSegment {
  type: 'hook' | 'setup' | 'conflict' | 'climax' | 'resolution' | 'cta';
  content: string;
  duration: number; // seconds
  visualCues: string[];
  audioNotes: string[];
  emotionalTarget: string;
  engagementTechnique: string;
}

export interface GeneratedScript {
  id: string;
  title: string;
  hook: string;
  segments: ScriptSegment[];
  fullScript: string;
  duration: number;
  wordCount: number;
  platform: 'tiktok' | 'reels' | 'shorts' | 'universal';
  viralityScore: number;
  emotionalArc: string[];
  hashtags: string[];
  hooks: AlternativeHook[];
  callToAction: string;
  thumbnailSuggestions: string[];
  musicRecommendations: MusicRecommendation[];
  editingNotes: string[];
  performancePreview: PerformancePreview;
  metadata: ScriptMetadata;
}

export interface AlternativeHook {
  text: string;
  type: HookStyle;
  strengthScore: number;
  emotionalTrigger: string;
}

export interface MusicRecommendation {
  genre: string;
  mood: string;
  tempo: 'slow' | 'medium' | 'fast' | 'variable';
  suggestions: string[];
  timingNotes: string;
}

export interface PerformancePreview {
  estimatedViews: { min: number; max: number; likely: number };
  estimatedEngagement: { likes: number; comments: number; shares: number };
  viralProbability: number;
  bestPostingTimes: string[];
  targetAudience: string[];
}

export interface ScriptMetadata {
  generatedAt: Date;
  sourceVideoId?: string;
  sourceVideoTitle?: string;
  processingTime: number;
  algorithmVersion: string;
  confidenceScore: number;
}

export type HookStyle = 
  | 'question' 
  | 'shocking_stat' 
  | 'controversy' 
  | 'curiosity' 
  | 'personal_story' 
  | 'challenge' 
  | 'promise' 
  | 'contrast' 
  | 'social_proof'
  | 'urgency';

export interface ContentAnalysisInput {
  text: string;
  sentiment: SentimentScore;
  emotions: EmotionAnalysis;
  entities: NamedEntity[];
  keywords: string[];
  keyphrases: string[];
  topics: TopicCluster[];
  segments?: TranscriptSegment[];
  chapters?: VideoChapter[];
}

export interface GenerationConfig {
  platform: 'tiktok' | 'reels' | 'shorts' | 'universal';
  targetDuration: number; // seconds (15, 30, 60)
  tone: 'professional' | 'casual' | 'humorous' | 'dramatic' | 'educational';
  hookStyle?: HookStyle;
  includeCallToAction: boolean;
  contentType: 'educational' | 'entertainment' | 'promotional' | 'storytelling';
  targetAudience?: string[];
  avoidTopics?: string[];
  emphasizeTopics?: string[];
}

// ============================================================================
// Hook Templates Library
// ============================================================================

const HOOK_TEMPLATES: Record<HookStyle, string[]> = {
  question: [
    "Did you know that {topic}?",
    "What if I told you {claim}?",
    "Have you ever wondered why {observation}?",
    "Why does nobody talk about {topic}?",
    "What's the one thing about {topic} that experts won't tell you?",
    "Are you making this {topic} mistake?",
    "Is {topic} actually {adjective}?",
    "Can you guess what {entity} discovered about {topic}?",
  ],
  shocking_stat: [
    "{percentage}% of people don't know this about {topic}",
    "Only {number} people in the world can {achievement}",
    "{entity} spent ${amount} on {topic} - here's why",
    "This {topic} fact will blow your mind",
    "The {topic} industry doesn't want you to know this",
    "In {timeframe}, {statistic} - let that sink in",
    "Here's what {amount} hours of {activity} taught me",
  ],
  controversy: [
    "Unpopular opinion: {statement}",
    "I'm about to upset a lot of people, but {claim}",
    "Everyone's wrong about {topic}",
    "Stop doing {activity} - here's why",
    "The truth about {topic} that nobody wants to hear",
    "{topic} is overrated, and here's proof",
    "Why {popular_opinion} is actually wrong",
  ],
  curiosity: [
    "Wait for it... {tease}",
    "You won't believe what happens at {timestamp}",
    "This {topic} secret changed everything for me",
    "The hidden truth behind {topic}",
    "Watch until the end to see {reveal}",
    "I found something incredible about {topic}",
    "The {topic} trick that {entity} uses",
  ],
  personal_story: [
    "I was today years old when I learned {discovery}",
    "Story time: How {topic} changed my life",
    "POV: You just discovered {topic}",
    "The moment I realized {insight}",
    "When I first learned about {topic}, I couldn't believe it",
    "Let me tell you about the time {event}",
    "This happened to me with {topic}",
  ],
  challenge: [
    "I bet you can't {challenge}",
    "Try this {topic} challenge",
    "Let's see if you can spot {target}",
    "Comment if you can {achievement}",
    "Only {percentage}% can do this {topic} thing",
    "Test yourself: {challenge}",
    "Most people fail this {topic} test",
  ],
  promise: [
    "This will change how you think about {topic}",
    "After watching this, you'll never {action} the same way",
    "In {duration}, you'll understand {topic} completely",
    "This is the only {topic} guide you'll ever need",
    "Master {topic} in just {timeframe}",
    "The {topic} hack that actually works",
    "How to {achievement} in {timeframe}",
  ],
  contrast: [
    "What they show vs reality of {topic}",
    "Expectation vs reality: {topic}",
    "How it started vs how it's going with {topic}",
    "{topic} then vs {topic} now",
    "Amateur vs Pro: {topic}",
    "What ${price} gets you vs what you actually need for {topic}",
    "Day 1 vs Day {number} of {activity}",
  ],
  social_proof: [
    "{number} million people have tried this {topic} method",
    "Why {celebrity} swears by this {topic} approach",
    "The {topic} technique used by {entity}",
    "This is why professionals always {action}",
    "Even {expert} recommends this for {topic}",
    "The {topic} secret that {entity} doesn't share publicly",
    "{entity}'s {topic} routine revealed",
  ],
  urgency: [
    "You need to see this before {deadline}",
    "This {topic} opportunity won't last",
    "Stop scrolling - this is important for {audience}",
    "If you're into {topic}, watch this NOW",
    "Last chance to learn about {topic}",
    "The {topic} trend you can't miss",
    "Time sensitive: {topic} update",
  ],
};

// ============================================================================
// Emotional Arc Templates
// ============================================================================

const EMOTIONAL_ARCS: Record<string, string[]> = {
  inspirational: ['curiosity', 'intrigue', 'realization', 'inspiration', 'motivation'],
  educational: ['confusion', 'curiosity', 'understanding', 'satisfaction', 'empowerment'],
  entertaining: ['surprise', 'amusement', 'anticipation', 'delight', 'satisfaction'],
  dramatic: ['tension', 'conflict', 'climax', 'resolution', 'reflection'],
  storytelling: ['setup', 'tension', 'surprise', 'resolution', 'connection'],
  promotional: ['problem', 'agitation', 'solution', 'proof', 'action'],
};

// ============================================================================
// Platform-Specific Templates
// ============================================================================

interface PlatformTemplate {
  maxDuration: number;
  idealDuration: number;
  hookDuration: number;
  ctaDuration: number;
  pacingStyle: 'rapid' | 'moderate' | 'relaxed';
  hashtagCount: number;
  preferredFormats: string[];
  audioStyle: string;
  captionStyle: string;
}

const PLATFORM_TEMPLATES: Record<string, PlatformTemplate> = {
  tiktok: {
    maxDuration: 60,
    idealDuration: 21,
    hookDuration: 3,
    ctaDuration: 5,
    pacingStyle: 'rapid',
    hashtagCount: 5,
    preferredFormats: ['vertical', 'face-to-camera', 'text-overlay'],
    audioStyle: 'trending-sound',
    captionStyle: 'animated-text',
  },
  reels: {
    maxDuration: 90,
    idealDuration: 30,
    hookDuration: 3,
    ctaDuration: 5,
    pacingStyle: 'moderate',
    hashtagCount: 8,
    preferredFormats: ['vertical', 'lifestyle', 'aesthetic'],
    audioStyle: 'original-or-trending',
    captionStyle: 'clean-text',
  },
  shorts: {
    maxDuration: 60,
    idealDuration: 45,
    hookDuration: 5,
    ctaDuration: 5,
    pacingStyle: 'moderate',
    hashtagCount: 3,
    preferredFormats: ['vertical', 'educational', 'commentary'],
    audioStyle: 'voiceover',
    captionStyle: 'subtitle-style',
  },
  universal: {
    maxDuration: 60,
    idealDuration: 30,
    hookDuration: 3,
    ctaDuration: 5,
    pacingStyle: 'moderate',
    hashtagCount: 5,
    preferredFormats: ['vertical', 'adaptable'],
    audioStyle: 'versatile',
    captionStyle: 'clean-text',
  },
};

// ============================================================================
// Call-to-Action Templates
// ============================================================================

const CTA_TEMPLATES: Record<string, string[]> = {
  engagement: [
    "Follow for more {topic} content!",
    "Like if you learned something new!",
    "Comment what you think about {topic}!",
    "Share this with someone who needs to see it!",
    "Save this for later!",
    "Drop a 🔥 if you agree!",
    "Tag someone who should try this!",
  ],
  educational: [
    "Follow for daily {topic} tips!",
    "Part 2? Comment below!",
    "More {topic} secrets coming tomorrow!",
    "Link in bio for the full guide!",
    "Comment 'MORE' if you want the advanced version!",
  ],
  promotional: [
    "Link in bio to get started!",
    "Check out the full breakdown in my bio!",
    "DM me '{keyword}' for more info!",
    "Tap the link and thank me later!",
  ],
  storytelling: [
    "Follow for part 2!",
    "Want to hear how it ended? Follow!",
    "The conclusion will surprise you - follow to see it!",
    "More stories like this on my page!",
  ],
};

// ============================================================================
// Content Type Configurations
// ============================================================================

interface ContentTypeConfig {
  segmentStructure: ScriptSegment['type'][];
  emotionalArc: string;
  pacingMultiplier: number;
  visualDensity: 'low' | 'medium' | 'high';
  audienceFocus: string;
  preferredHookStyles: HookStyle[];
}

const CONTENT_TYPE_CONFIGS: Record<string, ContentTypeConfig> = {
  educational: {
    segmentStructure: ['hook', 'setup', 'climax', 'resolution', 'cta'],
    emotionalArc: 'educational',
    pacingMultiplier: 0.9,
    visualDensity: 'medium',
    audienceFocus: 'learners',
    preferredHookStyles: ['question', 'shocking_stat', 'promise'],
  },
  entertainment: {
    segmentStructure: ['hook', 'setup', 'conflict', 'climax', 'cta'],
    emotionalArc: 'entertaining',
    pacingMultiplier: 1.2,
    visualDensity: 'high',
    audienceFocus: 'scrollers',
    preferredHookStyles: ['curiosity', 'challenge', 'contrast'],
  },
  promotional: {
    segmentStructure: ['hook', 'setup', 'climax', 'cta'],
    emotionalArc: 'promotional',
    pacingMultiplier: 1.0,
    visualDensity: 'medium',
    audienceFocus: 'buyers',
    preferredHookStyles: ['promise', 'social_proof', 'urgency'],
  },
  storytelling: {
    segmentStructure: ['hook', 'setup', 'conflict', 'climax', 'resolution', 'cta'],
    emotionalArc: 'storytelling',
    pacingMultiplier: 0.85,
    visualDensity: 'low',
    audienceFocus: 'engaged-viewers',
    preferredHookStyles: ['personal_story', 'curiosity', 'controversy'],
  },
};

// ============================================================================
// Hashtag Library
// ============================================================================

const HASHTAG_LIBRARY: Record<string, string[]> = {
  general: ['fyp', 'foryou', 'viral', 'trending', 'mustwatch'],
  educational: ['learnontiktok', 'edutok', 'didyouknow', 'lifehack', 'knowledge'],
  entertainment: ['funny', 'comedy', 'relatable', 'entertainment', 'mood'],
  business: ['entrepreneur', 'business', 'success', 'motivation', 'hustle'],
  tech: ['tech', 'techtok', 'coding', 'programming', 'ai'],
  lifestyle: ['lifestyle', 'dayinmylife', 'vlog', 'aesthetic', 'routine'],
  fitness: ['fitness', 'workout', 'gym', 'health', 'fitnesstips'],
  food: ['food', 'foodtok', 'recipe', 'cooking', 'foodie'],
  beauty: ['beauty', 'makeup', 'skincare', 'beautytips', 'grwm'],
  finance: ['finance', 'money', 'investing', 'personalfinance', 'stocks'],
};

// ============================================================================
// Script Generator Class
// ============================================================================

export class ScriptGenerator {
  private cache: Map<string, GeneratedScript[]> = new Map();
  private readonly cacheMaxSize = 100;
  private generationCount = 0;

  constructor() {}

  // Main generation method
  public generate(
    input: ContentAnalysisInput,
    config: GenerationConfig,
    count: number = 3
  ): GeneratedScript[] {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(input, config);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const scripts: GeneratedScript[] = [];
    const contentTypeConfig = CONTENT_TYPE_CONFIGS[config.contentType];
    const platformTemplate = PLATFORM_TEMPLATES[config.platform];

    // Extract key information
    const mainTopics = this.extractMainTopics(input);
    const keyEntities = this.extractKeyEntities(input);
    const emotionalThemes = this.extractEmotionalThemes(input);
    const bestMoments = this.identifyBestMoments(input);

    // Generate multiple script variations
    for (let i = 0; i < count; i++) {
      const hookStyle = config.hookStyle || 
        contentTypeConfig.preferredHookStyles[i % contentTypeConfig.preferredHookStyles.length];
      
      const script = this.generateSingleScript(
        input,
        config,
        contentTypeConfig,
        platformTemplate,
        hookStyle,
        mainTopics,
        keyEntities,
        emotionalThemes,
        bestMoments,
        startTime,
        i
      );
      
      scripts.push(script);
    }

    // Sort by virality score
    scripts.sort((a, b) => b.viralityScore - a.viralityScore);

    // Cache results
    this.addToCache(cacheKey, scripts);

    return scripts;
  }

  private generateSingleScript(
    input: ContentAnalysisInput,
    config: GenerationConfig,
    contentTypeConfig: ContentTypeConfig,
    platformTemplate: PlatformTemplate,
    hookStyle: HookStyle,
    mainTopics: string[],
    keyEntities: string[],
    emotionalThemes: string[],
    bestMoments: BestMoment[],
    startTime: number,
    variationIndex: number
  ): GeneratedScript {
    this.generationCount++;

    // Generate hook
    const hook = this.generateHook(
      hookStyle,
      mainTopics,
      keyEntities,
      input
    );

    // Generate alternative hooks
    const alternativeHooks = this.generateAlternativeHooks(
      mainTopics,
      keyEntities,
      input,
      hookStyle
    );

    // Generate segments
    const segments = this.generateSegments(
      input,
      config,
      contentTypeConfig,
      platformTemplate,
      hook,
      mainTopics,
      bestMoments,
      emotionalThemes
    );

    // Calculate total duration
    const duration = segments.reduce((sum, s) => sum + s.duration, 0);

    // Generate full script text
    const fullScript = this.compileFullScript(segments);

    // Generate hashtags
    const hashtags = this.generateHashtags(
      mainTopics,
      config.contentType,
      platformTemplate.hashtagCount
    );

    // Generate call to action
    const callToAction = this.generateCallToAction(
      config.contentType,
      mainTopics[0] || 'content'
    );

    // Generate thumbnail suggestions
    const thumbnailSuggestions = this.generateThumbnailSuggestions(
      mainTopics,
      emotionalThemes,
      hook
    );

    // Generate music recommendations
    const musicRecommendations = this.generateMusicRecommendations(
      emotionalThemes,
      config.tone,
      platformTemplate
    );

    // Generate editing notes
    const editingNotes = this.generateEditingNotes(
      segments,
      platformTemplate,
      contentTypeConfig
    );

    // Calculate virality score
    const viralityScore = this.calculateViralityScore(
      hook,
      segments,
      emotionalThemes,
      config.platform
    );

    // Generate performance preview
    const performancePreview = this.generatePerformancePreview(
      viralityScore,
      config.platform,
      mainTopics
    );

    // Create emotional arc
    const emotionalArc = EMOTIONAL_ARCS[contentTypeConfig.emotionalArc] || 
      EMOTIONAL_ARCS.entertaining;

    const processingTime = Date.now() - startTime;

    return {
      id: `script_${this.generationCount}_${Date.now()}`,
      title: this.generateTitle(mainTopics, hookStyle, variationIndex),
      hook,
      segments,
      fullScript,
      duration,
      wordCount: fullScript.split(/\s+/).length,
      platform: config.platform,
      viralityScore,
      emotionalArc,
      hashtags,
      hooks: alternativeHooks,
      callToAction,
      thumbnailSuggestions,
      musicRecommendations,
      editingNotes,
      performancePreview,
      metadata: {
        generatedAt: new Date(),
        processingTime,
        algorithmVersion: '2.0.0',
        confidenceScore: this.calculateConfidenceScore(input, viralityScore),
      },
    };
  }

  // Hook generation
  private generateHook(
    style: HookStyle,
    topics: string[],
    entities: string[],
    input: ContentAnalysisInput
  ): string {
    const templates = HOOK_TEMPLATES[style];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const topic = topics[0] || 'this topic';
    const entity = entities[0] || 'experts';
    
    return this.fillTemplate(template, {
      topic,
      entity,
      claim: this.generateClaim(input, topic),
      observation: this.generateObservation(input, topic),
      statement: this.generateStatement(input, topic),
      percentage: String(Math.floor(Math.random() * 30) + 70),
      number: String(Math.floor(Math.random() * 900) + 100),
      amount: this.formatNumber(Math.floor(Math.random() * 900000) + 100000),
      timeframe: this.getRandomTimeframe(),
      statistic: this.generateStatistic(input, topic),
      activity: topic,
      achievement: `master ${topic}`,
      adjective: this.getRandomAdjective(input.sentiment),
      popular_opinion: `what people think about ${topic}`,
      tease: this.generateTease(input, topic),
      timestamp: '0:' + String(Math.floor(Math.random() * 50) + 10),
      reveal: 'the truth',
      discovery: `the real story behind ${topic}`,
      insight: `${topic} is not what it seems`,
      event: `I discovered ${topic}`,
      challenge: `understand ${topic} in 30 seconds`,
      target: 'the pattern',
      action: `look at ${topic}`,
      duration: String(Math.floor(Math.random() * 50) + 10) + ' seconds',
      price: String(Math.floor(Math.random() * 900) + 100),
      celebrity: entity,
      expert: entity,
      deadline: 'it gets removed',
      audience: 'anyone interested in ' + topic,
      keyword: topic.toUpperCase().replace(/\s+/g, ''),
    });
  }

  private generateAlternativeHooks(
    topics: string[],
    entities: string[],
    input: ContentAnalysisInput,
    primaryStyle: HookStyle
  ): AlternativeHook[] {
    const styles: HookStyle[] = [
      'question', 'shocking_stat', 'curiosity', 
      'promise', 'controversy'
    ].filter(s => s !== primaryStyle) as HookStyle[];

    return styles.slice(0, 4).map(style => {
      const text = this.generateHook(style, topics, entities, input);
      return {
        text,
        type: style,
        strengthScore: this.calculateHookStrength(text, style),
        emotionalTrigger: this.getEmotionalTrigger(style),
      };
    });
  }

  private calculateHookStrength(hook: string, style: HookStyle): number {
    let score = 0.5;

    // Length check (optimal 8-15 words)
    const wordCount = hook.split(/\s+/).length;
    if (wordCount >= 8 && wordCount <= 15) score += 0.15;
    else if (wordCount >= 5 && wordCount <= 20) score += 0.08;

    // Emotional words
    const emotionalWords = ['shocking', 'secret', 'truth', 'never', 'always', 
      'mistake', 'wrong', 'incredible', 'amazing', 'terrible'];
    const hasEmotional = emotionalWords.some(w => 
      hook.toLowerCase().includes(w));
    if (hasEmotional) score += 0.1;

    // Question format bonus
    if (hook.endsWith('?')) score += 0.08;

    // Numbers boost engagement
    if (/\d+/.test(hook)) score += 0.07;

    // Style-specific bonuses
    if (style === 'shocking_stat' && /\d+%/.test(hook)) score += 0.1;
    if (style === 'controversy' && /wrong|stop|truth/i.test(hook)) score += 0.1;
    if (style === 'curiosity' && /secret|hidden|reveal/i.test(hook)) score += 0.1;

    return Math.min(1, score);
  }

  private getEmotionalTrigger(style: HookStyle): string {
    const triggers: Record<HookStyle, string> = {
      question: 'curiosity',
      shocking_stat: 'surprise',
      controversy: 'intrigue',
      curiosity: 'anticipation',
      personal_story: 'empathy',
      challenge: 'competitive',
      promise: 'hope',
      contrast: 'recognition',
      social_proof: 'trust',
      urgency: 'fomo',
    };
    return triggers[style];
  }

  // Segment generation
  private generateSegments(
    input: ContentAnalysisInput,
    config: GenerationConfig,
    contentTypeConfig: ContentTypeConfig,
    platformTemplate: PlatformTemplate,
    hook: string,
    topics: string[],
    bestMoments: BestMoment[],
    emotionalThemes: string[]
  ): ScriptSegment[] {
    const segments: ScriptSegment[] = [];
    const structure = contentTypeConfig.segmentStructure;
    const emotionalArc = EMOTIONAL_ARCS[contentTypeConfig.emotionalArc];
    
    // Calculate duration per segment
    const totalDuration = config.targetDuration;
    const hookDuration = platformTemplate.hookDuration;
    const ctaDuration = config.includeCallToAction ? platformTemplate.ctaDuration : 0;
    const mainDuration = totalDuration - hookDuration - ctaDuration;
    const mainSegmentCount = structure.filter(s => s !== 'hook' && s !== 'cta').length;
    const segmentDuration = mainDuration / mainSegmentCount;

    structure.forEach((type, index) => {
      const emotionalTarget = emotionalArc[Math.min(index, emotionalArc.length - 1)];
      
      let duration: number;
      let content: string;
      
      switch (type) {
        case 'hook':
          duration = hookDuration;
          content = hook;
          break;
        case 'cta':
          duration = ctaDuration;
          content = this.generateCallToAction(config.contentType, topics[0]);
          break;
        default:
          duration = segmentDuration;
          content = this.generateSegmentContent(
            type,
            input,
            topics,
            bestMoments,
            emotionalTarget,
            config.tone
          );
      }

      segments.push({
        type,
        content,
        duration: Math.round(duration),
        visualCues: this.generateVisualCues(type, content, platformTemplate),
        audioNotes: this.generateAudioNotes(type, emotionalTarget, platformTemplate),
        emotionalTarget,
        engagementTechnique: this.getEngagementTechnique(type),
      });
    });

    return segments;
  }

  private generateSegmentContent(
    type: ScriptSegment['type'],
    input: ContentAnalysisInput,
    topics: string[],
    bestMoments: BestMoment[],
    emotionalTarget: string,
    tone: GenerationConfig['tone']
  ): string {
    const topic = topics[0] || 'this topic';
    const moment = bestMoments[0];

    switch (type) {
      case 'setup':
        return this.generateSetupContent(topic, tone, input);
      case 'conflict':
        return this.generateConflictContent(topic, tone, input);
      case 'climax':
        return this.generateClimaxContent(topic, tone, moment, input);
      case 'resolution':
        return this.generateResolutionContent(topic, tone, input);
      default:
        return `[${type}] content about ${topic}`;
    }
  }

  private generateSetupContent(
    topic: string,
    tone: GenerationConfig['tone'],
    input: ContentAnalysisInput
  ): string {
    const setups: Record<string, string[]> = {
      professional: [
        `Here's what you need to know about ${topic}.`,
        `Let me break down ${topic} for you.`,
        `The key insight about ${topic} is this:`,
      ],
      casual: [
        `So basically, ${topic} works like this...`,
        `Okay so here's the deal with ${topic}...`,
        `Real talk about ${topic}:`,
      ],
      humorous: [
        `Buckle up because ${topic} is wild...`,
        `${topic} is about to make a lot more sense...`,
        `You're not gonna believe this about ${topic}...`,
      ],
      dramatic: [
        `Everything you know about ${topic} is about to change.`,
        `The truth about ${topic} has been hidden for too long.`,
        `What they don't want you to know about ${topic}:`,
      ],
      educational: [
        `${topic} can be understood in three key points.`,
        `Let's explore what makes ${topic} work.`,
        `The science behind ${topic} is fascinating.`,
      ],
    };

    const toneSetups = setups[tone] || setups.casual;
    return toneSetups[Math.floor(Math.random() * toneSetups.length)];
  }

  private generateConflictContent(
    topic: string,
    tone: GenerationConfig['tone'],
    input: ContentAnalysisInput
  ): string {
    const conflicts: Record<string, string[]> = {
      professional: [
        `But here's where it gets complicated...`,
        `The challenge with ${topic} is that most people approach it wrong.`,
        `However, there's a critical mistake people make with ${topic}.`,
      ],
      casual: [
        `But here's the thing nobody tells you...`,
        `Plot twist: ${topic} isn't what you think.`,
        `Wait, it gets better...`,
      ],
      humorous: [
        `And then reality hit different...`,
        `Spoiler alert: I was completely wrong about ${topic}.`,
        `That's when ${topic} personally attacked me...`,
      ],
      dramatic: [
        `But everything changed when I discovered this...`,
        `The problem? Nobody was ready for the truth.`,
        `Then came the revelation that shook everything...`,
      ],
      educational: [
        `Common misconceptions about ${topic} include...`,
        `Where most people go wrong with ${topic}:`,
        `The counterintuitive truth about ${topic}:`,
      ],
    };

    const toneConflicts = conflicts[tone] || conflicts.casual;
    return toneConflicts[Math.floor(Math.random() * toneConflicts.length)];
  }

  private generateClimaxContent(
    topic: string,
    tone: GenerationConfig['tone'],
    moment: BestMoment | undefined,
    input: ContentAnalysisInput
  ): string {
    // Use the best moment from the content if available
    if (moment && moment.text.length > 20 && moment.text.length < 200) {
      return moment.text;
    }

    const climaxes: Record<string, string[]> = {
      professional: [
        `The key breakthrough is understanding that ${topic} requires a different approach.`,
        `This insight about ${topic} changes everything: focus on the fundamentals.`,
        `The solution? A systematic approach to ${topic} that actually works.`,
      ],
      casual: [
        `And THAT'S the real secret about ${topic}.`,
        `This is the ${topic} game-changer right here.`,
        `Mind = blown. ${topic} finally makes sense.`,
      ],
      humorous: [
        `*chef's kiss* That's how ${topic} is done.`,
        `${topic} said: "Hold my beer."`,
        `And that, my friends, is peak ${topic}.`,
      ],
      dramatic: [
        `THIS is the moment everything clicked about ${topic}.`,
        `The truth was there all along: ${topic} is the answer.`,
        `And in that moment, ${topic} revealed its true nature.`,
      ],
      educational: [
        `This is the core principle of ${topic}: consistency over perfection.`,
        `Understanding ${topic} comes down to this key concept.`,
        `Master this one thing, and ${topic} becomes second nature.`,
      ],
    };

    const toneClimaxes = climaxes[tone] || climaxes.casual;
    return toneClimaxes[Math.floor(Math.random() * toneClimaxes.length)];
  }

  private generateResolutionContent(
    topic: string,
    tone: GenerationConfig['tone'],
    input: ContentAnalysisInput
  ): string {
    const resolutions: Record<string, string[]> = {
      professional: [
        `Apply this to your ${topic} approach and see the difference.`,
        `Remember: success with ${topic} comes from consistent application.`,
        `Now you have the framework for ${topic}. Time to implement.`,
      ],
      casual: [
        `So yeah, that's the ${topic} situation. You're welcome.`,
        `Now you know. Go do something amazing with ${topic}.`,
        `${topic} unlocked. What are you waiting for?`,
      ],
      humorous: [
        `And that's on ${topic}. No cap.`,
        `${topic} has left the chat (in a good way).`,
        `You've graduated from ${topic} school. Congratulations!`,
      ],
      dramatic: [
        `And now you possess the knowledge of ${topic}.`,
        `The ${topic} journey begins here. Are you ready?`,
        `With this ${topic} wisdom, nothing can stop you.`,
      ],
      educational: [
        `Apply these ${topic} principles and track your progress.`,
        `Review these ${topic} concepts regularly for mastery.`,
        `You now have the foundation for ${topic} excellence.`,
      ],
    };

    const toneResolutions = resolutions[tone] || resolutions.casual;
    return toneResolutions[Math.floor(Math.random() * toneResolutions.length)];
  }

  private generateVisualCues(
    type: ScriptSegment['type'],
    content: string,
    platformTemplate: PlatformTemplate
  ): string[] {
    const cues: Record<string, string[]> = {
      hook: [
        'Eye contact with camera',
        'Expressive facial reaction',
        'Quick zoom or movement',
        'Text overlay with hook',
      ],
      setup: [
        'B-roll or visual demonstration',
        'Graphics/illustrations',
        'Split screen if comparing',
        'Natural gestures',
      ],
      conflict: [
        'Change in lighting/mood',
        'Cut to reaction shot',
        'Dramatic pause visual',
        'Contrast imagery',
      ],
      climax: [
        'Key point text overlay',
        'Highlight/emphasis effect',
        'Energetic delivery',
        'Visual proof/evidence',
      ],
      resolution: [
        'Summary graphics',
        'Before/after if applicable',
        'Satisfied expression',
        'Smooth transition',
      ],
      cta: [
        'Direct eye contact',
        'Point to follow button',
        'Engaging smile',
        'CTA text overlay',
      ],
    };

    return cues[type] || ['Standard framing'];
  }

  private generateAudioNotes(
    type: ScriptSegment['type'],
    emotionalTarget: string,
    platformTemplate: PlatformTemplate
  ): string[] {
    const notes: string[] = [];

    // Pacing notes based on segment type
    switch (type) {
      case 'hook':
        notes.push('Start with energy - grab attention immediately');
        notes.push('Clear enunciation for hook line');
        break;
      case 'setup':
        notes.push('Moderate pace - let information land');
        break;
      case 'conflict':
        notes.push('Build tension with pacing');
        notes.push('Strategic pauses for effect');
        break;
      case 'climax':
        notes.push('Peak energy delivery');
        notes.push('Emphasis on key words');
        break;
      case 'resolution':
        notes.push('Confident, conclusive tone');
        break;
      case 'cta':
        notes.push('Warm, inviting delivery');
        notes.push('Clear call to action');
        break;
    }

    // Platform-specific audio notes
    if (platformTemplate.audioStyle === 'trending-sound') {
      notes.push('Consider trending audio underneath');
    } else if (platformTemplate.audioStyle === 'voiceover') {
      notes.push('Clean voiceover recording recommended');
    }

    return notes;
  }

  private getEngagementTechnique(type: ScriptSegment['type']): string {
    const techniques: Record<string, string> = {
      hook: 'Pattern interrupt - stop the scroll',
      setup: 'Value promise - keep them watching',
      conflict: 'Open loop - create curiosity',
      climax: 'Payoff delivery - satisfy curiosity',
      resolution: 'Future pacing - show transformation',
      cta: 'Direct ask - guide action',
    };
    return techniques[type] || 'Maintain engagement';
  }

  // Utility generation methods
  private generateHashtags(
    topics: string[],
    contentType: string,
    count: number
  ): string[] {
    const hashtags: string[] = [];
    
    // Add content type specific hashtags
    const typeHashtags = HASHTAG_LIBRARY[contentType] || HASHTAG_LIBRARY.general;
    hashtags.push(...typeHashtags.slice(0, Math.ceil(count / 2)));

    // Add general viral hashtags
    hashtags.push(...HASHTAG_LIBRARY.general.slice(0, Math.floor(count / 3)));

    // Add topic-based hashtags
    topics.forEach(topic => {
      const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTopic.length > 2) {
        hashtags.push(cleanTopic);
      }
    });

    // Deduplicate and limit
    return [...new Set(hashtags)].slice(0, count).map(h => `#${h}`);
  }

  private generateCallToAction(
    contentType: string,
    topic: string
  ): string {
    const templates = CTA_TEMPLATES[contentType] || CTA_TEMPLATES.engagement;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template
      .replace('{topic}', topic)
      .replace('{keyword}', topic.toUpperCase().replace(/\s+/g, ''));
  }

  private generateThumbnailSuggestions(
    topics: string[],
    emotions: string[],
    hook: string
  ): string[] {
    return [
      `Expressive face reacting to "${topics[0] || 'topic'}"`,
      `Bold text overlay: "${hook.substring(0, 30)}..."`,
      `Split image showing before/after or contrast`,
      `Close-up with emoji overlay representing ${emotions[0] || 'surprise'}`,
      `Action shot related to ${topics[0] || 'content'}`,
    ];
  }

  private generateMusicRecommendations(
    emotions: string[],
    tone: GenerationConfig['tone'],
    platformTemplate: PlatformTemplate
  ): MusicRecommendation[] {
    const primaryEmotion = emotions[0] || 'energetic';
    
    const moodMap: Record<string, { genre: string; tempo: MusicRecommendation['tempo'] }> = {
      excitement: { genre: 'electronic/pop', tempo: 'fast' },
      curiosity: { genre: 'ambient/indie', tempo: 'medium' },
      joy: { genre: 'pop/upbeat', tempo: 'fast' },
      surprise: { genre: 'electronic/dramatic', tempo: 'variable' },
      trust: { genre: 'acoustic/soft', tempo: 'medium' },
      anticipation: { genre: 'cinematic', tempo: 'variable' },
      energetic: { genre: 'electronic/pop', tempo: 'fast' },
    };

    const config = moodMap[primaryEmotion] || moodMap.energetic;

    return [
      {
        genre: config.genre,
        mood: primaryEmotion,
        tempo: config.tempo,
        suggestions: this.getMusicSuggestions(config.genre, platformTemplate.audioStyle),
        timingNotes: 'Sync beat drop with key moment',
      },
      {
        genre: 'trending',
        mood: 'viral',
        tempo: 'variable',
        suggestions: ['Check platform trending sounds', 'Use original audio for reach'],
        timingNotes: 'Match trending audio timing expectations',
      },
    ];
  }

  private getMusicSuggestions(genre: string, audioStyle: string): string[] {
    if (audioStyle === 'trending-sound') {
      return [
        'Browse TikTok trending sounds',
        'Check viral audio this week',
        'Original sound for algorithm boost',
      ];
    }
    
    return [
      `Search for "${genre}" on audio library`,
      'Use royalty-free music platforms',
      'Consider original composition',
    ];
  }

  private generateEditingNotes(
    segments: ScriptSegment[],
    platformTemplate: PlatformTemplate,
    contentTypeConfig: ContentTypeConfig
  ): string[] {
    const notes: string[] = [];

    // Pacing notes
    notes.push(`Pacing: ${platformTemplate.pacingStyle} - match ${platformTemplate.idealDuration}s ideal length`);

    // Visual density
    notes.push(`Visual density: ${contentTypeConfig.visualDensity} - adjust cuts accordingly`);

    // Platform-specific
    notes.push(`Format: ${platformTemplate.preferredFormats.join(', ')}`);
    notes.push(`Captions: ${platformTemplate.captionStyle} style recommended`);

    // Segment-specific timing
    segments.forEach((segment, i) => {
      if (segment.type === 'hook') {
        notes.push(`Hook (0-${segment.duration}s): Front-load impact, no slow intro`);
      }
      if (segment.type === 'climax') {
        notes.push(`Climax: Use visual emphasis (zoom, text, highlight)`);
      }
    });

    // General best practices
    notes.push('Add captions for 85% silent viewers');
    notes.push('First frame must be scroll-stopping');

    return notes;
  }

  // Analysis and scoring methods
  private calculateViralityScore(
    hook: string,
    segments: ScriptSegment[],
    emotions: string[],
    platform: string
  ): number {
    let score = 0.5;

    // Hook quality (0-0.25)
    const hookScore = this.calculateHookStrength(hook, 'curiosity');
    score += hookScore * 0.25;

    // Content structure (0-0.15)
    if (segments.length >= 4) score += 0.08;
    if (segments.some(s => s.type === 'climax')) score += 0.07;

    // Emotional engagement (0-0.15)
    if (emotions.length > 0) score += 0.08;
    if (emotions.includes('surprise') || emotions.includes('excitement')) score += 0.07;

    // Platform optimization (0-0.1)
    const platformTemplate = PLATFORM_TEMPLATES[platform];
    const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0);
    if (Math.abs(totalDuration - platformTemplate.idealDuration) <= 10) {
      score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  private generatePerformancePreview(
    viralityScore: number,
    platform: string,
    topics: string[]
  ): PerformancePreview {
    // Base calculations from virality score
    const baseViews = 10000;
    const multiplier = Math.pow(10, viralityScore * 2);
    
    const likelyViews = Math.round(baseViews * multiplier);
    const minViews = Math.round(likelyViews * 0.2);
    const maxViews = Math.round(likelyViews * 5);

    const engagementRate = 0.05 + (viralityScore * 0.1);
    const likes = Math.round(likelyViews * engagementRate);
    const comments = Math.round(likes * 0.1);
    const shares = Math.round(likes * 0.05);

    return {
      estimatedViews: {
        min: minViews,
        max: maxViews,
        likely: likelyViews,
      },
      estimatedEngagement: {
        likes,
        comments,
        shares,
      },
      viralProbability: viralityScore * 0.3,
      bestPostingTimes: this.getBestPostingTimes(platform),
      targetAudience: this.getTargetAudience(topics),
    };
  }

  private getBestPostingTimes(platform: string): string[] {
    const times: Record<string, string[]> = {
      tiktok: ['7-9 AM', '12-3 PM', '7-9 PM'],
      reels: ['11 AM-1 PM', '7-9 PM'],
      shorts: ['2-4 PM', '8-11 PM'],
      universal: ['12-1 PM', '7-9 PM'],
    };
    return times[platform] || times.universal;
  }

  private getTargetAudience(topics: string[]): string[] {
    return [
      `People interested in ${topics[0] || 'this content'}`,
      'Content consumers aged 18-34',
      'Users who engage with similar topics',
      'Followers of related creators',
    ];
  }

  // Content analysis helpers
  private extractMainTopics(input: ContentAnalysisInput): string[] {
    const topics: string[] = [];
    
    // From topic clusters
    if (input.topics && input.topics.length > 0) {
      topics.push(...input.topics.map(t => t.name));
    }
    
    // From keywords
    if (input.keywords && input.keywords.length > 0) {
      topics.push(...input.keywords.slice(0, 3));
    }

    // From keyphrases
    if (input.keyphrases && input.keyphrases.length > 0) {
      topics.push(...input.keyphrases.slice(0, 2));
    }

    return [...new Set(topics)].slice(0, 5);
  }

  private extractKeyEntities(input: ContentAnalysisInput): string[] {
    if (!input.entities || input.entities.length === 0) {
      return ['experts', 'professionals'];
    }
    
    return input.entities
      .filter(e => e.type === 'PERSON' || e.type === 'ORGANIZATION')
      .map(e => e.text)
      .slice(0, 3);
  }

  private extractEmotionalThemes(input: ContentAnalysisInput): string[] {
    const themes: string[] = [];
    
    if (input.emotions) {
      themes.push(input.emotions.primary);
      if (input.emotions.secondary) {
        themes.push(...input.emotions.secondary);
      }
    }

    // Derive from sentiment
    if (input.sentiment) {
      if (input.sentiment.positive > 0.6) themes.push('positivity');
      if (input.sentiment.negative > 0.4) themes.push('concern');
    }

    return [...new Set(themes)];
  }

  private identifyBestMoments(input: ContentAnalysisInput): BestMoment[] {
    const moments: BestMoment[] = [];

    // From segments
    if (input.segments && input.segments.length > 0) {
      // Find high-engagement segments
      input.segments.forEach((segment, index) => {
        if (segment.text.length > 20 && segment.text.length < 300) {
          moments.push({
            text: segment.text,
            timestamp: segment.startTime,
            score: 0.5 + (Math.random() * 0.3),
            type: 'quote',
          });
        }
      });
    }

    // From text analysis
    if (input.text) {
      const sentences = input.text.split(/[.!?]+/).filter(s => s.trim().length > 20);
      sentences.slice(0, 5).forEach((sentence, i) => {
        moments.push({
          text: sentence.trim(),
          timestamp: i * 10,
          score: 0.4 + (Math.random() * 0.3),
          type: 'insight',
        });
      });
    }

    return moments.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  // Template filling
  private fillTemplate(template: string, values: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  }

  private generateClaim(input: ContentAnalysisInput, topic: string): string {
    if (input.sentiment && input.sentiment.positive > 0.6) {
      return `${topic} is more powerful than you think`;
    }
    return `${topic} could change everything`;
  }

  private generateObservation(input: ContentAnalysisInput, topic: string): string {
    return `${topic} works the way it does`;
  }

  private generateStatement(input: ContentAnalysisInput, topic: string): string {
    return `${topic} is completely misunderstood`;
  }

  private generateStatistic(input: ContentAnalysisInput, topic: string): string {
    return `${topic} adoption increased by 300%`;
  }

  private generateTease(input: ContentAnalysisInput, topic: string): string {
    return `you'll never guess what this ${topic} reveal shows`;
  }

  private getRandomTimeframe(): string {
    const timeframes = ['2024', 'the last decade', 'recent years', 'just one year'];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  }

  private getRandomAdjective(sentiment?: SentimentScore): string {
    if (sentiment && sentiment.positive > 0.6) {
      return 'incredible';
    }
    if (sentiment && sentiment.negative > 0.4) {
      return 'problematic';
    }
    return 'different than expected';
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  }

  private compileFullScript(segments: ScriptSegment[]): string {
    return segments.map(s => s.content).join('\n\n');
  }

  private generateTitle(
    topics: string[],
    hookStyle: HookStyle,
    index: number
  ): string {
    const topic = topics[0] || 'content';
    const styles: Record<string, string> = {
      question: `The ${topic} Question`,
      shocking_stat: `${topic} Stats Revealed`,
      controversy: `Controversial ${topic} Take`,
      curiosity: `${topic} Secret`,
      personal_story: `My ${topic} Story`,
      challenge: `${topic} Challenge`,
      promise: `Master ${topic}`,
      contrast: `${topic} Reality Check`,
      social_proof: `Why Experts Love ${topic}`,
      urgency: `${topic} Now`,
    };
    
    const base = styles[hookStyle] || `${topic} Script`;
    return `${base} v${index + 1}`;
  }

  private calculateConfidenceScore(
    input: ContentAnalysisInput,
    viralityScore: number
  ): number {
    let confidence = 0.5;
    
    // More input data = higher confidence
    if (input.text && input.text.length > 500) confidence += 0.1;
    if (input.keywords && input.keywords.length > 5) confidence += 0.1;
    if (input.entities && input.entities.length > 0) confidence += 0.1;
    if (input.segments && input.segments.length > 0) confidence += 0.1;

    // Virality extremes reduce confidence
    if (viralityScore > 0.3 && viralityScore < 0.7) confidence += 0.1;

    return Math.min(1, confidence);
  }

  // Cache management
  private generateCacheKey(
    input: ContentAnalysisInput,
    config: GenerationConfig
  ): string {
    const inputHash = this.hashString(input.text?.substring(0, 100) || '');
    return `${inputHash}_${config.platform}_${config.contentType}_${config.targetDuration}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private addToCache(key: string, scripts: GeneratedScript[]): void {
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, scripts);
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================================
// Supporting Types
// ============================================================================

interface BestMoment {
  text: string;
  timestamp: number;
  score: number;
  type: 'quote' | 'insight' | 'fact' | 'story';
}

// ============================================================================
// Singleton Export and Helper Functions
// ============================================================================

export const scriptGenerator = new ScriptGenerator();

export function generateScripts(
  input: ContentAnalysisInput,
  config: GenerationConfig,
  count?: number
): GeneratedScript[] {
  return scriptGenerator.generate(input, config, count);
}

export function generateQuickScript(
  text: string,
  platform: 'tiktok' | 'reels' | 'shorts' = 'tiktok'
): GeneratedScript[] {
  const input: ContentAnalysisInput = {
    text,
    sentiment: { overall: 0, positive: 0.5, negative: 0.1, neutral: 0.4, confidence: 0.5 },
    emotions: { primary: 'curiosity', secondary: [], intensity: 0.5, valence: 0.3, arousal: 0.5 },
    entities: [],
    keywords: text.toLowerCase().split(/\s+/).slice(0, 10),
    keyphrases: [],
    topics: [],
  };

  const config: GenerationConfig = {
    platform,
    targetDuration: platform === 'shorts' ? 45 : 30,
    tone: 'casual',
    includeCallToAction: true,
    contentType: 'entertainment',
  };

  return scriptGenerator.generate(input, config, 3);
}

export function getHookTemplates(): typeof HOOK_TEMPLATES {
  return HOOK_TEMPLATES;
}

export function getEmotionalArcs(): typeof EMOTIONAL_ARCS {
  return EMOTIONAL_ARCS;
}

export function getPlatformTemplates(): typeof PLATFORM_TEMPLATES {
  return PLATFORM_TEMPLATES;
}

export function getContentTypeConfigs(): typeof CONTENT_TYPE_CONFIGS {
  return CONTENT_TYPE_CONFIGS;
}
