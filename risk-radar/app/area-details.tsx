import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../src/theme";

export default function AreaDetailsScreen() {
  const { area = "Mirpur 10" } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{area}</Text>
      <Text style={styles.badge}>Medium Risk</Text>

      <Text style={styles.label}>Risk Score</Text>
      <Text style={styles.score}>65 / 100</Text>

      <Text style={styles.heading}>Recent Crimes</Text>

      <Text style={styles.item}>🟢 Theft — 8:30 PM</Text>
      <Text style={styles.item}>🔴 Robbery — 10:15 PM</Text>
      <Text style={styles.item}>🟠 Harassment — 7:00 PM</Text>

      <Pressable style={styles.button} onPress={() => router.push("/dashboard")}>
        <Text style={styles.buttonText}>View Full Report</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    paddingTop: 70,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  badge: {
    color: colors.orange,
    marginVertical: 16,
    fontWeight: "900",
  },
  label: {
    color: colors.muted,
  },
  score: {
    color: colors.orange,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 25,
  },
  heading: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  item: {
    color: colors.text,
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.red,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
});