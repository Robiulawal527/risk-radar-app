import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, Crosshair, Layers, Menu, Navigation, Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { api } from '../../src/api';
import { GlassCard } from '../../src/components/GlassCard';
import { RiskBadge } from '../../src/components/RiskBadge';
import { colors, radius, riskColor } from '../../src/theme';

type HeatPoint = {
  area: string;
  latitude: number;
  longitude: number;
  total: number;
  riskScore: number;
  riskLevel: string;
};

const fallbackData: HeatPoint[] = [
  { area: 'Dhanmondi', latitude: 23.7465, longitude: 90.376, total: 14, riskScore: 78, riskLevel: 'High Risk' },
  { area: 'Mirpur', latitude: 23.8069, longitude: 90.3687, total: 9, riskScore: 65, riskLevel: 'Medium Risk' },
  { area: 'Gulshan', latitude: 23.7925, longitude: 90.4078, total: 6, riskScore: 48, riskLevel: 'Medium Risk' },
  { area: 'Uttara', latitude: 23.8759, longitude: 90.3795, total: 8, riskScore: 58, riskLevel: 'Medium Risk' },
];

export default function MapScreen() {
  const [heatData, setHeatData] = useState<HeatPoint[]>(fallbackData);
  const [selected, setSelected] = useState<HeatPoint>(fallbackData[0]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHeatmap();
  }, []);

  async function loadHeatmap() {
    try {
      const res = await api.get('/crimes/heatmap');
      const clean = Array.isArray(res.data)
        ? res.data.filter((item) => Number(item.latitude) && Number(item.longitude))
        : [];
      if (clean.length > 0) {
        setHeatData(clean);
        setSelected(clean[0]);
      }
    } catch (error) {
      console.log('Using fallback map data');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return heatData;
    return heatData.filter((item) => item.area.toLowerCase().includes(q));
  }, [heatData, search]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: 23.8103, longitude: 90.4125, latitudeDelta: 0.35, longitudeDelta: 0.35 }}
      >
        {filtered.map((item, index) => {
          const color = riskColor(Number(item.riskScore));
          return (
            <View key={`${item.area}-${index}`}>
              <Marker
                coordinate={{ latitude: Number(item.latitude), longitude: Number(item.longitude) }}
                title={item.area}
                description={`Risk score ${item.riskScore}`}
                pinColor={color}
                onPress={() => setSelected(item)}
              />
              <Circle
                center={{ latitude: Number(item.latitude), longitude: Number(item.longitude) }}
                radius={900 + Math.min(1200, Number(item.riskScore) * 16)}
                fillColor={`${color}26`}
                strokeColor={`${color}75`}
                strokeWidth={1}
              />
            </View>
          );
        })}
      </MapView>

      <View style={styles.topBar}>
        <Pressable style={styles.roundButton}>
          <Menu color={colors.text} size={24} />
        </Pressable>
        <View style={styles.searchBox}>
          <Search color={colors.muted} size={18} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search location..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.roundButton} onPress={() => router.push('/(tabs)/alerts')}>
          <Bell color={colors.text} size={22} />
        </Pressable>
      </View>

      <View style={styles.mapTools}>
        <Pressable style={styles.toolButton}><Layers color={colors.text} size={25} /></Pressable>
        <Pressable style={styles.toolButton}><Navigation color={colors.text} size={25} /></Pressable>
        <Pressable style={styles.toolButton}><Crosshair color={colors.text} size={25} /></Pressable>
      </View>

      <GlassCard style={styles.panel}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.label}>Current Area</Text>
            <Text style={styles.area}>{selected.area}</Text>
          </View>
          <RiskBadge score={Number(selected.riskScore)} />
        </View>

        <View style={styles.riskRow}>
          <View>
            <Text style={styles.label}>Risk Score</Text>
            <Text style={styles.score}>{Number(selected.riskScore)}<Text style={styles.outOf}> /100</Text></Text>
          </View>
          <View style={styles.sparkline}>
            {[18, 24, 15, 31, 21, 37, 30, 45].map((h, idx) => (
              <View key={idx} style={[styles.sparkBar, { height: h }]} />
            ))}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.label}>Recent Crimes</Text>
            <Text style={styles.bold}>Theft, Robbery</Text>
          </View>
          <View>
            <Text style={styles.label}>Recommended</Text>
            <Text style={styles.bold}>Avoid after 8 PM</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/safe-route')}>
            <LinearGradient colors={['#0a84ff', '#005ed1']} style={styles.actionGradient}>
              <Text style={styles.actionText}>Find Safe Route</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/report-crime')}>
            <LinearGradient colors={['#ff3838', '#c91520']} style={styles.actionGradient}>
              <Text style={styles.actionText}>Report Crime</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </GlassCard>

      {loading ? (
        <View style={styles.loadingPill}>
          <ActivityIndicator color={colors.text} size="small" />
          <Text style={styles.loadingText}>Loading risk data...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { position: 'absolute', top: 52, left: 18, right: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundButton: { width: 48, height: 48, borderRadius: radius.pill, backgroundColor: colors.glassStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  searchBox: { flex: 1, height: 58, borderRadius: 18, backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, marginLeft: 10 },
  mapTools: { position: 'absolute', right: 17, top: 150, backgroundColor: colors.glassStrong, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  toolButton: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
  panel: { position: 'absolute', left: 18, right: 18, bottom: 16, padding: 20 },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  area: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: 4 },
  riskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 },
  score: { color: colors.red, fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  outOf: { color: colors.muted, fontSize: 22, fontWeight: '800' },
  sparkline: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 48 },
  sparkBar: { width: 8, borderRadius: 6, backgroundColor: colors.red },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  bold: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 5 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionButton: { flex: 1, borderRadius: 18, overflow: 'hidden' },
  actionGradient: { paddingVertical: 17, alignItems: 'center', borderRadius: 18 },
  actionText: { color: colors.text, fontSize: 16, fontWeight: '900' },
  loadingPill: { position: 'absolute', top: 118, alignSelf: 'center', backgroundColor: colors.glassStrong, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: colors.text, fontWeight: '800' },
});
