import { create } from 'zustand';
import { UserDTO } from '@sport-match/shared';

interface AuthStore {
  user: UserDTO | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserDTO, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  setUser: (user, token) => {
    set({ user, token, error: null });
  },
  clearAuth: () => {
    set({ user: null, token: null });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
