import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Send, Users } from 'lucide-react-native';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../src/theme';

export default function SosScreen() {
  return (
    <LinearGradient colors={['#060912', '#071523']} style={styles.container}>
      <Text style={styles.title}>SOS</Text>
      <Pressable style={styles.pulse} onPress={() => Linking.openURL('tel:999')}>
        <LinearGradient colors={['#ff4a4a', '#d31320']} style={styles.sosButton}>
          <Text style={styles.sosText}>SOS</Text>
        </LinearGradient>
      </Pressable>
      <Text style={styles.subtitle}>Your location will be shared with emergency contacts</Text>
      <View style={styles.actionRow}>
        <MiniAction icon={<Phone color={colors.text} size={24} />} label="Call 999" onPress={() => Linking.openURL('tel:999')} />
        <MiniAction icon={<Send color={colors.text} size={24} />} label="Share" onPress={() => Alert.alert('Shared', 'Location shared')} />
        <MiniAction icon={<Users color={colors.text} size={24} />} label="Contacts" onPress={() => Alert.alert('Alert', 'Contacts notified')} />
      </View>
    </LinearGradient>
  );
}

function MiniAction({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return <Pressable style={styles.mini} onPress={onPress}>{icon}<Text style={styles.miniText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginBottom: 28 },
  pulse: { width: 224, height: 224, borderRadius: 112, backgroundColor: 'rgba(255,43,43,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 22, borderColor: 'rgba(255,43,43,0.08)' },
  sosButton: { width: 158, height: 158, borderRadius: 79, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  sosText: { color: colors.text, fontSize: 44, fontWeight: '900' },
  subtitle: { color: colors.muted, textAlign: 'center', marginTop: 28, marginBottom: 24, fontSize: 16 },
  actionRow: { flexDirection: 'row', gap: 12 },
  mini: { width: 96, height: 92, borderRadius: 20, backgroundColor: colors.glassStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  miniText: { color: colors.text, fontWeight: '800', marginTop: 7 },
});
