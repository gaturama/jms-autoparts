import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'],
};

export const typography = {
  displayLg: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.black,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  } as TextStyle,

  displayMd: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  } as TextStyle,

  h1: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  } as TextStyle,

  h2: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  } as TextStyle,

  h3: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  } as TextStyle,

  bodyLg: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: 22,
  } as TextStyle,

  bodySm: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.textMuted,
    lineHeight: 18,
  } as TextStyle,

  labelLg: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  priceLg: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.accent,
  } as TextStyle,

  price: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.accent,
  } as TextStyle,

  priceSm: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.accent,
  } as TextStyle,

  priceOriginal: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.textMuted,
    textDecorationLine: 'line-through' as const,
  } as TextStyle,

  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.textMuted,
  } as TextStyle,

  buttonLg: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.4,
  } as TextStyle,
};