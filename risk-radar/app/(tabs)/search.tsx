import { Search } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { GlassCard } from '../../src/components/GlassCard';
import { colors } from '../../src/theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Location</Text>
      <GlassCard style={styles.searchBox}>
        <Search color={colors.muted} size={22} />
        <TextInput placeholder="Dhanmondi, Mirpur, Gulshan..." placeholderTextColor={colors.muted} style={styles.input} />
      </GlassCard>
      <Text style={styles.hint}>Search UI ready. Connect it to /crimes?area=name for live area lookup.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 18, paddingTop: 60 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', marginBottom: 18 },
  searchBox: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, color: colors.text, fontSize: 16 },
  hint: { color: colors.muted, marginTop: 16, lineHeight: 22 },
});
