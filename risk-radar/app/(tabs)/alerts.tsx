import { AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../../src/api';
import { GlassCard } from '../../src/components/GlassCard';
import { colors } from '../../src/theme';

type AlertItem = { id: number; title: string; body: string; area: string; riskScore?: number };

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    api.get('/alerts').then((res) => setAlerts(res.data)).catch(() => setAlerts([]));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Alerts</Text>
      {alerts.length === 0 ? (
        <GlassCard style={styles.empty}>
          <CheckCircle2 color={colors.green} size={36} />
          <Text style={styles.emptyTitle}>No critical alerts</Text>
          <Text style={styles.emptyText}>Risk Radar will notify you when a high-risk zone is detected.</Text>
        </GlassCard>
      ) : alerts.map((item) => (
        <GlassCard key={item.id} style={styles.card}>
          <View style={styles.icon}><AlertTriangle color={colors.red} size={24} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.meta}>{item.area} • Score {item.riskScore ?? '--'}</Text>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 18, paddingTop: 60, paddingBottom: 110 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', marginBottom: 18 },
  card: { padding: 18, flexDirection: 'row', gap: 14, marginBottom: 14 },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,43,43,0.16)', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.red, fontSize: 17, fontWeight: '900' },
  body: { color: colors.text, fontSize: 15, marginTop: 4 },
  meta: { color: colors.muted, fontSize: 13, marginTop: 7 },
  empty: { padding: 24, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 12 },
  emptyText: { color: colors.muted, textAlign: 'center', marginTop: 6 },
});
