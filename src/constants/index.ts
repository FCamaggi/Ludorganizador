/**
 * @file Constantes de la aplicación
 * @module constants
 */

/**
 * Configuración de la API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
} as const;

/**
 * Claves de almacenamiento local
 */
export const STORAGE_KEYS = {
  AUTH_USER: 'ludorganizador_auth_user',
  EVENTS: 'ludorganizador_events',
  TABLES: 'ludorganizador_tables',
  FREE_GAMES: 'ludorganizador_free_games',
} as const;

/**
 * Rutas de la API
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
  },
  EVENTS: {
    BASE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    VERIFY_PASSWORD: (id: string) => `/events/${id}/verify-password`,
  },
  TABLES: {
    BASE: '/tables',
    BY_ID: (id: string) => `/tables/${id}`,
    BY_EVENT: (eventId: string) => `/tables/event/${eventId}`,
    JOIN: (id: string) => `/tables/${id}/join`,
    LEAVE: (id: string) => `/tables/${id}/leave`,
  },
  GAMES: {
    BASE: '/games',
    BY_ID: (id: string) => `/games/${id}`,
    BY_EVENT: (eventId: string) => `/games/event/${eventId}`,
  },
  ADMIN: {
    USERS: '/admin/users',
    MAKE_ADMIN: '/admin/make-admin',
  },
} as const;

/**
 * Límites y restricciones
 */
export const LIMITS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 20,
  DEFAULT_MIN_PLAYERS: 2,
  DEFAULT_MAX_PLAYERS: 4,
  MIN_PASSWORD_LENGTH: 6,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION: 'Por favor, verifica los datos ingresados.',
} as const;

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Evento creado exitosamente',
  TABLE_CREATED: 'Mesa creada exitosamente',
  GAME_CREATED: 'Juego agregado exitosamente',
  JOINED_TABLE: 'Te has unido a la mesa',
  LEFT_TABLE: 'Has salido de la mesa',
  DELETED: 'Eliminado exitosamente',
} as const;

/**
 * Vistas de la aplicación
 */
export const VIEWS = {
  EVENTS: 'events',
  DETAIL: 'detail',
} as const;

/**
 * Tabs del detalle de evento
 */
export const EVENT_TABS = {
  TABLES: 'tables',
  FREE: 'free',
} as const;
