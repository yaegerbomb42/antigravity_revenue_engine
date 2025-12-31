// ============================================================================
// Advanced Sentence Splitter with Linguistic Analysis
// ============================================================================

import { Sentence, Token, SentimentScore } from '@/types';
import { tokenizer } from './tokenizer';

// ----------------------------------------------------------------------------
// Sentence Boundary Detection Rules
// ----------------------------------------------------------------------------

interface AbbreviationSet {
  titles: Set<string>;
  academic: Set<string>;
  months: Set<string>;
  states: Set<string>;
  common: Set<string>;
  units: Set<string>;
}

const ABBREVIATIONS: AbbreviationSet = {
  titles: new Set([
    'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'rev', 'hon', 'gov',
    'pres', 'gen', 'col', 'lt', 'sgt', 'cpl', 'pvt', 'adm', 'capt',
    'cmdr', 'maj', 'rep', 'sen', 'amb', 'treas', 'sec', 'atty', 'supt',
  ]),
  academic: new Set([
    'ph', 'phd', 'md', 'ba', 'bs', 'ma', 'mba', 'jd', 'llb', 'llm',
    'ed', 'edd', 'dds', 'dvm', 'rn', 'esq', 'cpa', 'pe', 'ra',
  ]),
  months: new Set([
    'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept',
    'oct', 'nov', 'dec',
  ]),
  states: new Set([
    'ala', 'ariz', 'ark', 'calif', 'colo', 'conn', 'del', 'fla', 'ill',
    'ind', 'kans', 'mass', 'mich', 'minn', 'miss', 'mont', 'nebr', 'nev',
    'okla', 'oreg', 'penn', 'tenn', 'tex', 'wash', 'wisc', 'wyo',
  ]),
  common: new Set([
    'etc', 'vs', 'viz', 'al', 'eg', 'ie', 'cf', 'approx', 'dept', 'est',
    'min', 'max', 'misc', 'no', 'nos', 'op', 'pp', 're', 'ref', 'tel',
    'temp', 'vet', 'vol', 'vols', 'yr', 'yrs', 'fig', 'figs', 'inc',
    'corp', 'ltd', 'co', 'bros', 'assn', 'assoc', 'natl', 'intl', 'govt',
  ]),
  units: new Set([
    'oz', 'lb', 'lbs', 'kg', 'km', 'cm', 'mm', 'ml', 'mg', 'ft', 'yd',
    'mi', 'hr', 'hrs', 'min', 'mins', 'sec', 'secs', 'cal', 'sq', 'cu',
  ]),
};

const ALL_ABBREVIATIONS = new Set([
  ...ABBREVIATIONS.titles,
  ...ABBREVIATIONS.academic,
  ...ABBREVIATIONS.months,
  ...ABBREVIATIONS.states,
  ...ABBREVIATIONS.common,
  ...ABBREVIATIONS.units,
]);

// Sentence-ending punctuation
const SENTENCE_ENDERS = new Set(['.', '!', '?']);
const QUOTE_CHARS = new Set(['"', "'", '\u201C', '\u201D', '\u2018', '\u2019', '`']);
const BRACKET_CLOSE = new Set([')', ']', '}', '»']);

// ----------------------------------------------------------------------------
// Sentence Type Detection
// ----------------------------------------------------------------------------

type SentenceType = 'declarative' | 'interrogative' | 'exclamatory' | 'imperative';

function detectSentenceType(text: string, tokens: Token[]): SentenceType {
  const trimmed = text.trim();
  
  // Check ending punctuation
  if (trimmed.endsWith('?')) {
    return 'interrogative';
  }
  if (trimmed.endsWith('!')) {
    return 'exclamatory';
  }
  
  // Check for imperative (starts with verb)
  const firstWord = tokens.find(t => t.isAlpha && !t.isStopWord);
  if (firstWord && firstWord.pos === 'VERB') {
    // Check if it's a command structure
    const firstAlpha = tokens.find(t => t.isAlpha);
    if (firstAlpha && firstAlpha.pos === 'VERB' && firstAlpha === firstWord) {
      return 'imperative';
    }
  }
  
  return 'declarative';
}

// ----------------------------------------------------------------------------
// Complexity Analysis
// ----------------------------------------------------------------------------

interface ComplexityMetrics {
  wordCount: number;
  avgWordLength: number;
  syllableCount: number;
  avgSyllablesPerWord: number;
  clauseCount: number;
  subordinateClauseCount: number;
  complexityScore: number;
}

function countSyllables(word: string): number {
  const lower = word.toLowerCase();
  if (lower.length <= 3) return 1;
  
  // Count vowel groups
  let count = 0;
  let prevVowel = false;
  const vowels = 'aeiouy';
  
  for (let i = 0; i < lower.length; i++) {
    const isVowel = vowels.includes(lower[i]);
    if (isVowel && !prevVowel) {
      count++;
    }
    prevVowel = isVowel;
  }
  
  // Adjust for silent e
  if (lower.endsWith('e') && count > 1) {
    count--;
  }
  
  // Adjust for common suffixes
  if (lower.endsWith('le') && lower.length > 2 && !vowels.includes(lower[lower.length - 3])) {
    count++;
  }
  
  return Math.max(1, count);
}

function analyzeComplexity(tokens: Token[]): ComplexityMetrics {
  const words = tokens.filter(t => t.isAlpha);
  const wordCount = words.length;
  
  if (wordCount === 0) {
    return {
      wordCount: 0,
      avgWordLength: 0,
      syllableCount: 0,
      avgSyllablesPerWord: 0,
      clauseCount: 1,
      subordinateClauseCount: 0,
      complexityScore: 0,
    };
  }
  
  // Calculate word length stats
  const totalLength = words.reduce((sum, t) => sum + t.text.length, 0);
  const avgWordLength = totalLength / wordCount;
  
  // Calculate syllables
  const syllableCounts = words.map(t => countSyllables(t.text));
  const syllableCount = syllableCounts.reduce((a, b) => a + b, 0);
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  // Count clauses (approximation based on conjunctions and punctuation)
  const clauseIndicators = new Set([',', ';', 'and', 'but', 'or', 'because', 'although', 'while', 'when', 'if', 'that', 'which', 'who']);
  let clauseCount = 1;
  let subordinateClauseCount = 0;
  
  const subordinators = new Set(['because', 'although', 'while', 'when', 'if', 'unless', 'since', 'after', 'before', 'that', 'which', 'who', 'whom', 'whose']);
  
  for (const token of tokens) {
    const lower = token.text.toLowerCase();
    if (clauseIndicators.has(lower) || clauseIndicators.has(token.text)) {
      clauseCount++;
    }
    if (subordinators.has(lower)) {
      subordinateClauseCount++;
    }
  }
  
  // Calculate complexity score (0-100)
  const lengthFactor = Math.min(avgWordLength / 8, 1) * 25;
  const syllableFactor = Math.min(avgSyllablesPerWord / 3, 1) * 25;
  const clauseFactor = Math.min(clauseCount / 4, 1) * 25;
  const wordCountFactor = Math.min(wordCount / 30, 1) * 25;
  
  const complexityScore = lengthFactor + syllableFactor + clauseFactor + wordCountFactor;
  
  return {
    wordCount,
    avgWordLength,
    syllableCount,
    avgSyllablesPerWord,
    clauseCount,
    subordinateClauseCount,
    complexityScore,
  };
}

// ----------------------------------------------------------------------------
// Main Sentence Splitter Class
// ----------------------------------------------------------------------------

export class SentenceSplitter {
  private cache: Map<string, Sentence[]> = new Map();
  private maxCacheSize = 500;

  /**
   * Split text into sentences with full analysis
   */
  split(text: string): Sentence[] {
    // Check cache
    const cacheKey = text.substring(0, 200);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const sentences: Sentence[] = [];
    const boundaries = this.findBoundaries(text);
    
    let lastEnd = 0;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      const sentenceText = text.substring(lastEnd, boundary.end).trim();
      
      if (sentenceText.length > 0) {
        const tokens = tokenizer.tokenize(sentenceText);
        const sentenceType = detectSentenceType(sentenceText, tokens);
        const complexity = analyzeComplexity(tokens);
        
        sentences.push({
          text: sentenceText,
          tokens,
          startChar: lastEnd,
          endChar: boundary.end,
          type: sentenceType,
          sentiment: this.calculateBasicSentiment(tokens),
          complexity: complexity.complexityScore,
        });
      }
      
      lastEnd = boundary.end;
    }
    
    // Handle remaining text
    if (lastEnd < text.length) {
      const remainingText = text.substring(lastEnd).trim();
      if (remainingText.length > 0) {
        const tokens = tokenizer.tokenize(remainingText);
        const sentenceType = detectSentenceType(remainingText, tokens);
        const complexity = analyzeComplexity(tokens);
        
        sentences.push({
          text: remainingText,
          tokens,
          startChar: lastEnd,
          endChar: text.length,
          type: sentenceType,
          sentiment: this.calculateBasicSentiment(tokens),
          complexity: complexity.complexityScore,
        });
      }
    }

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, sentences);

    return sentences;
  }

  /**
   * Find sentence boundaries in text
   */
  private findBoundaries(text: string): { start: number; end: number }[] {
    const boundaries: { start: number; end: number }[] = [];
    let currentStart = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (SENTENCE_ENDERS.has(char)) {
        // Check if this is a real sentence boundary
        if (this.isSentenceBoundary(text, i)) {
          // Find the actual end (including quotes, brackets)
          let endPos = i + 1;
          while (endPos < text.length) {
            const nextChar = text[endPos];
            if (QUOTE_CHARS.has(nextChar) || BRACKET_CLOSE.has(nextChar)) {
              endPos++;
            } else if (nextChar === ' ' || nextChar === '\n' || nextChar === '\t') {
              break;
            } else {
              break;
            }
          }
          
          boundaries.push({ start: currentStart, end: endPos });
          currentStart = endPos;
        }
      }
    }
    
    return boundaries;
  }

  /**
   * Determine if a position is a true sentence boundary
   */
  private isSentenceBoundary(text: string, pos: number): boolean {
    const char = text[pos];
    
    // Question marks and exclamation points are usually boundaries
    if (char === '?' || char === '!') {
      return true;
    }
    
    // For periods, we need more analysis
    if (char === '.') {
      // Check for abbreviation
      const wordBefore = this.getWordBefore(text, pos);
      if (wordBefore && ALL_ABBREVIATIONS.has(wordBefore.toLowerCase())) {
        // Could still be end of sentence if followed by capital
        const nextNonSpace = this.getNextNonSpace(text, pos + 1);
        if (nextNonSpace && /[A-Z]/.test(nextNonSpace)) {
          // Check if it's a known continuation (like "Dr. Smith")
          const nextWord = this.getWordAfter(text, pos);
          if (nextWord && ABBREVIATIONS.titles.has(wordBefore.toLowerCase())) {
            // Title followed by name - not a boundary
            return false;
          }
          return true;
        }
        return false;
      }
      
      // Check for decimal number
      const charBefore = pos > 0 ? text[pos - 1] : '';
      const charAfter = pos < text.length - 1 ? text[pos + 1] : '';
      if (/\d/.test(charBefore) && /\d/.test(charAfter)) {
        return false;
      }
      
      // Check for ellipsis
      if (pos < text.length - 2 && text.substring(pos, pos + 3) === '...') {
        return false;
      }
      
      // Check for initials (single letter followed by period)
      if (wordBefore && wordBefore.length === 1 && /[A-Z]/.test(wordBefore)) {
        const nextNonSpace = this.getNextNonSpace(text, pos + 1);
        if (nextNonSpace && /[A-Z]/.test(nextNonSpace)) {
          return false;
        }
      }
      
      // Check for URL or email
      const surroundingText = text.substring(Math.max(0, pos - 50), Math.min(text.length, pos + 50));
      if (/https?:\/\/|www\.|@\w+\./.test(surroundingText)) {
        // Check if we're inside a URL
        const urlMatch = surroundingText.match(/https?:\/\/[^\s]+|www\.[^\s]+/);
        if (urlMatch) {
          const urlStart = surroundingText.indexOf(urlMatch[0]);
          const relativePos = 50 - (Math.max(0, pos - 50) - 0);
          if (relativePos >= urlStart && relativePos < urlStart + urlMatch[0].length) {
            return false;
          }
        }
      }
      
      // Default: if followed by space and capital letter, it's a boundary
      const nextNonSpace = this.getNextNonSpace(text, pos + 1);
      if (nextNonSpace === undefined) {
        return true; // End of text
      }
      if (/[A-Z]/.test(nextNonSpace)) {
        return true;
      }
      if (/[a-z]/.test(nextNonSpace)) {
        return false; // Lowercase after period - probably not a boundary
      }
      if (/\d/.test(nextNonSpace)) {
        return true; // Number after period could be new sentence
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Get the word before a position
   */
  private getWordBefore(text: string, pos: number): string | null {
    let end = pos;
    let start = pos - 1;
    
    while (start >= 0 && /[a-zA-Z]/.test(text[start])) {
      start--;
    }
    
    if (start + 1 < end) {
      return text.substring(start + 1, end);
    }
    return null;
  }

  /**
   * Get the word after a position
   */
  private getWordAfter(text: string, pos: number): string | null {
    // Skip whitespace
    let start = pos;
    while (start < text.length && /\s/.test(text[start])) {
      start++;
    }
    
    let end = start;
    while (end < text.length && /[a-zA-Z]/.test(text[end])) {
      end++;
    }
    
    if (start < end) {
      return text.substring(start, end);
    }
    return null;
  }

  /**
   * Get the next non-space character
   */
  private getNextNonSpace(text: string, pos: number): string | undefined {
    for (let i = pos; i < text.length; i++) {
      if (!/\s/.test(text[i])) {
        return text[i];
      }
    }
    return undefined;
  }

  /**
   * Calculate basic sentiment for a sentence
   */
  private calculateBasicSentiment(tokens: Token[]): SentimentScore {
    // This is a placeholder - full sentiment analysis is in sentiment-analyzer.ts
    let positive = 0;
    let negative = 0;
    
    const positiveWords = new Set([
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'awesome', 'best', 'love', 'happy', 'beautiful', 'perfect', 'incredible',
      'brilliant', 'outstanding', 'superb', 'magnificent', 'exceptional',
      'positive', 'success', 'win', 'winning', 'joy', 'exciting', 'excited',
    ]);
    
    const negativeWords = new Set([
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad',
      'ugly', 'poor', 'disappointing', 'disappointed', 'negative', 'fail',
      'failure', 'lose', 'losing', 'angry', 'boring', 'bored', 'annoying',
      'annoyed', 'frustrating', 'frustrated', 'painful', 'pain', 'wrong',
    ]);
    
    for (const token of tokens) {
      const lower = token.lemma.toLowerCase();
      if (positiveWords.has(lower)) {
        positive++;
      } else if (negativeWords.has(lower)) {
        negative++;
      }
    }
    
    const total = positive + negative;
    if (total === 0) {
      return {
        overall: 0,
        positive: 0,
        negative: 0,
        neutral: 1,
        confidence: 0.5,
      };
    }
    
    const positiveScore = positive / total;
    const negativeScore = negative / total;
    const overall = positiveScore - negativeScore;
    
    return {
      overall,
      positive: positiveScore,
      negative: negativeScore,
      neutral: 1 - (positiveScore + negativeScore),
      confidence: Math.min(total / 5, 1),
    };
  }

  /**
   * Get sentence statistics
   */
  getStatistics(sentences: Sentence[]): SentenceStatistics {
    if (sentences.length === 0) {
      return {
        count: 0,
        avgLength: 0,
        avgComplexity: 0,
        typeDistribution: {
          declarative: 0,
          interrogative: 0,
          exclamatory: 0,
          imperative: 0,
        },
        avgSentiment: 0,
      };
    }

    const totalLength = sentences.reduce((sum, s) => sum + s.tokens.filter(t => t.isAlpha).length, 0);
    const totalComplexity = sentences.reduce((sum, s) => sum + s.complexity, 0);
    const totalSentiment = sentences.reduce((sum, s) => sum + s.sentiment.overall, 0);

    const typeDistribution = {
      declarative: 0,
      interrogative: 0,
      exclamatory: 0,
      imperative: 0,
    };

    for (const sentence of sentences) {
      typeDistribution[sentence.type]++;
    }

    // Normalize distribution
    for (const type in typeDistribution) {
      typeDistribution[type as SentenceType] /= sentences.length;
    }

    return {
      count: sentences.length,
      avgLength: totalLength / sentences.length,
      avgComplexity: totalComplexity / sentences.length,
      typeDistribution,
      avgSentiment: totalSentiment / sentences.length,
    };
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

export interface SentenceStatistics {
  count: number;
  avgLength: number;
  avgComplexity: number;
  typeDistribution: Record<SentenceType, number>;
  avgSentiment: number;
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const sentenceSplitter = new SentenceSplitter();

export function splitIntoSentences(text: string): Sentence[] {
  return sentenceSplitter.split(text);
}

export function getSentenceStatistics(text: string): SentenceStatistics {
  const sentences = sentenceSplitter.split(text);
  return sentenceSplitter.getStatistics(sentences);
}

export { countSyllables, analyzeComplexity };
