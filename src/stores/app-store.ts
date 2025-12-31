// ============================================================================
// Application State Management Store
// ============================================================================
// Centralized state management for the GravityClip AI application
// Includes user state, generation history, settings, and real-time updates

import { 
  User, 
  GenerationHistory, 
  GeneratedScript,
  ViralityScore,
  EngagementMetrics,
  AudienceProfile,
  ToneProfile
} from '@/types';

// ============================================================================
// State Types
// ============================================================================

export interface AppState {
  // User State
  user: UserState;
  
  // Generation State
  generation: GenerationState;
  
  // History State
  history: HistoryState;
  
  // Settings State
  settings: SettingsState;
  
  // UI State
  ui: UIState;
  
  // Analytics State
  analytics: AnalyticsState;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface GenerationState {
  status: 'idle' | 'extracting' | 'analyzing' | 'generating' | 'complete' | 'error';
  currentUrl: string;
  progress: number;
  progressMessage: string;
  scripts: GeneratedScript[];
  viralityScore: ViralityScore | null;
  error: string | null;
  startedAt: number | null;
  completedAt: number | null;
}

export interface HistoryState {
  items: GenerationHistoryItem[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: HistoryFilters;
}

export interface GenerationHistoryItem extends GenerationHistory {
  isFavorite: boolean;
  tags: string[];
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface HistoryFilters {
  platform: string | null;
  dateRange: DateRange | null;
  searchQuery: string;
  sortBy: 'date' | 'views' | 'engagement' | 'virality';
  sortOrder: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  generation: GenerationSettings;
  privacy: PrivacySettings;
  integrations: IntegrationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  generationComplete: boolean;
  weeklyDigest: boolean;
  trendAlerts: boolean;
}

export interface GenerationSettings {
  defaultPlatform: 'tiktok' | 'reels' | 'shorts' | 'all';
  defaultTone: ToneProfile['style'];
  defaultDuration: number;
  autoSave: boolean;
  includeHashtags: boolean;
  includeMusic: boolean;
  scriptCount: number;
}

export interface PrivacySettings {
  shareAnalytics: boolean;
  saveHistory: boolean;
  publicProfile: boolean;
}

export interface IntegrationSettings {
  youtube: IntegrationConfig;
  tiktok: IntegrationConfig;
  instagram: IntegrationConfig;
}

export interface IntegrationConfig {
  enabled: boolean;
  connected: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface UIState {
  sidebarOpen: boolean;
  modalOpen: string | null;
  activeTab: string;
  toasts: Toast[];
  isLoading: boolean;
  isMobile: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
  createdAt: number;
}

export interface AnalyticsState {
  dashboard: DashboardAnalytics;
  performance: PerformanceMetrics;
  trends: TrendData[];
  loading: boolean;
}

export interface DashboardAnalytics {
  totalGenerations: number;
  totalViews: number;
  avgViralityScore: number;
  topPerformingScripts: GeneratedScript[];
  recentActivity: ActivityItem[];
}

export interface PerformanceMetrics {
  viewsOverTime: TimeSeriesData[];
  engagementOverTime: TimeSeriesData[];
  platformBreakdown: PlatformMetrics[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface PlatformMetrics {
  platform: string;
  generations: number;
  avgViews: number;
  avgEngagement: number;
}

export interface ActivityItem {
  id: string;
  type: 'generation' | 'view' | 'share' | 'favorite';
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface TrendData {
  topic: string;
  score: number;
  change: number;
  platform: string;
}

// ============================================================================
// Action Types
// ============================================================================

export type AppAction =
  | UserAction
  | GenerationAction
  | HistoryAction
  | SettingsAction
  | UIAction
  | AnalyticsAction;

// User Actions
export type UserAction =
  | { type: 'USER_LOGIN_START' }
  | { type: 'USER_LOGIN_SUCCESS'; payload: User }
  | { type: 'USER_LOGIN_FAILURE'; payload: string }
  | { type: 'USER_LOGOUT' }
  | { type: 'USER_UPDATE_PROFILE'; payload: Partial<User> };

// Generation Actions
export type GenerationAction =
  | { type: 'GENERATION_START'; payload: string }
  | { type: 'GENERATION_PROGRESS'; payload: { progress: number; message: string } }
  | { type: 'GENERATION_EXTRACTING' }
  | { type: 'GENERATION_ANALYZING' }
  | { type: 'GENERATION_GENERATING' }
  | { type: 'GENERATION_COMPLETE'; payload: { scripts: GeneratedScript[]; viralityScore: ViralityScore } }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'GENERATION_RESET' }
  | { type: 'GENERATION_UPDATE_SCRIPT'; payload: { index: number; script: Partial<GeneratedScript> } };

// History Actions
export type HistoryAction =
  | { type: 'HISTORY_FETCH_START' }
  | { type: 'HISTORY_FETCH_SUCCESS'; payload: { items: GenerationHistoryItem[]; total: number } }
  | { type: 'HISTORY_FETCH_FAILURE'; payload: string }
  | { type: 'HISTORY_ADD_ITEM'; payload: GenerationHistoryItem }
  | { type: 'HISTORY_REMOVE_ITEM'; payload: string }
  | { type: 'HISTORY_TOGGLE_FAVORITE'; payload: string }
  | { type: 'HISTORY_SET_FILTER'; payload: Partial<HistoryFilters> }
  | { type: 'HISTORY_SET_PAGE'; payload: number }
  | { type: 'HISTORY_CLEAR' };

// Settings Actions
export type SettingsAction =
  | { type: 'SETTINGS_UPDATE'; payload: Partial<SettingsState> }
  | { type: 'SETTINGS_UPDATE_THEME'; payload: SettingsState['theme'] }
  | { type: 'SETTINGS_UPDATE_NOTIFICATIONS'; payload: Partial<NotificationSettings> }
  | { type: 'SETTINGS_UPDATE_GENERATION'; payload: Partial<GenerationSettings> }
  | { type: 'SETTINGS_UPDATE_PRIVACY'; payload: Partial<PrivacySettings> }
  | { type: 'SETTINGS_CONNECT_INTEGRATION'; payload: { platform: keyof IntegrationSettings; config: IntegrationConfig } }
  | { type: 'SETTINGS_DISCONNECT_INTEGRATION'; payload: keyof IntegrationSettings }
  | { type: 'SETTINGS_RESET' };

// UI Actions
export type UIAction =
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'UI_SET_SIDEBAR'; payload: boolean }
  | { type: 'UI_OPEN_MODAL'; payload: string }
  | { type: 'UI_CLOSE_MODAL' }
  | { type: 'UI_SET_ACTIVE_TAB'; payload: string }
  | { type: 'UI_ADD_TOAST'; payload: Omit<Toast, 'id' | 'createdAt'> }
  | { type: 'UI_REMOVE_TOAST'; payload: string }
  | { type: 'UI_SET_LOADING'; payload: boolean }
  | { type: 'UI_SET_MOBILE'; payload: boolean };

// Analytics Actions
export type AnalyticsAction =
  | { type: 'ANALYTICS_FETCH_START' }
  | { type: 'ANALYTICS_FETCH_SUCCESS'; payload: Partial<AnalyticsState> }
  | { type: 'ANALYTICS_FETCH_FAILURE'; payload: string }
  | { type: 'ANALYTICS_UPDATE_DASHBOARD'; payload: Partial<DashboardAnalytics> }
  | { type: 'ANALYTICS_UPDATE_TRENDS'; payload: TrendData[] };

// ============================================================================
// Initial State
// ============================================================================

export const initialState: AppState = {
  user: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  },
  generation: {
    status: 'idle',
    currentUrl: '',
    progress: 0,
    progressMessage: '',
    scripts: [],
    viralityScore: null,
    error: null,
    startedAt: null,
    completedAt: null
  },
  history: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      hasMore: false
    },
    filters: {
      platform: null,
      dateRange: null,
      searchQuery: '',
      sortBy: 'date',
      sortOrder: 'desc'
    }
  },
  settings: {
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      generationComplete: true,
      weeklyDigest: false,
      trendAlerts: true
    },
    generation: {
      defaultPlatform: 'all',
      defaultTone: 'conversational',
      defaultDuration: 30,
      autoSave: true,
      includeHashtags: true,
      includeMusic: true,
      scriptCount: 3
    },
    privacy: {
      shareAnalytics: true,
      saveHistory: true,
      publicProfile: false
    },
    integrations: {
      youtube: { enabled: true, connected: false, accessToken: null, refreshToken: null, expiresAt: null },
      tiktok: { enabled: true, connected: false, accessToken: null, refreshToken: null, expiresAt: null },
      instagram: { enabled: true, connected: false, accessToken: null, refreshToken: null, expiresAt: null }
    }
  },
  ui: {
    sidebarOpen: true,
    modalOpen: null,
    activeTab: 'generate',
    toasts: [],
    isLoading: false,
    isMobile: false
  },
  analytics: {
    dashboard: {
      totalGenerations: 0,
      totalViews: 0,
      avgViralityScore: 0,
      topPerformingScripts: [],
      recentActivity: []
    },
    performance: {
      viewsOverTime: [],
      engagementOverTime: [],
      platformBreakdown: []
    },
    trends: [],
    loading: false
  }
};

// ============================================================================
// Reducer Functions
// ============================================================================

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'USER_LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'USER_LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload, loading: false, error: null };
    case 'USER_LOGIN_FAILURE':
      return { ...state, isAuthenticated: false, user: null, loading: false, error: action.payload };
    case 'USER_LOGOUT':
      return { ...initialState.user };
    case 'USER_UPDATE_PROFILE':
      return state.user 
        ? { ...state, user: { ...state.user, ...action.payload } }
        : state;
    default:
      return state;
  }
}

function generationReducer(state: GenerationState, action: GenerationAction): GenerationState {
  switch (action.type) {
    case 'GENERATION_START':
      return {
        ...state,
        status: 'extracting',
        currentUrl: action.payload,
        progress: 0,
        progressMessage: 'Starting generation...',
        scripts: [],
        viralityScore: null,
        error: null,
        startedAt: Date.now(),
        completedAt: null
      };
    case 'GENERATION_PROGRESS':
      return {
        ...state,
        progress: action.payload.progress,
        progressMessage: action.payload.message
      };
    case 'GENERATION_EXTRACTING':
      return { ...state, status: 'extracting', progressMessage: 'Extracting video transcript...' };
    case 'GENERATION_ANALYZING':
      return { ...state, status: 'analyzing', progressMessage: 'Analyzing content for virality...' };
    case 'GENERATION_GENERATING':
      return { ...state, status: 'generating', progressMessage: 'Generating viral scripts...' };
    case 'GENERATION_COMPLETE':
      return {
        ...state,
        status: 'complete',
        progress: 100,
        progressMessage: 'Generation complete!',
        scripts: action.payload.scripts,
        viralityScore: action.payload.viralityScore,
        completedAt: Date.now()
      };
    case 'GENERATION_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
        completedAt: Date.now()
      };
    case 'GENERATION_RESET':
      return { ...initialState.generation };
    case 'GENERATION_UPDATE_SCRIPT':
      return {
        ...state,
        scripts: state.scripts.map((script, i) =>
          i === action.payload.index
            ? { ...script, ...action.payload.script }
            : script
        )
      };
    default:
      return state;
  }
}

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'HISTORY_FETCH_START':
      return { ...state, loading: true, error: null };
    case 'HISTORY_FETCH_SUCCESS':
      return {
        ...state,
        items: action.payload.items,
        loading: false,
        pagination: {
          ...state.pagination,
          total: action.payload.total,
          hasMore: action.payload.items.length >= state.pagination.pageSize
        }
      };
    case 'HISTORY_FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'HISTORY_ADD_ITEM':
      return {
        ...state,
        items: [action.payload, ...state.items],
        pagination: { ...state.pagination, total: state.pagination.total + 1 }
      };
    case 'HISTORY_REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        pagination: { ...state.pagination, total: state.pagination.total - 1 }
      };
    case 'HISTORY_TOGGLE_FAVORITE':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        )
      };
    case 'HISTORY_SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    case 'HISTORY_SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload }
      };
    case 'HISTORY_CLEAR':
      return { ...initialState.history };
    default:
      return state;
  }
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SETTINGS_UPDATE':
      return { ...state, ...action.payload };
    case 'SETTINGS_UPDATE_THEME':
      return { ...state, theme: action.payload };
    case 'SETTINGS_UPDATE_NOTIFICATIONS':
      return { ...state, notifications: { ...state.notifications, ...action.payload } };
    case 'SETTINGS_UPDATE_GENERATION':
      return { ...state, generation: { ...state.generation, ...action.payload } };
    case 'SETTINGS_UPDATE_PRIVACY':
      return { ...state, privacy: { ...state.privacy, ...action.payload } };
    case 'SETTINGS_CONNECT_INTEGRATION':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [action.payload.platform]: action.payload.config
        }
      };
    case 'SETTINGS_DISCONNECT_INTEGRATION':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [action.payload]: {
            ...state.integrations[action.payload],
            connected: false,
            accessToken: null,
            refreshToken: null,
            expiresAt: null
          }
        }
      };
    case 'SETTINGS_RESET':
      return { ...initialState.settings };
    default:
      return state;
  }
}

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'UI_TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'UI_SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'UI_OPEN_MODAL':
      return { ...state, modalOpen: action.payload };
    case 'UI_CLOSE_MODAL':
      return { ...state, modalOpen: null };
    case 'UI_SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'UI_ADD_TOAST':
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...action.payload,
            createdAt: Date.now()
          }
        ]
      };
    case 'UI_REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    case 'UI_SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UI_SET_MOBILE':
      return { ...state, isMobile: action.payload };
    default:
      return state;
  }
}

function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'ANALYTICS_FETCH_START':
      return { ...state, loading: true };
    case 'ANALYTICS_FETCH_SUCCESS':
      return { ...state, ...action.payload, loading: false };
    case 'ANALYTICS_FETCH_FAILURE':
      return { ...state, loading: false };
    case 'ANALYTICS_UPDATE_DASHBOARD':
      return { ...state, dashboard: { ...state.dashboard, ...action.payload } };
    case 'ANALYTICS_UPDATE_TRENDS':
      return { ...state, trends: action.payload };
    default:
      return state;
  }
}

// ============================================================================
// Main Reducer
// ============================================================================

export function appReducer(state: AppState, action: AppAction): AppState {
  return {
    user: userReducer(state.user, action as UserAction),
    generation: generationReducer(state.generation, action as GenerationAction),
    history: historyReducer(state.history, action as HistoryAction),
    settings: settingsReducer(state.settings, action as SettingsAction),
    ui: uiReducer(state.ui, action as UIAction),
    analytics: analyticsReducer(state.analytics, action as AnalyticsAction)
  };
}

// ============================================================================
// Selectors
// ============================================================================

export const selectors = {
  // User Selectors
  selectUser: (state: AppState) => state.user.user,
  selectIsAuthenticated: (state: AppState) => state.user.isAuthenticated,
  selectUserLoading: (state: AppState) => state.user.loading,
  
  // Generation Selectors
  selectGenerationStatus: (state: AppState) => state.generation.status,
  selectGenerationProgress: (state: AppState) => state.generation.progress,
  selectGeneratedScripts: (state: AppState) => state.generation.scripts,
  selectViralityScore: (state: AppState) => state.generation.viralityScore,
  selectIsGenerating: (state: AppState) => 
    ['extracting', 'analyzing', 'generating'].includes(state.generation.status),
  selectGenerationDuration: (state: AppState) => {
    const { startedAt, completedAt } = state.generation;
    if (!startedAt) return 0;
    return (completedAt || Date.now()) - startedAt;
  },
  
  // History Selectors
  selectHistory: (state: AppState) => state.history.items,
  selectHistoryLoading: (state: AppState) => state.history.loading,
  selectHistoryPagination: (state: AppState) => state.history.pagination,
  selectHistoryFilters: (state: AppState) => state.history.filters,
  selectFavoriteHistory: (state: AppState) => 
    state.history.items.filter(item => item.isFavorite),
  
  // Settings Selectors
  selectTheme: (state: AppState) => state.settings.theme,
  selectLanguage: (state: AppState) => state.settings.language,
  selectNotificationSettings: (state: AppState) => state.settings.notifications,
  selectGenerationSettings: (state: AppState) => state.settings.generation,
  selectPrivacySettings: (state: AppState) => state.settings.privacy,
  selectIntegrations: (state: AppState) => state.settings.integrations,
  selectConnectedIntegrations: (state: AppState) => 
    Object.entries(state.settings.integrations)
      .filter(([, config]) => config.connected)
      .map(([platform]) => platform),
  
  // UI Selectors
  selectSidebarOpen: (state: AppState) => state.ui.sidebarOpen,
  selectModalOpen: (state: AppState) => state.ui.modalOpen,
  selectActiveTab: (state: AppState) => state.ui.activeTab,
  selectToasts: (state: AppState) => state.ui.toasts,
  selectIsLoading: (state: AppState) => state.ui.isLoading,
  selectIsMobile: (state: AppState) => state.ui.isMobile,
  
  // Analytics Selectors
  selectDashboard: (state: AppState) => state.analytics.dashboard,
  selectPerformance: (state: AppState) => state.analytics.performance,
  selectTrends: (state: AppState) => state.analytics.trends,
  selectAnalyticsLoading: (state: AppState) => state.analytics.loading,
  selectTopPerformingScripts: (state: AppState) => 
    state.analytics.dashboard.topPerformingScripts
};

// ============================================================================
// Action Creators
// ============================================================================

export const actions = {
  // User Actions
  loginStart: (): UserAction => ({ type: 'USER_LOGIN_START' }),
  loginSuccess: (user: User): UserAction => ({ type: 'USER_LOGIN_SUCCESS', payload: user }),
  loginFailure: (error: string): UserAction => ({ type: 'USER_LOGIN_FAILURE', payload: error }),
  logout: (): UserAction => ({ type: 'USER_LOGOUT' }),
  updateProfile: (data: Partial<User>): UserAction => ({ type: 'USER_UPDATE_PROFILE', payload: data }),
  
  // Generation Actions
  startGeneration: (url: string): GenerationAction => ({ type: 'GENERATION_START', payload: url }),
  updateProgress: (progress: number, message: string): GenerationAction => 
    ({ type: 'GENERATION_PROGRESS', payload: { progress, message } }),
  setExtracting: (): GenerationAction => ({ type: 'GENERATION_EXTRACTING' }),
  setAnalyzing: (): GenerationAction => ({ type: 'GENERATION_ANALYZING' }),
  setGenerating: (): GenerationAction => ({ type: 'GENERATION_GENERATING' }),
  completeGeneration: (scripts: GeneratedScript[], viralityScore: ViralityScore): GenerationAction => 
    ({ type: 'GENERATION_COMPLETE', payload: { scripts, viralityScore } }),
  generationError: (error: string): GenerationAction => ({ type: 'GENERATION_ERROR', payload: error }),
  resetGeneration: (): GenerationAction => ({ type: 'GENERATION_RESET' }),
  updateScript: (index: number, script: Partial<GeneratedScript>): GenerationAction => 
    ({ type: 'GENERATION_UPDATE_SCRIPT', payload: { index, script } }),
  
  // History Actions
  fetchHistoryStart: (): HistoryAction => ({ type: 'HISTORY_FETCH_START' }),
  fetchHistorySuccess: (items: GenerationHistoryItem[], total: number): HistoryAction => 
    ({ type: 'HISTORY_FETCH_SUCCESS', payload: { items, total } }),
  fetchHistoryFailure: (error: string): HistoryAction => ({ type: 'HISTORY_FETCH_FAILURE', payload: error }),
  addHistoryItem: (item: GenerationHistoryItem): HistoryAction => ({ type: 'HISTORY_ADD_ITEM', payload: item }),
  removeHistoryItem: (id: string): HistoryAction => ({ type: 'HISTORY_REMOVE_ITEM', payload: id }),
  toggleFavorite: (id: string): HistoryAction => ({ type: 'HISTORY_TOGGLE_FAVORITE', payload: id }),
  setHistoryFilter: (filter: Partial<HistoryFilters>): HistoryAction => 
    ({ type: 'HISTORY_SET_FILTER', payload: filter }),
  setHistoryPage: (page: number): HistoryAction => ({ type: 'HISTORY_SET_PAGE', payload: page }),
  clearHistory: (): HistoryAction => ({ type: 'HISTORY_CLEAR' }),
  
  // Settings Actions
  updateSettings: (settings: Partial<SettingsState>): SettingsAction => 
    ({ type: 'SETTINGS_UPDATE', payload: settings }),
  updateTheme: (theme: SettingsState['theme']): SettingsAction => 
    ({ type: 'SETTINGS_UPDATE_THEME', payload: theme }),
  updateNotifications: (settings: Partial<NotificationSettings>): SettingsAction => 
    ({ type: 'SETTINGS_UPDATE_NOTIFICATIONS', payload: settings }),
  updateGenerationSettings: (settings: Partial<GenerationSettings>): SettingsAction => 
    ({ type: 'SETTINGS_UPDATE_GENERATION', payload: settings }),
  updatePrivacy: (settings: Partial<PrivacySettings>): SettingsAction => 
    ({ type: 'SETTINGS_UPDATE_PRIVACY', payload: settings }),
  connectIntegration: (platform: keyof IntegrationSettings, config: IntegrationConfig): SettingsAction => 
    ({ type: 'SETTINGS_CONNECT_INTEGRATION', payload: { platform, config } }),
  disconnectIntegration: (platform: keyof IntegrationSettings): SettingsAction => 
    ({ type: 'SETTINGS_DISCONNECT_INTEGRATION', payload: platform }),
  resetSettings: (): SettingsAction => ({ type: 'SETTINGS_RESET' }),
  
  // UI Actions
  toggleSidebar: (): UIAction => ({ type: 'UI_TOGGLE_SIDEBAR' }),
  setSidebar: (open: boolean): UIAction => ({ type: 'UI_SET_SIDEBAR', payload: open }),
  openModal: (modal: string): UIAction => ({ type: 'UI_OPEN_MODAL', payload: modal }),
  closeModal: (): UIAction => ({ type: 'UI_CLOSE_MODAL' }),
  setActiveTab: (tab: string): UIAction => ({ type: 'UI_SET_ACTIVE_TAB', payload: tab }),
  addToast: (toast: Omit<Toast, 'id' | 'createdAt'>): UIAction => 
    ({ type: 'UI_ADD_TOAST', payload: toast }),
  removeToast: (id: string): UIAction => ({ type: 'UI_REMOVE_TOAST', payload: id }),
  setLoading: (loading: boolean): UIAction => ({ type: 'UI_SET_LOADING', payload: loading }),
  setMobile: (isMobile: boolean): UIAction => ({ type: 'UI_SET_MOBILE', payload: isMobile }),
  
  // Analytics Actions
  fetchAnalyticsStart: (): AnalyticsAction => ({ type: 'ANALYTICS_FETCH_START' }),
  fetchAnalyticsSuccess: (data: Partial<AnalyticsState>): AnalyticsAction => 
    ({ type: 'ANALYTICS_FETCH_SUCCESS', payload: data }),
  fetchAnalyticsFailure: (error: string): AnalyticsAction => 
    ({ type: 'ANALYTICS_FETCH_FAILURE', payload: error }),
  updateDashboard: (data: Partial<DashboardAnalytics>): AnalyticsAction => 
    ({ type: 'ANALYTICS_UPDATE_DASHBOARD', payload: data }),
  updateTrends: (trends: TrendData[]): AnalyticsAction => 
    ({ type: 'ANALYTICS_UPDATE_TRENDS', payload: trends })
};

// ============================================================================
// Store Helpers
// ============================================================================

/**
 * Create a simple store implementation
 */
export function createStore(initialState: AppState) {
  let state = initialState;
  const listeners: Set<(state: AppState) => void> = new Set();
  
  return {
    getState: () => state,
    dispatch: (action: AppAction) => {
      state = appReducer(state, action);
      listeners.forEach(listener => listener(state));
    },
    subscribe: (listener: (state: AppState) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

/**
 * Persist state to localStorage
 */
export function persistState(state: AppState, key: string = 'gravityclip_state'): void {
  try {
    const serialized = JSON.stringify({
      settings: state.settings,
      history: {
        items: state.history.items.slice(0, 50),
        filters: state.history.filters
      }
    });
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn('Failed to persist state:', error);
  }
}

/**
 * Load state from localStorage
 */
export function loadPersistedState(key: string = 'gravityclip_state'): Partial<AppState> | null {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
    return null;
  }
}

/**
 * Merge persisted state with initial state
 */
export function hydrateState(persisted: Partial<AppState> | null): AppState {
  if (!persisted) return initialState;
  
  return {
    ...initialState,
    settings: { ...initialState.settings, ...persisted.settings },
    history: { 
      ...initialState.history, 
      items: (persisted.history?.items || []) as GenerationHistoryItem[],
      filters: { ...initialState.history.filters, ...persisted.history?.filters }
    }
  };
}
