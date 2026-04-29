import { ChevronRight, LogOut, MapPin, Settings, Shield, UserRound } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../../src/components/GlassCard';
import { colors } from '../../src/theme';

export default function ProfileScreen() {
  const items = ['My Reports', 'My Alerts', 'Saved Locations', 'Emergency Contacts', 'Settings'];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><UserRound color={colors.text} size={36} /></View>
        <View><Text style={styles.name}>Ahmed Rahman</Text><Text style={styles.email}>ahmed@gmail.com</Text></View>
      </View>
      <GlassCard style={styles.menu}>
        {items.map((item, index) => <View key={item} style={styles.row}>{index === 0 ? <Shield color={colors.muted} size={21} /> : index === 2 ? <MapPin color={colors.muted} size={21} /> : <Settings color={colors.muted} size={21} />}<Text style={styles.rowText}>{item}</Text><ChevronRight color={colors.muted} size={20} /></View>)}
        <View style={styles.row}><LogOut color={colors.red} size={21} /><Text style={[styles.rowText, { color: colors.red }]}>Logout</Text></View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 18, paddingTop: 60 },
  header: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.glassStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  name: { color: colors.text, fontSize: 20, fontWeight: '900' },
  email: { color: colors.muted, marginTop: 3 },
  menu: { padding: 6 },
  row: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  rowText: { color: colors.text, fontSize: 16, fontWeight: '800', flex: 1 },
});
