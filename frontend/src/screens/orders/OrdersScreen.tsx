import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStackParamList } from "../../types/navigation.types";
import { Order, OrderStatus } from "../../types/order.types";
import { orderService } from "../../service/orderService";
import { Header } from "../../components/layout/Header";
import { EmptyState } from "../../components/common/EmptyState";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Nav = StackNavigationProp<AppStackParamList>;

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

export default function OrdersScreen() {
  const navigation = useNavigation<Nav>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      const data = await orderService.list();
      setOrders(data);
    } catch {
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renderOrder = ({ item }: { item: Order }) => {
    const status = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("OrderDetail", { orderId: item._id })
        }
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>
              #{item._id.slice(-8).toUpperCase()}
            </Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
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

        <View style={styles.divider} />

        <View style={styles.itemsPreview}>
          {item.items.slice(0, 2).map((oi, i) => (
            <Text key={i} style={styles.itemName} numberOfLines={1}>
              {oi.quantity}× {oi.name}
            </Text>
          ))}
          {item.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{item.items.length - 2} mais itens
            </Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.totalLabel}>TOTAL DO PEDIDO</Text>
            <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text>
          </View>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Meus pedidos" onBack={() => navigation.goBack()} />
        <LoadingSpinner fullScreen label="Carregando pedidos..." />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Meus pedidos" onBack={() => navigation.goBack()} />
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
          <EmptyState
            emoji="📋"
            title="Nenhum pedido ainda"
            subtitle="Seus pedidos aparecerão aqui após a primeira compra"
            actionLabel="Ir ao catálogo"
            onAction={() => navigation.navigate("CatalogTab" as never)}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.base, paddingBottom: spacing["3x1"], flexGrow: 1 },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.md,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  orderDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  statusIcon: { fontSize: 12 },
  statusLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },

  divider: { height: 1, backgroundColor: colors.border },

  itemsPreview: { padding: spacing.md, gap: 3 },
  itemName: { fontSize: 12, color: colors.textSecondary },
  moreItems: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
    marginTop: 2,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.cardAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  totalValue: { fontSize: 16, fontWeight: "900", color: colors.accent },
  arrowText: { fontSize: 18, color: colors.textMuted },
});
