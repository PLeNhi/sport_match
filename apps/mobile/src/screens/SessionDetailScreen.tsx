import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { PrimaryButton, StatusBadge, LoadingView } from '../components';
import { useSessionDetail, useJoinSession, useLeaveSession, useConfirmAttendance } from '../hooks/useSession';
import { useAuthStore } from '../store/auth.store';
import { formatDate, formatTime } from '@sport-match/shared';

export function SessionDetailScreen({ route, navigation }: any) {
  const { sessionId } = route.params;
  const { data, isLoading, refetch } = useSessionDetail(sessionId);
  const joinSession = useJoinSession();
  const leaveSession = useLeaveSession();
  const confirmAttendance = useConfirmAttendance();
  const user = useAuthStore((state) => state.user);

  const session = data?.session;

  if (isLoading) {
    return <LoadingView message="Loading session..." />;
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
      </SafeAreaView>
    );
  }

  const handleJoin = async () => {
    joinSession.mutate(sessionId, {
      onSuccess: () => {
        refetch();
        alert('Joined session successfully!');
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || 'Failed to join session');
      },
    });
  };

  const handleLeave = async () => {
    leaveSession.mutate(sessionId, {
      onSuccess: () => {
        refetch();
        alert('Left session');
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || 'Failed to leave session');
      },
    });
  };

  const handleConfirm = async () => {
    confirmAttendance.mutate(
      { sessionId, status: 'confirmed' },
      {
        onSuccess: () => {
          refetch();
          alert('Attendance confirmed!');
        },
        onError: (error: any) => {
          alert(error?.response?.data?.message || 'Failed to confirm');
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{session.title}</Text>
            <StatusBadge status={session.status} />
          </View>
          <Text style={styles.level}>{session.skillLevel} Level</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Date</Text>
            <Text style={styles.value}>{formatDate(session.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🕒 Time</Text>
            <Text style={styles.value}>
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Venue</Text>
            <Text style={styles.value}>{session.venue?.name}</Text>
          </View>
          {session.priceLabel && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>💰 Price</Text>
              <Text style={styles.value}>{session.priceLabel}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>👥 Joined</Text>
            <Text style={styles.value}>
              {session.joinedCount} / {session.maxPlayers}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🔓 Available</Text>
            <Text style={styles.value}>{session.availableSlots}</Text>
          </View>
        </View>

        {session.host && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Host</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>👤 Name</Text>
              <Text style={styles.value}>{session.host.name}</Text>
            </View>
            {session.host.displayName && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>🏢 Organization</Text>
                <Text style={styles.value}>{session.host.displayName}</Text>
              </View>
            )}
          </View>
        )}

        {session.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{session.description}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.actions}>
        {session.isJoinedByCurrentUser ? (
          <>
            <PrimaryButton
              title="Confirm Attendance"
              onPress={handleConfirm}
              loading={confirmAttendance.isPending}
              style={styles.button}
            />
            <PrimaryButton
              title="Leave Session"
              onPress={handleLeave}
              loading={leaveSession.isPending}
              variant="secondary"
              style={styles.button}
            />
          </>
        ) : (
          <PrimaryButton
            title="Join Session"
            onPress={handleJoin}
            loading={joinSession.isPending}
            disabled={session.status === 'full'}
            style={styles.button}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  level: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  button: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 20,
  },
});
