import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { api } from "../src/api";
import { colors } from "../src/theme";

export default function ReportCrimeScreen() {
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [description, setDescription] = useState("");

  async function submitReport() {
    try {
      await api.post("/crimes", {
        type,
        area,
        latitude: 23.7465,
        longitude: 90.376,
        severity,
        description,
      });

      Alert.alert("Success", "Crime report submitted");
    } catch {
      Alert.alert("Error", "Could not submit report");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Crime</Text>

      <TextInput
        placeholder="Crime type"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setType}
      />

      <TextInput
        placeholder="Area"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setArea}
      />

      <View style={styles.row}>
        {["low", "medium", "high"].map((item) => (
          <Pressable
            key={item}
            style={[styles.severity, severity === item && styles.active]}
            onPress={() => setSeverity(item)}
          >
            <Text style={styles.severityText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Description"
        placeholderTextColor="#888"
        multiline
        style={[styles.input, { height: 130 }]}
        onChangeText={setDescription}
      />

      <Pressable style={styles.button} onPress={submitReport}>
        <Text style={styles.buttonText}>Submit Report</Text>
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
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 25,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  severity: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.red,
  },
  severityText: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "700",
  },
  button: {
    backgroundColor: colors.red,
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
});