import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  SessionCard,
  LoadingView,
  EmptyState,
  PrimaryButton,
} from "../components";
import { useHostSessions } from "../hooks/useSession";
import { useHostProfile } from "../hooks/useAuth";
import { GameSessionDTO } from "@sport-match/shared";

export function HostDashboardScreen({ navigation }: any) {
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useHostSessions();
  const { data: profileData, isLoading: profileLoading } = useHostProfile();

  useFocusEffect(
    React.useCallback(() => {
      refetchSessions();
    }, [refetchSessions]),
  );

  const handleSessionPress = (session: GameSessionDTO) => {
    navigation.navigate("HostSessionDetail", { sessionId: session.id });
  };

  const handleCreateSession = () => {
    navigation.navigate("CreateSession");
  };

  if (sessionsLoading || profileLoading) {
    return <LoadingView message="Loading dashboard..." />;
  }

  const sessions = sessionsData?.sessions || [];
  const openSessions = sessions.filter((s) => s.status === "open").length;
  const upcomingSessions = sessions.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Host Dashboard</Text>
        <Text style={styles.subtitle}>
          {profileData?.profile?.displayName || "Your Sessions"}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.stat, styles.statOpen]}>
          <Text style={styles.statNumber}>{openSessions}</Text>
          <Text style={styles.statLabel}>Open</Text>
        </View>
        <View style={[styles.stat, styles.statUpcoming]}>
          <Text style={styles.statNumber}>{upcomingSessions}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <PrimaryButton
        title="Create New Session"
        onPress={handleCreateSession}
        style={styles.createButton}
      />

      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions created yet"
          message="Tap 'Create New Session' to host your first game"
          icon="🎯"
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={() => handleSessionPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  stat: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statOpen: {
    backgroundColor: "#34C759",
  },
  statUpcoming: {
    backgroundColor: "#0066cc",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  createButton: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
