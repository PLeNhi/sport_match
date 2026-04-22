import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { PrimaryButton, LoadingView, StatusBadge } from '../components';
import { useSessionDetail } from '../hooks/useSession';
import { formatDate, formatTime } from '@sport-match/shared';

export function HostSessionDetailScreen({ route, navigation }: any) {
  const { sessionId } = route.params;
  const { data, isLoading } = useSessionDetail(sessionId);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{session.title}</Text>
            <StatusBadge status={session.status} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(session.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Skill Level</Text>
            <Text style={styles.value}>{session.skillLevel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Players</Text>
            <Text style={styles.value}>
              {session.joinedCount}/{session.maxPlayers}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participants ({session.participants?.length || 0})
          </Text>
          {session.participants && session.participants.length > 0 ? (
            <FlatList
              data={session.participants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.participantRow}>
                  <View>
                    <Text style={styles.participantName}>
                      {item.userId} {/* TODO: Show user name when available */}
                    </Text>
                    <Text style={styles.participantStatus}>
                      {item.attendanceStatus}
                    </Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No participants yet</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <PrimaryButton title="Edit Session" onPress={() => {}} style={styles.button} />
        <PrimaryButton
          title="Cancel Session"
          variant="danger"
          onPress={() => {}}
          style={styles.button}
        />
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    flex: 1,
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
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  participantRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  participantStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
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
