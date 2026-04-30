import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BrainCircuit, Clock, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '../src/api';
import { ActionButton } from '../src/components/ActionButton';
import { AppleHeader } from '../src/components/AppleHeader';
import { GlassCard } from '../src/components/GlassCard';
import { RiskBadge } from '../src/components/RiskBadge';
import { Screen } from '../src/components/Screen';
import { colors, radii } from '../src/theme';
import type { CrimeReport } from '../src/types';

type AreaData = {
  area: string;
  riskScore: number;
  riskLevel: string;
  totalReports: number;
  recentCrimes: CrimeReport[];
};

type Prediction = {
  predictedRisk: number;
  confidence: number;
  prediction: string;
};

export default function AreaDetailsScreen() {
  const params = useLocalSearchParams<{ area?: string }>();
  const area = typeof params.area === 'string' ? params.area : 'Dhaka';
  const [data, setData] = useState<AreaData | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const areaRes = await api.get(`/crimes/area/${encodeURIComponent(area)}`);
        setData(areaRes.data);
        try {
          const pred = await api.get(`/prediction/area/${encodeURIComponent(area)}`);
          setPrediction(pred.data);
        } catch {
          setPrediction(null);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [area]);

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.red} />
          <Text style={styles.loading}>Opening area intelligence...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft color={colors.white} size={20} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <AppleHeader eyebrow="Area Intelligence" title={area} subtitle="Risk score, prediction, and recent reports from MySQL." />

      <GlassCard>
        <View style={styles.scoreRow}>
          <View>
            <Text style={styles.scoreLabel}>Current Risk</Text>
            <Text style={styles.score}>{Math.round(data?.riskScore || 0)}</Text>
          </View>
          <RiskBadge score={data?.riskScore || 0} />
        </View>
        <Text style={styles.bodyText}>{data?.totalReports || 0} reports detected for this area.</Text>
      </GlassCard>

      <GlassCard style={styles.cardGap}>
        <View style={styles.predictionHeader}>
          <BrainCircuit color={colors.purple} size={24} />
          <Text style={styles.sectionTitle}>AI Prediction</Text>
        </View>
        <Text style={styles.predictionText}>{prediction?.prediction || 'Prediction route not installed yet. Add backend prediction.routes.js for this card.'}</Text>
        {prediction ? <RiskBadge score={prediction.predictedRisk} label={`${prediction.confidence}% confidence`} /> : null}
      </GlassCard>

      <GlassCard style={styles.cardGap}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {(data?.recentCrimes || []).slice(0, 8).map((item, index) => (
          <View key={`${item.id || index}`} style={styles.reportRow}>
            <View style={styles.reportIcon}>
              <Clock color={colors.cyan} size={17} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportType}>{item.type}</Text>
              <Text style={styles.reportDesc}>{item.description || 'No description provided'}</Text>
            </View>
            <Text style={styles.severity}>{item.severity}</Text>
          </View>
        ))}
      </GlassCard>

      <ActionButton title="Navigate safer route" variant="green" icon={<MapPin color="#fff" size={18} />} onPress={() => router.push('/safe-route')} style={styles.routeButton} />
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
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  backText: {
    color: colors.text,
    fontWeight: '900',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    color: colors.muted,
    fontWeight: '800',
  },
  score: {
    color: colors.text,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 4,
  },
  bodyText: {
    color: colors.muted,
    marginTop: 10,
  },
  cardGap: {
    marginTop: 14,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  predictionText: {
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 14,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  reportIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,210,255,0.1)',
  },
  reportType: {
    color: colors.text,
    fontWeight: '900',
  },
  reportDesc: {
    color: colors.muted,
    marginTop: 3,
  },
  severity: {
    color: colors.orange,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 11,
  },
  routeButton: {
    marginTop: 18,
  },
});
