import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function GlassCard({ children, style }: Props) {
  return (
    <LinearGradient
      colors={['rgba(13,31,46,0.96)', 'rgba(7,19,31,0.90)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: 'hidden',
  },
});
