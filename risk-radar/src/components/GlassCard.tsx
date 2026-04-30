import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export function GlassCard({ children, style, intensity = 32 }: Props) {
  const content = <View style={styles.inner}>{children}</View>;

  if (Platform.OS === 'web') {
    return <View style={[styles.card, style]}>{content}</View>;
  }

  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.06)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {content}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  inner: {
    padding: 18,
  },
});
