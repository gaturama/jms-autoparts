import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
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
import { orderService } from "../../service/orderService";
import { Header } from "../../components/layout/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatCEP, formatPhone, isValidCEP } from "../../utils/validators";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Nav = StackNavigationProp<AppStackParamList>;

const PAYMENT_METHODS = [
  { id: "pix", label: "PIX", icon: "flash-outline" as const, desc: "5% de desconto" },
  {
    id: "credit",
    label: "Cartão de crédito",
    icon: "card-outline" as const,
    desc: "Até 12x sem juros",
  },
  { id: "boleto", label: "Boleto", icon: "document-text-outline" as const, desc: "Vencimento em 3 dias" },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<Nav>();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    street: user?.address?.street ?? "",
    city: user?.address?.city ?? "",
    state: user?.address?.state ?? "",
    zipCode: user?.address?.zipCode ?? "",
  });
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: string) => (val: string) =>
    setAddress((a) => ({ ...a, [key]: val }));

  const shipping = total > 500 ? 0 : 49.9;
  const pixDiscount = paymentMethod === "pix" ? total * 0.05 : 0;
  const finalTotal = total + shipping - pixDiscount;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.street.trim()) e.street = "Endereço obrigatório";
    if (!address.city.trim()) e.city = "Cidade obrigatória";
    if (!address.state.trim()) e.state = "Estado obrigatório";
    if (!isValidCEP(address.zipCode)) e.zipCode = "CEP inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const order = await orderService.create({
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        paymentMethod,
        shippingAddress: address,
      });
      clearCart();
      navigation.replace("OrderDetail", { orderId: order._id });
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao criar pedido",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Finalizar pedido" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>ENDEREÇO DE ENTREGA</Text>
          </View>
          <Input
            label="Endereço completo"
            value={address.street}
            onChangeText={setField("street")}
            placeholder="Rua, número, complemento"
            error={errors.street}
          />
          <View style={styles.row}>
            <View style={styles.flex2}>
              <Input
                label="Cidade"
                value={address.city}
                onChangeText={setField("city")}
                placeholder="Sua cidade"
                error={errors.city}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Estado"
                value={address.state}
                onChangeText={(v) => setField("state")(v.toUpperCase())}
                placeholder="SC"
                maxLength={2}
                error={errors.state}
              />
            </View>
          </View>
          <Input
            label="CEP"
            value={address.zipCode}
            onChangeText={(v) => setField("zipCode")(formatCEP(v))}
            keyboardType="numeric"
            placeholder="00000-000"
            maxLength={9}
            error={errors.zipCode}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="card-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>FORMA DE PAGAMENTO</Text>
          </View>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[
                styles.paymentOption,
                paymentMethod === pm.id && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod(pm.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === pm.id && styles.radioOuterActive,
                ]}
              >
                {paymentMethod === pm.id && <View style={styles.radioInner} />}
              </View>
              <Ionicons name={pm.icon} size={20} color={paymentMethod === pm.id ? colors.primary : colors.textSecondary} />
              <View style={styles.paymentInfo}>
                <Text
                  style={[
                    styles.paymentLabel,
                    paymentMethod === pm.id && styles.paymentLabelActive,
                  ]}
                >
                  {pm.label}
                </Text>
                <Text style={styles.paymentDesc}>{pm.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="clipboard-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>RESUMO DO PEDIDO</Text>
          </View>
          <View style={styles.summaryCard}>
            {items.map((item) => (
              <View key={item.product._id} style={styles.orderItem}>
                <Text style={styles.orderItemQty}>{item.quantity}×</Text>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.orderItemPrice}>
                  {formatCurrency(item.product.price * item.quantity)}
                </Text>
              </View>
            ))}

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frete</Text>
              <Text
                style={shipping === 0 ? styles.freeText : styles.summaryValue}
              >
                {shipping === 0 ? "GRÁTIS" : formatCurrency(shipping)}
              </Text>
            </View>
            {pixDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>Desconto PIX (5%)</Text>
                <Text style={styles.discountValue}>
                  -{formatCurrency(pixDiscount)}
                </Text>
              </View>
            )}

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(finalTotal)}
              </Text>
            </View>
          </View>
        </View>

        <Button
          label={`Confirmar pedido • ${formatCurrency(finalTotal)}`}
          onPress={handlePlaceOrder}
          isLoading={isLoading}
          fullWidth
          size="lg"
          style={styles.confirmBtn}
        />

        <View style={{ height: spacing["3x1"] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.base },

  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.md },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },

  row: { flexDirection: "row", gap: spacing.sm },
  flex1: { flex: 1 },
  flex2: { flex: 2 },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "15",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentIcon: { fontSize: 20 },
  paymentInfo: { flex: 1 },
  paymentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  paymentLabelActive: { color: colors.textPrimary, fontWeight: "700" },
  paymentDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  summaryCard: { gap: spacing.xs },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 3,
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    minWidth: 20,
  },
  orderItemName: { flex: 1, fontSize: 12, color: colors.textSecondary },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 13, color: colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  freeText: { fontSize: 12, color: colors.success, fontWeight: "800" },
  discountLabel: { fontSize: 13, color: colors.success },
  discountValue: { fontSize: 13, fontWeight: "700", color: colors.success },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  totalValue: { fontSize: 22, fontWeight: "900", color: colors.accent },

  confirmBtn: { marginTop: spacing.sm },
});