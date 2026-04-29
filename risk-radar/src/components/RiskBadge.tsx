import { Text, StyleSheet, View } from 'react-native';
import { riskColor, riskLabel } from '../theme';

export function RiskBadge({ score }: { score: number }) {
  const color = riskColor(score);
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}77` }]}>
      <Text style={[styles.text, { color }]}>{riskLabel(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '900',
  },
});
