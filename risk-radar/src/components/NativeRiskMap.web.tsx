import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import { StyleSheet, Text, View } from 'react-native';
import type { HeatmapArea, LatLng } from '../types';
import { colors, radii, riskColor } from '../theme';

type Props = {
  zones: HeatmapArea[];
  userLocation: LatLng;
  onSelectArea: (area: HeatmapArea) => void;
};

export function NativeRiskMap({ zones, userLocation, onSelectArea }: Props) {
  const visibleZones = zones.filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)).slice(0, 150);

  return (
    <View style={styles.mapWeb}>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={12}
        scrollWheelZoom
        style={styles.leafletMap as any}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {visibleZones.map((zone) => {
          const score = Number(zone.riskScore) || 0;
          const color = riskColor(score);
          const radius = Math.max(220, Math.min(1300, score * 16 + 220));
          return (
            <Circle
              key={`${zone.area}-${zone.latitude}-${zone.longitude}`}
              center={[zone.latitude, zone.longitude]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: score >= 70 ? 0.34 : score >= 40 ? 0.24 : 0.17,
                weight: 1.4,
              }}
              eventHandlers={{
                click: () => onSelectArea(zone),
              }}
            >
              <Tooltip direction="top" sticky>
                <div>
                  <strong>{zone.area}</strong>
                  <br />
                  Risk {Math.round(score)}/100
                </div>
              </Tooltip>
            </Circle>
          );
        })}
      </MapContainer>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Live web heatmap</Text>
        <Text style={styles.footerText}>
          Interactive zone intensity is now plotted over OpenStreetMap. Click any hotspot to select the area.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07101f',
  },
  leafletMap: {
    height: '100%',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(9,16,34,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
