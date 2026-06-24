import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useCart } from "../../context/CartContext";
import { Divider } from "../common/Divider";
import { formatCurrency } from "../../utils/formatCurrency";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

interface CartSummaryProps {
  style?: ViewStyle;
  showShipping?: boolean;
  paymentMethod?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  style,
  showShipping = true,
  paymentMethod = "",
}) => {
  const { items, total, itemCount } = useCart();

  const shipping = total > 500 ? 0 : 49.9;
  const pixDiscount = paymentMethod === "pix" ? total * 0.05 : 0;
  const finalTotal = total + shipping - pixDiscount;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>RESUMO DO PEDIDO</Text>

      {/* Item count */}
      <View style={styles.row}>
        <Text style={styles.label}>
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </Text>
        <Text style={styles.value}>{formatCurrency(total)}</Text>
      </View>

      {showShipping && (
        <View style={styles.row}>
          <Text style={styles.label}>Frete</Text>
          {shipping === 0 ? (
            <Text style={styles.free}>GRÁTIS</Text>
          ) : (
            <Text style={styles.value}>{formatCurrency(shipping)}</Text>
          )}
        </View>
      )}

      {pixDiscount > 0 && (
        <View style={styles.row}>
          <Text style={styles.discountLabel}>Desconto PIX (5%)</Text>
          <Text style={styles.discountValue}>
            -{formatCurrency(pixDiscount)}
          </Text>
        </View>
      )}

      <Divider />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
      </View>

      {total > 0 && total < 500 && showShipping && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            💡 Faltam {formatCurrency(500 - total)} para frete grátis
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  title: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  free: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.success,
    letterSpacing: 1,
  },
  discountLabel: { fontSize: 14, color: colors.success },
  discountValue: { fontSize: 14, fontWeight: "700", color: colors.success },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  totalValue: { fontSize: 24, fontWeight: "900", color: colors.accent },
  hint: {
    backgroundColor: colors.successBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  hintText: { fontSize: 12, color: colors.success },
});
