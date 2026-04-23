import React from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SessionCard, LoadingView, EmptyState } from "../components";
import { useSessionsList } from "../hooks/useSession";
import { GameSessionDTO } from "@sport-match/shared";

export function MySessionsScreen({ navigation }: any) {
  const { data, isLoading, refetch } = useSessionsList();

  // Refetch when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleSessionPress = (session: GameSessionDTO) => {
    navigation.navigate("SessionDetail", { sessionId: session.id });
  };

  if (isLoading) {
    return <LoadingView message="Loading your sessions..." />;
  }

  const sessions = data?.sessions?.filter((s) => s.isJoinedByCurrentUser) || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Sessions</Text>
        <Text style={styles.subtitle}>{sessions.length} sessions joined</Text>
      </View>

      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions joined yet"
          message="Browse available sessions to join one"
          icon="📋"
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
