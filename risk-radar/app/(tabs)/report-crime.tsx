import { MapPin, Send, ShieldAlert } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, getErrorMessage } from '../../src/api';
import { ActionButton } from '../../src/components/ActionButton';
import { AppleHeader } from '../../src/components/AppleHeader';
import { GlassCard } from '../../src/components/GlassCard';
import { Screen } from '../../src/components/Screen';
import { getCurrentLocation } from '../../src/location';
import { colors, radii } from '../../src/theme';
import type { LatLng, Severity } from '../../src/types';

const crimeTypes = ['Theft', 'Robbery', 'Harassment', 'Assault', 'Fraud', 'Cyber Crime', 'Drug Related'];
const areas = ['Dhanmondi', 'Mirpur', 'Uttara', 'Gulshan', 'Banani', 'Mohammadpur', 'Motijheel', 'Badda', 'Jatrabari', 'Farmgate'];

export default function ReportCrimeScreen() {
  const [type, setType] = useState('Theft');
  const [area, setArea] = useState('Dhanmondi');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation().then(setLocation).catch(() => setLocation(null));
  }, []);

  async function submit() {
    try {
      setLoading(true);
      await api.post('/crimes', {
        type,
        area,
        division: 'Dhaka',
        district: 'Dhaka',
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        severity,
        description: description || `${type} report submitted from ${area}`,
        report_date: new Date().toISOString().slice(0, 10),
      });

      Alert.alert('Report submitted', 'Your report is saved in MySQL and will affect risk scoring after verification.');
      setDescription('');
    } catch (error) {
      Alert.alert('Submit failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <AppleHeader eyebrow="Community safety" title="Report" subtitle="Send verified area-level incident data to improve real-time risk intelligence." />

      <GlassCard>
        <Text style={styles.label}>Crime type</Text>
        <ChipGrid data={crimeTypes} value={type} onChange={setType} />

        <Text style={styles.label}>Area</Text>
        <ChipGrid data={areas} value={area} onChange={setArea} />

        <Text style={styles.label}>Severity</Text>
        <View style={styles.severityRow}>
          {(['low', 'medium', 'high'] as Severity[]).map((item) => (
            <Pressable key={item} onPress={() => setSeverity(item)} style={[styles.severity, severity === item && styles.activeSeverity]}>
              <Text style={[styles.severityText, severity === item && styles.activeSeverityText]}>{item.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What happened? Add helpful details."
          placeholderTextColor={colors.soft}
          multiline
          style={styles.textArea}
        />

        <View style={styles.locationBox}>
          <MapPin color={colors.cyan} size={18} />
          <Text style={styles.locationText}>
            {location ? `GPS attached: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'GPS not available yet'}
          </Text>
        </View>

        <ActionButton title="Submit report" loading={loading} onPress={submit} icon={<Send color="#fff" size={18} />} />
      </GlassCard>

      <GlassCard style={styles.safetyNote}>
        <View style={styles.noteRow}>
          <ShieldAlert color={colors.orange} size={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle}>Emergency?</Text>
            <Text style={styles.noteText}>Use the SOS action or call 999 immediately if you are in danger.</Text>
          </View>
        </View>
      </GlassCard>
    </Screen>
  );
}

function ChipGrid({ data, value, onChange }: { data: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.chips}>
      {data.map((item) => (
        <Pressable key={item} onPress={() => onChange(item)} style={[styles.chip, value === item && styles.activeChip]}>
          <Text style={[styles.chipText, value === item && styles.activeChipText]}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 14,
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  activeChip: {
    backgroundColor: 'rgba(10,132,255,0.2)',
    borderColor: 'rgba(100,210,255,0.55)',
  },
  chipText: {
    color: colors.muted,
    fontWeight: '800',
  },
  activeChipText: {
    color: colors.cyan,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  severity: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  activeSeverity: {
    backgroundColor: 'rgba(255,59,48,0.22)',
    borderColor: 'rgba(255,59,48,0.6)',
  },
  severityText: {
    color: colors.muted,
    fontWeight: '900',
    fontSize: 12,
  },
  activeSeverityText: {
    color: colors.red,
  },
  textArea: {
    minHeight: 124,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: colors.text,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  locationBox: {
    marginVertical: 16,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(100,210,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(100,210,255,0.24)',
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  locationText: {
    color: colors.muted,
    flex: 1,
    fontWeight: '700',
  },
  safetyNote: {
    marginTop: 16,
  },
  noteRow: {
    flexDirection: 'row',
    gap: 12,
  },
  noteTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  noteText: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 20,
  },
});
