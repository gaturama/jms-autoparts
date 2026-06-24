import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

interface DividerProps {
  label?: string;
  style?: ViewStyle;
  color?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  style,
  color = colors.border,
}) => {
  if (label) {
    return (
      <View style={[styles.rowContainer, style]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
    );
  }

  return <View style={[styles.divider, { backgroundColor: color }, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: "100%",
    marginVertical: spacing.md,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
