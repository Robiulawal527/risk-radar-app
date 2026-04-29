import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { colors } from "../src/theme";

export default function SafeRouteScreen() {
  const safeRoute = [
    { latitude: 23.7465, longitude: 90.376 },
    { latitude: 23.7565, longitude: 90.386 },
    { latitude: 23.7665, longitude: 90.396 },
  ];

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 23.7565,
          longitude: 90.386,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        <Polyline coordinates={safeRoute} strokeWidth={6} strokeColor="#36c946" />
        <Marker coordinate={safeRoute[0]} title="Your Location" />
        <Marker coordinate={safeRoute[2]} title="Destination" />
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.title}>Safest Route Found</Text>
        <Text style={styles.text}>Estimated Time: 24 mins</Text>
        <Text style={styles.text}>Avoided: 3 High Risk Zones</Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start Navigation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 18,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  text: {
    color: colors.muted,
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.red,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
});