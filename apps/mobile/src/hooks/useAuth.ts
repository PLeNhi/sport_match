import { useQuery, useMutation } from '@tanstack/react-query';
import { authAPI, usersAPI, hostsAPI } from '../utils/api';
import { useAuthStore } from '../store/auth.store';
import { setAuthToken, clearAuthToken } from '../utils/api-client';
import { UserDTO } from '@sport-match/shared';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return useMutation({
    mutationFn: (data: { phone: string; name?: string }) => authAPI.mockLogin(data),
    onSuccess: async (response) => {
      await setAuthToken(response.token);
      setUser(response.user, response.token);
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'Login failed');
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return async () => {
    await clearAuthToken();
    clearAuth();
  };
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authAPI.getMe(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (updates: Partial<UserDTO>) => usersAPI.updateMe(updates),
  });
}

export function useHostProfile() {
  return useQuery({
    queryKey: ['host', 'profile'],
    queryFn: () => hostsAPI.getMe(),
  });
}

export function useCreateHostProfile() {
  return useMutation({
    mutationFn: (data: { displayName: string; bio?: string }) =>
      hostsAPI.createProfile(data.displayName, data.bio),
  });
}
