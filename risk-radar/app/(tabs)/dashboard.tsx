import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../../src/api';
import { GlassCard } from '../../src/components/GlassCard';
import { colors } from '../../src/theme';

type Dashboard = {
  totalCrimes: number;
  highRiskAreas: number;
  safeAreas: number;
  byCategory: { type: string; total: number }[];
  byArea: { area: string; total: number; riskScore: number }[];
};

export default function DashboardScreen() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data)).catch(() => null);
  }, []);

  const stats = [
    ['Total Crimes', data?.totalCrimes ?? 0, colors.red],
    ['High Risk Areas', data?.highRiskAreas ?? 0, colors.orange],
    ['Safe Areas', data?.safeAreas ?? 0, colors.green],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.statsRow}>
        {stats.map(([label, value, color]) => (
          <LinearGradient key={String(label)} colors={[`${color}44`, 'rgba(13,31,46,0.9)']} style={styles.statCard}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={[styles.statValue, { color: String(color) }]}>{String(value)}</Text>
          </LinearGradient>
        ))}
      </View>

      <GlassCard style={styles.card}>
        <Text style={styles.section}>Crime by Category</Text>
        {(data?.byCategory ?? []).slice(0, 6).map((item, index) => (
          <View key={`${item.type}-${index}`} style={styles.row}>
            <Text style={styles.rowText}>{item.type}</Text>
            <Text style={styles.rowValue}>{item.total}</Text>
          </View>
        ))}
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.section}>Area Safety Ranking</Text>
        {(data?.byArea ?? []).slice(0, 8).map((item, index) => (
          <View key={`${item.area}-${index}`} style={styles.row}>
            <Text style={styles.rowText}>{index + 1}. {item.area}</Text>
            <Text style={[styles.rowValue, { color: item.riskScore >= 70 ? colors.red : colors.orange }]}>{item.riskScore}</Text>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 18, paddingTop: 60, paddingBottom: 110 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', marginBottom: 18 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 20, padding: 14, minHeight: 96, borderWidth: 1, borderColor: colors.border },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  statValue: { fontSize: 28, fontWeight: '900', marginTop: 10 },
  card: { padding: 18, marginTop: 16 },
  section: { color: colors.text, fontSize: 20, fontWeight: '900', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  rowText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  rowValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
});
