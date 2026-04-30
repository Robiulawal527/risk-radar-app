import { BellRing, Radar, ShieldAlert } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { api } from '../../src/api';
import { AppleHeader } from '../../src/components/AppleHeader';
import { GlassCard } from '../../src/components/GlassCard';
import { RiskBadge } from '../../src/components/RiskBadge';
import { Screen } from '../../src/components/Screen';
import { colors, radii } from '../../src/theme';
import type { AlertItem } from '../../src/types';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/alerts');
        setAlerts(res.data);
      } catch {
        Alert.alert('Alerts failed', 'Could not load alerts from backend.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.red} />
          <Text style={styles.loading}>Scanning active alerts...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppleHeader eyebrow="Proactive safety" title="Alerts" subtitle="High-risk area notifications generated from the live database." />

      <GlassCard style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <Radar color={colors.red} size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{alerts.length} active warnings</Text>
            <Text style={styles.heroSub}>Risk Radar monitors nearby hotspots and severe area activity.</Text>
          </View>
        </View>
      </GlassCard>

      {alerts.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <BellRing color={colors.green} size={30} />
          <Text style={styles.emptyTitle}>No critical alerts</Text>
          <Text style={styles.emptyText}>You are clear based on the current MySQL risk analysis.</Text>
        </GlassCard>
      ) : (
        alerts.map((item) => (
          <GlassCard key={`${item.id}-${item.area}`} style={styles.alertCard}>
            <View style={styles.alertRow}>
              <View style={styles.alertIcon}>
                <ShieldAlert color={colors.red} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.alertBody}>{item.body}</Text>
                <Text style={styles.alertArea}>{item.area}</Text>
              </View>
              <RiskBadge score={item.riskScore || 70} />
            </View>
          </GlassCard>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    color: colors.muted,
    marginTop: 12,
  },
  heroCard: {
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,59,48,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  heroSub: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 20,
  },
  alertCard: {
    marginTop: 12,
  },
  alertRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  alertIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,59,48,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 17,
  },
  alertBody: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 20,
  },
  alertArea: {
    color: colors.cyan,
    marginTop: 8,
    fontWeight: '900',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 12,
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
