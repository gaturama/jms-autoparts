import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStackParamList } from "../../types/navigation.types";
import { Order, OrderStatus } from "../../types/order.types";
import api from "../../service/api";
import { Header } from "../../components/layout/Header";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Nav = StackNavigationProp<AppStackParamList>;
type AdminOrder = Order & { user: { name: string; email: string } };

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Aguardando", color: colors.statusPending, icon: "⏳" },
  confirmed: { label: "Confirmado", color: colors.statusConfirmed, icon: "✅" },
  shipped: { label: "Enviado", color: colors.statusShipped, icon: "🚚" },
  delivered: { label: "Entregue", color: colors.statusDelivered, icon: "📦" },
  cancelled: { label: "Cancelado", color: colors.statusCancelled, icon: "❌" },
};

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "Todos", value: "" },
  { label: "Aguardando", value: "pending" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Enviado", value: "shipped" },
  { label: "Entregue", value: "delivered" },
  { label: "Cancelado", value: "cancelled" },
];

export default function AdminOrdersScreen() {
  const navigation = useNavigation<Nav>();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = useCallback(
    async (refresh = false) => {
      try {
        refresh ? setIsRefreshing(true) : setIsLoading(true);
        const params = filterStatus ? { status: filterStatus } : {};
        const { data } = await api.get("/admin/orders", { params });
        setOrders(data.data);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filterStatus],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      Alert.alert(
        "✓ Atualizado",
        `Status alterado para "${STATUS_CONFIG[status].label}"`,
      );
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao atualizar status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const renderOrder = ({ item }: { item: AdminOrder }) => {
    const status = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedOrder(item)}
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.orderId}>
              #{item._id.slice(-8).toUpperCase()}
            </Text>
            <Text style={styles.orderUser}>{item.user?.name ?? "—"}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
            <View
              style={[
                styles.statusPill,
                {
                  borderColor: status.color,
                  backgroundColor: status.color + "20",
                },
              ]}
            >
              <Text style={styles.statusIcon}>{status.icon}</Text>
              <Text style={[styles.statusLabel, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.itemsText}>
            {item.items.length} {item.items.length === 1 ? "item" : "itens"}
            {" · "}
            {item.paymentMethod.toUpperCase()}
          </Text>
          <Text style={styles.manageText}>Gerenciar →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Pedidos" onBack={() => navigation.goBack()} />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title="Pedidos"
        subtitle={`${orders.length} pedidos`}
        onBack={() => navigation.goBack()}
      />

      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.filterChip,
              filterStatus === opt.value && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(opt.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === opt.value && styles.filterChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={orders}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={renderOrder}
        ListEmptyComponent={
          <EmptyState emoji="📋" title="Nenhum pedido encontrado" />
        }
      />

      {/* Order management modal */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedOrder(null)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>
                  PEDIDO #{selectedOrder._id.slice(-8).toUpperCase()}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedOrder.user?.name} ·{" "}
                  {formatCurrency(selectedOrder.total)}
                </Text>

                <View style={styles.modalDivider} />
                <Text style={styles.modalSectionTitle}>ALTERAR STATUS</Text>

                {STATUS_ORDER.map((status) => {
                  const cfg = STATUS_CONFIG[status];
                  const isActive = selectedOrder.status === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusOption,
                        isActive && {
                          borderColor: cfg.color,
                          backgroundColor: cfg.color + "15",
                        },
                      ]}
                      onPress={() => {
                        if (!isActive)
                          handleUpdateStatus(selectedOrder._id, status);
                      }}
                      disabled={isActive || updatingStatus}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.statusOptionIcon}>{cfg.icon}</Text>
                      <Text
                        style={[
                          styles.statusOptionLabel,
                          isActive && { color: cfg.color, fontWeight: "700" },
                        ]}
                      >
                        {cfg.label}
                      </Text>
                      {isActive && (
                        <Text
                          style={[
                            styles.statusOptionCheck,
                            { color: cfg.color },
                          ]}
                        >
                          ✓ Atual
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={styles.viewDetailBtn}
                  onPress={() => {
                    setSelectedOrder(null);
                    navigation.navigate("OrderDetail", {
                      orderId: selectedOrder._id,
                    });
                  }}
                >
                  <Text style={styles.viewDetailText}>
                    Ver detalhes completos →
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  filterBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 52,
  },
  filterScroll: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "20",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  filterChipTextActive: { color: colors.primary, fontWeight: "700" },

  list: { padding: spacing.base, paddingBottom: spacing["3x1"] },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.md,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  orderUser: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  orderDate: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  cardRight: { alignItems: "flex-end", gap: spacing.xs },
  orderTotal: { fontSize: 16, fontWeight: "900", color: colors.accent },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  statusIcon: { fontSize: 11 },
  statusLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  itemsText: { fontSize: 11, color: colors.textMuted },
  manageText: { fontSize: 11, color: colors.primary, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    paddingBottom: spacing["3x1"],
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  modalSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  modalSectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  statusOption: {
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
  statusOptionIcon: { fontSize: 18 },
  statusOptionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  statusOptionCheck: { fontSize: 12, fontWeight: "700" },
  viewDetailBtn: {
    alignItems: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  viewDetailText: { fontSize: 13, color: colors.primary, fontWeight: "600" },
});
