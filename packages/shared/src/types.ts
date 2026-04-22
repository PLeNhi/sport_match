/**
 * Domain types and constants shared between mobile and API
 */

// User-related types
export const USER_ROLES = {
  PLAYER: 'player',
  HOST: 'host',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Skill levels for badminton
export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type SkillLevel = typeof SKILL_LEVELS[keyof typeof SKILL_LEVELS];

// Game session statuses
export const SESSION_STATUSES = {
  OPEN: 'open',
  FULL: 'full',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type SessionStatus = typeof SESSION_STATUSES[keyof typeof SESSION_STATUSES];

// Attendance statuses for participants
export const ATTENDANCE_STATUSES = {
  JOINED: 'joined',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  REMOVED: 'removed',
} as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUSES[keyof typeof ATTENDANCE_STATUSES];

// Sport types (for future multi-sport support)
export const SPORT_TYPES = {
  BADMINTON: 'badminton',
} as const;

export type SportType = typeof SPORT_TYPES[keyof typeof SPORT_TYPES];

// Location types
export interface Location {
  city: string;
  district: string;
}

// Core domain entities (for API responses)
export interface UserDTO {
  id: string;
  phone: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  location?: Location | null;
  createdAt: string;
  updatedAt: string;
}

export interface HostProfileDTO {
  id: string;
  userId: string;
  displayName: string;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VenueDTO {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionParticipantDTO {
  id: string;
  sessionId: string;
  userId: string;
  attendanceStatus: AttendanceStatus;
  joinedAt: string;
  updatedAt: string;
}

export interface GameSessionDTO {
  id: string;
  hostId: string;
  venueId: string;
  title: string;
  description?: string | null;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  skillLevel: SkillLevel;
  maxPlayers: number;
  priceLabel?: string | null;
  status: SessionStatus;
  sportType: SportType;
  createdAt: string;
  updatedAt: string;

  // Derived fields in API responses
  joinedCount?: number;
  availableSlots?: number;
  isJoinedByCurrentUser?: boolean;
  host?: HostProfileDTO & { user?: UserDTO };
  venue?: VenueDTO;
  participants?: SessionParticipantDTO[];
}

// Request/Response types
export interface AuthLoginRequest {
  phone: string;
  name?: string;
}

export interface AuthLoginResponse {
  user: UserDTO;
  token: string;
}

export interface CreateSessionRequest {
  venueId: string;
  title: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  skillLevel: SkillLevel;
  maxPlayers: number;
  description?: string;
  priceLabel?: string;
}

export interface JoinSessionRequest {
  // Empty body, user determined from auth
}

export interface ConfirmAttendanceRequest {
  attendanceStatus: 'confirmed' | 'declined';
}

export interface RemoveParticipantRequest {
  participantId: string;
}

// Filter types
export interface SessionFilterParams {
  city?: string;
  district?: string;
  date?: string; // ISO date or date range
  skillLevel?: SkillLevel;
  hostId?: string;
  onlyOpen?: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Error response
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
}
