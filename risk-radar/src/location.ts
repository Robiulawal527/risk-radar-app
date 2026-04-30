import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import type { HeatmapArea, LatLng } from './types';

export const DHAKA_CENTER: LatLng = {
  latitude: 23.8103,
  longitude: 90.4125,
};

export async function getCurrentLocation(): Promise<LatLng> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    if (Platform.OS !== 'web') {
      Alert.alert('Location permission needed', 'Risk Radar will use Dhaka as the default map center.');
    }
    return DHAKA_CENTER;
  }

  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  };
}

export function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function getNearestDangerZone(location: LatLng, zones: HeatmapArea[], radiusMeters = 900) {
  return zones
    .filter((zone) => zone.riskScore >= 70)
    .map((zone) => ({
      ...zone,
      distance: distanceMeters(location, {
        latitude: Number(zone.latitude),
        longitude: Number(zone.longitude),
      }),
    }))
    .filter((zone) => zone.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance)[0];
}
