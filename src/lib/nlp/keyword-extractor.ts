// ============================================================================
// Advanced Keyword and Keyphrase Extraction Engine
// ============================================================================

import { Token, KeyPhrase, TopicCluster } from '@/types';
import { tokenizer } from './tokenizer';
import { sentenceSplitter } from './sentence-splitter';

// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------

interface KeywordConfig {
  maxKeywords: number;
  maxKeyphrases: number;
  minWordLength: number;
  minPhraseLength: number;
  maxPhraseLength: number;
  includeNGrams: boolean;
  useTFIDF: boolean;
  useTextRank: boolean;
  useRake: boolean;
}

const DEFAULT_CONFIG: KeywordConfig = {
  maxKeywords: 30,
  maxKeyphrases: 20,
  minWordLength: 3,
  minPhraseLength: 2,
  maxPhraseLength: 5,
  includeNGrams: true,
  useTFIDF: true,
  useTextRank: true,
  useRake: true,
};

// ----------------------------------------------------------------------------
// Stop Words and Phrase Delimiters
// ----------------------------------------------------------------------------

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', "can't", 'cannot', 'could', "couldn't",
  'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't",
  'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here',
  "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i',
  "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's",
  'its', 'itself', "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she',
  "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than',
  'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what',
  "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who',
  "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you',
  "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves',
  'also', 'just', 'like', 'will', 'can', 'may', 'might', 'shall', 'get', 'got',
  'getting', 'go', 'going', 'went', 'gone', 'come', 'came', 'coming', 'make',
  'made', 'making', 'take', 'took', 'taken', 'taking', 'see', 'saw', 'seen',
  'seeing', 'know', 'knew', 'known', 'knowing', 'think', 'thought', 'thinking',
  'want', 'wanted', 'wanting', 'use', 'used', 'using', 'find', 'found', 'finding',
  'give', 'gave', 'given', 'giving', 'tell', 'told', 'telling', 'ask', 'asked',
  'asking', 'work', 'worked', 'working', 'seem', 'seemed', 'seeming', 'feel',
  'felt', 'feeling', 'try', 'tried', 'trying', 'leave', 'left', 'leaving', 'call',
  'called', 'calling', 'keep', 'kept', 'keeping', 'let', 'letting', 'begin',
  'began', 'begun', 'beginning', 'show', 'showed', 'shown', 'showing', 'hear',
  'heard', 'hearing', 'play', 'played', 'playing', 'run', 'ran', 'running',
  'move', 'moved', 'moving', 'live', 'lived', 'living', 'believe', 'believed',
  'believing', 'hold', 'held', 'holding', 'bring', 'brought', 'bringing', 'happen',
  'happened', 'happening', 'write', 'wrote', 'written', 'writing', 'provide',
  'provided', 'providing', 'sit', 'sat', 'sitting', 'stand', 'stood', 'standing',
  'lose', 'lost', 'losing', 'pay', 'paid', 'paying', 'meet', 'met', 'meeting',
  'include', 'included', 'including', 'continue', 'continued', 'continuing',
  'set', 'setting', 'learn', 'learned', 'learning', 'change', 'changed', 'changing',
  'lead', 'led', 'leading', 'understand', 'understood', 'understanding', 'watch',
  'watched', 'watching', 'follow', 'followed', 'following', 'stop', 'stopped',
  'stopping', 'create', 'created', 'creating', 'speak', 'spoke', 'spoken', 'speaking',
  'read', 'reading', 'allow', 'allowed', 'allowing', 'add', 'added', 'adding',
  'spend', 'spent', 'spending', 'grow', 'grew', 'grown', 'growing', 'open',
  'opened', 'opening', 'walk', 'walked', 'walking', 'win', 'won', 'winning',
  'offer', 'offered', 'offering', 'remember', 'remembered', 'remembering',
  'love', 'loved', 'loving', 'consider', 'considered', 'considering', 'appear',
  'appeared', 'appearing', 'buy', 'bought', 'buying', 'wait', 'waited', 'waiting',
  'serve', 'served', 'serving', 'die', 'died', 'dying', 'send', 'sent', 'sending',
  'expect', 'expected', 'expecting', 'build', 'built', 'building', 'stay',
  'stayed', 'staying', 'fall', 'fell', 'fallen', 'falling', 'cut', 'cutting',
  'reach', 'reached', 'reaching', 'kill', 'killed', 'killing', 'remain',
  'remained', 'remaining', 'suggest', 'suggested', 'suggesting', 'raise',
  'raised', 'raising', 'pass', 'passed', 'passing', 'sell', 'sold', 'selling',
  'require', 'required', 'requiring', 'report', 'reported', 'reporting',
  'decide', 'decided', 'deciding', 'pull', 'pulled', 'pulling',
]);

const PHRASE_DELIMITERS = new Set([
  '.', ',', '!', '?', ';', ':', '(', ')', '[', ']', '{', '}', '"', "'",
  '/', '\\', '|', '<', '>', '@', '#', '$', '%', '^', '&', '*', '+', '=',
  '~', '`', '\n', '\r', '\t',
]);

// ----------------------------------------------------------------------------
// TextRank Algorithm Implementation
// ----------------------------------------------------------------------------

interface GraphNode {
  word: string;
  score: number;
  edges: Map<string, number>;
}

class TextRankGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private dampingFactor = 0.85;
  private convergenceThreshold = 0.0001;
  private maxIterations = 100;

  addEdge(word1: string, word2: string, weight: number = 1): void {
    if (word1 === word2) return;

    // Add or get node1
    if (!this.nodes.has(word1)) {
      this.nodes.set(word1, { word: word1, score: 1, edges: new Map() });
    }
    // Add or get node2
    if (!this.nodes.has(word2)) {
      this.nodes.set(word2, { word: word2, score: 1, edges: new Map() });
    }

    // Add bidirectional edges
    const node1 = this.nodes.get(word1)!;
    const node2 = this.nodes.get(word2)!;

    node1.edges.set(word2, (node1.edges.get(word2) || 0) + weight);
    node2.edges.set(word1, (node2.edges.get(word1) || 0) + weight);
  }

  calculate(): Map<string, number> {
    const scores = new Map<string, number>();

    // Initialize scores
    for (const [word] of this.nodes) {
      scores.set(word, 1);
    }

    // Iterate until convergence
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      let maxDiff = 0;

      for (const [word, node] of this.nodes) {
        let newScore = 1 - this.dampingFactor;

        // Sum contributions from neighbors
        for (const [neighbor, weight] of node.edges) {
          const neighborNode = this.nodes.get(neighbor);
          if (neighborNode) {
            const totalNeighborWeight = Array.from(neighborNode.edges.values())
              .reduce((a, b) => a + b, 0);
            if (totalNeighborWeight > 0) {
              newScore += this.dampingFactor * (weight / totalNeighborWeight) * (scores.get(neighbor) || 1);
            }
          }
        }

        const oldScore = scores.get(word) || 1;
        scores.set(word, newScore);
        maxDiff = Math.max(maxDiff, Math.abs(newScore - oldScore));
      }

      // Check convergence
      if (maxDiff < this.convergenceThreshold) {
        break;
      }
    }

    return scores;
  }

  clear(): void {
    this.nodes.clear();
  }
}

// ----------------------------------------------------------------------------
// RAKE (Rapid Automatic Keyword Extraction) Implementation
// ----------------------------------------------------------------------------

interface RakeCandidate {
  phrase: string;
  words: string[];
  wordScores: Map<string, number>;
  score: number;
}

class RakeExtractor {
  private wordFreq: Map<string, number> = new Map();
  private wordDegree: Map<string, number> = new Map();
  private wordScore: Map<string, number> = new Map();

  extract(text: string, maxPhrases: number = 20): RakeCandidate[] {
    // Reset state
    this.wordFreq.clear();
    this.wordDegree.clear();
    this.wordScore.clear();

    // Extract candidate phrases
    const candidates = this.extractCandidates(text);

    // Calculate word scores
    this.calculateWordScores(candidates);

    // Score phrases
    const scoredCandidates = candidates.map(candidate => ({
      ...candidate,
      score: this.scorePhrases(candidate.words),
    }));

    // Sort by score and return top phrases
    return scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPhrases);
  }

  private extractCandidates(text: string): RakeCandidate[] {
    const candidates: RakeCandidate[] = [];
    const sentences = text.split(/[.!?]+/);

    for (const sentence of sentences) {
      // Split on stop words and delimiters
      const phrases = this.splitOnStopWords(sentence);

      for (const phrase of phrases) {
        const words = phrase.split(/\s+/)
          .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
          .filter(w => w.length >= 2);

        if (words.length > 0 && words.length <= 5) {
          candidates.push({
            phrase: words.join(' '),
            words,
            wordScores: new Map(),
            score: 0,
          });
        }
      }
    }

    return candidates;
  }

  private splitOnStopWords(text: string): string[] {
    const result: string[] = [];
    let currentPhrase = '';

    const words = text.split(/\s+/);

    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (STOP_WORDS.has(cleanWord) || PHRASE_DELIMITERS.has(word)) {
        if (currentPhrase.trim()) {
          result.push(currentPhrase.trim());
        }
        currentPhrase = '';
      } else {
        currentPhrase += (currentPhrase ? ' ' : '') + word;
      }
    }

    if (currentPhrase.trim()) {
      result.push(currentPhrase.trim());
    }

    return result;
  }

  private calculateWordScores(candidates: RakeCandidate[]): void {
    // Calculate frequency and degree for each word
    for (const candidate of candidates) {
      for (const word of candidate.words) {
        this.wordFreq.set(word, (this.wordFreq.get(word) || 0) + 1);
        this.wordDegree.set(word, (this.wordDegree.get(word) || 0) + candidate.words.length);
      }
    }

    // Calculate word score = degree / frequency
    for (const [word, freq] of this.wordFreq) {
      const degree = this.wordDegree.get(word) || 0;
      this.wordScore.set(word, degree / freq);
    }
  }

  private scorePhrases(words: string[]): number {
    return words.reduce((sum, word) => sum + (this.wordScore.get(word) || 0), 0);
  }
}

// ----------------------------------------------------------------------------
// TF-IDF Implementation
// ----------------------------------------------------------------------------

interface TFIDFResult {
  term: string;
  tf: number;
  idf: number;
  tfidf: number;
}

class TFIDFCalculator {
  private documentFrequency: Map<string, number> = new Map();
  private totalDocuments = 0;

  /**
   * Calculate TF-IDF for a single document
   */
  calculateForDocument(text: string, corpus?: string[]): TFIDFResult[] {
    const tokens = tokenizer.tokenize(text);
    const words = tokens
      .filter(t => t.isAlpha && !t.isStopWord && t.text.length >= 3)
      .map(t => t.lemma.toLowerCase());

    // Calculate term frequency
    const tf = new Map<string, number>();
    for (const word of words) {
      tf.set(word, (tf.get(word) || 0) + 1);
    }

    // Normalize TF by document length
    const maxTF = Math.max(...Array.from(tf.values()), 1);
    for (const [word, freq] of tf) {
      tf.set(word, freq / maxTF);
    }

    // Calculate IDF if corpus provided, otherwise use document frequency
    let idf: Map<string, number>;
    if (corpus && corpus.length > 0) {
      idf = this.calculateIDFFromCorpus(corpus, Array.from(tf.keys()));
    } else {
      // Use pseudo-IDF based on position and frequency in document
      idf = this.calculatePseudoIDF(tokens, Array.from(tf.keys()));
    }

    // Calculate TF-IDF scores
    const results: TFIDFResult[] = [];
    for (const [term, tfScore] of tf) {
      const idfScore = idf.get(term) || 1;
      results.push({
        term,
        tf: tfScore,
        idf: idfScore,
        tfidf: tfScore * idfScore,
      });
    }

    return results.sort((a, b) => b.tfidf - a.tfidf);
  }

  private calculateIDFFromCorpus(corpus: string[], terms: string[]): Map<string, number> {
    const df = new Map<string, number>();

    // Count document frequency for each term
    for (const doc of corpus) {
      const docTokens = new Set(
        tokenizer.tokenize(doc)
          .filter(t => t.isAlpha)
          .map(t => t.lemma.toLowerCase())
      );

      for (const term of terms) {
        if (docTokens.has(term)) {
          df.set(term, (df.get(term) || 0) + 1);
        }
      }
    }

    // Calculate IDF
    const idf = new Map<string, number>();
    const N = corpus.length;

    for (const term of terms) {
      const docFreq = df.get(term) || 0;
      // IDF with smoothing: log((N + 1) / (df + 1)) + 1
      idf.set(term, Math.log((N + 1) / (docFreq + 1)) + 1);
    }

    return idf;
  }

  private calculatePseudoIDF(tokens: Token[], terms: string[]): Map<string, number> {
    const idf = new Map<string, number>();

    // Use position-based weighting as pseudo-IDF
    const termPositions = new Map<string, number[]>();

    tokens.forEach((token, index) => {
      const term = token.lemma.toLowerCase();
      if (terms.includes(term)) {
        if (!termPositions.has(term)) {
          termPositions.set(term, []);
        }
        termPositions.get(term)!.push(index);
      }
    });

    for (const term of terms) {
      const positions = termPositions.get(term) || [];

      // Earlier positions are weighted higher
      let positionScore = 0;
      for (const pos of positions) {
        positionScore += 1 / (Math.log(pos + 2));
      }

      // Inverse frequency effect (rare terms get higher scores)
      const frequencyPenalty = 1 / Math.log(positions.length + 2);

      idf.set(term, positionScore * frequencyPenalty + 1);
    }

    return idf;
  }
}

// ----------------------------------------------------------------------------
// Topic Clustering
// ----------------------------------------------------------------------------

interface WordVector {
  word: string;
  vector: number[];
}

class TopicClusterer {
  private wordCooccurrence: Map<string, Map<string, number>> = new Map();
  private windowSize = 5;

  /**
   * Cluster keywords into topics
   */
  cluster(keywords: string[], text: string, numClusters: number = 5): TopicCluster[] {
    // Build co-occurrence matrix
    this.buildCooccurrenceMatrix(text, keywords);

    // Create word vectors from co-occurrence
    const wordVectors = this.createWordVectors(keywords);

    // K-means clustering
    const clusters = this.kMeansClustering(wordVectors, numClusters);

    // Convert to TopicCluster format
    return this.formatClusters(clusters, text);
  }

  private buildCooccurrenceMatrix(text: string, keywords: string[]): void {
    this.wordCooccurrence.clear();

    const tokens = tokenizer.tokenize(text);
    const keywordSet = new Set(keywords.map(k => k.toLowerCase()));

    for (let i = 0; i < tokens.length; i++) {
      const word1 = tokens[i].lemma.toLowerCase();
      if (!keywordSet.has(word1)) continue;

      // Look at words within window
      for (let j = Math.max(0, i - this.windowSize); j < Math.min(tokens.length, i + this.windowSize + 1); j++) {
        if (i === j) continue;

        const word2 = tokens[j].lemma.toLowerCase();
        if (!keywordSet.has(word2)) continue;

        // Update co-occurrence
        if (!this.wordCooccurrence.has(word1)) {
          this.wordCooccurrence.set(word1, new Map());
        }
        const current = this.wordCooccurrence.get(word1)!.get(word2) || 0;
        this.wordCooccurrence.get(word1)!.set(word2, current + 1);
      }
    }
  }

  private createWordVectors(keywords: string[]): WordVector[] {
    const vectors: WordVector[] = [];
    const keywordList = keywords.map(k => k.toLowerCase());

    for (const word of keywordList) {
      const cooccur = this.wordCooccurrence.get(word) || new Map();
      const vector = keywordList.map(kw => cooccur.get(kw) || 0);
      vectors.push({ word, vector });
    }

    return vectors;
  }

  private kMeansClustering(
    vectors: WordVector[],
    k: number
  ): Map<number, WordVector[]> {
    if (vectors.length === 0) return new Map();

    // Limit k to number of vectors
    k = Math.min(k, vectors.length);

    const vectorDim = vectors[0]?.vector.length || 0;

    // Initialize centroids randomly
    const centroids: number[][] = [];
    const usedIndices = new Set<number>();

    while (centroids.length < k) {
      const idx = Math.floor(Math.random() * vectors.length);
      if (!usedIndices.has(idx)) {
        centroids.push([...vectors[idx].vector]);
        usedIndices.add(idx);
      }
    }

    // Iterate
    const maxIterations = 50;
    let assignments = new Map<number, WordVector[]>();

    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign vectors to nearest centroid
      const newAssignments = new Map<number, WordVector[]>();

      for (const vector of vectors) {
        let minDist = Infinity;
        let nearest = 0;

        for (let c = 0; c < centroids.length; c++) {
          const dist = this.euclideanDistance(vector.vector, centroids[c]);
          if (dist < minDist) {
            minDist = dist;
            nearest = c;
          }
        }

        if (!newAssignments.has(nearest)) {
          newAssignments.set(nearest, []);
        }
        newAssignments.get(nearest)!.push(vector);
      }

      // Update centroids
      let converged = true;
      for (let c = 0; c < centroids.length; c++) {
        const clusterVectors = newAssignments.get(c) || [];
        if (clusterVectors.length === 0) continue;

        const newCentroid = new Array(vectorDim).fill(0);
        for (const v of clusterVectors) {
          for (let d = 0; d < vectorDim; d++) {
            newCentroid[d] += v.vector[d];
          }
        }

        for (let d = 0; d < vectorDim; d++) {
          newCentroid[d] /= clusterVectors.length;
          if (Math.abs(newCentroid[d] - centroids[c][d]) > 0.001) {
            converged = false;
          }
          centroids[c][d] = newCentroid[d];
        }
      }

      assignments = newAssignments;

      if (converged) break;
    }

    return assignments;
  }

  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  private formatClusters(
    clusters: Map<number, WordVector[]>,
    text: string
  ): TopicCluster[] {
    const result: TopicCluster[] = [];
    const tokens = tokenizer.tokenize(text);

    let clusterIdx = 0;
    for (const [, words] of clusters) {
      if (words.length === 0) continue;

      // Get keywords
      const keywords = words.map(w => w.word);

      // Generate topic name from most central word
      const topicName = this.generateTopicName(keywords);

      // Calculate relevance based on frequency in text
      const relevance = this.calculateTopicRelevance(keywords, tokens);

      result.push({
        id: `cluster_${clusterIdx}`,
        name: topicName,
        keywords,
        relevance,
        documentCount: 1,
      });

      clusterIdx++;
    }

    return result.sort((a, b) => b.relevance - a.relevance);
  }

  private generateTopicName(keywords: string[]): string {
    // Use the most common/central keyword as topic name
    if (keywords.length === 0) return 'Unknown';
    if (keywords.length === 1) return this.capitalize(keywords[0]);

    // Use first two keywords
    return keywords.slice(0, 2).map(k => this.capitalize(k)).join(' & ');
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private calculateTopicRelevance(keywords: string[], tokens: Token[]): number {
    const keywordSet = new Set(keywords);
    let count = 0;

    for (const token of tokens) {
      if (keywordSet.has(token.lemma.toLowerCase())) {
        count++;
      }
    }

    return Math.min(count / Math.max(tokens.length, 1), 1);
  }
}

// ----------------------------------------------------------------------------
// Main Keyword Extractor Class
// ----------------------------------------------------------------------------

export class KeywordExtractor {
  private config: KeywordConfig;
  private textRankGraph: TextRankGraph;
  private rakeExtractor: RakeExtractor;
  private tfidfCalculator: TFIDFCalculator;
  private topicClusterer: TopicClusterer;
  private cache: Map<string, ExtractedKeywords> = new Map();
  private maxCacheSize = 200;

  constructor(config: Partial<KeywordConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.textRankGraph = new TextRankGraph();
    this.rakeExtractor = new RakeExtractor();
    this.tfidfCalculator = new TFIDFCalculator();
    this.topicClusterer = new TopicClusterer();
  }

  /**
   * Extract keywords and keyphrases from text
   */
  extract(text: string, corpus?: string[]): ExtractedKeywords {
    // Check cache
    const cacheKey = text.substring(0, 100);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const tokens = tokenizer.tokenize(text);
    const sentences = sentenceSplitter.split(text);

    // Get keywords from multiple methods
    const textRankKeywords = this.config.useTextRank
      ? this.extractTextRank(tokens)
      : [];

    const rakeKeywords = this.config.useRake
      ? this.extractRake(text)
      : [];

    const tfidfKeywords = this.config.useTFIDF
      ? this.extractTFIDF(text, corpus)
      : [];

    const ngramKeywords = this.config.includeNGrams
      ? this.extractNGrams(tokens)
      : [];

    // Combine and deduplicate
    const combinedKeywords = this.combineKeywords([
      textRankKeywords,
      tfidfKeywords,
      ngramKeywords,
    ]);

    // Extract keyphrases
    const keyphrases = this.extractKeyphrases(text, rakeKeywords, combinedKeywords);

    // Cluster into topics
    const topics = this.topicClusterer.cluster(
      combinedKeywords.slice(0, 30).map(k => k.keyword),
      text,
      5
    );

    const result: ExtractedKeywords = {
      keywords: combinedKeywords.slice(0, this.config.maxKeywords),
      keyphrases: keyphrases.slice(0, this.config.maxKeyphrases),
      topics,
      statistics: this.calculateStatistics(tokens, sentences, combinedKeywords),
    };

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Extract keywords using TextRank
   */
  private extractTextRank(tokens: Token[]): ScoredKeyword[] {
    this.textRankGraph.clear();

    // Filter to content words
    const contentTokens = tokens.filter(t =>
      t.isAlpha &&
      !t.isStopWord &&
      t.text.length >= this.config.minWordLength
    );

    // Build co-occurrence graph (window size 2)
    for (let i = 0; i < contentTokens.length; i++) {
      const word1 = contentTokens[i].lemma.toLowerCase();

      for (let j = i + 1; j < Math.min(i + 3, contentTokens.length); j++) {
        const word2 = contentTokens[j].lemma.toLowerCase();
        this.textRankGraph.addEdge(word1, word2);
      }
    }

    // Calculate TextRank scores
    const scores = this.textRankGraph.calculate();

    // Convert to scored keywords
    const results: ScoredKeyword[] = [];
    for (const [word, score] of scores) {
      results.push({
        keyword: word,
        score,
        frequency: contentTokens.filter(t => t.lemma.toLowerCase() === word).length,
        method: 'textrank',
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Extract keywords using RAKE
   */
  private extractRake(text: string): ScoredKeyword[] {
    const candidates = this.rakeExtractor.extract(text, this.config.maxKeyphrases * 2);

    return candidates.map(c => ({
      keyword: c.phrase,
      score: c.score,
      frequency: 1,
      method: 'rake' as const,
    }));
  }

  /**
   * Extract keywords using TF-IDF
   */
  private extractTFIDF(text: string, corpus?: string[]): ScoredKeyword[] {
    const results = this.tfidfCalculator.calculateForDocument(text, corpus);

    return results.map(r => ({
      keyword: r.term,
      score: r.tfidf,
      frequency: Math.round(r.tf * 10), // Approximate frequency
      method: 'tfidf' as const,
    }));
  }

  /**
   * Extract n-gram keywords
   */
  private extractNGrams(tokens: Token[]): ScoredKeyword[] {
    const results: ScoredKeyword[] = [];
    const ngramCounts = new Map<string, number>();

    // Filter to content tokens
    const contentTokens = tokens.filter(t =>
      t.isAlpha &&
      t.text.length >= 2
    );

    // Extract 2-grams and 3-grams
    for (let n = 2; n <= 3; n++) {
      for (let i = 0; i <= contentTokens.length - n; i++) {
        const ngram = contentTokens.slice(i, i + n);

        // Skip if contains too many stop words
        const stopWordCount = ngram.filter(t => t.isStopWord).length;
        if (stopWordCount > 1) continue;

        // Skip if starts or ends with stop word
        if (ngram[0].isStopWord || ngram[ngram.length - 1].isStopWord) continue;

        const ngramText = ngram.map(t => t.lemma.toLowerCase()).join(' ');
        ngramCounts.set(ngramText, (ngramCounts.get(ngramText) || 0) + 1);
      }
    }

    // Convert to scored keywords (filter by minimum frequency)
    for (const [ngram, count] of ngramCounts) {
      if (count >= 2) {
        results.push({
          keyword: ngram,
          score: count * ngram.split(' ').length, // Weight by length
          frequency: count,
          method: 'ngram',
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Combine keywords from multiple methods
   */
  private combineKeywords(keywordSets: ScoredKeyword[][]): ScoredKeyword[] {
    const combinedScores = new Map<string, { score: number; frequency: number; methods: string[] }>();

    for (const keywords of keywordSets) {
      // Normalize scores within each set
      const maxScore = Math.max(...keywords.map(k => k.score), 0.001);

      for (const keyword of keywords) {
        const normalized = keyword.score / maxScore;
        const existing = combinedScores.get(keyword.keyword);

        if (existing) {
          existing.score += normalized;
          existing.frequency = Math.max(existing.frequency, keyword.frequency);
          if (!existing.methods.includes(keyword.method)) {
            existing.methods.push(keyword.method);
          }
        } else {
          combinedScores.set(keyword.keyword, {
            score: normalized,
            frequency: keyword.frequency,
            methods: [keyword.method],
          });
        }
      }
    }

    // Convert to array and sort
    const results: ScoredKeyword[] = [];
    for (const [keyword, data] of combinedScores) {
      // Boost score for keywords found by multiple methods
      const methodBoost = 1 + (data.methods.length - 1) * 0.3;

      results.push({
        keyword,
        score: data.score * methodBoost,
        frequency: data.frequency,
        method: data.methods.join('+'),
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Extract keyphrases
   */
  private extractKeyphrases(
    text: string,
    rakeKeywords: ScoredKeyword[],
    combinedKeywords: ScoredKeyword[]
  ): KeyPhrase[] {
    const keyphrases: KeyPhrase[] = [];
    const seen = new Set<string>();

    // Add RAKE phrases (already multi-word)
    for (const kw of rakeKeywords) {
      if (kw.keyword.includes(' ') && !seen.has(kw.keyword)) {
        keyphrases.push({
          phrase: kw.keyword,
          score: kw.score,
          frequency: this.countOccurrences(text, kw.keyword),
          words: kw.keyword.split(' '),
        });
        seen.add(kw.keyword);
      }
    }

    // Add combined n-grams
    for (const kw of combinedKeywords) {
      if (kw.keyword.includes(' ') && !seen.has(kw.keyword)) {
        keyphrases.push({
          phrase: kw.keyword,
          score: kw.score,
          frequency: this.countOccurrences(text, kw.keyword),
          words: kw.keyword.split(' '),
        });
        seen.add(kw.keyword);
      }
    }

    return keyphrases.sort((a, b) => b.score - a.score);
  }

  /**
   * Count occurrences of phrase in text (case-insensitive)
   */
  private countOccurrences(text: string, phrase: string): number {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (text.match(regex) || []).length;
  }

  /**
   * Calculate extraction statistics
   */
  private calculateStatistics(
    tokens: Token[],
    sentences: ReturnType<typeof sentenceSplitter.split>,
    keywords: ScoredKeyword[]
  ): KeywordStatistics {
    const totalWords = tokens.filter(t => t.isAlpha).length;
    const uniqueWords = new Set(tokens.filter(t => t.isAlpha).map(t => t.lemma.toLowerCase())).size;
    const keywordDensity = keywords.length / Math.max(totalWords, 1);

    // Calculate keyword coverage (% of text covered by keywords)
    const keywordSet = new Set(keywords.slice(0, 20).map(k => k.keyword));
    let coveredTokens = 0;
    for (const token of tokens) {
      if (keywordSet.has(token.lemma.toLowerCase())) {
        coveredTokens++;
      }
    }
    const coverage = coveredTokens / Math.max(totalWords, 1);

    return {
      totalWords,
      uniqueWords,
      vocabularyRichness: uniqueWords / Math.max(totalWords, 1),
      keywordDensity,
      keywordCoverage: coverage,
      sentenceCount: sentences.length,
      avgWordsPerSentence: totalWords / Math.max(sentences.length, 1),
      topKeywordScore: keywords[0]?.score || 0,
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

export interface ScoredKeyword {
  keyword: string;
  score: number;
  frequency: number;
  method: string;
}

export interface ExtractedKeywords {
  keywords: ScoredKeyword[];
  keyphrases: KeyPhrase[];
  topics: TopicCluster[];
  statistics: KeywordStatistics;
}

export interface KeywordStatistics {
  totalWords: number;
  uniqueWords: number;
  vocabularyRichness: number;
  keywordDensity: number;
  keywordCoverage: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  topKeywordScore: number;
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const keywordExtractor = new KeywordExtractor();

export function extractKeywords(text: string, corpus?: string[]): ExtractedKeywords {
  return keywordExtractor.extract(text, corpus);
}

export function getTopKeywords(text: string, count: number = 10): string[] {
  const result = keywordExtractor.extract(text);
  return result.keywords.slice(0, count).map(k => k.keyword);
}

export function getTopKeyphrases(text: string, count: number = 5): string[] {
  const result = keywordExtractor.extract(text);
  return result.keyphrases.slice(0, count).map(k => k.phrase);
}

export function getTopics(text: string, count: number = 5): TopicCluster[] {
  const result = keywordExtractor.extract(text);
  return result.topics.slice(0, count);
}

export { TextRankGraph, RakeExtractor, TFIDFCalculator, TopicClusterer };
