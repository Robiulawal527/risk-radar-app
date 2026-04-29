export const colors = {
  bg: '#06111c',
  bg2: '#0a1d2d',
  panel: 'rgba(8, 22, 34, 0.88)',
  glass: 'rgba(12, 28, 42, 0.72)',
  glassStrong: 'rgba(13, 31, 46, 0.94)',
  border: 'rgba(255,255,255,0.13)',
  text: '#ffffff',
  muted: '#9aa7b8',
  red: '#ff2b2b',
  redDark: '#b9151e',
  orange: '#ff9f0a',
  green: '#35d05c',
  blue: '#0a84ff',
  shadow: '#000000',
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
};

export function riskColor(score: number) {
  if (score >= 70) return colors.red;
  if (score >= 40) return colors.orange;
  return colors.green;
}

export function riskLabel(score: number) {
  if (score >= 70) return 'High Risk';
  if (score >= 40) return 'Medium Risk';
  return 'Low Risk';
}
