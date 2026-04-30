import { router } from 'expo-router';
import { ArrowLeft, Navigation, Route } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../src/api';
import { ActionButton } from '../src/components/ActionButton';
import { GlassCard } from '../src/components/GlassCard';
import { SafeRouteMap } from '../src/components/SafeRouteMap';
import { getCurrentLocation } from '../src/location';
import { calculateSafeRoute } from '../src/safeRoute';
import { colors, radii, riskColor } from '../src/theme';
import type { HeatmapArea, LatLng } from '../src/types';

export default function SafeRouteScreen() {
  const [zones, setZones] = useState<HeatmapArea[]>([]);
  const [from, setFrom] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<HeatmapArea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [location, heatmap] = await Promise.all([getCurrentLocation(), api.get('/crimes/heatmap')]);
        const cleanZones = heatmap.data
          .map((item: HeatmapArea) => ({
            ...item,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            riskScore: Number(item.riskScore),
            total: Number(item.total),
          }))
          .filter((item: HeatmapArea) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

        setFrom(location);
        setZones(cleanZones);
        setDestination(cleanZones[0] || null);
      } catch {
        Alert.alert('Safe route failed', 'Could not load route data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const route = useMemo(() => {
    if (!from || !destination) return null;
    return calculateSafeRoute(
      from,
      { latitude: destination.latitude, longitude: destination.longitude },
      zones
    );
  }, [from, destination, zones]);

  if (loading || !from || !destination || !route) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.green} size="large" />
        <Text style={styles.loading}>Calculating safest route...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeRouteMap
        from={from}
        to={{ latitude: destination.latitude, longitude: destination.longitude }}
        route={route.coordinates}
        zones={zones}
      />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={colors.white} size={22} />
        </Pressable>
        <GlassCard style={styles.topCard}>
          <Text style={styles.topTitle}>Safe Route</Text>
          <Text style={styles.topSub}>Avoiding high-risk clusters</Text>
        </GlassCard>
      </View>

      <View style={styles.bottomPanel}>
        <GlassCard>
          <View style={styles.routeHeader}>
            <View style={styles.routeIcon}>
              <Route color={colors.green} size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.destination}>To {destination.area}</Text>
              <Text style={styles.subtitle}>Estimated route risk: {route.estimatedRisk}</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.areaList}>
            {zones.slice(0, 18).map((zone) => (
              <Pressable
                key={zone.area}
                onPress={() => setDestination(zone)}
                style={[
                  styles.areaChip,
                  destination.area === zone.area && styles.activeAreaChip,
                  { borderColor: destination.area === zone.area ? riskColor(zone.riskScore) : colors.stroke },
                ]}
              >
                <Text style={styles.areaName}>{zone.area}</Text>
                <Text style={[styles.areaRisk, { color: riskColor(zone.riskScore) }]}>{Math.round(zone.riskScore)}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ActionButton title="Start navigation" variant="green" icon={<Navigation color="#fff" size={18} />} onPress={() => Alert.alert('Navigation', 'Connect Google Directions API later for live turn-by-turn navigation.')} />
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    color: colors.muted,
    marginTop: 12,
  },
  topBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  topCard: {
    flex: 1,
    borderRadius: 26,
  },
  topTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  topSub: {
    color: colors.muted,
    marginTop: 3,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 24,
    left: 14,
    right: 14,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50,215,75,0.16)',
  },
  destination: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 5,
  },
  areaList: {
    gap: 10,
    paddingVertical: 16,
  },
  areaChip: {
    minWidth: 112,
    borderRadius: radii.lg,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    padding: 12,
  },
  activeAreaChip: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  areaName: {
    color: colors.text,
    fontWeight: '900',
  },
  areaRisk: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '900',
  },
});
