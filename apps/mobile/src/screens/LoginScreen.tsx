import React from "react";
import { View, ScrollView, Text, StyleSheet, TextInput } from "react-native";
import { PrimaryButton, LoadingView } from "../components";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";

export function LoginScreen() {
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const login = useLogin();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    login.mutate({ phone, name });
  };

  if (login.isPending) {
    return <LoadingView message="Logging in..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🎾 Sport Match</Text>
        <Text style={styles.subtitle}>Find your badminton game</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!login.isPending}
        />

        <Text style={styles.label}>Name (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          editable={!login.isPending}
        />

        {login.error && <Text style={styles.errorText}>{login.error}</Text>}

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          loading={login.isPending}
          style={styles.button}
        />

        <Text style={styles.infoText}>
          💡 This is a demo login. Use any phone number to continue.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  button: {
    marginTop: 24,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
});
