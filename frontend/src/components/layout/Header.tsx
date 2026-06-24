import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightElement,
  showLogo = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />

      <View style={styles.row}>
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.center}>
          {showLogo ? (
            <Text style={styles.logo}>
              AUTO<Text style={styles.logoAccent}>PARTS</Text>
            </Text>
          ) : (
            <>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </>
          )}
        </View>

        <View style={styles.side}>{rightElement ?? null}</View>
      </View>

      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  side: { width: 48, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  backBtn: { padding: spacing.xs },
  backIcon: { fontSize: 22, color: colors.textPrimary, fontWeight: '300' },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  subtitle: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  logo: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  logoAccent: { color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginTop: spacing.sm },
});