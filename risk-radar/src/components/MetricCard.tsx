import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, riskColor } from '../theme';
import { GlassCard } from './GlassCard';

type Props = {
  label: string;
  value: string | number;
  sub?: string;
  score?: number;
  icon?: ReactNode;
};

export function MetricCard({ label, value, sub, score, icon }: Props) {
  const accent = score === undefined ? colors.blue : riskColor(score);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>{icon}</View>
        {score !== undefined ? <View style={[styles.dot, { backgroundColor: accent }]} /> : null}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 142,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  value: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  label: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700',
  },
  sub: {
    color: colors.soft,
    marginTop: 6,
    fontSize: 12,
  },
});
