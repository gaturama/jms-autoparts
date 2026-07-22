import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default' | 'accent';

interface BadgeProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const ICON_COLOR: Record<BadgeVariant, string> = {
  primary: colors.white,
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
  default: colors.textSecondary,
  accent: colors.accent,
};

export const Badge: React.FC<BadgeProps> = ({ label, icon, variant = 'default', style }) => (
  <View style={[styles.base, styles[variant], style, icon && styles.baseWithIcon]}>
    {icon && <Ionicons name={icon} size={10} color={ICON_COLOR[variant]} />}
    {!!label && <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>}
  </View>
);

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  baseWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  text: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },

  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  success: { backgroundColor: colors.successBg, borderColor: colors.success },
  error: { backgroundColor: colors.errorBg, borderColor: colors.error },
  warning: { backgroundColor: colors.warningBg, borderColor: colors.warning },
  info: { backgroundColor: colors.infoBg, borderColor: colors.info },
  default: { backgroundColor: colors.card, borderColor: colors.border },
  accent: { backgroundColor: colors.accentDark, borderColor: colors.accent },

  text_primary: { color: colors.white },
  text_success: { color: colors.success },
  text_error: { color: colors.error },
  text_warning: { color: colors.warning },
  text_info: { color: colors.info },
  text_default: { color: colors.textSecondary },
  text_accent: { color: colors.accent },
});