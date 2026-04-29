import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../src/theme';

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={['#020914', '#06111c', '#071523']} style={styles.container}>
      <View style={styles.glow} />
      <View style={styles.logoRing}>
        <ShieldCheck color={colors.red} size={98} strokeWidth={1.5} />
      </View>

      <Text style={styles.title}>
        Risk <Text style={styles.red}>Radar</Text>
      </Text>
      <Text style={styles.subtitle}>See the risk. Avoid the danger. Stay ahead.</Text>

      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)/map')}>
        <LinearGradient colors={['#ff3838', '#d71920']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </Pressable>

      <Pressable onPress={() => router.replace('/(tabs)/map')}>
        <Text style={styles.guest}>Continue as Guest</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 26 },
  glow: {
    position: 'absolute',
    top: 95,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,43,43,0.12)',
  },
  logoRing: {
    width: 178,
    height: 178,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,43,43,0.25)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 32,
  },
  title: { color: colors.text, fontSize: 44, fontWeight: '900', letterSpacing: -1 },
  red: { color: colors.red },
  subtitle: { color: colors.muted, fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 72 },
  button: { width: '100%', borderRadius: radius.md, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 17, alignItems: 'center', borderRadius: radius.md },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '900' },
  guest: { color: colors.muted, fontSize: 15, marginTop: 22, fontWeight: '700' },
});
