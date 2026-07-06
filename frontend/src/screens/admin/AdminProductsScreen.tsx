import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppStackParamList } from "../../types/navigation.types";
import { Product } from "../../types/product.types";
import { productService } from "../../service/productService";
import { Header } from "../../components/layout/Header";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Badge } from "../../components/common/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Nav = StackNavigationProp<AppStackParamList>;

export default function AdminProductsScreen() {
  const navigation = useNavigation<Nav>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      const result = await productService.list({ limit: 100 });
      setProducts(result.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = (product: Product) => {
    Alert.alert(
      "Remover produto",
      `Deseja remover "${product.name}"?\nEle ficará invisível no catálogo.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await productService.delete(product._id);
              setProducts((prev) => prev.filter((p) => p._id !== product._id));
            } catch (err) {
              Alert.alert(
                "Erro",
                err instanceof Error ? err.message : "Falha ao remover produto",
              );
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Product }) => {
    const category =
      typeof item.category === "object" ? item.category.name : "—";
    return (
      <View style={styles.card}>
        <View style={styles.cardMain}>
          {/* Stock indicator */}
          <View
            style={[
              styles.stockBar,
              {
                backgroundColor:
                  item.stock === 0
                    ? colors.error
                    : item.stock <= 3
                      ? colors.warning
                      : colors.success,
              },
            ]}
          />

          <View style={styles.cardInfo}>
            <View style={styles.cardTopRow}>
              <Text style={styles.brand}>{item.brand}</Text>
              {item.isFeatured && <Badge label="Destaque" variant="accent" />}
              {item.stock === 0 && <Badge label="Esgotado" variant="error" />}
            </View>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{category}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>SKU: {item.sku}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{item.stock} un.</Text>
            </View>
          </View>

          <View style={styles.cardRight}>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate("AdminAddProduct", { productId: item._id })
            }
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={14} color={colors.info} />
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={14} color={colors.error} />
            <Text style={styles.deleteBtnText}>Remover</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: item._id })
            }
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.viewBtnText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Produtos" onBack={() => navigation.goBack()} />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title="Produtos"
        subtitle={`${products.length} cadastrados`}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("AdminAddProduct", {})}
          >
            <Ionicons name="add" size={14} color={colors.white} />
            <Text style={styles.addBtnText}>Novo</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={products}
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
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title="Nenhum produto cadastrado"
            actionLabel="Adicionar produto"
            onAction={() => navigation.navigate("AdminAddProduct", {})}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.base, paddingBottom: spacing["3x1"] },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  addBtnText: { fontSize: 12, fontWeight: "700", color: colors.white },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  cardMain: { flexDirection: "row", alignItems: "stretch" },
  stockBar: { width: 4 },
  cardInfo: { flex: 1, padding: spacing.md },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 4,
  },
  brand: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 18,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaText: { fontSize: 10, color: colors.textMuted },
  metaDot: { fontSize: 10, color: colors.border },
  cardRight: {
    padding: spacing.md,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  price: { fontSize: 15, fontWeight: "900", color: colors.accent },

  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cardAlt,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  editBtnText: { fontSize: 12, fontWeight: "600", color: colors.info },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  deleteBtnText: { fontSize: 12, fontWeight: "600", color: colors.error },
  viewBtn: { flex: 1, flexDirection: "row", gap: 4, paddingVertical: spacing.sm, alignItems: "center", justifyContent: "center" },
  viewBtnText: { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
});