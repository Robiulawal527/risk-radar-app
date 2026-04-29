import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GlassCard } from '../src/components/GlassCard';
import { colors } from '../src/theme';

export default function SafeRouteScreen() {
  const route = [
    { latitude: 23.7465, longitude: 90.376 },
    { latitude: 23.7565, longitude: 90.386 },
    { latitude: 23.7665, longitude: 90.396 },
  ];

  return (
    <View style={{ flex: 1 }}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={{ latitude: 23.7565, longitude: 90.386, latitudeDelta: 0.09, longitudeDelta: 0.09 }}>
        <Polyline coordinates={route} strokeColor={colors.green} strokeWidth={7} />
        <Marker coordinate={route[0]} title="Your Location" />
        <Marker coordinate={route[2]} title="Destination" />
      </MapView>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Safest Route Found</Text>
        <View style={styles.row}><Text style={styles.label}>Estimated Time</Text><Text style={styles.value}>24 mins</Text></View>
        <View style={styles.row}><Text style={styles.label}>Avoided</Text><Text style={styles.value}>3 High Risk Zones</Text></View>
        <LinearGradient colors={['#ff3838', '#c91520']} style={styles.button}><Text style={styles.buttonText}>Start Navigation</Text></LinearGradient>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', left: 18, right: 18, bottom: 24, padding: 20 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900', marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: colors.muted, fontWeight: '700' },
  value: { color: colors.text, fontWeight: '900' },
  button: { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  buttonText: { color: colors.text, fontWeight: '900', fontSize: 16 },
});
