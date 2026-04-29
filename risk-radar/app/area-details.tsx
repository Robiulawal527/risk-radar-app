import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import MapView, { Polygon } from "react-native-maps";
import { Share2 } from "lucide-react-native";
import { safeGet } from "../src/api";
import { colors } from "../src/theme";
import { Card } from "../src/components/Card";
import { RiskBadge } from "../src/components/RiskBadge";
import { PrimaryButton } from "../src/components/PrimaryButton";
export default function AreaDetails() {
  const { area = "Dhanmondi" } = useLocalSearchParams();
  const [d, setD] = useState<any>(null);
  useEffect(() => {
    safeGet(`/crimes/area/${area}`, null).then(setD);
  }, [area]);
  const lat = d?.latitude || 23.7465,
    lng = d?.longitude || 90.376;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.back} onPress={() => router.back()}>
          ‹
        </Text>
        <Text style={styles.title}>Area Details</Text>
        <Share2 color="#fff" />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.035,
          longitudeDelta: 0.035,
        }}
      >
        <Polygon
          coordinates={[
            { latitude: lat + 0.012, longitude: lng - 0.014 },
            { latitude: lat + 0.018, longitude: lng + 0.012 },
            { latitude: lat - 0.005, longitude: lng + 0.018 },
            { latitude: lat - 0.018, longitude: lng - 0.008 },
          ]}
          fillColor="rgba(255,43,43,.22)"
          strokeColor={colors.red}
          strokeWidth={2}
        />
      </MapView>
      <Card style={{ margin: 16, marginTop: -26 }}>
        <View style={styles.row}>
          <Text style={styles.area}>{d?.area || area}</Text>
          <RiskBadge level={d?.riskLevel || "Medium Risk"} />
        </View>
        <Text style={styles.label}>Risk Score</Text>
        <Text style={styles.score}>
          {d?.riskScore || 65}
          <Text style={styles.out}> /100</Text>
        </Text>
        <Text style={styles.heading}>Recent Crimes</Text>
        {(d?.recentCrimes || []).map((c: any) => (
          <View key={c.id} style={styles.crime}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>{c.type}</Text>
            <Text style={{ color: colors.muted }}>
              {c.count} cases • {c.time}
            </Text>
          </View>
        ))}
        <PrimaryButton
          title="View Full Report"
          onPress={() => router.push("/(tabs)/dashboard")}
        />
      </Card>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    height: 88,
    paddingTop: 46,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { fontSize: 42, color: "#fff" },
  title: { color: "#fff", fontWeight: "900", fontSize: 18 },
  map: { height: 260 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  area: { color: "#fff", fontSize: 28, fontWeight: "900" },
  label: { color: colors.muted, marginTop: 14 },
  score: { color: colors.orange, fontSize: 36, fontWeight: "900" },
  out: { color: colors.muted, fontSize: 18 },
  heading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 10,
  },
  crime: {
    backgroundColor: colors.card2,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
