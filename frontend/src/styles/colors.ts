export const colors = {
  background: '#14161A',   
  surface: '#1E2126',      

  card: '#1B1E23',
  cardAlt: '#22252B',

  primary: '#2F8FE0',
  primaryDark: '#256FB0',
  primaryLight: '#5AAEEF',

  accent: '#F2A93B',
  accentDark: '#C98826',

  textPrimary: '#F4F5F7',
  textSecondary: '#C6C9CF',
  textMuted: '#8A8F98',
  textInverse: '#04141F',  

  success: '#4FA968',
  successBg: '#16241D',
  error: '#E0483E',
  errorBg: '#301716',
  warning: '#E0983B',
  warningBg: '#2E2415',
  info: '#3AA6FF',
  infoBg: '#132433',

  border: '#2A2E35',
  borderLight: '#3A3F47',
  borderStrong: '#2F8FE0',

  overlay: 'rgba(10, 11, 13, 0.85)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',

  star: '#F2A93B',
  starEmpty: '#2A2E35',

  statusPending: '#E0983B',
  statusConfirmed: '#3AA6FF',
  statusShipped: '#8C7AE6',
  statusDelivered: '#4FA968',
  statusCancelled: '#E0483E',
} as const;

export type Color = keyof typeof colors;