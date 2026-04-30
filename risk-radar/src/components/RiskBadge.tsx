import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, riskColor, riskLabel } from '../theme';

type Props = {
  score: number;
  label?: string;
};

export function RiskBadge({ score, label }: Props) {
  const accent = riskColor(score);

  return (
    <View style={[styles.badge, { backgroundColor: `${accent}22`, borderColor: `${accent}66` }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.text, { color: accent }]}>{label || riskLabel(score)}</Text>
      <Text style={styles.score}>{Math.round(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '800',
  },
  score: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
});
