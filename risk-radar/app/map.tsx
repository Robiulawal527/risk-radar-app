import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { router } from "expo-router";
import { colors } from "../src/theme";

const crimes = [
  {
    id: 1,
    area: "Dhanmondi",
    latitude: 23.7465,
    longitude: 90.376,
    risk: 78,
  },
  {
    id: 2,
    area: "Mirpur",
    latitude: 23.8069,
    longitude: 90.3687,
    risk: 65,
  },
  {
    id: 3,
    area: "Gulshan",
    latitude: 23.7925,
    longitude: 90.4078,
    risk: 48,
  },
];

export default function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 23.7465,
          longitude: 90.376,
          latitudeDelta: 0.13,
          longitudeDelta: 0.13,
        }}
      >
        {crimes.map((crime) => (
          <Marker
            key={crime.id}
            coordinate={{
              latitude: crime.latitude,
              longitude: crime.longitude,
            }}
            title={crime.area}
            description={`Risk Score: ${crime.risk}`}
            onCalloutPress={() =>
              router.push({
                pathname: "/area-details",
                params: { area: crime.area },
              })
            }
          />
        ))}

        {crimes.map((crime) => (
          <Circle
            key={`circle-${crime.id}`}
            center={{
              latitude: crime.latitude,
              longitude: crime.longitude,
            }}
            radius={1200}
            fillColor="rgba(255, 0, 0, 0.25)"
            strokeColor="rgba(255, 0, 0, 0.6)"
          />
        ))}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.label}>Current Area</Text>
        <Text style={styles.area}>Dhanmondi</Text>
        <Text style={styles.score}>Risk Score: 78 / 100</Text>

        <View style={styles.row}>
          <Pressable style={styles.blueBtn} onPress={() => router.push("/safe-route")}>
            <Text style={styles.btnText}>Find Safe Route</Text>
          </Pressable>

          <Pressable style={styles.redBtn} onPress={() => router.push("/report-crime")}>
            <Text style={styles.btnText}>Report Crime</Text>
          </Pressable>
        </View>

        <Pressable style={styles.sosBtn} onPress={() => router.push("/sos")}>
          <Text style={styles.btnText}>SOS</Text>
        </Pressable>

        <View style={styles.nav}>
          <Pressable onPress={() => router.push("/dashboard")}>
            <Text style={styles.navText}>Dashboard</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/alerts")}>
            <Text style={styles.navText}>Alerts</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/profile")}>
            <Text style={styles.navText}>Profile</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "rgba(6,17,28,0.96)",
    padding: 18,
    borderRadius: 18,
  },
  label: {
    color: colors.muted,
  },
  area: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  score: {
    color: colors.red,
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  blueBtn: {
    flex: 1,
    backgroundColor: colors.blue,
    padding: 14,
    borderRadius: 10,
  },
  redBtn: {
    flex: 1,
    backgroundColor: colors.red,
    padding: 14,
    borderRadius: 10,
  },
  sosBtn: {
    backgroundColor: colors.red,
    padding: 14,
    borderRadius: 999,
    marginTop: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
  },
  navText: {
    color: colors.muted,
    fontWeight: "700",
  },
});