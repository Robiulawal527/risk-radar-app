import MapView, { Circle, Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import type { HeatmapArea, LatLng } from '../types';
import { colors } from '../theme';

type Props = {
  zones: HeatmapArea[];
  userLocation: LatLng;
  onSelectArea: (area: HeatmapArea) => void;
};

function circleColor(score: number) {
  if (score >= 70) return 'rgba(255,59,48,0.30)';
  if (score >= 40) return 'rgba(255,159,10,0.26)';
  return 'rgba(50,215,75,0.20)';
}

function strokeColor(score: number) {
  if (score >= 70) return 'rgba(255,59,48,0.75)';
  if (score >= 40) return 'rgba(255,159,10,0.70)';
  return 'rgba(50,215,75,0.65)';
}

export function NativeRiskMap({ zones, userLocation, onSelectArea }: Props) {
  const visibleZones = zones.filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      }}
      showsUserLocation
      showsMyLocationButton
      showsCompass
    >
      {visibleZones.map((zone) => (
        <Circle
          key={`${zone.area}-circle`}
          center={{ latitude: Number(zone.latitude), longitude: Number(zone.longitude) }}
          radius={Math.max(550, Math.min(2600, Number(zone.riskScore) * 22))}
          fillColor={circleColor(Number(zone.riskScore))}
          strokeColor={strokeColor(Number(zone.riskScore))}
          strokeWidth={1.5}
          zIndex={1}
        />
      ))}

      {visibleZones.slice(0, 80).map((zone) => (
        <Marker
          key={`${zone.area}-marker`}
          coordinate={{ latitude: Number(zone.latitude), longitude: Number(zone.longitude) }}
          title={zone.area}
          description={`Risk ${Math.round(Number(zone.riskScore))}/100 - ${zone.total} reports`}
          pinColor={Number(zone.riskScore) >= 70 ? colors.red : Number(zone.riskScore) >= 40 ? colors.orange : colors.green}
          onCalloutPress={() => onSelectArea(zone)}
        />
      ))}
    </MapView>
  );
}
