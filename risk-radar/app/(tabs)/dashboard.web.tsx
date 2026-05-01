import { BrainCircuit, Flame, ShieldCheck, TrendingUp } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { api } from '../../src/api';
import { GlassCard } from '../../src/components/GlassCard';
import { RiskBadge } from '../../src/components/RiskBadge';
import { colors, radii, riskColor } from '../../src/theme';
import type { DashboardData } from '../../src/types';

type PredictionOverview = {
  city: string;
  predictedRisk: number;
  confidence: number;
  message: string;
  topAreas: Array<{ area: string; predictedRisk: number; confidence: number }>;
};

export default function DashboardWebScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [prediction, setPrediction] = useState<PredictionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashboard, pred] = await Promise.all([
          api.get('/dashboard'),
          api.get('/prediction/overview').catch(() => ({ data: null })),
        ]);
        setData(dashboard.data);
        setPrediction(pred.data);
      } catch {
        Alert.alert('Dashboard failed', 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxAreaRisk = useMemo(() => {
    if (!data?.byArea?.length) return 1;
    return Math.max(...data.byArea.map((item) => Number(item.riskScore) || 0), 1);
  }, [data]);

  if (loading) {
    return (
      <View style={styles.page}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.cyan} size="large" />
          <Text style={styles.loading}>Loading web intelligence panel...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.wrap}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Web Command Center</Text>
            <Text style={styles.title}>Risk Intelligence Dashboard</Text>
            <Text style={styles.subtitle}>Purpose-built React web UI for clearer analytics and faster scanning.</Text>
          </View>
          <RiskBadge score={prediction?.predictedRisk || 0} />
        </View>

        <View style={styles.metricGrid}>
          <MetricCard label="Total reports" value={data?.totalCrimes || 0} icon={<TrendingUp color={colors.cyan} size={20} />} />
          <MetricCard label="High-risk zones" value={data?.highRiskAreas || 0} icon={<Flame color={colors.red} size={20} />} />
          <MetricCard label="Safer zones" value={data?.safeAreas || 0} icon={<ShieldCheck color={colors.green} size={20} />} />
          <MetricCard label="AI forecast" value={prediction?.predictedRisk || 0} icon={<BrainCircuit color={colors.purple} size={20} />} />
        </View>

        <View style={styles.mainGrid}>
          <GlassCard style={styles.mainCard}>
            <Text style={styles.sectionTitle}>Predicted Risk Areas</Text>
            <Text style={styles.sectionSub}>{prediction?.message || 'Prediction API unavailable.'}</Text>
            {(prediction?.topAreas || []).slice(0, 7).map((item) => (
              <BarRow key={item.area} label={item.area} value={item.predictedRisk} max={100} />
            ))}
          </GlassCard>

          <GlassCard style={styles.sideCard}>
            <Text style={styles.sectionTitle}>Crime Category Mix</Text>
            <Text style={styles.sectionSub}>Most reported crime types.</Text>
            {(data?.byCategory || []).slice(0, 9).map((item) => (
              <View key={item.type} style={styles.itemRow}>
                <Text style={styles.itemLabel}>{item.type}</Text>
                <Text style={styles.itemValue}>{item.total}</Text>
              </View>
            ))}
          </GlassCard>
        </View>

        <GlassCard style={styles.bottomCard}>
          <Text style={styles.sectionTitle}>Area Risk Distribution</Text>
          <View style={styles.rowWrap}>
            {(data?.byArea || []).slice(0, 10).map((item) => (
              <BarRow key={item.area} label={item.area} value={Number(item.riskScore)} max={maxAreaRisk} />
            ))}
          </View>
        </GlassCard>
      </View>
    </View>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <GlassCard style={styles.metricCard}>
      <View style={styles.metricTop}>
        {icon}
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{Math.round(value)}</Text>
    </GlassCard>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const width = Math.max(5, Math.min(100, (value / max) * 100));
  const accent = riskColor(max === 100 ? value : Math.min(100, (value / max) * 100));
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, { color: accent }]}>{Math.round(value)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${width}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  wrap: {
    maxWidth: 1300,
    width: '100%',
    alignSelf: 'center',
    paddingTop: 106,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    color: colors.muted,
    marginTop: 12,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.cyan,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    marginTop: 4,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 15,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metricValue: {
    marginTop: 10,
    color: colors.text,
    fontWeight: '900',
    fontSize: 40,
  },
  mainGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  mainCard: {
    flex: 1.5,
  },
  sideCard: {
    flex: 1,
  },
  bottomCard: {
    marginTop: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '900',
  },
  sectionSub: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 8,
    lineHeight: 20,
  },
  barRow: {
    marginTop: 12,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  barLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  barValue: {
    fontWeight: '900',
  },
  track: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  itemRow: {
    minHeight: 44,
    marginTop: 9,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  itemValue: {
    color: colors.cyan,
    fontWeight: '900',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
