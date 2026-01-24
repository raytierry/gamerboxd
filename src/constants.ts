export const colors = {
  primary: {
    DEFAULT: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
  },
  status: {
    wantToPlay: '#3b82f6',
    playing: '#f59e0b',
    completed: '#10b981',
    dropped: '#ef4444',
    onHold: '#8b5cf6',
  },
} as const;

export const STATUS_LABELS = {
  WANT_TO_PLAY: 'Want to Play',
  PLAYING: 'Playing',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  ON_HOLD: 'On Hold',
} as const;

export const RANK_GRADIENT_CLASSES = [
  'from-amber-400 to-yellow-500',
  'from-slate-300 to-slate-400',
  'from-amber-600 to-amber-700',
  'from-indigo-400 to-indigo-500',
  'from-purple-400 to-purple-500',
  'from-pink-400 to-pink-500',
  'from-rose-400 to-rose-500',
  'from-orange-400 to-orange-500',
  'from-teal-400 to-teal-500',
  'from-cyan-400 to-cyan-500',
] as const;

export const RANK_CSS_COLORS = [
  { from: '#fbbf24', to: '#eab308', shadow: 'rgba(251, 191, 36, 0.4)' },
  { from: '#cbd5e1', to: '#94a3b8', shadow: 'rgba(203, 213, 225, 0.4)' },
  { from: '#d97706', to: '#b45309', shadow: 'rgba(217, 119, 6, 0.4)' },
  { from: '#818cf8', to: '#6366f1', shadow: 'rgba(129, 140, 248, 0.4)' },
  { from: '#c084fc', to: '#a855f7', shadow: 'rgba(192, 132, 252, 0.4)' },
  { from: '#f472b6', to: '#ec4899', shadow: 'rgba(244, 114, 182, 0.4)' },
  { from: '#fb7185', to: '#f43f5e', shadow: 'rgba(251, 113, 133, 0.4)' },
  { from: '#fb923c', to: '#f97316', shadow: 'rgba(251, 146, 60, 0.4)' },
  { from: '#2dd4bf', to: '#14b8a6', shadow: 'rgba(45, 212, 191, 0.4)' },
  { from: '#22d3ee', to: '#06b6d4', shadow: 'rgba(34, 211, 238, 0.4)' },
] as const;

export const IGDB_CONFIG = {
  baseUrl: 'https://api.igdb.com/v4',
  authUrl: 'https://id.twitch.tv/oauth2/token',
  defaultPageSize: 20,
  imageBaseUrl: 'https://images.igdb.com/igdb/image/upload',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 40,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const NAV_ITEMS = [
  { href: '/', icon: 'Home', label: 'Home' },
  { href: '/search', icon: 'Search', label: 'Search' },
  { href: '/profile', icon: 'User', label: 'Profile', requiresAuth: true },
] as const;

export function getActiveTab(pathname: string): string {
  if (pathname === '/' || pathname.startsWith('/games/')) return '/';
  if (pathname.startsWith('/search')) return '/search';
  if (pathname.startsWith('/profile')) return '/profile';
  return '/';
}
