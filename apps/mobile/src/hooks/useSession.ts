import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsAPI, venuesAPI } from "../utils/api";
import { GameSessionDTO, SessionFilterParams } from "@sport-match/shared";

// Query keys
export const sessionKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionKeys.all, "list"] as const,
  list: (filters?: SessionFilterParams) =>
    [...sessionKeys.lists(), filters] as const,
  details: () => [...sessionKeys.all, "detail"] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  hostSessions: () => [...sessionKeys.all, "host"] as const,
};

export const venueKeys = {
  all: ["venues"] as const,
  lists: () => [...venueKeys.all, "list"] as const,
  list: (filters?: any) => [...venueKeys.lists(), filters] as const,
};

// Session hooks
export function useSessionsList(filters?: SessionFilterParams) {
  return useQuery({
    queryKey: sessionKeys.list(filters),
    queryFn: () => sessionsAPI.list(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useSessionDetail(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionsAPI.getById(id),
    staleTime: 10 * 1000, // 10 seconds
  });
}

export function useHostSessions() {
  return useQuery({
    queryKey: sessionKeys.hostSessions(),
    queryFn: () => sessionsAPI.getHostSessions(),
    staleTime: 30 * 1000,
  });
}

export function useJoinSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsAPI.join(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

export function useLeaveSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsAPI.leave(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

export function useConfirmAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      status,
    }: {
      sessionId: string;
      status: "confirmed" | "declined";
    }) => sessionsAPI.confirmAttendance(sessionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.details() });
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => sessionsAPI.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.hostSessions() });
    },
  });
}

// Venue hooks
export function useVenuesList(filters?: any) {
  return useQuery({
    queryKey: venueKeys.list(filters),
    queryFn: () => venuesAPI.list(filters),
    staleTime: 60 * 60 * 1000, // 1 hour - venues change rarely
  });
}
