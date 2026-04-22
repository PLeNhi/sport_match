/**
 * API route constants
 */

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/auth/mock-login',
    ME: '/auth/me',
  },

  // Users
  USERS: {
    ME: '/users/me',
    PROFILE: '/users/me',
  },

  // Host
  HOST: {
    ME: '/hosts/me',
    CREATE_PROFILE: '/hosts/me/create-profile',
    UPDATE_PROFILE: '/hosts/me',
  },

  // Venues
  VENUES: {
    LIST: '/venues',
    DETAIL: (id: string) => `/venues/${id}`,
  },

  // Sessions
  SESSIONS: {
    LIST: '/sessions',
    CREATE: '/sessions',
    DETAIL: (id: string) => `/sessions/${id}`,
    UPDATE: (id: string) => `/sessions/${id}`,
    JOIN: (id: string) => `/sessions/${id}/join`,
    LEAVE: (id: string) => `/sessions/${id}/leave`,
    CONFIRM_ATTENDANCE: (id: string) => `/sessions/${id}/confirm-attendance`,
    HOST_SESSIONS: '/sessions/host/me',
  },

  // Participants
  PARTICIPANTS: {
    SESSION_PARTICIPANTS: (sessionId: string) => `/participants/session/${sessionId}`,
    REMOVE: (participantId: string) => `/participants/${participantId}/remove`,
  },

  // Health
  HEALTH: '/health',
} as const;

/**
 * UI-related constants
 */
export const UI_CONSTANTS = {
  MAX_SESSION_TITLE_LENGTH: 100,
  MAX_HOST_BIO_LENGTH: 500,
  DEFAULT_MAX_PLAYERS: 16,
  MIN_MAX_PLAYERS: 2,
  SESSION_POLLING_INTERVAL_MS: 30000, // 30 seconds
} as const;

/**
 * Distance/Location constants for MVP
 */
export const LOCATION_CONSTANTS = {
  DEFAULT_CITY: 'Nha Trang',
  DEFAULT_DISTRICT: 'Nha Trang',
} as const;
