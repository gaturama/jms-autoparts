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
import { wishlistService } from "../../service/wishlistService";
import { useCart } from "../../context/CartContext";
import { Header } from "../../components/layout/Header";
import { ProductCard } from "../../components/product/ProdutoCard";
import { EmptyState } from "../../components/common/EmptyState";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

type Nav = StackNavigationProp<AppStackParamList>;

export default function WishlistScreen() {
  const navigation = useNavigation<Nav>();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      const data = await wishlistService.get();
      setProducts(data);
    } catch {
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (productId: string) => {
    try {
      await wishlistService.remove(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch {
      Alert.alert("Erro", "Não foi possível remover da lista de desejos.");
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    Alert.alert("Adicionado", `${product.name} foi adicionado ao carrinho.`, [
      { text: "OK" },
      {
        text: "Ver carrinho",
        onPress: () => navigation.navigate("CartTab" as never),
      },
    ]);
  };

  if (isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Lista de desejos" onBack={() => navigation.goBack()} />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title="Lista de desejos"
        subtitle={
          products.length > 0 ? `${products.length} itens salvos` : undefined
        }
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={products}
        keyExtractor={(i) => i._id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: item._id })
              }
            />
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => handleAddToCart(item)}
                disabled={item.stock === 0}
              >
                {item.stock === 0 ? (
                  <Text style={styles.cartBtnText}>Esgotado</Text>
                ) : (
                  <>
                    <Ionicons name="cart-outline" size={12} color={colors.white} />
                    <Text style={styles.cartBtnText}>Adicionar</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item._id)}
              >
                <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Lista de desejos vazia"
            subtitle="Salve produtos que você gostou para encontrá-los facilmente depois"
            actionLabel="Explorar produtos"
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
  row: { justifyContent: "space-between" },
  cardWrapper: { width: "48.5%", marginBottom: spacing.sm },
  cardActions: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: -spacing.xs,
    paddingHorizontal: 2,
  },
  cartBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: spacing.xs + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBtnText: { fontSize: 11, fontWeight: "700", color: colors.white },
  removeBtn: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: { fontSize: 13 },
});