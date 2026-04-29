import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../src/api';
import { GlassCard } from '../src/components/GlassCard';
import { colors } from '../src/theme';

export default function ReportCrimeScreen() {
  const [type, setType] = useState('Theft');
  const [area, setArea] = useState('Dhanmondi');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');

  async function submit() {
    try {
      await api.post('/crimes', { type, area, severity, description, latitude: 23.7465, longitude: 90.376 });
      Alert.alert('Submitted', 'Crime report stored in MySQL.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Could not submit report. Check backend connection.');
    }
  }

  return (
    <LinearGradient colors={['#06111c', '#071827']} style={styles.container}>
      <Text style={styles.title}>Report Crime</Text>
      <GlassCard style={styles.form}>
        <Text style={styles.label}>Crime Type</Text>
        <TextInput value={type} onChangeText={setType} style={styles.input} placeholderTextColor={colors.muted} />
        <Text style={styles.label}>Location</Text>
        <TextInput value={area} onChangeText={setArea} style={styles.input} placeholderTextColor={colors.muted} />
        <Text style={styles.label}>Severity</Text>
        <View style={styles.chips}>
          {(['low', 'medium', 'high'] as const).map((item) => (
            <Pressable key={item} onPress={() => setSeverity(item)} style={[styles.chip, severity === item && styles.activeChip]}>
              <Text style={[styles.chipText, severity === item && styles.activeChipText]}>{item.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Description</Text>
        <TextInput value={description} onChangeText={setDescription} style={[styles.input, styles.textarea]} multiline placeholder="Write description..." placeholderTextColor={colors.muted} />
        <Pressable onPress={submit} style={styles.submitWrap}>
          <LinearGradient colors={['#ff3838', '#c91520']} style={styles.submit}>
            <Text style={styles.submitText}>Submit Report</Text>
          </LinearGradient>
        </Pressable>
      </GlassCard>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingTop: 60 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', marginBottom: 18 },
  form: { padding: 18 },
  label: { color: colors.text, fontSize: 14, fontWeight: '900', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, color: colors.text, fontSize: 16 },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', gap: 10 },
  chip: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  activeChip: { backgroundColor: 'rgba(255,43,43,0.18)', borderColor: colors.red },
  chipText: { color: colors.muted, fontWeight: '900' },
  activeChipText: { color: colors.red },
  submitWrap: { marginTop: 22, borderRadius: 16, overflow: 'hidden' },
  submit: { paddingVertical: 17, alignItems: 'center' },
  submitText: { color: colors.text, fontSize: 16, fontWeight: '900' },
});
