import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { spacing, radius } from "@/styles/spacing";
import { Skeleton } from "../common/Skeleton";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <Skeleton height={110} borderRadius={0} />
      <View style={styles.info}>
        <Skeleton width={48} height={9} style={{ marginBottom: 6 }} />
        <Skeleton width="85%" height={11} style={{ marginBottom: 4 }} />
        <Skeleton width="55%" height={11} style={{ marginBottom: 8 }} />
        <Skeleton width={64} height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  info: { padding: spacing.sm },
});
