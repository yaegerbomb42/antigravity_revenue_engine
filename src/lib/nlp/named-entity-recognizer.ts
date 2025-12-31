// ============================================================================
// Named Entity Recognition (NER) Engine
// ============================================================================

import { NamedEntity, EntityType, Token } from '@/types';
import { tokenizer } from './tokenizer';

// ----------------------------------------------------------------------------
// Entity Patterns and Gazetteers
// ----------------------------------------------------------------------------

// Common person name prefixes
const NAME_PREFIXES = new Set([
  'mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'professor', 'sir', 'madam',
  'lord', 'lady', 'rev', 'reverend', 'fr', 'father', 'sister', 'brother',
  'rabbi', 'imam', 'senator', 'representative', 'governor', 'mayor',
  'president', 'ceo', 'cfo', 'cto', 'coo', 'vp', 'director', 'manager',
]);

// Common person name suffixes
const NAME_SUFFIXES = new Set([
  'jr', 'sr', 'ii', 'iii', 'iv', 'v', 'phd', 'md', 'esq', 'jd', 'dds',
  'cpa', 'mba', 'msc', 'bsc', 'ba', 'ma',
]);

// Common first names (sample for pattern matching)
const COMMON_FIRST_NAMES = new Set([
  'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph',
  'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'mark',
  'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian',
  'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan',
  'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty', 'margaret', 'sandra',
  'ashley', 'dorothy', 'kimberly', 'emily', 'donna', 'michelle', 'carol',
  'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura',
  'elon', 'jeff', 'mark', 'tim', 'sundar', 'satya', 'jensen', 'sam', 'alex',
]);

// Known organization indicators
const ORG_INDICATORS = new Set([
  'inc', 'corp', 'corporation', 'company', 'co', 'llc', 'ltd', 'limited',
  'group', 'holdings', 'partners', 'association', 'foundation', 'institute',
  'university', 'college', 'school', 'academy', 'hospital', 'clinic',
  'bank', 'trust', 'fund', 'capital', 'ventures', 'labs', 'technologies',
  'tech', 'software', 'systems', 'solutions', 'services', 'industries',
  'entertainment', 'media', 'studios', 'productions', 'records', 'music',
  'games', 'sports', 'airlines', 'airways', 'motors', 'automotive',
]);

// Known organizations
const KNOWN_ORGANIZATIONS = new Set([
  'google', 'apple', 'microsoft', 'amazon', 'facebook', 'meta', 'netflix',
  'twitter', 'x', 'tesla', 'spacex', 'nvidia', 'intel', 'amd', 'ibm',
  'oracle', 'salesforce', 'adobe', 'spotify', 'uber', 'lyft', 'airbnb',
  'tiktok', 'bytedance', 'alibaba', 'tencent', 'baidu', 'samsung', 'sony',
  'nintendo', 'disney', 'warner', 'paramount', 'universal', 'fox', 'hbo',
  'cnn', 'bbc', 'nbc', 'cbs', 'abc', 'espn', 'nfl', 'nba', 'mlb', 'fifa',
  'youtube', 'instagram', 'snapchat', 'pinterest', 'linkedin', 'reddit',
  'twitch', 'discord', 'slack', 'zoom', 'github', 'gitlab', 'openai',
  'anthropic', 'deepmind', 'huggingface', 'stability', 'midjourney',
]);

// Location indicators
const LOCATION_INDICATORS = new Set([
  'city', 'town', 'village', 'county', 'state', 'province', 'region',
  'country', 'nation', 'island', 'peninsula', 'continent', 'ocean', 'sea',
  'river', 'lake', 'mountain', 'valley', 'desert', 'forest', 'park',
  'street', 'avenue', 'boulevard', 'road', 'highway', 'bridge', 'tunnel',
  'airport', 'station', 'terminal', 'port', 'harbor', 'beach', 'coast',
]);

// Known locations
const KNOWN_LOCATIONS = new Set([
  'usa', 'america', 'canada', 'mexico', 'brazil', 'argentina', 'uk',
  'england', 'france', 'germany', 'italy', 'spain', 'portugal', 'russia',
  'china', 'japan', 'korea', 'india', 'australia', 'africa', 'europe',
  'asia', 'california', 'texas', 'florida', 'newyork', 'chicago', 'boston',
  'seattle', 'denver', 'atlanta', 'miami', 'dallas', 'houston', 'phoenix',
  'sanfrancisco', 'losangeles', 'sandiego', 'lasvegas', 'portland',
  'london', 'paris', 'berlin', 'rome', 'madrid', 'amsterdam', 'vienna',
  'tokyo', 'beijing', 'shanghai', 'singapore', 'hongkong', 'dubai',
  'sydney', 'melbourne', 'toronto', 'vancouver', 'montreal', 'hollywood',
  'silicon valley', 'wall street', 'broadway', 'times square', 'manhattan',
]);

// Product/brand indicators
const PRODUCT_INDICATORS = new Set([
  'iphone', 'ipad', 'macbook', 'airpods', 'apple watch', 'imac',
  'pixel', 'android', 'chrome', 'chromebook', 'nest',
  'windows', 'xbox', 'surface', 'office', 'azure', 'teams',
  'alexa', 'kindle', 'echo', 'aws', 'prime',
  'model s', 'model 3', 'model x', 'model y', 'cybertruck',
  'playstation', 'switch', 'quest', 'oculus',
  'chatgpt', 'gpt', 'claude', 'gemini', 'copilot', 'midjourney',
  'photoshop', 'illustrator', 'premiere', 'after effects',
]);

// Event patterns
const EVENT_PATTERNS = [
  /\b(super bowl|world cup|olympics|grammy|oscar|emmy|tony)\b/i,
  /\b(conference|summit|expo|convention|festival|championship)\b/i,
  /\b(election|inauguration|ceremony|premiere|launch)\b/i,
  /\b(black friday|cyber monday|prime day|christmas|thanksgiving)\b/i,
];

// Date patterns
const DATE_PATTERNS = [
  /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
  /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?,?\s*\d{0,4}\b/i,
  /\b\d{1,2}(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december),?\s*\d{0,4}\b/i,
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\b(today|tomorrow|yesterday|next week|last week|this month|next month)\b/i,
];

// Time patterns
const TIME_PATTERNS = [
  /\b(\d{1,2}:\d{2}(:\d{2})?\s*(am|pm|AM|PM)?)\b/,
  /\b(\d{1,2}\s*(am|pm|AM|PM))\b/,
  /\b(noon|midnight|morning|afternoon|evening|night)\b/i,
];

// Money patterns
const MONEY_PATTERNS = [
  /\$\d+(?:,\d{3})*(?:\.\d{2})?(?:\s*(?:million|billion|trillion|k|m|b))?/i,
  /\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|usd|euros|eur|pounds|gbp|yen|jpy)/i,
  /(?:€|£|¥)\d+(?:,\d{3})*(?:\.\d{2})?/,
];

// Percentage patterns
const PERCENTAGE_PATTERNS = [
  /\b\d+(?:\.\d+)?%/,
  /\b\d+(?:\.\d+)?\s*percent\b/i,
];

// URL pattern
const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

// Email pattern
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// Hashtag pattern
const HASHTAG_PATTERN = /#[a-zA-Z0-9_]+/g;

// Mention pattern
const MENTION_PATTERN = /@[a-zA-Z0-9_]+/g;

// ----------------------------------------------------------------------------
// NER Class
// ----------------------------------------------------------------------------

export class NamedEntityRecognizer {
  private cache: Map<string, NamedEntity[]> = new Map();
  private maxCacheSize = 500;

  /**
   * Extract named entities from text
   */
  recognize(text: string): NamedEntity[] {
    // Check cache
    const cacheKey = text.substring(0, 150);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const entities: NamedEntity[] = [];
    const tokens = tokenizer.tokenize(text);

    // Pattern-based extraction
    this.extractPatternEntities(text, entities);
    
    // Token-based extraction
    this.extractTokenEntities(tokens, text, entities);

    // Deduplicate and merge overlapping entities
    const dedupedEntities = this.deduplicateEntities(entities);

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, dedupedEntities);

    return dedupedEntities;
  }

  /**
   * Extract entities using regex patterns
   */
  private extractPatternEntities(text: string, entities: NamedEntity[]): void {
    // URLs
    const urls = text.match(URL_PATTERN);
    if (urls) {
      for (const url of urls) {
        const start = text.indexOf(url);
        entities.push(this.createEntity(url, 'URL', start, start + url.length, 0.95));
      }
    }

    // Emails
    const emails = text.match(EMAIL_PATTERN);
    if (emails) {
      for (const email of emails) {
        const start = text.indexOf(email);
        entities.push(this.createEntity(email, 'EMAIL', start, start + email.length, 0.95));
      }
    }

    // Hashtags
    const hashtags = text.match(HASHTAG_PATTERN);
    if (hashtags) {
      for (const hashtag of hashtags) {
        const start = text.indexOf(hashtag);
        entities.push(this.createEntity(hashtag, 'HASHTAG', start, start + hashtag.length, 0.95));
      }
    }

    // Mentions
    const mentions = text.match(MENTION_PATTERN);
    if (mentions) {
      for (const mention of mentions) {
        const start = text.indexOf(mention);
        entities.push(this.createEntity(mention, 'MENTION', start, start + mention.length, 0.95));
      }
    }

    // Dates
    for (const pattern of DATE_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, 'gi');
      while ((match = regex.exec(text)) !== null) {
        entities.push(this.createEntity(match[0], 'DATE', match.index, match.index + match[0].length, 0.85));
      }
    }

    // Times
    for (const pattern of TIME_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, 'gi');
      while ((match = regex.exec(text)) !== null) {
        entities.push(this.createEntity(match[0], 'TIME', match.index, match.index + match[0].length, 0.85));
      }
    }

    // Money
    for (const pattern of MONEY_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, 'gi');
      while ((match = regex.exec(text)) !== null) {
        entities.push(this.createEntity(match[0], 'MONEY', match.index, match.index + match[0].length, 0.9));
      }
    }

    // Percentages
    for (const pattern of PERCENTAGE_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, 'gi');
      while ((match = regex.exec(text)) !== null) {
        entities.push(this.createEntity(match[0], 'PERCENT', match.index, match.index + match[0].length, 0.9));
      }
    }

    // Events
    for (const pattern of EVENT_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, 'gi');
      while ((match = regex.exec(text)) !== null) {
        entities.push(this.createEntity(match[0], 'EVENT', match.index, match.index + match[0].length, 0.75));
      }
    }
  }

  /**
   * Extract entities using token analysis
   */
  private extractTokenEntities(tokens: Token[], text: string, entities: NamedEntity[]): void {
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];
      
      // Skip non-alpha tokens and stopwords
      if (!token.isAlpha) {
        i++;
        continue;
      }

      // Check for capitalized word sequences (potential named entities)
      if (this.isCapitalized(token.text)) {
        const entityTokens = this.extractCapitalizedSequence(tokens, i);
        if (entityTokens.length > 0) {
          const entityText = entityTokens.map(t => t.text).join(' ');
          const entityType = this.classifyEntity(entityTokens, text);
          
          if (entityType) {
            const startChar = entityTokens[0].startChar;
            const endChar = entityTokens[entityTokens.length - 1].endChar;
            const confidence = this.calculateConfidence(entityTokens, entityType);
            
            entities.push(this.createEntity(entityText, entityType, startChar, endChar, confidence));
          }
          
          i += entityTokens.length;
          continue;
        }
      }

      // Check for known entities (case-insensitive)
      const entityType = this.checkKnownEntity(token.text.toLowerCase());
      if (entityType) {
        entities.push(this.createEntity(
          token.text, 
          entityType, 
          token.startChar, 
          token.endChar, 
          0.8
        ));
      }

      i++;
    }
  }

  /**
   * Check if a word is capitalized
   */
  private isCapitalized(word: string): boolean {
    return word.length > 0 && word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase();
  }

  /**
   * Extract sequence of capitalized words
   */
  private extractCapitalizedSequence(tokens: Token[], startIndex: number): Token[] {
    const sequence: Token[] = [];
    let i = startIndex;

    while (i < tokens.length) {
      const token = tokens[i];
      
      // Continue sequence if capitalized or is a known connector
      if (this.isCapitalized(token.text) || 
          (sequence.length > 0 && this.isEntityConnector(token.text))) {
        sequence.push(token);
        i++;
      } else {
        break;
      }
    }

    // Remove trailing connectors
    while (sequence.length > 0 && this.isEntityConnector(sequence[sequence.length - 1].text)) {
      sequence.pop();
    }

    return sequence;
  }

  /**
   * Check if word is an entity connector
   */
  private isEntityConnector(word: string): boolean {
    const connectors = new Set(['of', 'the', 'and', 'for', 'in', 'at', 'on', '&', '-']);
    return connectors.has(word.toLowerCase());
  }

  /**
   * Classify entity type based on context
   */
  private classifyEntity(tokens: Token[], text: string): EntityType | null {
    const entityText = tokens.map(t => t.text.toLowerCase()).join(' ');
    const firstWord = tokens[0].text.toLowerCase();
    const lastWord = tokens[tokens.length - 1].text.toLowerCase();

    // Check for organization indicators
    if (ORG_INDICATORS.has(lastWord) || KNOWN_ORGANIZATIONS.has(firstWord)) {
      return 'ORGANIZATION';
    }

    // Check for location indicators
    if (LOCATION_INDICATORS.has(lastWord) || KNOWN_LOCATIONS.has(entityText.replace(/\s/g, ''))) {
      return 'LOCATION';
    }

    // Check for person name patterns
    if (NAME_PREFIXES.has(firstWord)) {
      return 'PERSON';
    }
    if (NAME_SUFFIXES.has(lastWord)) {
      return 'PERSON';
    }
    if (COMMON_FIRST_NAMES.has(firstWord) && tokens.length >= 2) {
      return 'PERSON';
    }

    // Check for product indicators
    const productMatch = PRODUCT_INDICATORS.has(entityText.replace(/\s/g, '').toLowerCase());
    if (productMatch) {
      return 'PRODUCT';
    }

    // Default classification based on token count and patterns
    if (tokens.length === 1) {
      // Single capitalized word - likely a proper noun
      if (KNOWN_ORGANIZATIONS.has(firstWord)) {
        return 'ORGANIZATION';
      }
      // Could be a person's first name or location
      return null; // Too ambiguous
    }

    if (tokens.length >= 2 && tokens.length <= 4) {
      // 2-4 word phrases - likely person or organization
      // Check if looks like a person name (2-3 words, no indicators)
      if (tokens.length <= 3 && !ORG_INDICATORS.has(lastWord)) {
        return 'PERSON';
      }
      return 'ORGANIZATION';
    }

    return 'ORGANIZATION'; // Default for longer sequences
  }

  /**
   * Check if word is a known entity
   */
  private checkKnownEntity(word: string): EntityType | null {
    if (KNOWN_ORGANIZATIONS.has(word)) return 'ORGANIZATION';
    if (KNOWN_LOCATIONS.has(word)) return 'LOCATION';
    if (PRODUCT_INDICATORS.has(word)) return 'PRODUCT';
    return null;
  }

  /**
   * Calculate confidence score for entity
   */
  private calculateConfidence(tokens: Token[], entityType: EntityType): number {
    let confidence = 0.5;

    // Increase confidence for longer entities
    confidence += Math.min(tokens.length * 0.05, 0.2);

    // Increase confidence for entities with indicators
    const lastWord = tokens[tokens.length - 1].text.toLowerCase();
    const firstWord = tokens[0].text.toLowerCase();

    if (entityType === 'ORGANIZATION' && ORG_INDICATORS.has(lastWord)) {
      confidence += 0.2;
    }
    if (entityType === 'PERSON' && NAME_PREFIXES.has(firstWord)) {
      confidence += 0.2;
    }
    if (entityType === 'LOCATION' && LOCATION_INDICATORS.has(lastWord)) {
      confidence += 0.2;
    }

    // Known entities get high confidence
    if (KNOWN_ORGANIZATIONS.has(firstWord) || KNOWN_LOCATIONS.has(firstWord)) {
      confidence += 0.3;
    }

    return Math.min(confidence, 0.95);
  }

  /**
   * Create entity object
   */
  private createEntity(
    text: string, 
    type: EntityType, 
    start: number, 
    end: number, 
    confidence: number
  ): NamedEntity {
    return {
      text,
      type,
      startChar: start,
      endChar: end,
      confidence,
    };
  }

  /**
   * Deduplicate and merge overlapping entities
   */
  private deduplicateEntities(entities: NamedEntity[]): NamedEntity[] {
    // Sort by start position and then by length (longer first)
    const sorted = [...entities].sort((a, b) => {
      if (a.startChar !== b.startChar) return a.startChar - b.startChar;
      return (b.endChar - b.startChar) - (a.endChar - a.startChar);
    });

    const result: NamedEntity[] = [];
    let lastEnd = -1;

    for (const entity of sorted) {
      // Skip if this entity overlaps with a longer/earlier one
      if (entity.startChar < lastEnd) {
        continue;
      }

      // Check for exact duplicates
      const duplicate = result.find(e => 
        e.text === entity.text && 
        e.type === entity.type &&
        Math.abs(e.startChar - entity.startChar) < 5
      );

      if (!duplicate) {
        result.push(entity);
        lastEnd = entity.endChar;
      }
    }

    return result;
  }

  /**
   * Get entities by type
   */
  getEntitiesByType(entities: NamedEntity[], type: EntityType): NamedEntity[] {
    return entities.filter(e => e.type === type);
  }

  /**
   * Get entity frequency map
   */
  getEntityFrequencies(entities: NamedEntity[]): Map<string, { count: number; type: EntityType }> {
    const frequencies = new Map<string, { count: number; type: EntityType }>();

    for (const entity of entities) {
      const key = entity.text.toLowerCase();
      const existing = frequencies.get(key);
      
      if (existing) {
        existing.count++;
      } else {
        frequencies.set(key, { count: 1, type: entity.type });
      }
    }

    return frequencies;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const nerRecognizer = new NamedEntityRecognizer();

export function recognizeEntities(text: string): NamedEntity[] {
  return nerRecognizer.recognize(text);
}

export function getEntitiesByType(text: string, type: EntityType): NamedEntity[] {
  const entities = nerRecognizer.recognize(text);
  return nerRecognizer.getEntitiesByType(entities, type);
}

export function getEntityFrequencies(text: string): Map<string, { count: number; type: EntityType }> {
  const entities = nerRecognizer.recognize(text);
  return nerRecognizer.getEntityFrequencies(entities);
}

export function extractPeople(text: string): string[] {
  return getEntitiesByType(text, 'PERSON').map(e => e.text);
}

export function extractOrganizations(text: string): string[] {
  return getEntitiesByType(text, 'ORGANIZATION').map(e => e.text);
}

export function extractLocations(text: string): string[] {
  return getEntitiesByType(text, 'LOCATION').map(e => e.text);
}
