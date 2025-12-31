// ============================================================================
// Text Processing Utilities
// ============================================================================
// Comprehensive text manipulation and analysis utilities for content processing
// Includes string operations, formatting, validation, and transformation helpers

// ============================================================================
// String Manipulation
// ============================================================================

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Truncate text at word boundary
 */
export function truncateAtWord(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace === -1) return truncated + suffix;
  return truncated.slice(0, lastSpace) + suffix;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Convert to sentence case
 */
export function sentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(text: string): string {
  return text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(text: string): string {
  return text.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(text: string): string {
  return text.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(text: string): string {
  return text.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

/**
 * Remove extra whitespace and normalize spaces
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Remove all whitespace
 */
export function removeWhitespace(text: string): string {
  return text.replace(/\s+/g, '');
}

/**
 * Pad string to specified length
 */
export function pad(text: string, length: number, char: string = ' ', position: 'start' | 'end' = 'end'): string {
  const padLength = length - text.length;
  if (padLength <= 0) return text;
  
  const padding = char.repeat(Math.ceil(padLength / char.length)).slice(0, padLength);
  return position === 'start' ? padding + text : text + padding;
}

/**
 * Repeat string n times
 */
export function repeat(text: string, count: number): string {
  return text.repeat(Math.max(0, count));
}

/**
 * Reverse string
 */
export function reverse(text: string): string {
  return [...text].reverse().join('');
}

/**
 * Shuffle string characters
 */
export function shuffle(text: string): string {
  const chars = [...text];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

// ============================================================================
// Text Cleaning
// ============================================================================

/**
 * Remove HTML tags from text
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Remove markdown formatting
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')           // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Bold
    .replace(/\*([^*]+)\*/g, '$1')      // Italic
    .replace(/__([^_]+)__/g, '$1')      // Bold alt
    .replace(/_([^_]+)_/g, '$1')        // Italic alt
    .replace(/~~([^~]+)~~/g, '$1')      // Strikethrough
    .replace(/`([^`]+)`/g, '$1')        // Inline code
    .replace(/```[\s\S]*?```/g, '')     // Code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
    .replace(/^>\s/gm, '')              // Blockquotes
    .replace(/^[-*+]\s/gm, '')          // Unordered lists
    .replace(/^\d+\.\s/gm, '')          // Ordered lists
    .replace(/---/g, '')                // Horizontal rules
    .trim();
}

/**
 * Remove emojis from text
 */
export function stripEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
}

/**
 * Remove URLs from text
 */
export function stripUrls(text: string): string {
  return text.replace(/https?:\/\/[^\s]+/g, '').replace(/www\.[^\s]+/g, '');
}

/**
 * Remove mentions (@username) from text
 */
export function stripMentions(text: string): string {
  return text.replace(/@\w+/g, '');
}

/**
 * Remove hashtags from text
 */
export function stripHashtags(text: string): string {
  return text.replace(/#\w+/g, '');
}

/**
 * Remove special characters, keeping alphanumeric and spaces
 */
export function stripSpecialChars(text: string): string {
  return text.replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
 * Remove numbers from text
 */
export function stripNumbers(text: string): string {
  return text.replace(/\d+/g, '');
}

/**
 * Remove punctuation from text
 */
export function stripPunctuation(text: string): string {
  return text.replace(/[.,!?;:'"()[\]{}]/g, '');
}

/**
 * Clean text by applying multiple filters
 */
export function cleanText(
  text: string,
  options: {
    lowercase?: boolean;
    removeHtml?: boolean;
    removeUrls?: boolean;
    removeMentions?: boolean;
    removeHashtags?: boolean;
    removeEmojis?: boolean;
    removeSpecialChars?: boolean;
    normalizeSpaces?: boolean;
  } = {}
): string {
  let result = text;
  
  if (options.removeHtml) result = stripHtml(result);
  if (options.removeUrls) result = stripUrls(result);
  if (options.removeMentions) result = stripMentions(result);
  if (options.removeHashtags) result = stripHashtags(result);
  if (options.removeEmojis) result = stripEmojis(result);
  if (options.removeSpecialChars) result = stripSpecialChars(result);
  if (options.lowercase) result = result.toLowerCase();
  if (options.normalizeSpaces !== false) result = normalizeWhitespace(result);
  
  return result;
}

// ============================================================================
// Text Extraction
// ============================================================================

/**
 * Extract hashtags from text
 */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract mentions from text
 */
export function extractMentions(text: string): string[] {
  const matches = text.match(/@\w+/g);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract URLs from text
 */
export function extractUrls(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/g;
  const matches = text.match(urlPattern);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract emails from text
 */
export function extractEmails(text: string): string[] {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailPattern);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract phone numbers from text
 */
export function extractPhoneNumbers(text: string): string[] {
  const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phonePattern);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract numbers from text
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Extract sentences from text
 */
export function extractSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Extract paragraphs from text
 */
export function extractParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Extract words from text
 */
export function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

// ============================================================================
// Text Validation
// ============================================================================

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(text: string | null | undefined): boolean {
  return !text || text.trim().length === 0;
}

/**
 * Check if string contains only letters
 */
export function isAlpha(text: string): boolean {
  return /^[a-zA-Z]+$/.test(text);
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(text: string): boolean {
  return /^-?\d+\.?\d*$/.test(text);
}

/**
 * Check if string contains only alphanumeric characters
 */
export function isAlphanumeric(text: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(text);
}

/**
 * Check if string is valid email
 */
export function isEmail(text: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text);
}

/**
 * Check if string is valid URL
 */
export function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is valid YouTube URL
 */
export function isYouTubeUrl(text: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(text));
}

/**
 * Check if string contains profanity (basic filter)
 */
export function containsProfanity(text: string): boolean {
  const profanityList = ['fuck', 'shit', 'ass', 'damn', 'bitch', 'crap', 'bastard'];
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}

/**
 * Check if string is palindrome
 */
export function isPalindrome(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
}

// ============================================================================
// Text Statistics
// ============================================================================

/**
 * Count words in text
 */
export function wordCount(text: string): number {
  return extractWords(text).length;
}

/**
 * Count sentences in text
 */
export function sentenceCount(text: string): number {
  return extractSentences(text).length;
}

/**
 * Count paragraphs in text
 */
export function paragraphCount(text: string): number {
  return extractParagraphs(text).length;
}

/**
 * Count characters (excluding spaces)
 */
export function charCount(text: string, includeSpaces: boolean = true): number {
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
}

/**
 * Calculate average word length
 */
export function avgWordLength(text: string): number {
  const words = extractWords(text);
  if (words.length === 0) return 0;
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return totalLength / words.length;
}

/**
 * Calculate average sentence length (in words)
 */
export function avgSentenceLength(text: string): number {
  const sentences = extractSentences(text);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce((sum, sentence) => sum + wordCount(sentence), 0);
  return totalWords / sentences.length;
}

/**
 * Count syllables in word (approximate)
 */
export function syllableCount(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

/**
 * Calculate reading time in minutes
 */
export function readingTime(text: string, wordsPerMinute: number = 200): number {
  const words = wordCount(text);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Calculate speaking time in seconds
 */
export function speakingTime(text: string, wordsPerMinute: number = 150): number {
  const words = wordCount(text);
  return Math.round((words / wordsPerMinute) * 60);
}

/**
 * Calculate Flesch reading ease score
 */
export function fleschReadingEase(text: string): number {
  const words = wordCount(text);
  const sentences = sentenceCount(text);
  const syllables = extractWords(text).reduce((sum, word) => sum + syllableCount(word), 0);
  
  if (words === 0 || sentences === 0) return 0;
  
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

/**
 * Calculate Flesch-Kincaid grade level
 */
export function fleschKincaidGrade(text: string): number {
  const words = wordCount(text);
  const sentences = sentenceCount(text);
  const syllables = extractWords(text).reduce((sum, word) => sum + syllableCount(word), 0);
  
  if (words === 0 || sentences === 0) return 0;
  
  return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
}

/**
 * Get comprehensive text statistics
 */
export interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  avgWordLength: number;
  avgSentenceLength: number;
  readingTimeMinutes: number;
  speakingTimeSeconds: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  uniqueWords: number;
  lexicalDiversity: number;
}

export function getTextStatistics(text: string): TextStatistics {
  const words = extractWords(text);
  const uniqueWords = new Set(words);
  
  return {
    characters: charCount(text, true),
    charactersNoSpaces: charCount(text, false),
    words: words.length,
    sentences: sentenceCount(text),
    paragraphs: paragraphCount(text),
    avgWordLength: avgWordLength(text),
    avgSentenceLength: avgSentenceLength(text),
    readingTimeMinutes: readingTime(text),
    speakingTimeSeconds: speakingTime(text),
    fleschReadingEase: fleschReadingEase(text),
    fleschKincaidGrade: fleschKincaidGrade(text),
    uniqueWords: uniqueWords.size,
    lexicalDiversity: words.length > 0 ? uniqueWords.size / words.length : 0
  };
}

// ============================================================================
// Text Transformation
// ============================================================================

/**
 * Convert text to slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert slug to readable text
 */
export function unslugify(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, char => escapeMap[char]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(text: string): string {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  return text.replace(/&(amp|lt|gt|quot|#39);/g, match => unescapeMap[match]);
}

/**
 * Escape regex special characters
 */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert newlines to HTML breaks
 */
export function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>');
}

/**
 * Convert HTML breaks to newlines
 */
export function br2nl(text: string): string {
  return text.replace(/<br\s*\/?>/gi, '\n');
}

/**
 * Wrap text at specified width
 */
export function wordWrap(text: string, width: number = 80): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= width) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines.join('\n');
}

/**
 * Indent text
 */
export function indent(text: string, spaces: number = 2): string {
  const indentation = ' '.repeat(spaces);
  return text.split('\n').map(line => indentation + line).join('\n');
}

/**
 * Remove indentation from text
 */
export function dedent(text: string): string {
  const lines = text.split('\n');
  const minIndent = lines
    .filter(line => line.trim())
    .reduce((min, line) => {
      const indent = line.match(/^\s*/)?.[0].length || 0;
      return Math.min(min, indent);
    }, Infinity);
  
  if (minIndent === Infinity) return text;
  return lines.map(line => line.slice(minIndent)).join('\n');
}

// ============================================================================
// Text Comparison
// ============================================================================

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate string similarity (0-1)
 */
export function stringSimilarity(a: string, b: string): number {
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLength;
}

/**
 * Find longest common substring
 */
export function longestCommonSubstring(a: string, b: string): string {
  const matrix: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));
  
  let longest = 0;
  let endIndex = 0;
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
        if (matrix[i][j] > longest) {
          longest = matrix[i][j];
          endIndex = i;
        }
      }
    }
  }
  
  return a.substring(endIndex - longest, endIndex);
}

/**
 * Check if strings are anagrams
 */
export function areAnagrams(a: string, b: string): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/\s/g, '').split('').sort().join('');
  return normalize(a) === normalize(b);
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format number as compact (1K, 1M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Format duration in seconds to mm:ss or hh:mm:ss
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

// ============================================================================
// Template Utilities
// ============================================================================

/**
 * Simple template interpolation
 */
export function interpolate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => 
    String(variables[key] ?? `{{${key}}}`)
  );
}

/**
 * Generate placeholder text (Lorem Ipsum)
 */
export function loremIpsum(paragraphs: number = 1): string {
  const lorem = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa.'
  ];
  
  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    const sentences = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () =>
      lorem[Math.floor(Math.random() * lorem.length)]
    );
    result.push(sentences.join(' '));
  }
  return result.join('\n\n');
}

/**
 * Generate random string
 */
export function randomString(length: number, charset: string = 'alphanumeric'): string {
  const charsets: Record<string, string> = {
    alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numeric: '0123456789',
    alphanumeric: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    hex: '0123456789abcdef'
  };
  
  const chars = charsets[charset] || charset;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
