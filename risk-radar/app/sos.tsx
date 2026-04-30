import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, PhoneCall, Send } from 'lucide-react-native';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../src/components/ActionButton';
import { GlassCard } from '../src/components/GlassCard';
import { Screen } from '../src/components/Screen';
import { colors, radii } from '../src/theme';

export default function SosScreen() {
  return (
    <Screen scroll={false}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft color={colors.white} size={20} />
      </Pressable>
      <View style={styles.wrap}>
        <LinearGradient colors={[colors.red, '#ff6b5f']} style={styles.sosButton}>
          <Text style={styles.sosText}>SOS</Text>
        </LinearGradient>
        <Text style={styles.title}>Emergency Mode</Text>
        <Text style={styles.subtitle}>Use this only when you feel unsafe or need immediate help.</Text>

        <GlassCard style={styles.card}>
          <ActionButton title="Call 999" icon={<PhoneCall color="#fff" size={18} />} onPress={() => Linking.openURL('tel:999')} />
          <ActionButton title="Notify trusted contacts" variant="dark" icon={<Send color="#fff" size={18} />} onPress={() => Alert.alert('Alert sent', 'Emergency contacts will be notified in the production version.')} style={styles.second} />
        </GlassCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 58,
    left: 20,
    zIndex: 4,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.red,
    shadowOpacity: 0.55,
    shadowRadius: 38,
    shadowOffset: { width: 0, height: 18 },
  },
  sosText: {
    color: colors.white,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 34,
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 310,
    marginTop: 10,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    marginTop: 28,
  },
  second: {
    marginTop: 12,
  },
});
