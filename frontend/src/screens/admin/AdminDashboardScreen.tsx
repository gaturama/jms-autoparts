import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppStackParamList } from "../../types/navigation.types";
import { Order } from "../../types/order.types";
import api from "../../service/api";
import { Header } from "../../components/layout/Header";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Nav = StackNavigationProp<AppStackParamList>;

interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: (Order & { user: { name: string; email: string } })[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: colors.statusPending,
  confirmed: colors.statusConfirmed,
  shipped: colors.statusShipped,
  delivered: colors.statusDelivered,
  cancelled: colors.statusCancelled,
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function AdminDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = async (refresh = false) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      const { data } = await api.get("/admin/stats");
      setStats(data.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Receita total",
          value: formatCurrency(stats.totalRevenue),
          icon: "cash-outline" as const,
          color: colors.accent,
        },
        {
          label: "Pedidos",
          value: String(stats.totalOrders),
          icon: "cube-outline" as const,
          color: colors.statusConfirmed,
        },
        {
          label: "Clientes",
          value: String(stats.totalUsers),
          icon: "people-outline" as const,
          color: colors.statusShipped,
        },
        {
          label: "Produtos ativos",
          value: String(stats.totalProducts),
          icon: "pricetag-outline" as const,
          color: colors.primary,
        },
      ]
    : [];

  const quickActions = [
    {
      icon: "add-circle-outline" as const,
      label: "Novo produto",
      onPress: () => navigation.navigate("AdminAddProduct", {}),
    },
    {
      icon: "cube-outline" as const,
      label: "Produtos",
      onPress: () => navigation.navigate("AdminProducts"),
    },
    {
      icon: "clipboard-outline" as const,
      label: "Pedidos",
      onPress: () => navigation.navigate("AdminOrders"),
    },
  ];

  if (isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Painel Admin" onBack={() => navigation.goBack()} />
        <LoadingSpinner fullScreen label="Carregando dados..." />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Painel Admin" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.welcome}>
          <View style={styles.welcomeTitleRow}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.textPrimary}
            />
            <Text style={styles.welcomeTitle}>Dashboard</Text>
          </View>
          <Text style={styles.welcomeSub}>Visão geral da sua loja</Text>
        </View>

        <View style={styles.statsGrid}>
          {statCards.map((card, i) => (
            <View
              key={i}
              style={[styles.statCard, { borderLeftColor: card.color }]}
            >
              <Ionicons
                name={card.icon}
                size={22}
                color={card.color}
                style={styles.statIcon}
              />
              <Text style={[styles.statValue, { color: card.color }]}>
                {card.value}
              </Text>
              <Text style={styles.statLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
          <View style={styles.actionsRow}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <Ionicons name={action.icon} size={24} color={colors.primary} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {stats && stats.recentOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>PEDIDOS RECENTES</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AdminOrders")}
                style={styles.manageRow}
              >
                <Text style={styles.seeAll}>Ver todos</Text>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            {stats.recentOrders.map((order) => {
              const statusColor =
                STATUS_COLORS[order.status] ?? colors.textMuted;
              return (
                <TouchableOpacity
                  key={order._id}
                  style={styles.orderRow}
                  onPress={() =>
                    navigation.navigate("OrderDetail", { orderId: order._id })
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>
                      #{order._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text style={styles.orderUser}>
                      {order.user?.name ?? "Usuário não encontrado"}
                    </Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderTotal}>
                      {formatCurrency(order.total)}
                    </Text>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColor },
                      ]}
                    />
                    <Text style={[styles.orderStatus, { color: statusColor }]}>
                      {STATUS_LABELS[order.status]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: spacing["3x1"] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  welcome: {
    padding: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  welcomeTitle: { fontSize: 20, fontWeight: "900", color: colors.textPrimary },
  welcomeSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: spacing.sm,
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  statCard: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    padding: spacing.md,
  },
  statIcon: { fontSize: 22, marginBottom: spacing.xs },
  statValue: { fontSize: 22, fontWeight: "900" },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  section: {
    margin: spacing.base,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  seeAll: { fontSize: 12, color: colors.primary, fontWeight: "600" },
  manageRow: { flexDirection: "row", alignItems: "center", gap: 2 },

  actionsRow: { flexDirection: "row", gap: spacing.sm },
  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },

  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderInfo: { flex: 1 },
  orderId: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  orderUser: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  orderDate: { fontSize: 10, color: colors.textMuted },
  orderRight: { alignItems: "flex-end", gap: 3 },
  orderTotal: { fontSize: 14, fontWeight: "800", color: colors.accent },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  orderStatus: { fontSize: 10, fontWeight: "700" },
});
