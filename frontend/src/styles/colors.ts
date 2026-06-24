export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A2E',
  card: '#0F3460',
  cardAlt: '#16213E',

  primary: '#E94560',
  primaryDark: '#C73652',
  primaryLight: '#FF6B7A',

  accent: '#F5A623',
  accentDark: '#D4891A',

  textPrimary: '#EAEAEA',
  textSecondary: '#A8B2C1',
  textMuted: '#5E6B7A',
  textInverse: '#0D0D0D',

  success: '#2ECC71',
  successBg: '#1A3D2B',
  error: '#E74C3C',
  errorBg: '#3D1A1A',
  warning: '#F39C12',
  warningBg: '#3D2E1A',
  info: '#3498DB',
  infoBg: '#1A2D3D',

  border: '#2A2A4A',
  borderLight: '#3A3A5A',
  borderStrong: '#E94560',

  overlay: 'rgba(13, 13, 13, 0.85)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',

  star: '#F5A623',
  starEmpty: '#2A2A4A',

  statusPending: '#F39C12',
  statusConfirmed: '#3498DB',
  statusShipped: '#9B59B6',
  statusDelivered: '#2ECC71',
  statusCancelled: '#E74C3C',
} as const;

export type Color = keyof typeof colors;