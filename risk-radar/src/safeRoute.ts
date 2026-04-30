import type { HeatmapArea, LatLng } from './types';
import { distanceMeters } from './location';

function pointRisk(point: LatLng, zones: HeatmapArea[]) {
  return zones.reduce((sum, zone) => {
    const distance = distanceMeters(point, {
      latitude: Number(zone.latitude),
      longitude: Number(zone.longitude),
    });

    const influence = Math.max(0, 1 - distance / 2500);
    return sum + influence * zone.riskScore;
  }, 0);
}

function routeRisk(points: LatLng[], zones: HeatmapArea[]) {
  return points.reduce((sum, point) => sum + pointRisk(point, zones), 0) / points.length;
}

function midpoint(a: LatLng, b: LatLng, offsetLat = 0, offsetLng = 0): LatLng {
  return {
    latitude: (a.latitude + b.latitude) / 2 + offsetLat,
    longitude: (a.longitude + b.longitude) / 2 + offsetLng,
  };
}

export function calculateSafeRoute(from: LatLng, to: LatLng, zones: HeatmapArea[]) {
  const candidates: LatLng[][] = [
    [from, midpoint(from, to, 0.012, -0.006), to],
    [from, midpoint(from, to, -0.012, 0.006), to],
    [from, midpoint(from, to, 0.006, 0.012), to],
    [from, midpoint(from, to, -0.006, -0.012), to],
    [from, midpoint(from, to), to],
  ];

  const ranked = candidates
    .map((points) => ({ points, risk: routeRisk(points, zones) }))
    .sort((a, b) => a.risk - b.risk);

  return {
    coordinates: ranked[0].points,
    estimatedRisk: Math.round(ranked[0].risk),
    avoidedZones: zones.filter((zone) => zone.riskScore >= 70).length,
  };
}
