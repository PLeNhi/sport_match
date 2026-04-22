import apiClient from './api-client';
import {
  AuthLoginRequest,
  AuthLoginResponse,
  GameSessionDTO,
  SessionFilterParams,
  CreateSessionRequest,
  UserDTO,
} from '@sport-match/shared';

// Auth
export const authAPI = {
  mockLogin: async (data: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const { data: response } = await apiClient.post('/auth/mock-login', data);
    return response;
  },
  getMe: async (): Promise<{ user: UserDTO }> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};

// Sessions
export const sessionsAPI = {
  list: async (filters?: SessionFilterParams): Promise<{ sessions: GameSessionDTO[] }> => {
    const { data } = await apiClient.get('/sessions', { params: filters });
    return data;
  },
  getById: async (id: string): Promise<{ session: GameSessionDTO }> => {
    const { data } = await apiClient.get(`/sessions/${id}`);
    return data;
  },
  create: async (dto: CreateSessionRequest): Promise<{ session: GameSessionDTO }> => {
    const { data } = await apiClient.post('/sessions', dto);
    return data;
  },
  join: async (sessionId: string): Promise<{ participant: any }> => {
    const { data } = await apiClient.post(`/sessions/${sessionId}/join`, {});
    return data;
  },
  leave: async (sessionId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post(`/sessions/${sessionId}/leave`, {});
    return data;
  },
  confirmAttendance: async (sessionId: string, status: 'confirmed' | 'declined'): Promise<any> => {
    const { data } = await apiClient.post(`/sessions/${sessionId}/confirm-attendance`, {
      attendanceStatus: status,
    });
    return data;
  },
  getHostSessions: async (): Promise<{ sessions: GameSessionDTO[] }> => {
    const { data } = await apiClient.get('/sessions/host/me');
    return data;
  },
};

// Venues
export const venuesAPI = {
  list: async (filters?: { city?: string; district?: string }): Promise<{ venues: any[] }> => {
    const { data } = await apiClient.get('/venues', { params: filters });
    return data;
  },
  getById: async (id: string): Promise<{ venue: any }> => {
    const { data } = await apiClient.get(`/venues/${id}`);
    return data;
  },
};

// Users
export const usersAPI = {
  getMe: async (): Promise<{ user: UserDTO }> => {
    const { data } = await apiClient.get('/users/me');
    return data;
  },
  updateMe: async (updates: Partial<UserDTO>): Promise<{ user: UserDTO }> => {
    const { data } = await apiClient.patch('/users/me', updates);
    return data;
  },
};

// Hosts
export const hostsAPI = {
  getMe: async (): Promise<{ profile: any }> => {
    const { data } = await apiClient.get('/hosts/me');
    return data;
  },
  createProfile: async (displayName: string, bio?: string): Promise<{ profile: any }> => {
    const { data } = await apiClient.post('/hosts/me/create-profile', {
      displayName,
      bio,
    });
    return data;
  },
};
