// ============================================================================
// Advanced Sentiment Analysis Engine
// ============================================================================

import { SentimentScore, EmotionAnalysis, Token } from '@/types';
import { tokenizer } from './tokenizer';

// ----------------------------------------------------------------------------
// Sentiment Lexicon
// ----------------------------------------------------------------------------

interface LexiconEntry {
  score: number;
  intensity: number;
  emotions: string[];
}

// AFINN-inspired sentiment lexicon with extensions
const SENTIMENT_LEXICON: Record<string, LexiconEntry> = {
  // Strongly positive (3-5)
  'amazing': { score: 4, intensity: 0.9, emotions: ['joy', 'surprise'] },
  'awesome': { score: 4, intensity: 0.85, emotions: ['joy'] },
  'beautiful': { score: 3, intensity: 0.7, emotions: ['joy', 'love'] },
  'best': { score: 4, intensity: 0.8, emotions: ['joy'] },
  'brilliant': { score: 4, intensity: 0.85, emotions: ['joy', 'surprise'] },
  'celebrate': { score: 3, intensity: 0.75, emotions: ['joy'] },
  'champion': { score: 3, intensity: 0.7, emotions: ['joy', 'pride'] },
  'charming': { score: 3, intensity: 0.65, emotions: ['love', 'joy'] },
  'delight': { score: 4, intensity: 0.8, emotions: ['joy'] },
  'delightful': { score: 4, intensity: 0.8, emotions: ['joy'] },
  'excellent': { score: 4, intensity: 0.85, emotions: ['joy'] },
  'exceptional': { score: 4, intensity: 0.85, emotions: ['joy', 'surprise'] },
  'exciting': { score: 3, intensity: 0.75, emotions: ['joy', 'anticipation'] },
  'extraordinary': { score: 4, intensity: 0.85, emotions: ['surprise', 'joy'] },
  'fabulous': { score: 4, intensity: 0.85, emotions: ['joy'] },
  'fantastic': { score: 4, intensity: 0.85, emotions: ['joy'] },
  'favorite': { score: 3, intensity: 0.7, emotions: ['love', 'joy'] },
  'genius': { score: 4, intensity: 0.85, emotions: ['admiration', 'surprise'] },
  'glorious': { score: 4, intensity: 0.8, emotions: ['joy', 'admiration'] },
  'gorgeous': { score: 4, intensity: 0.8, emotions: ['love', 'joy'] },
  'great': { score: 3, intensity: 0.7, emotions: ['joy'] },
  'happy': { score: 3, intensity: 0.75, emotions: ['joy'] },
  'incredible': { score: 4, intensity: 0.85, emotions: ['surprise', 'joy'] },
  'inspiring': { score: 3, intensity: 0.75, emotions: ['admiration', 'joy'] },
  'legendary': { score: 4, intensity: 0.85, emotions: ['admiration', 'surprise'] },
  'love': { score: 4, intensity: 0.9, emotions: ['love', 'joy'] },
  'lovely': { score: 3, intensity: 0.7, emotions: ['love', 'joy'] },
  'magnificent': { score: 4, intensity: 0.85, emotions: ['admiration', 'joy'] },
  'marvelous': { score: 4, intensity: 0.85, emotions: ['joy', 'surprise'] },
  'masterpiece': { score: 5, intensity: 0.95, emotions: ['admiration', 'joy'] },
  'outstanding': { score: 4, intensity: 0.85, emotions: ['joy', 'admiration'] },
  'perfect': { score: 5, intensity: 0.95, emotions: ['joy'] },
  'phenomenal': { score: 4, intensity: 0.9, emotions: ['surprise', 'joy'] },
  'remarkable': { score: 3, intensity: 0.75, emotions: ['surprise', 'joy'] },
  'sensational': { score: 4, intensity: 0.85, emotions: ['surprise', 'joy'] },
  'spectacular': { score: 4, intensity: 0.85, emotions: ['surprise', 'joy'] },
  'stunning': { score: 4, intensity: 0.85, emotions: ['surprise', 'joy'] },
  'sublime': { score: 4, intensity: 0.85, emotions: ['joy', 'admiration'] },
  'superb': { score: 4, intensity: 0.85, emotions: ['joy'] },
  'superior': { score: 3, intensity: 0.7, emotions: ['pride', 'joy'] },
  'terrific': { score: 4, intensity: 0.8, emotions: ['joy'] },
  'thrilled': { score: 4, intensity: 0.85, emotions: ['joy', 'excitement'] },
  'triumph': { score: 4, intensity: 0.8, emotions: ['joy', 'pride'] },
  'unbelievable': { score: 4, intensity: 0.85, emotions: ['surprise'] },
  'victory': { score: 3, intensity: 0.75, emotions: ['joy', 'pride'] },
  'viral': { score: 3, intensity: 0.7, emotions: ['excitement', 'joy'] },
  'win': { score: 3, intensity: 0.7, emotions: ['joy', 'pride'] },
  'winner': { score: 3, intensity: 0.7, emotions: ['joy', 'pride'] },
  'wonderful': { score: 4, intensity: 0.85, emotions: ['joy'] },
  'wow': { score: 3, intensity: 0.8, emotions: ['surprise', 'joy'] },
  
  // Mildly positive (1-2)
  'accept': { score: 1, intensity: 0.4, emotions: ['trust'] },
  'accomplished': { score: 2, intensity: 0.6, emotions: ['pride', 'joy'] },
  'achievement': { score: 2, intensity: 0.6, emotions: ['pride'] },
  'admire': { score: 2, intensity: 0.6, emotions: ['admiration'] },
  'agree': { score: 1, intensity: 0.4, emotions: ['trust'] },
  'amusing': { score: 2, intensity: 0.5, emotions: ['joy', 'amusement'] },
  'appreciate': { score: 2, intensity: 0.6, emotions: ['gratitude'] },
  'approval': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'attractive': { score: 2, intensity: 0.5, emotions: ['love'] },
  'benefit': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'calm': { score: 2, intensity: 0.5, emotions: ['serenity'] },
  'capable': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'care': { score: 2, intensity: 0.6, emotions: ['love'] },
  'comfortable': { score: 2, intensity: 0.5, emotions: ['serenity'] },
  'confidence': { score: 2, intensity: 0.6, emotions: ['trust'] },
  'cool': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'creative': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'curious': { score: 1, intensity: 0.5, emotions: ['anticipation'] },
  'easy': { score: 1, intensity: 0.4, emotions: ['serenity'] },
  'effective': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'efficient': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'elegant': { score: 2, intensity: 0.6, emotions: ['admiration'] },
  'encourage': { score: 2, intensity: 0.6, emotions: ['trust', 'joy'] },
  'enjoy': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'entertaining': { score: 2, intensity: 0.5, emotions: ['joy', 'amusement'] },
  'enthusiastic': { score: 2, intensity: 0.7, emotions: ['joy', 'anticipation'] },
  'free': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'fresh': { score: 1, intensity: 0.4, emotions: ['joy'] },
  'friendly': { score: 2, intensity: 0.5, emotions: ['love', 'trust'] },
  'fun': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'generous': { score: 2, intensity: 0.6, emotions: ['love'] },
  'glad': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'good': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'grateful': { score: 2, intensity: 0.7, emotions: ['gratitude'] },
  'growth': { score: 2, intensity: 0.5, emotions: ['anticipation'] },
  'helpful': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'honest': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'hope': { score: 2, intensity: 0.6, emotions: ['anticipation', 'optimism'] },
  'improve': { score: 2, intensity: 0.5, emotions: ['optimism'] },
  'innovative': { score: 2, intensity: 0.6, emotions: ['surprise', 'admiration'] },
  'insight': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'intelligent': { score: 2, intensity: 0.5, emotions: ['admiration'] },
  'interesting': { score: 2, intensity: 0.5, emotions: ['anticipation'] },
  'kind': { score: 2, intensity: 0.6, emotions: ['love'] },
  'laugh': { score: 2, intensity: 0.6, emotions: ['joy', 'amusement'] },
  'learn': { score: 1, intensity: 0.4, emotions: ['anticipation'] },
  'like': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'lucky': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'motivated': { score: 2, intensity: 0.6, emotions: ['anticipation'] },
  'natural': { score: 1, intensity: 0.4, emotions: ['serenity'] },
  'nice': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'opportunity': { score: 2, intensity: 0.5, emotions: ['anticipation'] },
  'optimistic': { score: 2, intensity: 0.6, emotions: ['optimism'] },
  'peaceful': { score: 2, intensity: 0.5, emotions: ['serenity'] },
  'pleasant': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'pleased': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'popular': { score: 2, intensity: 0.5, emotions: ['joy'] },
  'positive': { score: 2, intensity: 0.5, emotions: ['optimism'] },
  'powerful': { score: 2, intensity: 0.6, emotions: ['admiration'] },
  'pretty': { score: 2, intensity: 0.5, emotions: ['love'] },
  'progress': { score: 2, intensity: 0.5, emotions: ['optimism'] },
  'proud': { score: 2, intensity: 0.7, emotions: ['pride'] },
  'quality': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'recommend': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'relax': { score: 2, intensity: 0.5, emotions: ['serenity'] },
  'reliable': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'respect': { score: 2, intensity: 0.6, emotions: ['admiration'] },
  'safe': { score: 2, intensity: 0.5, emotions: ['trust', 'serenity'] },
  'satisfied': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'secure': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'simple': { score: 1, intensity: 0.4, emotions: ['serenity'] },
  'smart': { score: 2, intensity: 0.5, emotions: ['admiration'] },
  'smile': { score: 2, intensity: 0.6, emotions: ['joy'] },
  'smooth': { score: 1, intensity: 0.4, emotions: ['serenity'] },
  'special': { score: 2, intensity: 0.5, emotions: ['joy', 'love'] },
  'strong': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'succeed': { score: 2, intensity: 0.6, emotions: ['joy', 'pride'] },
  'success': { score: 3, intensity: 0.7, emotions: ['joy', 'pride'] },
  'support': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'sweet': { score: 2, intensity: 0.5, emotions: ['love', 'joy'] },
  'thank': { score: 2, intensity: 0.6, emotions: ['gratitude'] },
  'trust': { score: 2, intensity: 0.6, emotions: ['trust'] },
  'unique': { score: 2, intensity: 0.5, emotions: ['surprise'] },
  'useful': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'valuable': { score: 2, intensity: 0.5, emotions: ['trust'] },
  'warm': { score: 2, intensity: 0.5, emotions: ['love'] },
  'welcome': { score: 2, intensity: 0.5, emotions: ['trust', 'joy'] },
  'worth': { score: 2, intensity: 0.5, emotions: ['trust'] },
  
  // Mildly negative (-1 to -2)
  'annoy': { score: -2, intensity: 0.5, emotions: ['anger'] },
  'anxious': { score: -2, intensity: 0.6, emotions: ['fear', 'anticipation'] },
  'bad': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  'bored': { score: -2, intensity: 0.4, emotions: ['sadness'] },
  'boring': { score: -2, intensity: 0.4, emotions: ['sadness'] },
  'concern': { score: -1, intensity: 0.4, emotions: ['fear'] },
  'confused': { score: -1, intensity: 0.4, emotions: ['surprise'] },
  'criticism': { score: -2, intensity: 0.5, emotions: ['anger'] },
  'delay': { score: -1, intensity: 0.4, emotions: ['anger'] },
  'difficult': { score: -1, intensity: 0.4, emotions: ['fear'] },
  'disappoint': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'disappointed': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'dislike': { score: -2, intensity: 0.5, emotions: ['disgust'] },
  'doubt': { score: -1, intensity: 0.4, emotions: ['fear'] },
  'dull': { score: -1, intensity: 0.3, emotions: ['sadness'] },
  'empty': { score: -1, intensity: 0.4, emotions: ['sadness'] },
  'exhausted': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  'fail': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'failure': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'fault': { score: -2, intensity: 0.5, emotions: ['anger'] },
  'fear': { score: -2, intensity: 0.7, emotions: ['fear'] },
  'frustrated': { score: -2, intensity: 0.6, emotions: ['anger'] },
  'frustrating': { score: -2, intensity: 0.6, emotions: ['anger'] },
  'guilty': { score: -2, intensity: 0.6, emotions: ['sadness', 'fear'] },
  'hard': { score: -1, intensity: 0.3, emotions: ['fear'] },
  'ignore': { score: -1, intensity: 0.4, emotions: ['sadness'] },
  'impatient': { score: -1, intensity: 0.4, emotions: ['anger'] },
  'jealous': { score: -2, intensity: 0.6, emotions: ['anger', 'sadness'] },
  'lack': { score: -1, intensity: 0.4, emotions: ['sadness'] },
  'late': { score: -1, intensity: 0.3, emotions: ['anger'] },
  'lazy': { score: -1, intensity: 0.4, emotions: ['disgust'] },
  'limit': { score: -1, intensity: 0.3, emotions: ['sadness'] },
  'lonely': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'lose': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'loss': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'mad': { score: -2, intensity: 0.6, emotions: ['anger'] },
  'mess': { score: -1, intensity: 0.4, emotions: ['disgust'] },
  'miss': { score: -1, intensity: 0.4, emotions: ['sadness'] },
  'mistake': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  'negative': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  'nervous': { score: -2, intensity: 0.5, emotions: ['fear'] },
  'problem': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  'regret': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'reject': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'risk': { score: -1, intensity: 0.4, emotions: ['fear'] },
  'sad': { score: -2, intensity: 0.7, emotions: ['sadness'] },
  'scare': { score: -2, intensity: 0.6, emotions: ['fear'] },
  'slow': { score: -1, intensity: 0.3, emotions: ['anger'] },
  'sorry': { score: -1, intensity: 0.5, emotions: ['sadness'] },
  'stress': { score: -2, intensity: 0.6, emotions: ['fear', 'anger'] },
  'struggle': { score: -2, intensity: 0.5, emotions: ['sadness', 'fear'] },
  'stuck': { score: -1, intensity: 0.4, emotions: ['sadness'] },
  'tired': { score: -1, intensity: 0.4, emotions: ['sadness'] },
  'trouble': { score: -2, intensity: 0.5, emotions: ['fear'] },
  'ugly': { score: -2, intensity: 0.5, emotions: ['disgust'] },
  'uncomfortable': { score: -2, intensity: 0.4, emotions: ['fear'] },
  'unfair': { score: -2, intensity: 0.6, emotions: ['anger'] },
  'unhappy': { score: -2, intensity: 0.6, emotions: ['sadness'] },
  'upset': { score: -2, intensity: 0.6, emotions: ['anger', 'sadness'] },
  'useless': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  'wait': { score: -1, intensity: 0.3, emotions: ['anticipation'] },
  'weak': { score: -1, intensity: 0.4, emotions: ['fear'] },
  'weird': { score: -1, intensity: 0.3, emotions: ['surprise', 'disgust'] },
  'worry': { score: -2, intensity: 0.6, emotions: ['fear'] },
  'wrong': { score: -2, intensity: 0.5, emotions: ['sadness'] },
  
  // Strongly negative (-3 to -5)
  'abuse': { score: -4, intensity: 0.9, emotions: ['anger', 'fear'] },
  'angry': { score: -3, intensity: 0.8, emotions: ['anger'] },
  'awful': { score: -4, intensity: 0.85, emotions: ['disgust'] },
  'betray': { score: -4, intensity: 0.9, emotions: ['anger', 'sadness'] },
  'catastrophe': { score: -4, intensity: 0.9, emotions: ['fear', 'sadness'] },
  'cheat': { score: -3, intensity: 0.8, emotions: ['anger', 'disgust'] },
  'corrupt': { score: -3, intensity: 0.8, emotions: ['anger', 'disgust'] },
  'cruel': { score: -4, intensity: 0.85, emotions: ['anger', 'fear'] },
  'damage': { score: -3, intensity: 0.7, emotions: ['fear', 'anger'] },
  'danger': { score: -3, intensity: 0.8, emotions: ['fear'] },
  'dangerous': { score: -3, intensity: 0.8, emotions: ['fear'] },
  'dead': { score: -3, intensity: 0.8, emotions: ['sadness', 'fear'] },
  'death': { score: -4, intensity: 0.9, emotions: ['sadness', 'fear'] },
  'destroy': { score: -4, intensity: 0.85, emotions: ['anger', 'fear'] },
  'disaster': { score: -4, intensity: 0.9, emotions: ['fear', 'sadness'] },
  'disgust': { score: -3, intensity: 0.8, emotions: ['disgust'] },
  'disgusting': { score: -4, intensity: 0.85, emotions: ['disgust'] },
  'dread': { score: -3, intensity: 0.8, emotions: ['fear'] },
  'enemy': { score: -3, intensity: 0.7, emotions: ['anger', 'fear'] },
  'evil': { score: -4, intensity: 0.9, emotions: ['fear', 'anger'] },
  'fake': { score: -3, intensity: 0.7, emotions: ['anger', 'disgust'] },
  'fraud': { score: -4, intensity: 0.85, emotions: ['anger', 'disgust'] },
  'grief': { score: -4, intensity: 0.9, emotions: ['sadness'] },
  'hate': { score: -4, intensity: 0.9, emotions: ['anger'] },
  'horrible': { score: -4, intensity: 0.85, emotions: ['fear', 'disgust'] },
  'horrify': { score: -4, intensity: 0.9, emotions: ['fear'] },
  'horror': { score: -4, intensity: 0.9, emotions: ['fear'] },
  'hurt': { score: -3, intensity: 0.7, emotions: ['sadness', 'anger'] },
  'idiot': { score: -3, intensity: 0.7, emotions: ['anger', 'disgust'] },
  'insult': { score: -3, intensity: 0.7, emotions: ['anger'] },
  'kill': { score: -4, intensity: 0.9, emotions: ['fear', 'anger'] },
  'liar': { score: -3, intensity: 0.8, emotions: ['anger', 'disgust'] },
  'lie': { score: -3, intensity: 0.7, emotions: ['anger', 'disgust'] },
  'miserable': { score: -4, intensity: 0.85, emotions: ['sadness'] },
  'murder': { score: -5, intensity: 1.0, emotions: ['fear', 'anger'] },
  'nightmare': { score: -4, intensity: 0.85, emotions: ['fear'] },
  'pain': { score: -3, intensity: 0.7, emotions: ['sadness', 'fear'] },
  'pathetic': { score: -3, intensity: 0.7, emotions: ['disgust', 'sadness'] },
  'poison': { score: -3, intensity: 0.8, emotions: ['fear', 'disgust'] },
  'rage': { score: -4, intensity: 0.9, emotions: ['anger'] },
  'ruin': { score: -3, intensity: 0.8, emotions: ['sadness', 'anger'] },
  'scam': { score: -4, intensity: 0.85, emotions: ['anger', 'disgust'] },
  'shame': { score: -3, intensity: 0.8, emotions: ['sadness'] },
  'shit': { score: -3, intensity: 0.7, emotions: ['anger', 'disgust'] },
  'shock': { score: -3, intensity: 0.8, emotions: ['surprise', 'fear'] },
  'sick': { score: -2, intensity: 0.6, emotions: ['sadness', 'disgust'] },
  'spam': { score: -3, intensity: 0.6, emotions: ['anger', 'disgust'] },
  'stupid': { score: -3, intensity: 0.7, emotions: ['anger', 'disgust'] },
  'suffer': { score: -3, intensity: 0.8, emotions: ['sadness'] },
  'terrible': { score: -4, intensity: 0.85, emotions: ['fear', 'sadness'] },
  'terrify': { score: -4, intensity: 0.9, emotions: ['fear'] },
  'terror': { score: -4, intensity: 0.9, emotions: ['fear'] },
  'threat': { score: -3, intensity: 0.8, emotions: ['fear'] },
  'toxic': { score: -3, intensity: 0.8, emotions: ['disgust', 'fear'] },
  'tragedy': { score: -4, intensity: 0.9, emotions: ['sadness'] },
  'tragic': { score: -4, intensity: 0.85, emotions: ['sadness'] },
  'trauma': { score: -4, intensity: 0.9, emotions: ['fear', 'sadness'] },
  'victim': { score: -3, intensity: 0.7, emotions: ['sadness', 'fear'] },
  'violence': { score: -4, intensity: 0.9, emotions: ['fear', 'anger'] },
  'violent': { score: -4, intensity: 0.85, emotions: ['fear', 'anger'] },
  'waste': { score: -2, intensity: 0.5, emotions: ['sadness', 'anger'] },
  'worst': { score: -4, intensity: 0.85, emotions: ['sadness', 'anger'] },
  'worthless': { score: -3, intensity: 0.8, emotions: ['sadness'] },
};

// Intensifiers and diminishers
const INTENSIFIERS: Record<string, number> = {
  'absolutely': 1.5,
  'completely': 1.4,
  'definitely': 1.3,
  'extremely': 1.5,
  'greatly': 1.3,
  'highly': 1.3,
  'incredibly': 1.5,
  'insanely': 1.6,
  'literally': 1.2,
  'particularly': 1.2,
  'perfectly': 1.4,
  'purely': 1.3,
  'quite': 1.2,
  'really': 1.3,
  'remarkably': 1.3,
  'so': 1.3,
  'super': 1.4,
  'totally': 1.4,
  'truly': 1.3,
  'utterly': 1.5,
  'very': 1.3,
};

const DIMINISHERS: Record<string, number> = {
  'a bit': 0.6,
  'a little': 0.6,
  'barely': 0.4,
  'fairly': 0.7,
  'hardly': 0.3,
  'kind of': 0.6,
  'kinda': 0.6,
  'less': 0.6,
  'marginally': 0.5,
  'merely': 0.5,
  'mildly': 0.6,
  'moderately': 0.7,
  'only': 0.7,
  'partially': 0.6,
  'pretty': 0.8,
  'rather': 0.7,
  'slightly': 0.5,
  'somewhat': 0.6,
  'sort of': 0.6,
  'sorta': 0.6,
};

// Negation words
const NEGATIONS = new Set([
  'not', "n't", 'no', 'never', 'neither', 'nobody', 'nothing',
  'nowhere', 'none', 'without', 'hardly', 'barely', 'scarcely',
  'seldom', 'rarely', "don't", "doesn't", "didn't", "won't",
  "wouldn't", "couldn't", "shouldn't", "can't", "cannot",
]);

// Emotion categories
type EmotionCategory = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'trust' | 'anticipation' | 'love' | 'optimism' | 'pride' | 'admiration' | 'gratitude' | 'serenity' | 'amusement' | 'excitement';

// ----------------------------------------------------------------------------
// Sentiment Analyzer Class
// ----------------------------------------------------------------------------

export class SentimentAnalyzer {
  private cache: Map<string, SentimentScore> = new Map();
  private maxCacheSize = 1000;

  /**
   * Analyze sentiment of text
   */
  analyze(text: string): SentimentScore {
    // Check cache
    const cacheKey = text.substring(0, 100);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const tokens = tokenizer.tokenize(text);
    const result = this.analyzeTokens(tokens);

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Analyze sentiment from tokens
   */
  analyzeTokens(tokens: Token[]): SentimentScore {
    let totalScore = 0;
    let positiveScore = 0;
    let negativeScore = 0;
    let wordCount = 0;
    let sentimentWordCount = 0;
    let currentIntensifier = 1;
    let negationActive = false;
    let negationScope = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const lemma = token.lemma.toLowerCase();

      // Check for negation
      if (NEGATIONS.has(lemma) || NEGATIONS.has(token.text.toLowerCase())) {
        negationActive = true;
        negationScope = 3; // Negation affects next 3 words
        continue;
      }

      // Check for intensifiers
      if (INTENSIFIERS[lemma]) {
        currentIntensifier = INTENSIFIERS[lemma];
        continue;
      }

      // Check for diminishers
      if (DIMINISHERS[lemma]) {
        currentIntensifier = DIMINISHERS[lemma];
        continue;
      }

      // Check sentiment lexicon
      const entry = SENTIMENT_LEXICON[lemma];
      if (entry) {
        let score = entry.score * entry.intensity * currentIntensifier;
        
        // Apply negation
        if (negationActive && negationScope > 0) {
          score *= -0.5; // Negation reduces and inverts
        }

        totalScore += score;
        if (score > 0) {
          positiveScore += score;
        } else {
          negativeScore += Math.abs(score);
        }
        sentimentWordCount++;
        
        // Reset intensifier after use
        currentIntensifier = 1;
      }

      // Count words
      if (token.isAlpha && !token.isStopWord) {
        wordCount++;
      }

      // Decrease negation scope
      if (negationActive && token.isAlpha) {
        negationScope--;
        if (negationScope <= 0) {
          negationActive = false;
        }
      }
    }

    // Normalize scores
    const normalizer = Math.max(sentimentWordCount, 1);
    const maxPossibleScore = normalizer * 5; // Max score per word is 5
    
    const normalizedTotal = totalScore / maxPossibleScore;
    const normalizedPositive = positiveScore / maxPossibleScore;
    const normalizedNegative = negativeScore / maxPossibleScore;
    
    // Calculate neutral as remainder
    const totalSentiment = normalizedPositive + normalizedNegative;
    const neutral = Math.max(0, 1 - totalSentiment);

    // Calculate confidence based on sentiment word density
    const confidence = Math.min(sentimentWordCount / Math.max(wordCount, 1), 1);

    return {
      overall: Math.max(-1, Math.min(1, normalizedTotal)),
      positive: Math.min(1, normalizedPositive),
      negative: Math.min(1, normalizedNegative),
      neutral: Math.min(1, neutral),
      confidence,
    };
  }

  /**
   * Analyze emotions in text
   */
  analyzeEmotions(text: string): EmotionAnalysis {
    const tokens = tokenizer.tokenize(text);
    const emotionCounts: Record<string, number> = {};
    const emotionIntensities: Record<string, number[]> = {};
    let totalIntensity = 0;

    for (const token of tokens) {
      const lemma = token.lemma.toLowerCase();
      const entry = SENTIMENT_LEXICON[lemma];
      
      if (entry && entry.emotions) {
        for (const emotion of entry.emotions) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          if (!emotionIntensities[emotion]) {
            emotionIntensities[emotion] = [];
          }
          emotionIntensities[emotion].push(entry.intensity);
          totalIntensity += entry.intensity;
        }
      }
    }

    // Determine primary and secondary emotions
    const sortedEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1]);

    const primary = sortedEmotions[0]?.[0] || 'neutral';
    const secondary = sortedEmotions[1]?.[0];

    // Calculate emotion scores
    const emotions: Record<string, number> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
      trust: 0,
      anticipation: 0,
    };

    for (const [emotion, intensities] of Object.entries(emotionIntensities)) {
      if (emotion in emotions) {
        const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
        emotions[emotion] = avgIntensity * (intensities.length / Math.max(Object.keys(emotionIntensities).length, 1));
      }
    }

    // Normalize emotion scores
    const maxEmotion = Math.max(...Object.values(emotions), 0.01);
    for (const emotion in emotions) {
      emotions[emotion] = emotions[emotion] / maxEmotion;
    }

    // Calculate intensity
    const intensity = totalIntensity / Math.max(tokens.filter(t => t.isAlpha).length, 1);

    return {
      primary: primary as EmotionCategory,
      secondary: secondary as EmotionCategory | undefined,
      emotions: emotions as Record<EmotionCategory, number>,
      intensity: Math.min(1, intensity),
      confidence: Math.min(1, Object.keys(emotionCounts).length / 5),
    };
  }

  /**
   * Get sentiment trend across sentences
   */
  getSentimentTrend(sentences: string[]): { position: number; sentiment: number }[] {
    return sentences.map((sentence, index) => ({
      position: index / Math.max(sentences.length - 1, 1),
      sentiment: this.analyze(sentence).overall,
    }));
  }

  /**
   * Find sentiment shifts in text
   */
  findSentimentShifts(sentences: string[]): SentimentShift[] {
    const shifts: SentimentShift[] = [];
    const sentiments = sentences.map(s => this.analyze(s));

    for (let i = 1; i < sentiments.length; i++) {
      const prev = sentiments[i - 1];
      const curr = sentiments[i];
      const diff = curr.overall - prev.overall;

      if (Math.abs(diff) > 0.3) { // Significant shift threshold
        shifts.push({
          position: i,
          from: prev.overall,
          to: curr.overall,
          magnitude: Math.abs(diff),
          direction: diff > 0 ? 'positive' : 'negative',
          sentence: sentences[i],
        });
      }
    }

    return shifts;
  }

  /**
   * Analyze aspect-based sentiment
   */
  analyzeAspectSentiment(text: string, aspects: string[]): AspectSentiment[] {
    const tokens = tokenizer.tokenize(text);
    const results: AspectSentiment[] = [];

    for (const aspect of aspects) {
      const aspectLower = aspect.toLowerCase();
      let aspectSentiment = 0;
      let count = 0;

      // Find sentiment words near aspect mentions
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].lemma.toLowerCase() === aspectLower || 
            tokens[i].text.toLowerCase() === aspectLower) {
          // Look at surrounding words (window of 5)
          for (let j = Math.max(0, i - 5); j < Math.min(tokens.length, i + 6); j++) {
            if (i !== j) {
              const entry = SENTIMENT_LEXICON[tokens[j].lemma.toLowerCase()];
              if (entry) {
                const distance = Math.abs(i - j);
                const weight = 1 / distance;
                aspectSentiment += entry.score * entry.intensity * weight;
                count++;
              }
            }
          }
        }
      }

      results.push({
        aspect,
        sentiment: count > 0 ? aspectSentiment / count : 0,
        confidence: Math.min(count / 3, 1),
        mentions: tokens.filter(t => 
          t.lemma.toLowerCase() === aspectLower || 
          t.text.toLowerCase() === aspectLower
        ).length,
      });
    }

    return results;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface SentimentShift {
  position: number;
  from: number;
  to: number;
  magnitude: number;
  direction: 'positive' | 'negative';
  sentence: string;
}

export interface AspectSentiment {
  aspect: string;
  sentiment: number;
  confidence: number;
  mentions: number;
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const sentimentAnalyzer = new SentimentAnalyzer();

export function analyzeSentiment(text: string): SentimentScore {
  return sentimentAnalyzer.analyze(text);
}

export function analyzeEmotions(text: string): EmotionAnalysis {
  return sentimentAnalyzer.analyzeEmotions(text);
}

export function getSentimentTrend(sentences: string[]): { position: number; sentiment: number }[] {
  return sentimentAnalyzer.getSentimentTrend(sentences);
}

export function findSentimentShifts(sentences: string[]): SentimentShift[] {
  return sentimentAnalyzer.findSentimentShifts(sentences);
}

export function analyzeAspectSentiment(text: string, aspects: string[]): AspectSentiment[] {
  return sentimentAnalyzer.analyzeAspectSentiment(text, aspects);
}
