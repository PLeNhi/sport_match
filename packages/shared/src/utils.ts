/**
 * Validation helpers and utilities
 */
import type { SessionStatus, AttendanceStatus, SessionParticipantDTO } from './types';

export function isValidPhone(phone: string): boolean {
  // Simple validation for Vietnamese phone numbers
  const normalized = phone.replace(/\D/g, '');
  return normalized.length >= 9 && normalized.length <= 12;
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isSessionActive(startTime: string, date: string): boolean {
  const now = new Date();
  const sessionDateTime = new Date(`${date}T${startTime}`);
  return sessionDateTime > now;
}

export function canJoinSession(
  sessionStatus: SessionStatus,
  joinedCount: number,
  maxPlayers: number,
  startTime: string,
  date: string,
  isAlreadyJoined: boolean,
): boolean {
  return (
    sessionStatus === 'open' &&
    joinedCount < maxPlayers &&
    isSessionActive(startTime, date) &&
    !isAlreadyJoined
  );
}

export function getParticipantStatus(
  participants: SessionParticipantDTO[],
  userId: string,
): AttendanceStatus | null {
  const participant = participants.find((p) => p.userId === userId);
  return participant?.attendanceStatus ?? null;
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  // time is in HH:mm format
  return time; // Already formatted correctly
}

export function formatDate(date: string): string {
  const dateObj = new Date(`${date}T00:00:00`);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}
