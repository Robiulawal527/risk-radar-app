import { BrainCircuit, Flame, ShieldCheck, TrendingUp } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { api } from '../../src/api';
import { AppleHeader } from '../../src/components/AppleHeader';
import { GlassCard } from '../../src/components/GlassCard';
import { MetricCard } from '../../src/components/MetricCard';
import { RiskBadge } from '../../src/components/RiskBadge';
import { Screen } from '../../src/components/Screen';
import { colors, radii, riskColor } from '../../src/theme';
import type { DashboardData } from '../../src/types';

type PredictionOverview = {
  city: string;
  predictedRisk: number;
  confidence: number;
  message: string;
  topAreas: Array<{ area: string; predictedRisk: number; confidence: number }>;
};

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [prediction, setPrediction] = useState<PredictionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await api.get('/dashboard');
        setData(dashboard.data);
        try {
          const pred = await api.get('/prediction/overview');
          setPrediction(pred.data);
        } catch {
          setPrediction(null);
        }
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
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.red} size="large" />
          <Text style={styles.loading}>Loading intelligence...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppleHeader eyebrow="City Intelligence" title="Insights" subtitle="Live analytics from MySQL reports, grouped for speed and clarity." />

      <View style={styles.metricsRow}>
        <MetricCard label="Total reports" value={data?.totalCrimes || 0} icon={<TrendingUp color={colors.cyan} size={20} />} />
        <MetricCard label="High risk zones" value={data?.highRiskAreas || 0} score={86} icon={<Flame color={colors.red} size={20} />} />
      </View>

      <View style={styles.metricsRow}>
        <MetricCard label="Safer areas" value={data?.safeAreas || 0} score={24} icon={<ShieldCheck color={colors.green} size={20} />} />
        <MetricCard label="AI forecast" value={prediction ? `${prediction.predictedRisk}` : '--'} score={prediction?.predictedRisk || 0} sub="Next 24h" icon={<BrainCircuit color={colors.purple} size={20} />} />
      </View>

      <GlassCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Predictive Risk</Text>
            <Text style={styles.sectionSub}>{prediction?.message || 'Add backend prediction route for AI-like forecasts.'}</Text>
          </View>
          <RiskBadge score={prediction?.predictedRisk || 0} />
        </View>
        {prediction?.topAreas?.slice(0, 5).map((item) => (
          <BarRow key={item.area} label={item.area} value={item.predictedRisk} max={100} />
        ))}
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Hottest Areas</Text>
        <Text style={styles.sectionSub}>Risk score is calculated from severity-weighted reports.</Text>
        {data?.byArea?.slice(0, 8).map((item) => (
          <BarRow key={item.area} label={item.area} value={Number(item.riskScore)} max={maxAreaRisk} />
        ))}
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Crime Mix</Text>
        <Text style={styles.sectionSub}>Top report categories in the database.</Text>
        {data?.byCategory?.slice(0, 8).map((item) => (
          <CategoryRow key={item.type} type={item.type} total={Number(item.total)} />
        ))}
      </GlassCard>
    </Screen>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const width = Math.max(4, Math.min(100, (value / max) * 100));
  const accent = riskColor(max === 100 ? value : Math.min(100, (value / max) * 100));

  return (
    <View style={styles.barRow}>
      <View style={styles.barTop}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, { color: accent }]}>{Math.round(value)}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${width}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

function CategoryRow({ type, total }: { type: string; total: number }) {
  return (
    <View style={styles.categoryRow}>
      <Text style={styles.categoryText}>{type}</Text>
      <Text style={styles.categoryCount}>{total}</Text>
    </View>
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
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  section: {
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  sectionSub: {
    color: colors.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  barRow: {
    marginTop: 16,
  },
  barTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barLabel: {
    color: colors.text,
    fontWeight: '800',
  },
  barValue: {
    fontWeight: '900',
  },
  barTrack: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  categoryRow: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: colors.stroke,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  categoryText: {
    color: colors.text,
    fontWeight: '800',
  },
  categoryCount: {
    color: colors.cyan,
    fontWeight: '900',
  },
});
