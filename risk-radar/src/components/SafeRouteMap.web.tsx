import { StyleSheet, Text, View } from 'react-native';
import type { HeatmapArea, LatLng } from '../types';
import { colors, radii } from '../theme';

type Props = {
  from: LatLng;
  to: LatLng;
  route: LatLng[];
  zones: HeatmapArea[];
};

export function SafeRouteMap({ from, to, route }: Props) {
  return (
    <View style={styles.webMap}>
      <View style={styles.routeLine} />
      {route.map((point, index) => (
        <View key={`${point.latitude}-${point.longitude}`} style={[styles.point, index === 1 && styles.midpoint]} />
      ))}
      <View style={styles.panel}>
        <Text style={styles.title}>Web route preview</Text>
        <Text style={styles.text}>From {from.latitude.toFixed(3)}, {from.longitude.toFixed(3)}</Text>
        <Text style={styles.text}>To {to.latitude.toFixed(3)}, {to.longitude.toFixed(3)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webMap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#09111f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    width: '70%',
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.green,
    transform: [{ rotate: '-18deg' }],
  },
  point: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.blue,
    borderWidth: 3,
    borderColor: colors.white,
  },
  midpoint: {
    backgroundColor: colors.green,
    transform: [{ translateX: 80 }, { translateY: -40 }],
  },
  panel: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
  },
  text: {
    color: colors.muted,
    marginTop: 4,
  },
});
