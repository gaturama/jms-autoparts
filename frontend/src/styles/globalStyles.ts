import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { spacing, radius } from "./spacing";

export const globalStyles = StyleSheet.create({
  flex1: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  padSm: { padding: spacing.sm },
  padMd: { padding: spacing.md },
  padBase: { padding: spacing.base },
  padLg: { padding: spacing.lg },
  padHBase: { paddingHorizontal: spacing.base },
  padHLg: { paddingHorizontal: spacing.lg },
  padVBase: { paddingVertical: spacing.base },
  padVLg: { paddingVertical: spacing.lg },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  cardAlt: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  separator: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
});
