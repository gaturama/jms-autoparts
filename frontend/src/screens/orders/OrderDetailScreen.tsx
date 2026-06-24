import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStackParamList } from "../../types/navigation.types";
import { Order, OrderStatus } from "../../types/order.types";
import { orderService } from "../../service/orderService";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/common/Button";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateFull } from "../../utils/formatDate";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Route = RouteProp<AppStackParamList, "OrderDetail">;
type Nav = StackNavigationProp<AppStackParamList>;

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: string; color: string }
> = {
  pending: {
    label: "Aguardando pagamento",
    icon: "⏳",
    color: colors.statusPending,
  },
  confirmed: {
    label: "Pedido confirmado",
    icon: "✅",
    color: colors.statusConfirmed,
  },
  shipped: { label: "Em trânsito", icon: "🚚", color: colors.statusShipped },
  delivered: { label: "Entregue", icon: "📦", color: colors.statusDelivered },
  cancelled: { label: "Cancelado", icon: "❌", color: colors.statusCancelled },
};

export default function OrderDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderService
      .getById(orderId)
      .then(setOrder)
      .catch(() => Alert.alert("Erro", "Pedido não encontrado"))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  const handleCancel = () => {
    Alert.alert(
      "Cancelar pedido",
      "Tem certeza que deseja cancelar este pedido?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              const updated = await orderService.cancel(orderId);
              setOrder(updated);
            } catch (err) {
              Alert.alert(
                "Erro",
                err instanceof Error
                  ? err.message
                  : "Não foi possível cancelar",
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Detalhes do pedido" onBack={() => navigation.goBack()} />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );

  if (!order) return null;

  const status = STATUS_CONFIG[order.status];
  const isCancelled = order.status === "cancelled";
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title={`Pedido #${orderId.slice(-8).toUpperCase()}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={[styles.statusHero, { borderColor: status.color }]}>
          <Text style={styles.statusHeroIcon}>{status.icon}</Text>
          <Text style={[styles.statusHeroLabel, { color: status.color }]}>
            {status.label}
          </Text>
          <Text style={styles.statusHeroDate}>
            {formatDateFull(order.updatedAt)}
          </Text>
        </View>

        {!isCancelled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROGRESSO DO PEDIDO</Text>
            <View style={styles.timeline}>
              {STATUS_STEPS.map((step, i) => {
                const cfg = STATUS_CONFIG[step];
                const done = i <= currentStepIndex;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <View key={step} style={styles.timelineStep}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          done && {
                            backgroundColor: cfg.color,
                            borderColor: cfg.color,
                          },
                        ]}
                      >
                        {done && <Text style={styles.timelineDotIcon}>✓</Text>}
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            done &&
                              i < currentStepIndex && {
                                backgroundColor: cfg.color,
                              },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineLabel,
                          done && {
                            color: colors.textPrimary,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {cfg.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITENS DO PEDIDO</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.orderItem}>
              <View style={styles.orderItemQtyBadge}>
                <Text style={styles.orderItemQtyText}>{item.quantity}</Text>
              </View>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.orderItemUnit}>
                  {formatCurrency(item.price)} / un.
                </Text>
              </View>
              <Text style={styles.orderItemTotal}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 ENDEREÇO DE ENTREGA</Text>
          <Text style={styles.addressLine}>{order.shippingAddress.street}</Text>
          <Text style={styles.addressLine}>
            {order.shippingAddress.city} — {order.shippingAddress.state}
          </Text>
          <Text style={styles.addressLine}>
            CEP {order.shippingAddress.zipCode}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 PAGAMENTO</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Método</Text>
            <Text style={styles.summaryValue}>
              {order.paymentMethod.toUpperCase()}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>TOTAL PAGO</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {canCancel && (
          <Button
            label="Cancelar pedido"
            onPress={handleCancel}
            variant="danger"
            isLoading={cancelling}
            fullWidth
            style={styles.cancelBtn}
          />
        )}

        <TouchableOpacity
          style={styles.reorderBtn}
          onPress={() => navigation.navigate("CatalogTab" as never)}
        >
          <Text style={styles.reorderText}>🔄 Comprar novamente</Text>
        </TouchableOpacity>

        <View style={{ height: spacing["3x1"] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.base },

  statusHero: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  statusHeroIcon: { fontSize: 44, marginBottom: spacing.sm },
  statusHeroLabel: { fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
  statusHeroDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },

  timeline: { gap: 0 },
  timelineStep: { flexDirection: "row", gap: spacing.md },
  timelineLeft: { alignItems: "center", width: 24 },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotIcon: { fontSize: 11, color: colors.white, fontWeight: "800" },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  timelineContent: { flex: 1, paddingBottom: spacing.md, paddingTop: 2 },
  timelineLabel: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },

  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderItemQtyBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  orderItemQtyText: { fontSize: 13, fontWeight: "800", color: colors.white },
  orderItemInfo: { flex: 1 },
  orderItemName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 17,
  },
  orderItemUnit: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  orderItemTotal: { fontSize: 14, fontWeight: "800", color: colors.accent },

  addressLine: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  totalValue: { fontSize: 22, fontWeight: "900", color: colors.accent },

  cancelBtn: { marginBottom: spacing.sm },
  reorderBtn: {
    alignItems: "center",
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  reorderText: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },
});
