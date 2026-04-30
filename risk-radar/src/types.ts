export type Severity = 'low' | 'medium' | 'high';

export type HeatmapArea = {
  area: string;
  latitude: number;
  longitude: number;
  total: number;
  riskScore: number;
  riskLevel?: string;
};

export type CrimeReport = {
  id?: number;
  type: string;
  area: string;
  division?: string;
  district?: string;
  latitude?: number | null;
  longitude?: number | null;
  severity: Severity;
  description?: string;
  created_at?: string;
  report_date?: string;
};

export type DashboardData = {
  totalCrimes: number;
  highRiskAreas: number;
  safeAreas: number;
  byCategory: Array<{ type: string; total: number }>;
  byArea: Array<{ area: string; total: number; riskScore: number }>;
  weeklyTrend: Array<{ date: string; total: number }>;
};

export type AlertItem = {
  id: number;
  title: string;
  body: string;
  area: string;
  type: string;
  riskScore?: number;
};

export type LatLng = {
  latitude: number;
  longitude: number;
};
