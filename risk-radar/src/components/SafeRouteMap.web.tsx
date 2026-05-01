import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import { StyleSheet, Text, View } from 'react-native';
import type { HeatmapArea, LatLng } from '../types';
import { colors, radii, riskColor } from '../theme';

type Props = {
  from: LatLng;
  to: LatLng;
  route: LatLng[];
  zones: HeatmapArea[];
};

export function SafeRouteMap({ from, to, route, zones }: Props) {
  const highRiskZones = zones.filter((zone) => Number(zone.riskScore) >= 65).slice(0, 60);
  return (
    <View style={styles.webMap}>
      <MapContainer
        center={[(from.latitude + to.latitude) / 2, (from.longitude + to.longitude) / 2]}
        zoom={12}
        scrollWheelZoom
        style={styles.leafletMap as any}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <Polyline
          positions={route.map((point) => [point.latitude, point.longitude])}
          pathOptions={{ color: colors.green, weight: 6, opacity: 0.9 }}
        />
        <CircleMarker center={[from.latitude, from.longitude]} radius={8} pathOptions={{ color: colors.white, fillColor: colors.blue, fillOpacity: 0.9 }}>
          <Tooltip direction="top" sticky>
            Start
          </Tooltip>
        </CircleMarker>
        <CircleMarker center={[to.latitude, to.longitude]} radius={8} pathOptions={{ color: colors.white, fillColor: colors.green, fillOpacity: 0.95 }}>
          <Tooltip direction="top" sticky>
            Destination
          </Tooltip>
        </CircleMarker>
        {highRiskZones.map((zone) => (
          <CircleMarker
            key={`${zone.area}-${zone.latitude}-${zone.longitude}`}
            center={[zone.latitude, zone.longitude]}
            radius={Math.max(4, Math.min(11, Number(zone.riskScore) / 10))}
            pathOptions={{ color: riskColor(Number(zone.riskScore)), fillColor: riskColor(Number(zone.riskScore)), fillOpacity: 0.5 }}
          >
            <Tooltip direction="top" sticky>
              {zone.area} ({Math.round(Number(zone.riskScore))})
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <View style={styles.panel}>
        <Text style={styles.title}>Live safe route map</Text>
        <Text style={styles.text}>From {from.latitude.toFixed(3)}, {from.longitude.toFixed(3)}</Text>
        <Text style={styles.text}>To {to.latitude.toFixed(3)}, {to.longitude.toFixed(3)}</Text>
        <Text style={styles.textMuted}>Green path is safer path. Red/orange points are high-risk hotspots.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webMap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07101f',
  },
  leafletMap: {
    width: '100%',
    height: '100%',
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
  textMuted: {
    color: colors.soft,
    marginTop: 6,
    fontSize: 12,
  },
});
