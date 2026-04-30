import { router } from 'expo-router';
import { BellRing, LocateFixed, Navigation, RefreshCw, ShieldAlert } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '../../src/api';
import { ActionButton } from '../../src/components/ActionButton';
import { GlassCard } from '../../src/components/GlassCard';
import { NativeRiskMap } from '../../src/components/NativeRiskMap';
import { RiskBadge } from '../../src/components/RiskBadge';
import { getCurrentLocation, getNearestDangerZone } from '../../src/location';
import { colors, radii, riskColor } from '../../src/theme';
import type { HeatmapArea, LatLng } from '../../src/types';

export default function MapScreen() {
  const [zones, setZones] = useState<HeatmapArea[]>([]);
  const [location, setLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<HeatmapArea | null>(null);
  const [hasWarned, setHasWarned] = useState(false);

  async function load() {
    try {
      setRefreshing(true);
      const [pos, heatmap] = await Promise.all([getCurrentLocation(), api.get('/crimes/heatmap')]);
      const cleanZones = heatmap.data
        .map((item: HeatmapArea) => ({
          ...item,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          riskScore: Number(item.riskScore),
          total: Number(item.total),
        }))
        .filter((item: HeatmapArea) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

      setLocation(pos);
      setZones(cleanZones);
      setSelected(cleanZones[0] || null);

      const danger = getNearestDangerZone(pos, cleanZones, 900);
      if (danger && !hasWarned) {
        setHasWarned(true);
        Alert.alert('High risk nearby', `${danger.area} is within ${Math.round(danger.distance)}m with risk score ${Math.round(danger.riskScore)}.`);
      }
    } catch (error) {
      Alert.alert('Map data failed', 'Could not load map risk data. Make sure backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const highestRisk = useMemo(() => {
    return [...zones].sort((a, b) => Number(b.riskScore) - Number(a.riskScore))[0];
  }, [zones]);

  if (loading || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={styles.loadingText}>Calibrating your safety radar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NativeRiskMap zones={zones} userLocation={location} onSelectArea={(item) => setSelected(item)} />

      <View style={styles.topHud}>
        <GlassCard style={styles.hudCard}>
          <View style={styles.hudRow}>
            <View style={styles.hudIcon}>
              <LocateFixed color={colors.cyan} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hudTitle}>Risk Radar Live</Text>
              <Text style={styles.hudSub}>Dhaka city safety heatmap</Text>
            </View>
            <Pressable onPress={load} style={styles.refreshButton}>
              <RefreshCw color={refreshing ? colors.orange : colors.white} size={18} />
            </Pressable>
          </View>
        </GlassCard>
      </View>

      <View style={styles.bottomPanel}>
        <GlassCard style={styles.panelCard}>
          <View style={styles.panelTop}>
            <View>
              <Text style={styles.label}>Selected Area</Text>
              <Text style={styles.area}>{selected?.area || highestRisk?.area || 'Dhaka'}</Text>
            </View>
            <RiskBadge score={Number(selected?.riskScore || highestRisk?.riskScore || 0)} />
          </View>

          <View style={styles.riskBarOuter}>
            <View
              style={[
                styles.riskBarInner,
                {
                  width: `${Math.min(100, Number(selected?.riskScore || 0))}%`,
                  backgroundColor: riskColor(Number(selected?.riskScore || 0)),
                },
              ]}
            />
          </View>

          <Text style={styles.panelText}>
            {selected?.total || 0} reports analyzed. Tap an area marker to inspect risk details and predictions.
          </Text>

          <View style={styles.actionGrid}>
            <ActionButton
              title="Safe Route"
              variant="green"
              icon={<Navigation color="#fff" size={18} />}
              onPress={() => router.push('/safe-route')}
              style={styles.actionButton}
            />
            <ActionButton
              title="SOS"
              icon={<ShieldAlert color="#fff" size={18} />}
              onPress={() => Alert.alert('Emergency', 'Call 999 or notify your trusted contacts immediately.')}
              style={styles.actionButton}
            />
          </View>

          <Pressable
            onPress={() => selected && router.push({ pathname: '/area-details', params: { area: selected.area } })}
            style={styles.detailsButton}
          >
            <BellRing color={colors.cyan} size={18} />
            <Text style={styles.detailsText}>Open area intelligence</Text>
          </Pressable>
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
    padding: 24,
  },
  loadingText: {
    color: colors.muted,
    marginTop: 14,
    fontWeight: '700',
  },
  topHud: {
    position: 'absolute',
    top: 58,
    left: 16,
    right: 16,
  },
  hudCard: {
    borderRadius: 30,
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hudIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(100,210,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  hudSub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottomPanel: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 108,
  },
  panelCard: {
    borderRadius: 32,
  },
  panelTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  area: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 4,
  },
  riskBarOuter: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 18,
    overflow: 'hidden',
  },
  riskBarInner: {
    height: '100%',
    borderRadius: radii.pill,
  },
  panelText: {
    color: colors.muted,
    marginTop: 12,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  detailsButton: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(100,210,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(100,210,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  detailsText: {
    color: colors.cyan,
    fontWeight: '900',
  },
});
