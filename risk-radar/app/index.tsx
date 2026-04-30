import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ShieldCheck, Sparkles, Map, BellRing } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../src/components/ActionButton';
import { GlassCard } from '../src/components/GlassCard';
import { Screen } from '../src/components/Screen';
import { colors, radii } from '../src/theme';

export default function LandingScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <LinearGradient
          colors={['rgba(255,59,48,0.92)', 'rgba(191,90,242,0.75)', 'rgba(10,132,255,0.78)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoOrb}
        >
          <ShieldCheck color="#fff" size={68} strokeWidth={1.7} />
        </LinearGradient>

        <Text style={styles.brand}>Risk Radar</Text>
        <Text style={styles.tagline}>See the risk. Avoid the danger. Stay ahead.</Text>

        <GlassCard style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View>
              <Text style={styles.previewLabel}>Live Safety Intelligence</Text>
              <Text style={styles.previewTitle}>Dhaka Risk Pulse</Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.riskMeter}>
            <LinearGradient colors={[colors.green, colors.orange, colors.red]} style={styles.riskFill} />
            <View style={styles.riskNeedle} />
          </View>

          <View style={styles.previewStats}>
            <Mini icon={<Map color={colors.cyan} size={18} />} label="Heatmap" />
            <Mini icon={<BellRing color={colors.orange} size={18} />} label="Alerts" />
            <Mini icon={<Sparkles color={colors.purple} size={18} />} label="AI Risk" />
          </View>
        </GlassCard>

        <ActionButton title="Enter Risk Radar" onPress={() => router.replace('/(tabs)/map')} />
        <ActionButton title="Sign in" variant="dark" onPress={() => router.push('/login')} style={styles.secondary} />
      </View>
    </Screen>
  );
}

function Mini({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View style={styles.mini}>
      {icon}
      <Text style={styles.miniText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  logoOrb: {
    width: 142,
    height: 142,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.red,
    shadowOpacity: 0.45,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 },
  },
  brand: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2.2,
  },
  tagline: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 28,
    maxWidth: 320,
    lineHeight: 24,
  },
  previewCard: {
    width: '100%',
    marginBottom: 24,
  },
  previewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  livePill: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    borderRadius: radii.pill,
    backgroundColor: 'rgba(50,215,75,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(50,215,75,0.42)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  liveText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '900',
  },
  riskMeter: {
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 22,
    overflow: 'hidden',
  },
  riskFill: {
    flex: 1,
  },
  riskNeedle: {
    position: 'absolute',
    right: '21%',
    top: -5,
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  previewStats: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },
  mini: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 76,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  miniText: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
  },
  secondary: {
    marginTop: 12,
    width: '100%',
  },
});
