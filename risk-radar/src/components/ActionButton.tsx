import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../theme';

type Props = {
  title: string;
  onPress?: () => void;
  icon?: ReactNode;
  loading?: boolean;
  variant?: 'danger' | 'blue' | 'green' | 'dark';
  style?: StyleProp<ViewStyle>;
};

const variants = {
  danger: [colors.red, '#ff6b5f'],
  blue: [colors.blue, colors.cyan],
  green: [colors.green, '#7dff9b'],
  dark: ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.08)'],
} as const;

export function ActionButton({ title, onPress, icon, loading, variant = 'danger', style }: Props) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={({ pressed }) => [style, pressed && styles.pressed]}>
      <LinearGradient
        colors={variants[variant] as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        {loading ? <ActivityIndicator color="#fff" /> : icon}
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    ...shadows.glowRed,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});
