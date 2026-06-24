import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';

interface CategoryChipProps {
  name: string;
  icon: string;
  color?: string;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  name,
  icon,
  color = colors.primary,
  isSelected = false,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.chip, isSelected && { borderColor: color, backgroundColor: color + '22' }]}
  >
    <Text style={styles.icon}>{icon}</Text>
    <Text style={[styles.label, isSelected && { color: color, fontWeight: '700' }]}>
      {name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
});