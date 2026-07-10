import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppStackParamList } from "../../types/navigation.types";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CartItemComponent } from "../../components/cart/CartItem";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";
import { fonts } from "../../styles/typography";

type Nav = StackNavigationProp<AppStackParamList>;

export default function CartScreen() {
  const navigation = useNavigation<Nav>();
  const { items, total, itemCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Faça login para finalizar seu pedido.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Entrar", onPress: () => {} },
      ]);
      return;
    }
    navigation.navigate("Checkout");
  };

  const handleClearCart = () => {
    Alert.alert(
      "Limpar carrinho",
      "Deseja remover todos os itens do carrinho?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpar", style: "destructive", onPress: clearCart },
      ],
    );
  };

  const shipping = total > 500 ? 0 : 49.9;
  const finalTotal = total + shipping;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>CARRINHO</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.divider} />

      {items.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="Carrinho vazio"
          subtitle="Adicione produtos ao carrinho para continuar comprando"
          actionLabel="Ver catálogo"
          onAction={() => navigation.navigate("CatalogTab" as never)}
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.product._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <CartItemComponent item={item} />}
            ListHeaderComponent={
              <Text style={styles.countLabel}>
                {itemCount} {itemCount === 1 ? "item" : "itens"}
              </Text>
            }
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frete</Text>
              {shipping === 0 ? (
                <Text style={styles.freeShipping}>GRÁTIS</Text>
              ) : (
                <Text style={styles.summaryValue}>
                  {formatCurrency(shipping)}
                </Text>
              )}
            </View>

            {shipping > 0 && (
              <View style={styles.freeShippingHint}>
                <Ionicons name="bulb-outline" size={14} color={colors.success} />
                <Text style={styles.freeShippingHintText}>
                  Frete grátis em pedidos acima de {formatCurrency(500)}
                </Text>
              </View>
            )}

            <View style={styles.totalDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(finalTotal)}
              </Text>
            </View>

            <Button
              label="Finalizar pedido"
              onPress={handleCheckout}
              fullWidth
              size="lg"
              style={styles.checkoutBtn}
              textStyle={styles.checkoutBtnText}
            />

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => navigation.navigate("CatalogTab" as never)}
            >
              <Ionicons name="chevron-back" size={13} color={colors.textMuted} />
              <Text style={styles.continueBtnText}>Continuar comprando</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.textPrimary,
    letterSpacing: 3,
  },
  clearText: { fontSize: 12, color: colors.error, fontWeight: "600" },
  divider: { height: 1, backgroundColor: colors.border },

  list: { padding: spacing.base, paddingBottom: spacing.sm },
  countLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },

  summary: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.base,
    paddingBottom: spacing["2xl"],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontFamily: fonts.mono, fontSize: 14, color: colors.textPrimary },
  freeShipping: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "800",
    letterSpacing: 1,
  },
  freeShippingHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.successBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  freeShippingHintText: { fontSize: 12, color: colors.success, flexShrink: 1 },
  totalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  totalValue: { fontFamily: fonts.mono, fontSize: 22, color: colors.accent },
  checkoutBtn: { marginTop: spacing.md },
  checkoutBtnText: { fontFamily: fonts.displayBold, color: colors.textInverse },
  continueBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: spacing.md },
  continueBtnText: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },
});