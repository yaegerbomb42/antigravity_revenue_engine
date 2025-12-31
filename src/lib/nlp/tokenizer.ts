// ============================================================================
// Advanced NLP Tokenizer with Linguistic Analysis
// ============================================================================

import { Token, PartOfSpeech } from '@/types';

// ----------------------------------------------------------------------------
// Stop Words Database
// ----------------------------------------------------------------------------

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'i', 'me',
  'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they',
  'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who',
  'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do',
  'does', 'did', 'doing', 'would', 'could', 'ought', 'as', 'until',
  'while', 'if', 'because', 'against', 'both', 'any', 'over'
]);

// ----------------------------------------------------------------------------
// Lemmatization Rules
// ----------------------------------------------------------------------------

interface LemmaRule {
  suffix: string;
  replacement: string;
  minLength: number;
  pos?: PartOfSpeech[];
}

const LEMMA_RULES: LemmaRule[] = [
  // Verb conjugations
  { suffix: 'ing', replacement: '', minLength: 5, pos: ['VERB'] },
  { suffix: 'ying', replacement: 'y', minLength: 5, pos: ['VERB'] },
  { suffix: 'ied', replacement: 'y', minLength: 4, pos: ['VERB'] },
  { suffix: 'ies', replacement: 'y', minLength: 4, pos: ['VERB'] },
  { suffix: 'ed', replacement: '', minLength: 4, pos: ['VERB'] },
  { suffix: 'es', replacement: '', minLength: 4, pos: ['VERB'] },
  { suffix: 's', replacement: '', minLength: 4, pos: ['VERB', 'NOUN'] },
  
  // Noun plurals
  { suffix: 'ies', replacement: 'y', minLength: 4, pos: ['NOUN'] },
  { suffix: 'ves', replacement: 'f', minLength: 4, pos: ['NOUN'] },
  { suffix: 'xes', replacement: 'x', minLength: 4, pos: ['NOUN'] },
  { suffix: 'zes', replacement: 'z', minLength: 4, pos: ['NOUN'] },
  { suffix: 'ches', replacement: 'ch', minLength: 5, pos: ['NOUN'] },
  { suffix: 'shes', replacement: 'sh', minLength: 5, pos: ['NOUN'] },
  { suffix: 'ses', replacement: 's', minLength: 4, pos: ['NOUN'] },
  { suffix: 'men', replacement: 'man', minLength: 4, pos: ['NOUN'] },
  
  // Adjective/Adverb forms
  { suffix: 'er', replacement: '', minLength: 4, pos: ['ADJ'] },
  { suffix: 'est', replacement: '', minLength: 5, pos: ['ADJ'] },
  { suffix: 'ier', replacement: 'y', minLength: 4, pos: ['ADJ'] },
  { suffix: 'iest', replacement: 'y', minLength: 5, pos: ['ADJ'] },
  { suffix: 'ly', replacement: '', minLength: 4, pos: ['ADV'] },
  
  // Derivational suffixes
  { suffix: 'ness', replacement: '', minLength: 6, pos: ['NOUN'] },
  { suffix: 'ment', replacement: '', minLength: 6, pos: ['NOUN'] },
  { suffix: 'tion', replacement: 'te', minLength: 6, pos: ['NOUN'] },
  { suffix: 'ation', replacement: '', minLength: 7, pos: ['NOUN'] },
  { suffix: 'ity', replacement: '', minLength: 5, pos: ['NOUN'] },
  { suffix: 'able', replacement: '', minLength: 6, pos: ['ADJ'] },
  { suffix: 'ible', replacement: '', minLength: 6, pos: ['ADJ'] },
  { suffix: 'ful', replacement: '', minLength: 5, pos: ['ADJ'] },
  { suffix: 'less', replacement: '', minLength: 6, pos: ['ADJ'] },
  { suffix: 'ous', replacement: '', minLength: 5, pos: ['ADJ'] },
  { suffix: 'ive', replacement: '', minLength: 5, pos: ['ADJ'] },
];

// Irregular verb forms
const IRREGULAR_VERBS: Record<string, string> = {
  'was': 'be', 'were': 'be', 'been': 'be', 'being': 'be', 'am': 'be', 'is': 'be', 'are': 'be',
  'had': 'have', 'has': 'have', 'having': 'have',
  'did': 'do', 'does': 'do', 'doing': 'do', 'done': 'do',
  'went': 'go', 'goes': 'go', 'going': 'go', 'gone': 'go',
  'said': 'say', 'says': 'say', 'saying': 'say',
  'made': 'make', 'makes': 'make', 'making': 'make',
  'knew': 'know', 'knows': 'know', 'knowing': 'know', 'known': 'know',
  'thought': 'think', 'thinks': 'think', 'thinking': 'think',
  'took': 'take', 'takes': 'take', 'taking': 'take', 'taken': 'take',
  'came': 'come', 'comes': 'come', 'coming': 'come',
  'saw': 'see', 'sees': 'see', 'seeing': 'see', 'seen': 'see',
  'got': 'get', 'gets': 'get', 'getting': 'get', 'gotten': 'get',
  'gave': 'give', 'gives': 'give', 'giving': 'give', 'given': 'give',
  'found': 'find', 'finds': 'find', 'finding': 'find',
  'told': 'tell', 'tells': 'tell', 'telling': 'tell',
  'felt': 'feel', 'feels': 'feel', 'feeling': 'feel',
  'left': 'leave', 'leaves': 'leave', 'leaving': 'leave',
  'brought': 'bring', 'brings': 'bring', 'bringing': 'bring',
  'began': 'begin', 'begins': 'begin', 'beginning': 'begin', 'begun': 'begin',
  'kept': 'keep', 'keeps': 'keep', 'keeping': 'keep',
  'held': 'hold', 'holds': 'hold', 'holding': 'hold',
  'wrote': 'write', 'writes': 'write', 'writing': 'write', 'written': 'write',
  'stood': 'stand', 'stands': 'stand', 'standing': 'stand',
  'heard': 'hear', 'hears': 'hear', 'hearing': 'hear',
  'let': 'let', 'lets': 'let', 'letting': 'let',
  'meant': 'mean', 'means': 'mean', 'meaning': 'mean',
  'set': 'set', 'sets': 'set', 'setting': 'set',
  'met': 'meet', 'meets': 'meet', 'meeting': 'meet',
  'ran': 'run', 'runs': 'run', 'running': 'run',
  'paid': 'pay', 'pays': 'pay', 'paying': 'pay',
  'sat': 'sit', 'sits': 'sit', 'sitting': 'sit',
  'spoke': 'speak', 'speaks': 'speak', 'speaking': 'speak', 'spoken': 'speak',
  'lay': 'lie', 'lies': 'lie', 'lying': 'lie', 'lain': 'lie',
  'led': 'lead', 'leads': 'lead', 'leading': 'lead',
  'read': 'read', 'reads': 'read', 'reading': 'read',
  'grew': 'grow', 'grows': 'grow', 'growing': 'grow', 'grown': 'grow',
  'lost': 'lose', 'loses': 'lose', 'losing': 'lose',
  'fell': 'fall', 'falls': 'fall', 'falling': 'fall', 'fallen': 'fall',
  'sent': 'send', 'sends': 'send', 'sending': 'send',
  'built': 'build', 'builds': 'build', 'building': 'build',
  'spent': 'spend', 'spends': 'spend', 'spending': 'spend',
  'cut': 'cut', 'cuts': 'cut', 'cutting': 'cut',
  'hit': 'hit', 'hits': 'hit', 'hitting': 'hit',
  'put': 'put', 'puts': 'put', 'putting': 'put',
  'shut': 'shut', 'shuts': 'shut', 'shutting': 'shut',
  'hurt': 'hurt', 'hurts': 'hurt', 'hurting': 'hurt',
  'cost': 'cost', 'costs': 'cost', 'costing': 'cost',
  'burst': 'burst', 'bursts': 'burst', 'bursting': 'burst',
  'sold': 'sell', 'sells': 'sell', 'selling': 'sell',
  'bought': 'buy', 'buys': 'buy', 'buying': 'buy',
  'caught': 'catch', 'catches': 'catch', 'catching': 'catch',
  'taught': 'teach', 'teaches': 'teach', 'teaching': 'teach',
  'fought': 'fight', 'fights': 'fight', 'fighting': 'fight',
  'sought': 'seek', 'seeks': 'seek', 'seeking': 'seek',
  'wore': 'wear', 'wears': 'wear', 'wearing': 'wear', 'worn': 'wear',
  'bore': 'bear', 'bears': 'bear', 'bearing': 'bear', 'borne': 'bear', 'born': 'bear',
  'tore': 'tear', 'tears': 'tear', 'tearing': 'tear', 'torn': 'tear',
  'swore': 'swear', 'swears': 'swear', 'swearing': 'swear', 'sworn': 'swear',
  'broke': 'break', 'breaks': 'break', 'breaking': 'break', 'broken': 'break',
  'chose': 'choose', 'chooses': 'choose', 'choosing': 'choose', 'chosen': 'choose',
  'froze': 'freeze', 'freezes': 'freeze', 'freezing': 'freeze', 'frozen': 'freeze',
  'woke': 'wake', 'wakes': 'wake', 'waking': 'wake', 'woken': 'wake',
  'drove': 'drive', 'drives': 'drive', 'driving': 'drive', 'driven': 'drive',
  'rode': 'ride', 'rides': 'ride', 'riding': 'ride', 'ridden': 'ride',
  'rose': 'rise', 'rises': 'rise', 'rising': 'rise', 'risen': 'rise',
  'wrote': 'write', 'writes': 'write', 'writing': 'write', 'written': 'write',
  'hid': 'hide', 'hides': 'hide', 'hiding': 'hide', 'hidden': 'hide',
  'bit': 'bite', 'bites': 'bite', 'biting': 'bite', 'bitten': 'bite',
  'flew': 'fly', 'flies': 'fly', 'flying': 'fly', 'flown': 'fly',
  'drew': 'draw', 'draws': 'draw', 'drawing': 'draw', 'drawn': 'draw',
  'threw': 'throw', 'throws': 'throw', 'throwing': 'throw', 'thrown': 'throw',
  'blew': 'blow', 'blows': 'blow', 'blowing': 'blow', 'blown': 'blow',
  'knew': 'know', 'knows': 'know', 'knowing': 'know', 'known': 'know',
  'slew': 'slay', 'slays': 'slay', 'slaying': 'slay', 'slain': 'slay',
  'swam': 'swim', 'swims': 'swim', 'swimming': 'swim', 'swum': 'swim',
  'sang': 'sing', 'sings': 'sing', 'singing': 'sing', 'sung': 'sing',
  'rang': 'ring', 'rings': 'ring', 'ringing': 'ring', 'rung': 'ring',
  'sank': 'sink', 'sinks': 'sink', 'sinking': 'sink', 'sunk': 'sink',
  'shrank': 'shrink', 'shrinks': 'shrink', 'shrinking': 'shrink', 'shrunk': 'shrink',
  'stank': 'stink', 'stinks': 'stink', 'stinking': 'stink', 'stunk': 'stink',
  'drank': 'drink', 'drinks': 'drink', 'drinking': 'drink', 'drunk': 'drink',
  'sprang': 'spring', 'springs': 'spring', 'springing': 'spring', 'sprung': 'spring',
  "won't": 'will not', "can't": 'can not', "couldn't": 'could not', "shouldn't": 'should not',
  "wouldn't": 'would not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
  "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
  "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
  "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is',
  "what's": 'what is', "who's": 'who is', "where's": 'where is',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
  "i'll": 'i will', "you'll": 'you will', "we'll": 'we will', "they'll": 'they will',
  "he'll": 'he will', "she'll": 'she will', "it'll": 'it will',
  "i'd": 'i would', "you'd": 'you would', "we'd": 'we would', "they'd": 'they would',
  "he'd": 'he would', "she'd": 'she would', "it'd": 'it would',
  "let's": 'let us', "that'd": 'that would', "who'd": 'who would',
};

// Irregular plurals
const IRREGULAR_PLURALS: Record<string, string> = {
  'children': 'child', 'feet': 'foot', 'teeth': 'tooth', 'mice': 'mouse',
  'geese': 'goose', 'men': 'man', 'women': 'woman', 'people': 'person',
  'oxen': 'ox', 'dice': 'die', 'lice': 'louse', 'criteria': 'criterion',
  'phenomena': 'phenomenon', 'data': 'datum', 'bacteria': 'bacterium',
  'cacti': 'cactus', 'fungi': 'fungus', 'nuclei': 'nucleus', 'radii': 'radius',
  'alumni': 'alumnus', 'syllabi': 'syllabus', 'analyses': 'analysis',
  'bases': 'basis', 'crises': 'crisis', 'diagnoses': 'diagnosis',
  'hypotheses': 'hypothesis', 'oases': 'oasis', 'parentheses': 'parenthesis',
  'syntheses': 'synthesis', 'theses': 'thesis', 'appendices': 'appendix',
  'indices': 'index', 'matrices': 'matrix', 'vertices': 'vertex',
};

// ----------------------------------------------------------------------------
// POS Tagging Rules
// ----------------------------------------------------------------------------

interface POSPattern {
  pattern: RegExp;
  pos: PartOfSpeech;
  tag: string;
}

const POS_PATTERNS: POSPattern[] = [
  // Punctuation
  { pattern: /^[.!?;:]$/, pos: 'PUNCT', tag: '.' },
  { pattern: /^[,]$/, pos: 'PUNCT', tag: ',' },
  { pattern: /^[-–—]$/, pos: 'PUNCT', tag: ':' },
  { pattern: /^['"`']$/, pos: 'PUNCT', tag: '\'\'' },
  { pattern: /^[()\[\]{}]$/, pos: 'PUNCT', tag: '-LRB-' },
  
  // Numbers
  { pattern: /^\d+$/, pos: 'NUM', tag: 'CD' },
  { pattern: /^\d+[,.]\d+$/, pos: 'NUM', tag: 'CD' },
  { pattern: /^\d+(st|nd|rd|th)$/i, pos: 'ADJ', tag: 'JJ' },
  { pattern: /^\$\d+/, pos: 'NUM', tag: 'CD' },
  { pattern: /^\d+%$/, pos: 'NUM', tag: 'CD' },
  
  // Determiners
  { pattern: /^(a|an|the)$/i, pos: 'DET', tag: 'DT' },
  { pattern: /^(this|that|these|those)$/i, pos: 'DET', tag: 'DT' },
  { pattern: /^(my|your|his|her|its|our|their)$/i, pos: 'DET', tag: 'PRP$' },
  { pattern: /^(some|any|no|every|each|all|both|few|many|much|more|most|other|another)$/i, pos: 'DET', tag: 'DT' },
  
  // Pronouns
  { pattern: /^(i|me|myself)$/i, pos: 'PRON', tag: 'PRP' },
  { pattern: /^(you|yourself|yourselves)$/i, pos: 'PRON', tag: 'PRP' },
  { pattern: /^(he|him|himself|she|her|herself|it|itself)$/i, pos: 'PRON', tag: 'PRP' },
  { pattern: /^(we|us|ourselves|they|them|themselves)$/i, pos: 'PRON', tag: 'PRP' },
  { pattern: /^(who|whom|whose|which|what|whoever|whatever|whichever)$/i, pos: 'PRON', tag: 'WP' },
  
  // Prepositions
  { pattern: /^(in|on|at|to|for|of|with|by|from|up|about|into|through|during|before|after|above|below|between|under|again|further|then|once)$/i, pos: 'ADP', tag: 'IN' },
  
  // Conjunctions
  { pattern: /^(and|or|but|nor|so|yet|for)$/i, pos: 'CONJ', tag: 'CC' },
  { pattern: /^(if|unless|although|because|since|while|when|where|whereas|whether|as|than|that)$/i, pos: 'CONJ', tag: 'IN' },
  
  // Auxiliaries
  { pattern: /^(is|am|are|was|were|be|been|being)$/i, pos: 'VERB', tag: 'VB' },
  { pattern: /^(have|has|had|having)$/i, pos: 'VERB', tag: 'VB' },
  { pattern: /^(do|does|did|doing)$/i, pos: 'VERB', tag: 'VB' },
  { pattern: /^(will|would|shall|should|can|could|may|might|must)$/i, pos: 'VERB', tag: 'MD' },
  
  // Common verb endings
  { pattern: /ing$/i, pos: 'VERB', tag: 'VBG' },
  { pattern: /ed$/i, pos: 'VERB', tag: 'VBD' },
  { pattern: /s$/i, pos: 'VERB', tag: 'VBZ' },
  
  // Common adjective endings
  { pattern: /(ful|less|able|ible|ous|ive|al|ial|ic|ical|ish|like|ly|y|ary|ory)$/i, pos: 'ADJ', tag: 'JJ' },
  { pattern: /er$/i, pos: 'ADJ', tag: 'JJR' },
  { pattern: /est$/i, pos: 'ADJ', tag: 'JJS' },
  
  // Common adverb endings
  { pattern: /ly$/i, pos: 'ADV', tag: 'RB' },
  
  // Common noun endings
  { pattern: /(tion|sion|ness|ment|ity|ism|ist|er|or|ant|ent|ance|ence|dom|hood|ship|age)$/i, pos: 'NOUN', tag: 'NN' },
  
  // Interjections
  { pattern: /^(oh|ah|wow|ouch|hey|hi|hello|bye|oops|ugh|huh|hmm|um|uh|well|yeah|yes|no|okay|ok)$/i, pos: 'INTJ', tag: 'UH' },
  
  // Particles
  { pattern: /^(not|n't)$/i, pos: 'PART', tag: 'RB' },
  { pattern: /^(to)$/i, pos: 'PART', tag: 'TO' },
  
  // Symbols
  { pattern: /^[@#$%&*+=<>~^|\\]$/, pos: 'SYM', tag: 'SYM' },
];

// Common word -> POS mappings
const WORD_POS_MAP: Record<string, { pos: PartOfSpeech; tag: string }> = {
  // Common verbs
  'be': { pos: 'VERB', tag: 'VB' }, 'have': { pos: 'VERB', tag: 'VB' },
  'do': { pos: 'VERB', tag: 'VB' }, 'say': { pos: 'VERB', tag: 'VB' },
  'get': { pos: 'VERB', tag: 'VB' }, 'make': { pos: 'VERB', tag: 'VB' },
  'go': { pos: 'VERB', tag: 'VB' }, 'know': { pos: 'VERB', tag: 'VB' },
  'take': { pos: 'VERB', tag: 'VB' }, 'see': { pos: 'VERB', tag: 'VB' },
  'come': { pos: 'VERB', tag: 'VB' }, 'think': { pos: 'VERB', tag: 'VB' },
  'look': { pos: 'VERB', tag: 'VB' }, 'want': { pos: 'VERB', tag: 'VB' },
  'give': { pos: 'VERB', tag: 'VB' }, 'use': { pos: 'VERB', tag: 'VB' },
  'find': { pos: 'VERB', tag: 'VB' }, 'tell': { pos: 'VERB', tag: 'VB' },
  'ask': { pos: 'VERB', tag: 'VB' }, 'work': { pos: 'VERB', tag: 'VB' },
  'seem': { pos: 'VERB', tag: 'VB' }, 'feel': { pos: 'VERB', tag: 'VB' },
  'try': { pos: 'VERB', tag: 'VB' }, 'leave': { pos: 'VERB', tag: 'VB' },
  'call': { pos: 'VERB', tag: 'VB' }, 'need': { pos: 'VERB', tag: 'VB' },
  'become': { pos: 'VERB', tag: 'VB' }, 'put': { pos: 'VERB', tag: 'VB' },
  'mean': { pos: 'VERB', tag: 'VB' }, 'keep': { pos: 'VERB', tag: 'VB' },
  'let': { pos: 'VERB', tag: 'VB' }, 'begin': { pos: 'VERB', tag: 'VB' },
  'show': { pos: 'VERB', tag: 'VB' }, 'hear': { pos: 'VERB', tag: 'VB' },
  'play': { pos: 'VERB', tag: 'VB' }, 'run': { pos: 'VERB', tag: 'VB' },
  'move': { pos: 'VERB', tag: 'VB' }, 'live': { pos: 'VERB', tag: 'VB' },
  'believe': { pos: 'VERB', tag: 'VB' }, 'hold': { pos: 'VERB', tag: 'VB' },
  'bring': { pos: 'VERB', tag: 'VB' }, 'happen': { pos: 'VERB', tag: 'VB' },
  'write': { pos: 'VERB', tag: 'VB' }, 'provide': { pos: 'VERB', tag: 'VB' },
  'sit': { pos: 'VERB', tag: 'VB' }, 'stand': { pos: 'VERB', tag: 'VB' },
  'lose': { pos: 'VERB', tag: 'VB' }, 'pay': { pos: 'VERB', tag: 'VB' },
  'meet': { pos: 'VERB', tag: 'VB' }, 'include': { pos: 'VERB', tag: 'VB' },
  'continue': { pos: 'VERB', tag: 'VB' }, 'set': { pos: 'VERB', tag: 'VB' },
  'learn': { pos: 'VERB', tag: 'VB' }, 'change': { pos: 'VERB', tag: 'VB' },
  'lead': { pos: 'VERB', tag: 'VB' }, 'understand': { pos: 'VERB', tag: 'VB' },
  'watch': { pos: 'VERB', tag: 'VB' }, 'follow': { pos: 'VERB', tag: 'VB' },
  'stop': { pos: 'VERB', tag: 'VB' }, 'create': { pos: 'VERB', tag: 'VB' },
  'speak': { pos: 'VERB', tag: 'VB' }, 'read': { pos: 'VERB', tag: 'VB' },
  'allow': { pos: 'VERB', tag: 'VB' }, 'add': { pos: 'VERB', tag: 'VB' },
  'spend': { pos: 'VERB', tag: 'VB' }, 'grow': { pos: 'VERB', tag: 'VB' },
  'open': { pos: 'VERB', tag: 'VB' }, 'walk': { pos: 'VERB', tag: 'VB' },
  'win': { pos: 'VERB', tag: 'VB' }, 'offer': { pos: 'VERB', tag: 'VB' },
  'remember': { pos: 'VERB', tag: 'VB' }, 'love': { pos: 'VERB', tag: 'VB' },
  'consider': { pos: 'VERB', tag: 'VB' }, 'appear': { pos: 'VERB', tag: 'VB' },
  'buy': { pos: 'VERB', tag: 'VB' }, 'wait': { pos: 'VERB', tag: 'VB' },
  'serve': { pos: 'VERB', tag: 'VB' }, 'die': { pos: 'VERB', tag: 'VB' },
  'send': { pos: 'VERB', tag: 'VB' }, 'expect': { pos: 'VERB', tag: 'VB' },
  'build': { pos: 'VERB', tag: 'VB' }, 'stay': { pos: 'VERB', tag: 'VB' },
  'fall': { pos: 'VERB', tag: 'VB' }, 'cut': { pos: 'VERB', tag: 'VB' },
  'reach': { pos: 'VERB', tag: 'VB' }, 'kill': { pos: 'VERB', tag: 'VB' },
  'remain': { pos: 'VERB', tag: 'VB' }, 'suggest': { pos: 'VERB', tag: 'VB' },
  'raise': { pos: 'VERB', tag: 'VB' }, 'pass': { pos: 'VERB', tag: 'VB' },
  'sell': { pos: 'VERB', tag: 'VB' }, 'require': { pos: 'VERB', tag: 'VB' },
  'report': { pos: 'VERB', tag: 'VB' }, 'decide': { pos: 'VERB', tag: 'VB' },
  'pull': { pos: 'VERB', tag: 'VB' }, 'develop': { pos: 'VERB', tag: 'VB' },
  
  // Common nouns
  'time': { pos: 'NOUN', tag: 'NN' }, 'year': { pos: 'NOUN', tag: 'NN' },
  'people': { pos: 'NOUN', tag: 'NNS' }, 'way': { pos: 'NOUN', tag: 'NN' },
  'day': { pos: 'NOUN', tag: 'NN' }, 'man': { pos: 'NOUN', tag: 'NN' },
  'thing': { pos: 'NOUN', tag: 'NN' }, 'woman': { pos: 'NOUN', tag: 'NN' },
  'life': { pos: 'NOUN', tag: 'NN' }, 'child': { pos: 'NOUN', tag: 'NN' },
  'world': { pos: 'NOUN', tag: 'NN' }, 'school': { pos: 'NOUN', tag: 'NN' },
  'state': { pos: 'NOUN', tag: 'NN' }, 'family': { pos: 'NOUN', tag: 'NN' },
  'student': { pos: 'NOUN', tag: 'NN' }, 'group': { pos: 'NOUN', tag: 'NN' },
  'country': { pos: 'NOUN', tag: 'NN' }, 'problem': { pos: 'NOUN', tag: 'NN' },
  'hand': { pos: 'NOUN', tag: 'NN' }, 'part': { pos: 'NOUN', tag: 'NN' },
  'place': { pos: 'NOUN', tag: 'NN' }, 'case': { pos: 'NOUN', tag: 'NN' },
  'week': { pos: 'NOUN', tag: 'NN' }, 'company': { pos: 'NOUN', tag: 'NN' },
  'system': { pos: 'NOUN', tag: 'NN' }, 'program': { pos: 'NOUN', tag: 'NN' },
  'question': { pos: 'NOUN', tag: 'NN' }, 'work': { pos: 'NOUN', tag: 'NN' },
  'government': { pos: 'NOUN', tag: 'NN' }, 'number': { pos: 'NOUN', tag: 'NN' },
  'night': { pos: 'NOUN', tag: 'NN' }, 'point': { pos: 'NOUN', tag: 'NN' },
  'home': { pos: 'NOUN', tag: 'NN' }, 'water': { pos: 'NOUN', tag: 'NN' },
  'room': { pos: 'NOUN', tag: 'NN' }, 'mother': { pos: 'NOUN', tag: 'NN' },
  'area': { pos: 'NOUN', tag: 'NN' }, 'money': { pos: 'NOUN', tag: 'NN' },
  'story': { pos: 'NOUN', tag: 'NN' }, 'fact': { pos: 'NOUN', tag: 'NN' },
  'month': { pos: 'NOUN', tag: 'NN' }, 'lot': { pos: 'NOUN', tag: 'NN' },
  'right': { pos: 'NOUN', tag: 'NN' }, 'study': { pos: 'NOUN', tag: 'NN' },
  'book': { pos: 'NOUN', tag: 'NN' }, 'eye': { pos: 'NOUN', tag: 'NN' },
  'job': { pos: 'NOUN', tag: 'NN' }, 'word': { pos: 'NOUN', tag: 'NN' },
  'business': { pos: 'NOUN', tag: 'NN' }, 'issue': { pos: 'NOUN', tag: 'NN' },
  'side': { pos: 'NOUN', tag: 'NN' }, 'kind': { pos: 'NOUN', tag: 'NN' },
  'head': { pos: 'NOUN', tag: 'NN' }, 'house': { pos: 'NOUN', tag: 'NN' },
  'service': { pos: 'NOUN', tag: 'NN' }, 'friend': { pos: 'NOUN', tag: 'NN' },
  'father': { pos: 'NOUN', tag: 'NN' }, 'power': { pos: 'NOUN', tag: 'NN' },
  'hour': { pos: 'NOUN', tag: 'NN' }, 'game': { pos: 'NOUN', tag: 'NN' },
  'line': { pos: 'NOUN', tag: 'NN' }, 'end': { pos: 'NOUN', tag: 'NN' },
  'member': { pos: 'NOUN', tag: 'NN' }, 'law': { pos: 'NOUN', tag: 'NN' },
  'car': { pos: 'NOUN', tag: 'NN' }, 'city': { pos: 'NOUN', tag: 'NN' },
  'community': { pos: 'NOUN', tag: 'NN' }, 'name': { pos: 'NOUN', tag: 'NN' },
  'president': { pos: 'NOUN', tag: 'NN' }, 'team': { pos: 'NOUN', tag: 'NN' },
  'minute': { pos: 'NOUN', tag: 'NN' }, 'idea': { pos: 'NOUN', tag: 'NN' },
  'kid': { pos: 'NOUN', tag: 'NN' }, 'body': { pos: 'NOUN', tag: 'NN' },
  'information': { pos: 'NOUN', tag: 'NN' }, 'back': { pos: 'NOUN', tag: 'NN' },
  'parent': { pos: 'NOUN', tag: 'NN' }, 'face': { pos: 'NOUN', tag: 'NN' },
  'others': { pos: 'NOUN', tag: 'NNS' }, 'level': { pos: 'NOUN', tag: 'NN' },
  'office': { pos: 'NOUN', tag: 'NN' }, 'door': { pos: 'NOUN', tag: 'NN' },
  'health': { pos: 'NOUN', tag: 'NN' }, 'person': { pos: 'NOUN', tag: 'NN' },
  'art': { pos: 'NOUN', tag: 'NN' }, 'war': { pos: 'NOUN', tag: 'NN' },
  'history': { pos: 'NOUN', tag: 'NN' }, 'party': { pos: 'NOUN', tag: 'NN' },
  'result': { pos: 'NOUN', tag: 'NN' }, 'change': { pos: 'NOUN', tag: 'NN' },
  'morning': { pos: 'NOUN', tag: 'NN' }, 'reason': { pos: 'NOUN', tag: 'NN' },
  'research': { pos: 'NOUN', tag: 'NN' }, 'girl': { pos: 'NOUN', tag: 'NN' },
  'guy': { pos: 'NOUN', tag: 'NN' }, 'moment': { pos: 'NOUN', tag: 'NN' },
  'air': { pos: 'NOUN', tag: 'NN' }, 'teacher': { pos: 'NOUN', tag: 'NN' },
  'force': { pos: 'NOUN', tag: 'NN' }, 'education': { pos: 'NOUN', tag: 'NN' },
  'video': { pos: 'NOUN', tag: 'NN' }, 'content': { pos: 'NOUN', tag: 'NN' },
  'algorithm': { pos: 'NOUN', tag: 'NN' }, 'channel': { pos: 'NOUN', tag: 'NN' },
  'viewer': { pos: 'NOUN', tag: 'NN' }, 'creator': { pos: 'NOUN', tag: 'NN' },
  'audience': { pos: 'NOUN', tag: 'NN' }, 'engagement': { pos: 'NOUN', tag: 'NN' },
  'thumbnail': { pos: 'NOUN', tag: 'NN' }, 'hook': { pos: 'NOUN', tag: 'NN' },
  'script': { pos: 'NOUN', tag: 'NN' }, 'trend': { pos: 'NOUN', tag: 'NN' },
  'platform': { pos: 'NOUN', tag: 'NN' }, 'brand': { pos: 'NOUN', tag: 'NN' },
  
  // Common adjectives
  'good': { pos: 'ADJ', tag: 'JJ' }, 'new': { pos: 'ADJ', tag: 'JJ' },
  'first': { pos: 'ADJ', tag: 'JJ' }, 'last': { pos: 'ADJ', tag: 'JJ' },
  'long': { pos: 'ADJ', tag: 'JJ' }, 'great': { pos: 'ADJ', tag: 'JJ' },
  'little': { pos: 'ADJ', tag: 'JJ' }, 'own': { pos: 'ADJ', tag: 'JJ' },
  'other': { pos: 'ADJ', tag: 'JJ' }, 'old': { pos: 'ADJ', tag: 'JJ' },
  'right': { pos: 'ADJ', tag: 'JJ' }, 'big': { pos: 'ADJ', tag: 'JJ' },
  'high': { pos: 'ADJ', tag: 'JJ' }, 'different': { pos: 'ADJ', tag: 'JJ' },
  'small': { pos: 'ADJ', tag: 'JJ' }, 'large': { pos: 'ADJ', tag: 'JJ' },
  'next': { pos: 'ADJ', tag: 'JJ' }, 'early': { pos: 'ADJ', tag: 'JJ' },
  'young': { pos: 'ADJ', tag: 'JJ' }, 'important': { pos: 'ADJ', tag: 'JJ' },
  'few': { pos: 'ADJ', tag: 'JJ' }, 'public': { pos: 'ADJ', tag: 'JJ' },
  'bad': { pos: 'ADJ', tag: 'JJ' }, 'same': { pos: 'ADJ', tag: 'JJ' },
  'able': { pos: 'ADJ', tag: 'JJ' }, 'viral': { pos: 'ADJ', tag: 'JJ' },
  'amazing': { pos: 'ADJ', tag: 'JJ' }, 'incredible': { pos: 'ADJ', tag: 'JJ' },
  'crazy': { pos: 'ADJ', tag: 'JJ' }, 'insane': { pos: 'ADJ', tag: 'JJ' },
  'shocking': { pos: 'ADJ', tag: 'JJ' }, 'secret': { pos: 'ADJ', tag: 'JJ' },
  'best': { pos: 'ADJ', tag: 'JJS' }, 'worst': { pos: 'ADJ', tag: 'JJS' },
  'better': { pos: 'ADJ', tag: 'JJR' }, 'worse': { pos: 'ADJ', tag: 'JJR' },
  
  // Common adverbs
  'now': { pos: 'ADV', tag: 'RB' }, 'just': { pos: 'ADV', tag: 'RB' },
  'also': { pos: 'ADV', tag: 'RB' }, 'very': { pos: 'ADV', tag: 'RB' },
  'then': { pos: 'ADV', tag: 'RB' }, 'more': { pos: 'ADV', tag: 'RBR' },
  'here': { pos: 'ADV', tag: 'RB' }, 'well': { pos: 'ADV', tag: 'RB' },
  'only': { pos: 'ADV', tag: 'RB' }, 'even': { pos: 'ADV', tag: 'RB' },
  'back': { pos: 'ADV', tag: 'RB' }, 'there': { pos: 'ADV', tag: 'RB' },
  'still': { pos: 'ADV', tag: 'RB' }, 'down': { pos: 'ADV', tag: 'RB' },
  'up': { pos: 'ADV', tag: 'RB' }, 'out': { pos: 'ADV', tag: 'RB' },
  'really': { pos: 'ADV', tag: 'RB' }, 'never': { pos: 'ADV', tag: 'RB' },
  'always': { pos: 'ADV', tag: 'RB' }, 'most': { pos: 'ADV', tag: 'RBS' },
  'actually': { pos: 'ADV', tag: 'RB' }, 'literally': { pos: 'ADV', tag: 'RB' },
};

// ----------------------------------------------------------------------------
// Tokenizer Class
// ----------------------------------------------------------------------------

export class Tokenizer {
  private cache: Map<string, Token[]> = new Map();
  private maxCacheSize = 1000;

  /**
   * Tokenize text into an array of tokens with linguistic analysis
   */
  tokenize(text: string): Token[] {
    // Check cache
    const cacheKey = text.substring(0, 100);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const tokens: Token[] = [];
    let currentIndex = 0;

    // Split text into raw tokens
    const rawTokens = this.splitIntoRawTokens(text);

    for (const rawToken of rawTokens) {
      const startChar = text.indexOf(rawToken.text, currentIndex);
      const endChar = startChar + rawToken.text.length;
      
      const token = this.analyzeToken(rawToken.text, tokens.length, startChar, endChar);
      tokens.push(token);
      
      currentIndex = endChar;
    }

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, tokens);

    return tokens;
  }

  /**
   * Split text into raw tokens preserving contractions and handling edge cases
   */
  private splitIntoRawTokens(text: string): { text: string; type: 'word' | 'punct' | 'space' }[] {
    const tokens: { text: string; type: 'word' | 'punct' | 'space' }[] = [];
    
    // Advanced regex for tokenization
    const tokenRegex = /([A-Za-z]+(?:'[A-Za-z]+)?)|(\d+(?:[.,]\d+)*%?)|([^\w\s])|(\s+)/g;
    
    let match;
    while ((match = tokenRegex.exec(text)) !== null) {
      const [fullMatch, word, number, punct, space] = match;
      
      if (word) {
        tokens.push({ text: word, type: 'word' });
      } else if (number) {
        tokens.push({ text: number, type: 'word' });
      } else if (punct) {
        tokens.push({ text: punct, type: 'punct' });
      }
      // Ignore spaces for token output but preserve positions
    }

    return tokens;
  }

  /**
   * Analyze a single token to determine its properties
   */
  private analyzeToken(text: string, index: number, startChar: number, endChar: number): Token {
    const lowerText = text.toLowerCase();
    
    // Determine POS and tag
    const { pos, tag } = this.determinePOS(text, lowerText);
    
    // Get lemma
    const lemma = this.getLemma(lowerText, pos);
    
    return {
      text,
      lemma,
      pos,
      tag,
      isStopWord: STOP_WORDS.has(lowerText),
      isPunctuation: pos === 'PUNCT',
      isAlpha: /^[A-Za-z]+$/.test(text),
      isDigit: /^\d+$/.test(text),
      index,
      startChar,
      endChar,
    };
  }

  /**
   * Determine part of speech for a token
   */
  private determinePOS(text: string, lowerText: string): { pos: PartOfSpeech; tag: string } {
    // Check word map first
    if (WORD_POS_MAP[lowerText]) {
      return WORD_POS_MAP[lowerText];
    }

    // Check patterns
    for (const pattern of POS_PATTERNS) {
      if (pattern.pattern.test(text)) {
        return { pos: pattern.pos, tag: pattern.tag };
      }
    }

    // Default to noun for unknown words
    return { pos: 'NOUN', tag: 'NN' };
  }

  /**
   * Get the lemma (base form) of a word
   */
  private getLemma(word: string, pos: PartOfSpeech): string {
    // Check irregular forms
    if (IRREGULAR_VERBS[word]) {
      return IRREGULAR_VERBS[word];
    }
    if (IRREGULAR_PLURALS[word]) {
      return IRREGULAR_PLURALS[word];
    }

    // Apply lemmatization rules
    for (const rule of LEMMA_RULES) {
      if (word.endsWith(rule.suffix) && word.length >= rule.minLength) {
        if (!rule.pos || rule.pos.includes(pos)) {
          const stem = word.slice(0, -rule.suffix.length) + rule.replacement;
          // Basic validation - stem should have at least 2 chars
          if (stem.length >= 2) {
            return stem;
          }
        }
      }
    }

    return word;
  }

  /**
   * Get word frequency map from tokens
   */
  getWordFrequencies(tokens: Token[]): Map<string, number> {
    const frequencies = new Map<string, number>();
    
    for (const token of tokens) {
      if (!token.isStopWord && !token.isPunctuation && token.isAlpha) {
        const lemma = token.lemma;
        frequencies.set(lemma, (frequencies.get(lemma) || 0) + 1);
      }
    }

    return frequencies;
  }

  /**
   * Get n-grams from tokens
   */
  getNGrams(tokens: Token[], n: number): string[][] {
    const ngrams: string[][] = [];
    const words = tokens.filter(t => !t.isPunctuation).map(t => t.lemma);

    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n));
    }

    return ngrams;
  }

  /**
   * Calculate TF-IDF scores for terms
   */
  calculateTFIDF(documents: Token[][]): Map<string, number>[] {
    const docFrequencies = new Map<string, number>();
    const termFrequencies: Map<string, number>[] = [];

    // Calculate term frequencies per document
    for (const doc of documents) {
      const tf = this.getWordFrequencies(doc);
      termFrequencies.push(tf);

      // Update document frequencies
      for (const term of tf.keys()) {
        docFrequencies.set(term, (docFrequencies.get(term) || 0) + 1);
      }
    }

    // Calculate TF-IDF
    const tfidfScores: Map<string, number>[] = [];
    const numDocs = documents.length;

    for (const tf of termFrequencies) {
      const tfidf = new Map<string, number>();
      const maxTF = Math.max(...tf.values());

      for (const [term, freq] of tf.entries()) {
        const normalizedTF = freq / maxTF;
        const df = docFrequencies.get(term) || 1;
        const idf = Math.log(numDocs / df);
        tfidf.set(term, normalizedTF * idf);
      }

      tfidfScores.push(tfidf);
    }

    return tfidfScores;
  }

  /**
   * Extract key phrases using statistical measures
   */
  extractKeyPhrases(tokens: Token[], maxPhrases: number = 10): { phrase: string; score: number }[] {
    const phrases: Map<string, { count: number; positions: number[] }> = new Map();
    
    // Extract unigrams, bigrams, and trigrams
    for (let n = 1; n <= 3; n++) {
      for (let i = 0; i <= tokens.length - n; i++) {
        const phraseTokens = tokens.slice(i, i + n);
        
        // Skip if contains stopwords at edges or punctuation
        if (phraseTokens[0].isStopWord || phraseTokens[n - 1].isStopWord) continue;
        if (phraseTokens.some(t => t.isPunctuation)) continue;
        if (!phraseTokens.every(t => t.isAlpha)) continue;

        const phrase = phraseTokens.map(t => t.lemma).join(' ');
        const existing = phrases.get(phrase) || { count: 0, positions: [] };
        existing.count++;
        existing.positions.push(i);
        phrases.set(phrase, existing);
      }
    }

    // Score phrases
    const scored: { phrase: string; score: number }[] = [];
    for (const [phrase, data] of phrases.entries()) {
      // Score based on frequency, length, and position
      const freqScore = Math.log(data.count + 1);
      const lengthScore = phrase.split(' ').length * 0.5;
      const positionScore = 1 / (1 + data.positions[0] / tokens.length);
      
      const score = freqScore * lengthScore * positionScore;
      scored.push({ phrase, score });
    }

    // Sort and return top phrases
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPhrases);
  }

  /**
   * Clear tokenizer cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const tokenizer = new Tokenizer();

// Export utility functions
export function tokenize(text: string): Token[] {
  return tokenizer.tokenize(text);
}

export function getWordFrequencies(text: string): Map<string, number> {
  return tokenizer.getWordFrequencies(tokenizer.tokenize(text));
}

export function extractKeyPhrases(text: string, maxPhrases?: number): { phrase: string; score: number }[] {
  return tokenizer.extractKeyPhrases(tokenizer.tokenize(text), maxPhrases);
}

export function isStopWord(word: string): boolean {
  return STOP_WORDS.has(word.toLowerCase());
}

export function getStopWords(): Set<string> {
  return new Set(STOP_WORDS);
}
