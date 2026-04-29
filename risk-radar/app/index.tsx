import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors } from "../src/theme";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛡️</Text>

      <Text style={styles.title}>
        Risk <Text style={{ color: colors.red }}>Radar</Text>
      </Text>

      <Text style={styles.subtitle}>
        See the risk. Avoid the danger. Stay ahead.
      </Text>

      <Pressable style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/map")}>
        <Text style={styles.guest}>Continue as Guest</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 90,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 70,
  },
  button: {
    backgroundColor: colors.red,
    padding: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  guest: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 24,
  },
});