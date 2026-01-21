/**
 * Constantes globais da aplicação
 * Cores, breakpoints, configurações, etc.
 */

// Paleta de cores inspirada no Letterboxd Redesign
export const colors = {
  // Cores principais (usadas via CSS variables do shadcn)
  primary: {
    DEFAULT: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
  },

  // Status do backlog
  status: {
    wantToPlay: '#3b82f6', // Azul
    playing: '#f59e0b', // Amarelo
    completed: '#10b981', // Verde
    dropped: '#ef4444', // Vermelho
    onHold: '#8b5cf6', // Roxo
  },
} as const;

// Labels para os status do backlog
export const STATUS_LABELS = {
  WANT_TO_PLAY: 'Want to Play',
  PLAYING: 'Playing',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  ON_HOLD: 'On Hold',
} as const;

// Configuração do RAWG API
export const RAWG_CONFIG = {
  baseUrl: 'https://api.rawg.io/api',
  defaultPageSize: 20,
} as const;

// Configuração de paginação
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 40,
} as const;

// Breakpoints (mesmos do Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
