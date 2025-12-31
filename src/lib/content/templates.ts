// ============================================================================
// Viral Content Templates Library
// ============================================================================
// Comprehensive template system for generating viral short-form content
// Includes script structures, narrative patterns, and platform optimizations

// ============================================================================
// Script Structure Templates
// ============================================================================

export interface ScriptTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  structure: StructureSegment[];
  totalDuration: number;
  platforms: Platform[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  viralPotential: number;
  description: string;
  bestFor: string[];
  examples: string[];
}

export interface StructureSegment {
  name: string;
  type: SegmentType;
  duration: number;
  percentage: number;
  purpose: string;
  tips: string[];
  transitions: string[];
}

export type SegmentType = 
  | 'hook'
  | 'problem'
  | 'agitation'
  | 'solution'
  | 'proof'
  | 'story_setup'
  | 'conflict'
  | 'climax'
  | 'resolution'
  | 'call_to_action'
  | 'teaser';

export type TemplateCategory = 
  | 'educational'
  | 'storytelling'
  | 'promotional'
  | 'entertainment'
  | 'transformation'
  | 'comparison'
  | 'listicle'
  | 'challenge';

export type Platform = 'tiktok' | 'reels' | 'shorts';

// ============================================================================
// Core Templates
// ============================================================================

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  // Educational Templates
  {
    id: 'edu-quick-tip',
    name: 'Quick Tip Formula',
    category: 'educational',
    structure: [
      {
        name: 'Attention Hook',
        type: 'hook',
        duration: 3,
        percentage: 10,
        purpose: 'Stop the scroll with a bold claim or question',
        tips: [
          'Use "Did you know..." or "Stop making this mistake"',
          'Address viewer directly',
          'Create immediate curiosity',
        ],
        transitions: ['Now here\'s the thing...', 'So basically...'],
      },
      {
        name: 'Problem Setup',
        type: 'problem',
        duration: 5,
        percentage: 17,
        purpose: 'Identify the pain point your tip solves',
        tips: [
          'Make it relatable',
          'Use specific scenarios',
          'Show you understand their struggle',
        ],
        transitions: ['But here\'s what most people don\'t know...', 'The solution is simple:'],
      },
      {
        name: 'Solution Reveal',
        type: 'solution',
        duration: 12,
        percentage: 40,
        purpose: 'Deliver the tip with clear, actionable steps',
        tips: [
          'Break into 2-3 clear steps',
          'Use visual demonstrations',
          'Keep language simple',
        ],
        transitions: ['And that\'s it!', 'Try this and see the difference...'],
      },
      {
        name: 'Proof/Example',
        type: 'proof',
        duration: 5,
        percentage: 17,
        purpose: 'Show the tip in action or share results',
        tips: [
          'Show before/after if possible',
          'Share personal experience',
          'Include social proof',
        ],
        transitions: ['So remember...', 'Now you know...'],
      },
      {
        name: 'Call to Action',
        type: 'call_to_action',
        duration: 5,
        percentage: 16,
        purpose: 'Drive engagement and follows',
        tips: [
          'Ask for save/share',
          'Promise more value',
          'End with energy',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels', 'shorts'],
    difficulty: 'beginner',
    viralPotential: 0.75,
    description: 'Perfect for sharing quick, actionable tips that provide immediate value',
    bestFor: ['How-to content', 'Life hacks', 'Professional tips', 'Productivity advice'],
    examples: [
      'Productivity hack that saves 2 hours daily',
      'iPhone feature 90% of people don\'t use',
      'Excel trick that will blow your mind',
    ],
  },
  {
    id: 'edu-myth-buster',
    name: 'Myth Buster',
    category: 'educational',
    structure: [
      {
        name: 'Myth Statement',
        type: 'hook',
        duration: 4,
        percentage: 13,
        purpose: 'State the common misconception dramatically',
        tips: [
          'Start with "Everyone thinks..." or "You\'ve been told..."',
          'Make it sound authoritative',
          'Challenge conventional wisdom',
        ],
        transitions: ['But that\'s completely wrong.', 'Here\'s the truth:'],
      },
      {
        name: 'Why People Believe It',
        type: 'agitation',
        duration: 6,
        percentage: 20,
        purpose: 'Explain why the myth exists',
        tips: [
          'Validate their previous understanding',
          'Show where the confusion comes from',
          'Build credibility',
        ],
        transitions: ['The reality is...', 'What actually happens is...'],
      },
      {
        name: 'Truth Reveal',
        type: 'solution',
        duration: 12,
        percentage: 40,
        purpose: 'Explain the correct information with evidence',
        tips: [
          'Use facts and data',
          'Make it memorable',
          'Explain clearly',
        ],
        transitions: ['So next time you hear this...', 'Now you know the truth:'],
      },
      {
        name: 'Implications',
        type: 'resolution',
        duration: 4,
        percentage: 13,
        purpose: 'Show why this matters',
        tips: [
          'Connect to their life',
          'Show practical impact',
          'Create "aha" moment',
        ],
        transitions: ['Share this with someone who needs to know!'],
      },
      {
        name: 'CTA',
        type: 'call_to_action',
        duration: 4,
        percentage: 14,
        purpose: 'Drive engagement',
        tips: [
          'Ask if they knew this',
          'Promise more myth-busting',
          'Invite comments',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels', 'shorts'],
    difficulty: 'intermediate',
    viralPotential: 0.85,
    description: 'High-engagement format that challenges common beliefs',
    bestFor: ['Science facts', 'Health misconceptions', 'Industry secrets', 'Common mistakes'],
    examples: [
      'The breakfast myth doctors want you to know',
      'Why everything you know about metabolism is wrong',
      'The productivity advice that\'s actually hurting you',
    ],
  },
  
  // Storytelling Templates
  {
    id: 'story-mini-narrative',
    name: 'Mini Story Arc',
    category: 'storytelling',
    structure: [
      {
        name: 'Hook Moment',
        type: 'hook',
        duration: 4,
        percentage: 9,
        purpose: 'Start at the most interesting point',
        tips: [
          'Begin in medias res (middle of action)',
          'Use emotion-laden words',
          'Create immediate intrigue',
        ],
        transitions: ['Let me explain how we got here...', 'It all started when...'],
      },
      {
        name: 'Setup',
        type: 'story_setup',
        duration: 8,
        percentage: 18,
        purpose: 'Establish context and characters',
        tips: [
          'Keep setup brief',
          'Make protagonist relatable',
          'Set stakes clearly',
        ],
        transitions: ['Everything changed when...', 'Then the unexpected happened:'],
      },
      {
        name: 'Rising Conflict',
        type: 'conflict',
        duration: 12,
        percentage: 27,
        purpose: 'Build tension and obstacles',
        tips: [
          'Increase stakes progressively',
          'Add complications',
          'Keep viewers guessing',
        ],
        transitions: ['And just when I thought it couldn\'t get worse...', 'The moment of truth arrived:'],
      },
      {
        name: 'Climax',
        type: 'climax',
        duration: 10,
        percentage: 22,
        purpose: 'Deliver the peak moment',
        tips: [
          'Maximum emotional intensity',
          'Deliver the payoff',
          'Surprise if possible',
        ],
        transitions: ['And that\'s when I realized...', 'Looking back now...'],
      },
      {
        name: 'Resolution + Lesson',
        type: 'resolution',
        duration: 8,
        percentage: 18,
        purpose: 'Wrap up and share takeaway',
        tips: [
          'Connect to universal truth',
          'Leave lasting impression',
          'End with reflection',
        ],
        transitions: ['Follow for more stories...'],
      },
      {
        name: 'CTA',
        type: 'call_to_action',
        duration: 3,
        percentage: 6,
        purpose: 'Quick engagement ask',
        tips: [
          'Keep it brief',
          'Make it relevant to story',
          'Invite similar stories',
        ],
        transitions: [],
      },
    ],
    totalDuration: 45,
    platforms: ['shorts', 'reels'],
    difficulty: 'intermediate',
    viralPotential: 0.8,
    description: 'Compelling narrative structure for personal or illustrative stories',
    bestFor: ['Personal experiences', 'Customer stories', 'Case studies', 'Lessons learned'],
    examples: [
      'How losing everything taught me the most important lesson',
      'The meeting that changed my career forever',
      'What happened when I tried X for 30 days',
    ],
  },
  {
    id: 'story-confession',
    name: 'Confession Format',
    category: 'storytelling',
    structure: [
      {
        name: 'Confession Hook',
        type: 'hook',
        duration: 5,
        percentage: 17,
        purpose: 'Vulnerable admission that creates instant connection',
        tips: [
          'Start with "I have to admit..." or "Nobody knows this but..."',
          'Be authentic and vulnerable',
          'Create curiosity about the story',
        ],
        transitions: ['Here\'s what happened...', 'Let me tell you the whole story:'],
      },
      {
        name: 'The Backstory',
        type: 'story_setup',
        duration: 8,
        percentage: 27,
        purpose: 'Context for your confession',
        tips: [
          'Set the scene briefly',
          'Explain your mindset at the time',
          'Make it relatable',
        ],
        transitions: ['And that\'s when things went wrong...', 'The moment I realized:'],
      },
      {
        name: 'The Revelation',
        type: 'climax',
        duration: 10,
        percentage: 33,
        purpose: 'The core of your confession',
        tips: [
          'Be specific and honest',
          'Don\'t sugarcoat',
          'Show emotion',
        ],
        transitions: ['What I learned from this:', 'The lesson I\'ll never forget:'],
      },
      {
        name: 'Lesson + CTA',
        type: 'resolution',
        duration: 7,
        percentage: 23,
        purpose: 'Takeaway and engagement',
        tips: [
          'Share the wisdom gained',
          'Ask if others relate',
          'Invite their stories',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels'],
    difficulty: 'beginner',
    viralPotential: 0.85,
    description: 'Vulnerability-based content that builds deep connection',
    bestFor: ['Personal growth', 'Mistakes and lessons', 'Behind the scenes', 'Authentic moments'],
    examples: [
      'The biggest mistake I made in my 20s',
      'What I wish I knew before starting my business',
      'The thing I was too embarrassed to share until now',
    ],
  },
  
  // Promotional Templates
  {
    id: 'promo-pas',
    name: 'Problem-Agitate-Solve',
    category: 'promotional',
    structure: [
      {
        name: 'Problem Introduction',
        type: 'problem',
        duration: 6,
        percentage: 20,
        purpose: 'Identify the pain point clearly',
        tips: [
          'Use "You know that feeling when..."',
          'Be specific about the problem',
          'Make them nod in agreement',
        ],
        transitions: ['And it gets worse...', 'Here\'s the frustrating part:'],
      },
      {
        name: 'Agitation',
        type: 'agitation',
        duration: 8,
        percentage: 27,
        purpose: 'Intensify the pain of the problem',
        tips: [
          'Explore consequences',
          'Show what happens if not solved',
          'Create urgency',
        ],
        transitions: ['But what if I told you...', 'There\'s actually a solution:'],
      },
      {
        name: 'Solution Introduction',
        type: 'solution',
        duration: 10,
        percentage: 33,
        purpose: 'Present your solution as the answer',
        tips: [
          'Transition smoothly to solution',
          'Show specific benefits',
          'Make it seem easy',
        ],
        transitions: ['See how easy that was?', 'The results speak for themselves:'],
      },
      {
        name: 'Call to Action',
        type: 'call_to_action',
        duration: 6,
        percentage: 20,
        purpose: 'Drive action',
        tips: [
          'Clear next step',
          'Add urgency if genuine',
          'Make action simple',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels', 'shorts'],
    difficulty: 'intermediate',
    viralPotential: 0.7,
    description: 'Classic marketing framework adapted for short-form video',
    bestFor: ['Product launches', 'Service promotion', 'Course sales', 'Tool recommendations'],
    examples: [
      'Struggling with X? This changed everything',
      'Why I finally switched to Y (honest review)',
      'The tool that saved my business',
    ],
  },
  
  // Transformation Templates
  {
    id: 'transform-before-after',
    name: 'Before/After Transformation',
    category: 'transformation',
    structure: [
      {
        name: 'Dramatic Before',
        type: 'hook',
        duration: 5,
        percentage: 17,
        purpose: 'Show the starting point dramatically',
        tips: [
          'Start with the struggle',
          'Be authentic about the "before"',
          'Create relatability',
        ],
        transitions: ['I knew something had to change...', 'That\'s when I discovered:'],
      },
      {
        name: 'The Catalyst',
        type: 'conflict',
        duration: 6,
        percentage: 20,
        purpose: 'What sparked the transformation',
        tips: [
          'Share the turning point',
          'Make it inspirational',
          'Show determination',
        ],
        transitions: ['So I started...', 'The journey began with:'],
      },
      {
        name: 'The Process',
        type: 'solution',
        duration: 8,
        percentage: 27,
        purpose: 'Show the work/journey briefly',
        tips: [
          'Highlight key steps',
          'Show challenges overcome',
          'Build anticipation',
        ],
        transitions: ['And now...', 'Fast forward to today:'],
      },
      {
        name: 'The After',
        type: 'climax',
        duration: 6,
        percentage: 20,
        purpose: 'Reveal the transformation',
        tips: [
          'Maximum impact reveal',
          'Show genuine emotion',
          'Make results clear',
        ],
        transitions: ['If I can do it, so can you.', 'You can start today:'],
      },
      {
        name: 'CTA',
        type: 'call_to_action',
        duration: 5,
        percentage: 16,
        purpose: 'Inspire action in viewer',
        tips: [
          'Encourage their transformation',
          'Offer help or resources',
          'Ask to follow for more',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels', 'shorts'],
    difficulty: 'beginner',
    viralPotential: 0.9,
    description: 'Highly shareable transformation content',
    bestFor: ['Fitness journeys', 'Skill development', 'Business growth', 'Personal development'],
    examples: [
      '1 year of consistent work - the results',
      'Day 1 vs Day 365 of learning X',
      'My journey from broke to profitable',
    ],
  },
  
  // Listicle Templates
  {
    id: 'listicle-rapid-fire',
    name: 'Rapid Fire List',
    category: 'listicle',
    structure: [
      {
        name: 'Count Hook',
        type: 'hook',
        duration: 3,
        percentage: 10,
        purpose: 'Announce the list with intrigue',
        tips: [
          'Use specific numbers (5, 7, 10)',
          'Add "that no one talks about" or "you need to know"',
          'Create FOMO',
        ],
        transitions: ['Number 1:', 'Starting with:'],
      },
      {
        name: 'List Items',
        type: 'solution',
        duration: 22,
        percentage: 73,
        purpose: 'Deliver value rapidly',
        tips: [
          'Keep each item punchy',
          'Use consistent pacing',
          'Save best for last',
        ],
        transitions: ['Number X:', 'Next:', 'And finally:'],
      },
      {
        name: 'CTA',
        type: 'call_to_action',
        duration: 5,
        percentage: 17,
        purpose: 'Drive saves and follows',
        tips: [
          'Emphasize saving for later',
          'Promise more lists',
          'Ask which was their favorite',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels', 'shorts'],
    difficulty: 'beginner',
    viralPotential: 0.8,
    description: 'Fast-paced list format that maximizes watch time',
    bestFor: ['Tips and tricks', 'Product recommendations', 'Tool lists', 'Fact compilations'],
    examples: [
      '5 apps that will change your life',
      '7 things successful people do every morning',
      '10 websites you should know about',
    ],
  },
  
  // Comparison Templates
  {
    id: 'compare-versus',
    name: 'X vs Y Breakdown',
    category: 'comparison',
    structure: [
      {
        name: 'Comparison Hook',
        type: 'hook',
        duration: 4,
        percentage: 13,
        purpose: 'Set up the comparison with intrigue',
        tips: [
          'Frame as a common debate',
          'Show both options',
          'Promise a clear winner',
        ],
        transitions: ['Let\'s break it down:', 'Here\'s what you need to know:'],
      },
      {
        name: 'Option A Analysis',
        type: 'story_setup',
        duration: 8,
        percentage: 27,
        purpose: 'Fair analysis of first option',
        tips: [
          'Cover pros and cons',
          'Be objective',
          'Use specific examples',
        ],
        transitions: ['Now let\'s look at the other option:'],
      },
      {
        name: 'Option B Analysis',
        type: 'conflict',
        duration: 8,
        percentage: 27,
        purpose: 'Fair analysis of second option',
        tips: [
          'Same criteria as Option A',
          'Build toward conclusion',
          'Be fair',
        ],
        transitions: ['So which one wins?', 'The verdict:'],
      },
      {
        name: 'Verdict',
        type: 'climax',
        duration: 6,
        percentage: 20,
        purpose: 'Clear recommendation with reasoning',
        tips: [
          'Give clear winner',
          'Explain why',
          'Account for different needs',
        ],
        transitions: ['Which one do you prefer?'],
      },
      {
        name: 'CTA',
        type: 'call_to_action',
        duration: 4,
        percentage: 13,
        purpose: 'Invite debate and engagement',
        tips: [
          'Ask their opinion',
          'Create friendly debate',
          'Promise more comparisons',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels', 'shorts'],
    difficulty: 'intermediate',
    viralPotential: 0.75,
    description: 'Engagement-driving comparison format',
    bestFor: ['Product comparisons', 'Method comparisons', 'Tool reviews', 'Lifestyle choices'],
    examples: [
      'iPhone vs Android in 2024 - honest comparison',
      'Renting vs Buying - which is better?',
      'ChatGPT vs Claude - which should you use?',
    ],
  },
  
  // Challenge Templates
  {
    id: 'challenge-try-this',
    name: 'Try This Challenge',
    category: 'challenge',
    structure: [
      {
        name: 'Challenge Introduction',
        type: 'hook',
        duration: 4,
        percentage: 13,
        purpose: 'Hook viewers with the challenge',
        tips: [
          'Make it seem achievable',
          'Create curiosity about results',
          'Use "I bet you can\'t..."',
        ],
        transitions: ['Here\'s how it works:', 'The rules are simple:'],
      },
      {
        name: 'Rules/Instructions',
        type: 'story_setup',
        duration: 6,
        percentage: 20,
        purpose: 'Explain what to do clearly',
        tips: [
          'Keep instructions simple',
          'Make it replicable',
          'Show examples',
        ],
        transitions: ['Now watch what happens:', 'Here\'s my attempt:'],
      },
      {
        name: 'Demonstration',
        type: 'climax',
        duration: 12,
        percentage: 40,
        purpose: 'Show the challenge being done',
        tips: [
          'Be authentic',
          'Show real reactions',
          'Include obstacles',
        ],
        transitions: ['The results:', 'And here\'s what happened:'],
      },
      {
        name: 'Results + CTA',
        type: 'resolution',
        duration: 8,
        percentage: 27,
        purpose: 'Show outcome and invite participation',
        tips: [
          'Share honest results',
          'Encourage attempts',
          'Create UGC opportunity',
        ],
        transitions: [],
      },
    ],
    totalDuration: 30,
    platforms: ['tiktok', 'reels'],
    difficulty: 'intermediate',
    viralPotential: 0.85,
    description: 'Interactive format that drives UGC and engagement',
    bestFor: ['Trend participation', 'Community building', 'Brand challenges', 'Skill demonstrations'],
    examples: [
      'The 30-day no phone in bed challenge',
      'Can you solve this in under 10 seconds?',
      'I tried the X challenge for a week',
    ],
  },
];

// ============================================================================
// Template Helpers and Utilities
// ============================================================================

export function getTemplateById(id: string): ScriptTemplate | undefined {
  return SCRIPT_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): ScriptTemplate[] {
  return SCRIPT_TEMPLATES.filter(t => t.category === category);
}

export function getTemplatesByPlatform(platform: Platform): ScriptTemplate[] {
  return SCRIPT_TEMPLATES.filter(t => t.platforms.includes(platform));
}

export function getTemplatesByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): ScriptTemplate[] {
  return SCRIPT_TEMPLATES.filter(t => t.difficulty === difficulty);
}

export function getHighViralityTemplates(minScore: number = 0.8): ScriptTemplate[] {
  return SCRIPT_TEMPLATES.filter(t => t.viralPotential >= minScore);
}

export function getTemplatesForDuration(
  minDuration: number,
  maxDuration: number
): ScriptTemplate[] {
  return SCRIPT_TEMPLATES.filter(
    t => t.totalDuration >= minDuration && t.totalDuration <= maxDuration
  );
}

export function calculateSegmentTimings(
  template: ScriptTemplate,
  targetDuration: number
): StructureSegment[] {
  const ratio = targetDuration / template.totalDuration;
  return template.structure.map(segment => ({
    ...segment,
    duration: Math.round(segment.duration * ratio),
  }));
}

// ============================================================================
// Narrative Pattern Library
// ============================================================================

export interface NarrativePattern {
  id: string;
  name: string;
  description: string;
  emotionalArc: string[];
  pacingCurve: number[];
  bestFormats: string[];
}

export const NARRATIVE_PATTERNS: NarrativePattern[] = [
  {
    id: 'revelation',
    name: 'The Revelation',
    description: 'Building to a surprising truth or insight',
    emotionalArc: ['curiosity', 'intrigue', 'anticipation', 'surprise', 'satisfaction'],
    pacingCurve: [0.7, 0.8, 0.9, 1.0, 0.6],
    bestFormats: ['myth-buster', 'educational', 'behind-the-scenes'],
  },
  {
    id: 'transformation',
    name: 'The Transformation',
    description: 'Journey from struggle to success',
    emotionalArc: ['empathy', 'hope', 'determination', 'triumph', 'inspiration'],
    pacingCurve: [0.6, 0.7, 0.8, 1.0, 0.7],
    bestFormats: ['before-after', 'journey', 'case-study'],
  },
  {
    id: 'confrontation',
    name: 'The Confrontation',
    description: 'Challenging accepted beliefs or practices',
    emotionalArc: ['intrigue', 'discomfort', 'consideration', 'realization', 'empowerment'],
    pacingCurve: [0.8, 0.9, 0.7, 1.0, 0.6],
    bestFormats: ['controversy', 'myth-buster', 'comparison'],
  },
  {
    id: 'discovery',
    name: 'The Discovery',
    description: 'Sharing new knowledge or finding',
    emotionalArc: ['curiosity', 'fascination', 'understanding', 'excitement', 'motivation'],
    pacingCurve: [0.7, 0.8, 0.7, 1.0, 0.8],
    bestFormats: ['educational', 'tutorial', 'tips'],
  },
  {
    id: 'connection',
    name: 'The Connection',
    description: 'Building emotional bond through shared experience',
    emotionalArc: ['recognition', 'empathy', 'connection', 'validation', 'belonging'],
    pacingCurve: [0.6, 0.7, 0.8, 0.9, 0.8],
    bestFormats: ['confession', 'story', 'relatable-content'],
  },
  {
    id: 'urgency',
    name: 'The Urgency',
    description: 'Creating immediate need for action',
    emotionalArc: ['attention', 'concern', 'urgency', 'relief', 'action'],
    pacingCurve: [0.8, 0.9, 1.0, 0.7, 0.9],
    bestFormats: ['promotional', 'news', 'trending'],
  },
];

export function getPatternById(id: string): NarrativePattern | undefined {
  return NARRATIVE_PATTERNS.find(p => p.id === id);
}

export function getPatternForFormat(format: string): NarrativePattern[] {
  return NARRATIVE_PATTERNS.filter(p => p.bestFormats.includes(format));
}

// ============================================================================
// Timing Guidelines
// ============================================================================

export interface PlatformTiming {
  platform: Platform;
  optimalDurations: number[];
  hookWindow: number;
  attentionDropPoints: number[];
  engagementPeaks: number[];
  ctaPlacement: number;
}

export const PLATFORM_TIMINGS: PlatformTiming[] = [
  {
    platform: 'tiktok',
    optimalDurations: [7, 15, 21, 34, 60],
    hookWindow: 1.5,
    attentionDropPoints: [3, 8, 15, 30],
    engagementPeaks: [7, 15, 25],
    ctaPlacement: 0.9, // 90% through video
  },
  {
    platform: 'reels',
    optimalDurations: [15, 30, 60, 90],
    hookWindow: 2,
    attentionDropPoints: [3, 10, 20, 45],
    engagementPeaks: [10, 20, 40],
    ctaPlacement: 0.85,
  },
  {
    platform: 'shorts',
    optimalDurations: [15, 30, 45, 60],
    hookWindow: 3,
    attentionDropPoints: [5, 15, 30, 45],
    engagementPeaks: [15, 30, 50],
    ctaPlacement: 0.9,
  },
];

export function getTimingForPlatform(platform: Platform): PlatformTiming | undefined {
  return PLATFORM_TIMINGS.find(t => t.platform === platform);
}

export function getOptimalDuration(platform: Platform, targetLength: 'short' | 'medium' | 'long'): number {
  const timing = getTimingForPlatform(platform);
  if (!timing) return 30;
  
  const durations = timing.optimalDurations;
  switch (targetLength) {
    case 'short':
      return durations[0] || 15;
    case 'medium':
      return durations[Math.floor(durations.length / 2)] || 30;
    case 'long':
      return durations[durations.length - 1] || 60;
  }
}

// ============================================================================
// Export All
// ============================================================================

export {
  SCRIPT_TEMPLATES as templates,
  NARRATIVE_PATTERNS as patterns,
  PLATFORM_TIMINGS as timings,
};
