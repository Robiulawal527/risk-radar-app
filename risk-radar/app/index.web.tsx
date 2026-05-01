import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BellRing, BrainCircuit, MapPinned, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../src/components/ActionButton';
import { GlassCard } from '../src/components/GlassCard';
import { colors, radii } from '../src/theme';

const features = [
  { title: 'Live Heatmap', desc: 'Area-wise live risk pulse powered by incoming reports.', icon: <MapPinned color={colors.cyan} size={20} /> },
  { title: 'Smart Alerts', desc: 'Know danger spikes early before planning routes.', icon: <BellRing color={colors.orange} size={20} /> },
  { title: 'AI Forecast', desc: 'Predictive risk trend to help safer decisions.', icon: <BrainCircuit color={colors.purple} size={20} /> },
];

export default function WebLandingScreen() {
  return (
    <View style={styles.page}>
      <LinearGradient colors={['#060913', '#0a1224', '#080e1a']} style={StyleSheet.absoluteFill} />
      <View style={styles.wrap}>
        <View style={styles.left}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <ShieldCheck color={colors.white} size={28} />
            </View>
            <Text style={styles.brand}>Risk Radar</Text>
          </View>
          <Text style={styles.title}>Redesigned for web, built with React.</Text>
          <Text style={styles.subtitle}>
            Safety intelligence dashboard for social trust, location risk, and public profile transparency.
          </Text>
          <View style={styles.actions}>
            <ActionButton title="Open web app" onPress={() => router.replace('/(tabs)/map')} style={styles.actionBtn} />
            <ActionButton title="Sign in" variant="dark" onPress={() => router.push('/login')} style={styles.actionBtn} />
          </View>
        </View>

        <View style={styles.right}>
          <GlassCard style={styles.heroCard}>
            <View style={styles.liveRow}>
              <View style={styles.livePill}>
                <Sparkles color={colors.green} size={14} />
                <Text style={styles.liveText}>Live City Scan</Text>
              </View>
              <Text style={styles.liveScore}>74</Text>
            </View>
            <Text style={styles.heroTitle}>Dhaka Risk Index</Text>
            <Text style={styles.heroSub}>High-risk zones are clustered in specific transport-heavy areas.</Text>

            <View style={styles.meter}>
              <LinearGradient colors={[colors.green, colors.orange, colors.red]} style={styles.meterFill} />
              <View style={styles.needle} />
            </View>
          </GlassCard>

          <View style={styles.featureGrid}>
            {features.map((item) => (
              <GlassCard key={item.title} style={styles.featureCard}>
                {item.icon}
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </GlassCard>
            ))}
          </View>
        </View>
      </View>
      <Pressable onPress={() => router.push('/register')} style={styles.footerLink}>
        <Text style={styles.footerText}>Create account for profile score and social trust ranking</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  wrap: {
    flex: 1,
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 36,
    flexDirection: 'row',
    gap: 22,
  },
  left: {
    flex: 1.05,
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,59,48,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  brand: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 24,
  },
  title: {
    marginTop: 16,
    color: colors.text,
    fontSize: 60,
    fontWeight: '900',
    lineHeight: 64,
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 14,
    color: colors.muted,
    maxWidth: 560,
    fontSize: 18,
    lineHeight: 28,
  },
  actions: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    minWidth: 190,
  },
  heroCard: {
    borderRadius: 28,
  },
  liveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePill: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(50,215,75,0.34)',
    backgroundColor: 'rgba(50,215,75,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  liveText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '800',
  },
  liveScore: {
    color: colors.red,
    fontWeight: '900',
    fontSize: 34,
  },
  heroTitle: {
    marginTop: 12,
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  heroSub: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 22,
  },
  meter: {
    marginTop: 20,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  meterFill: {
    flex: 1,
  },
  needle: {
    position: 'absolute',
    right: '26%',
    top: -5,
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minHeight: 154,
    borderRadius: 20,
  },
  featureTitle: {
    marginTop: 12,
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  featureDesc: {
    marginTop: 8,
    color: colors.muted,
    lineHeight: 20,
  },
  footerLink: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: colors.cyan,
    fontWeight: '700',
  },
});
