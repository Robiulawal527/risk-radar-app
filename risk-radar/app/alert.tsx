import { View, Text, StyleSheet } from "react-native";
import { colors } from "../src/theme";

const alerts = [
  ["High Risk Alert", "You entered a high-risk zone"],
  ["Crowd Alert", "Large crowd detected nearby"],
  ["Safety Update", "Risk level improved in Gulshan"],
];

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alerts</Text>

      {alerts.map(([title, body]) => (
        <View key={title} style={styles.card}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      ))}
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
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.red,
    fontWeight: "900",
    fontSize: 18,
  },
  body: {
    color: colors.muted,
    marginTop: 6,
  },
});