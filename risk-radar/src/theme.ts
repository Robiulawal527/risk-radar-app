export const colors = {
  bg: '#05070d',
  bg2: '#0b1020',
  card: 'rgba(255,255,255,0.08)',
  cardStrong: 'rgba(255,255,255,0.14)',
  stroke: 'rgba(255,255,255,0.16)',
  text: '#f8fbff',
  muted: '#a7b1c2',
  soft: '#6f7a8b',
  red: '#ff3b30',
  orange: '#ff9f0a',
  yellow: '#ffd60a',
  green: '#32d74b',
  blue: '#0a84ff',
  purple: '#bf5af2',
  cyan: '#64d2ff',
  black: '#000000',
  white: '#ffffff',
};

export const radii = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  glowRed: {
    shadowColor: '#ff3b30',
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
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
