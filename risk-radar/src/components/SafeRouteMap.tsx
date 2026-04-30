import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import type { HeatmapArea, LatLng } from '../types';
import { colors } from '../theme';

type Props = {
  from: LatLng;
  to: LatLng;
  route: LatLng[];
  zones: HeatmapArea[];
};

export function SafeRouteMap({ from, to, route }: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: (from.latitude + to.latitude) / 2,
        longitude: (from.longitude + to.longitude) / 2,
        latitudeDelta: Math.max(0.05, Math.abs(from.latitude - to.latitude) + 0.04),
        longitudeDelta: Math.max(0.05, Math.abs(from.longitude - to.longitude) + 0.04),
      }}
      showsUserLocation
    >
      <Polyline coordinates={route} strokeWidth={7} strokeColor={colors.green} />
      <Marker coordinate={from} title="Your location" />
      <Marker coordinate={to} title="Destination" pinColor={colors.blue} />
    </MapView>
  );
}
