import React from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SessionCard, LoadingView, EmptyState } from "../components";
import { useSessionsList } from "../hooks/useSession";
import { GameSessionDTO } from "@sport-match/shared";

export function HomeScreen({ navigation }: any) {
  const { data, isLoading, refetch } = useSessionsList({
    onlyOpen: true,
  });

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
    return <LoadingView message="Loading sessions..." />;
  }

  const sessions = data?.sessions || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Sessions</Text>
        <Text style={styles.subtitle}>Find your next game</Text>
      </View>

      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions available"
          message="Check back soon or create your own!"
          icon="🎾"
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={() => handleSessionPress(item)}
              showJoinAction
            />
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled
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
