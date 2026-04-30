import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HeatmapArea, LatLng } from '../types';
import { colors, radii, riskColor } from '../theme';

type Props = {
  zones: HeatmapArea[];
  userLocation: LatLng;
  onSelectArea: (area: HeatmapArea) => void;
};

export function NativeRiskMap({ zones, userLocation, onSelectArea }: Props) {
  const topZones = [...zones].sort((a, b) => Number(b.riskScore) - Number(a.riskScore)).slice(0, 9);

  return (
    <View style={styles.mapWeb}>
      <View style={styles.grid}>
        {topZones.map((zone) => {
          const size = Math.max(58, Math.min(136, Number(zone.riskScore) * 1.35));
          return (
            <Pressable
              key={zone.area}
              onPress={() => onSelectArea(zone)}
              style={[
                styles.bubble,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderColor: riskColor(Number(zone.riskScore)),
                  backgroundColor: `${riskColor(Number(zone.riskScore))}28`,
                },
              ]}
            >
              <Text style={styles.score}>{Math.round(Number(zone.riskScore))}</Text>
              <Text numberOfLines={1} style={styles.area}>
                {zone.area}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Web heatmap preview</Text>
        <Text style={styles.footerText}>
          Mobile uses native maps. Current center: {userLocation.latitude.toFixed(3)}, {userLocation.longitude.toFixed(3)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#09111f',
    padding: 20,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  score: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  area: {
    color: colors.muted,
    maxWidth: 96,
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  footerTitle: {
    color: colors.text,
    fontWeight: '900',
  },
  footerText: {
    color: colors.muted,
    marginTop: 4,
  },
});
