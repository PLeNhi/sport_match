import React from "react";
import { View, ScrollView, StyleSheet, Text, SafeAreaView } from "react-native";
import { PrimaryButton, LoadingView } from "../components";
import { useAuthStore } from "../store/auth.store";
import { useLogout } from "../hooks/useAuth";
import { clearAuthToken } from "../utils/api-client";

export function ProfileScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await clearAuthToken();
      clearAuth();
      // Navigation will handle redirecting to login
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleBecomeHost = () => {
    navigation.navigate("BecomeHost");
  };

  if (!user) {
    return <LoadingView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>👤 Role</Text>
            <Text style={styles.value}>{user.role}</Text>
          </View>
          {user.location && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>🏙️ City</Text>
                <Text style={styles.value}>{user.location.city}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>📍 District</Text>
                <Text style={styles.value}>{user.location.district}</Text>
              </View>
            </>
          )}
        </View>

        {user.role === "player" && (
          <PrimaryButton
            title="Become a Host"
            onPress={handleBecomeHost}
            style={styles.button}
          />
        )}

        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          loading={isLoggingOut}
          variant="danger"
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  phone: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    marginBottom: 12,
  },
});
