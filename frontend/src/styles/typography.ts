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

export const fonts = {
  displayBold: 'Rajdhani-Bold',
  displaySemibold: 'Rajdhani-SemiBold',
  mono: 'JetBrainsMono-Medium',
};

export const typography = {
  displayLg: {
    fontFamily: fonts.displayBold,
    fontSize: fontSizes['4xl'],
    color: colors.textPrimary,
    letterSpacing: 0.5,
  } as TextStyle,
  displayMd: {
    fontFamily: fonts.displayBold,
    fontSize: fontSizes['3xl'],
    color: colors.textPrimary,
    letterSpacing: 0.5,
  } as TextStyle,
  h1: {
    fontFamily: fonts.displayBold,
    fontSize: fontSizes['2xl'],
    color: colors.textPrimary,
    letterSpacing: 0.5,
  } as TextStyle,
  h2: {
    fontFamily: fonts.displayBold,
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
  } as TextStyle,
  h3: {
    fontFamily: fonts.displaySemibold,
    fontSize: fontSizes.lg,
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
    fontFamily: fonts.displaySemibold,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  } as TextStyle,
  label: {
    fontFamily: fonts.displaySemibold,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  priceLg: {
    fontFamily: fonts.mono,
    fontSize: fontSizes['2xl'],
    color: colors.accent,
  } as TextStyle,
  price: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.lg,
    color: colors.accent,
  } as TextStyle,
  priceSm: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.md,
    color: colors.accent,
  } as TextStyle,
  priceOriginal: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textDecorationLine: 'line-through' as const,
  } as TextStyle,

  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.textMuted,
  } as TextStyle,

  buttonLg: {
    fontFamily: fonts.displayBold,
    fontSize: fontSizes.base,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  } as TextStyle,
  button: {
    fontFamily: fonts.displayBold,
    fontSize: fontSizes.md,
    letterSpacing: 0.8,
  } as TextStyle,
};