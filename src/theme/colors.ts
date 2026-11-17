export const colors = {
  primary: '#0e60ff',
  primaryDark: '#0030e0',
  primaryLight: '#dbe4ff',
  accent: '#a594ff',
  background: '#070b14',
  surface: '#ffffff',
  card: '#f7f9fd',
  border: '#eef2f8',
  textPrimary: '#0f172a',
  textSecondary: '#c5cdeb',
  textDisabled: '#94a3b8',
  textInverse: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0e60ff',
  shadowColor: '#000000',
} as const;

export type Colors = typeof colors;
