import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { GameSessionDTO } from "@sport-match/shared";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatTime } from "@sport-match/shared";

interface SessionCardProps {
  session: GameSessionDTO;
  onPress: () => void;
  showJoinAction?: boolean;
  style?: ViewStyle;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onPress,
  showJoinAction = false,
  style,
}) => {
  const joinLabel =
    session.status === "full"
      ? "Full"
      : session.isJoinedByCurrentUser
        ? "Joined"
        : "Join";

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.level}>{session.skillLevel}</Text>
        </View>
        <StatusBadge status={session.status} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>📍 Venue</Text>
          <Text style={styles.value}>{session.venue?.name || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Date & Time</Text>
          <Text style={styles.value}>
            {formatDate(session.date)} at {formatTime(session.startTime)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>👥 Players</Text>
          <Text style={styles.value}>
            {session.joinedCount}/{session.maxPlayers}
          </Text>
        </View>

        {session.priceLabel && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>💰 Price</Text>
            <Text style={styles.value}>{session.priceLabel}</Text>
          </View>
        )}
      </View>

      {showJoinAction && (
        <View style={styles.footer}>
          <Text style={styles.actionLabel}>{joinLabel}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  level: {
    fontSize: 12,
    color: "#0066cc",
    fontWeight: "500",
  },
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    color: "#333",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionLabel: {
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "600",
    textAlign: "center",
  },
});
