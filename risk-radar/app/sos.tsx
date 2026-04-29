import { View, Text, Pressable, StyleSheet, Linking, Alert } from "react-native";
import { colors } from "../src/theme";

export default function SosScreen() {
  function callEmergency() {
    Linking.openURL("tel:999");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS</Text>

      <Pressable style={styles.bigButton} onPress={callEmergency}>
        <Text style={styles.sos}>SOS</Text>
      </Pressable>

      <Text style={styles.text}>
        Your location will be shared with emergency contacts
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => Alert.alert("Alert Sent", "Emergency contacts notified")}
      >
        <Text style={styles.buttonText}>I Feel Unsafe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 30,
  },
  bigButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center",
  },
  sos: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "900",
  },
  text: {
    color: colors.muted,
    textAlign: "center",
    marginVertical: 30,
  },
  button: {
    width: "100%",
    backgroundColor: colors.orange,
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
});