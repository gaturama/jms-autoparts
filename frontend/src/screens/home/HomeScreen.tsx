import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStackParamList } from "../../types/navigation.types";
import { useAuth } from "../../context/AuthContext";
import { useFeaturedProducts } from "../../hooks/useProducts";
import { categoryService } from "../../service/productService";
import { Category } from "../../types/product.types";
import { ProductCard } from "../../components/product/ProdutoCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";
import { STATIC_CATEGORIES } from "../../data/categories";
import { Ionicons } from "@expo/vector-icons";

type Nav = StackNavigationProp<AppStackParamList>;

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { products: featured, isLoading: loadingFeatured } =
    useFeaturedProducts();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService
      .list()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const cats =
    categories.length > 0
      ? categories
      : STATIC_CATEGORIES.map((c, i) => ({
          _id: String(i),
          ...c,
          description: "",
          productCount: 0,
          isActive: true,
        }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {user?.name?.split(" ")[0] ?? "visitante"}
            </Text>
            <Text style={styles.logo}>
              AUTO<Text style={styles.logoAccent}>PARTS</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={styles.searchBtn}
          >
            <Ionicons name="search" size={18} color="#E94560" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>DESTAQUE DA SEMANA</Text>
            <Text style={styles.heroTitle}>Performance{"\n"}no seu DNA</Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation.navigate("CatalogTab" as never)}
            >
              <Text style={styles.heroBtnText}>VER CATÁLOGO →</Text>
            </TouchableOpacity>
          </View>
          <Ionicons
            name="speedometer-outline"
            size={64}
            color={colors.primary}
            style={{ marginLeft: spacing.md }}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CATEGORIAS</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CatalogTab" as never)}
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <Text style={styles.seeAll}>Ver todas</Text>
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {cats.map((cat) => {
              const staticCat = STATIC_CATEGORIES.find(
                (s) => s.slug === cat.slug,
              );
              return (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.catCard}
                  onPress={() =>
                    navigation.navigate("Category", {
                      slug: cat.slug,
                      name: cat.name,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="construct-outline"
                    size={26}
                    color={colors.primary}
                    style={styles.catIcon}
                  />
                  <Text style={styles.catName}>{cat.name}</Text>
                  {cat.productCount > 0 && (
                    <Text style={styles.catCount}>
                      {cat.productCount} itens
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EM DESTAQUE</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CatalogTab" as never)}
            >
              <Text style={styles.seeAll}>Ver todos →</Text>
            </TouchableOpacity>
          </View>

          {loadingFeatured ? (
            <LoadingSpinner />
          ) : (
            <FlatList
              data={featured}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate("ProductDetail", {
                      productId: item._id,
                    })
                  }
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Nenhum produto em destaque.
                </Text>
              }
            />
          )}
        </View>

        {user?.role === "admin" && (
          <TouchableOpacity
            style={styles.adminCard}
            onPress={() => navigation.navigate("AdminDashboard")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.primary}
            />
            <View>
              <Text style={styles.adminTitle}>PAINEL ADMIN</Text>
              <Text style={styles.adminSub}>
                Gerenciar produtos, pedidos e estoque
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        )}

        <View style={{ height: spacing["2xl"] }} />
      </ScrollView>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },
  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 3,
  },
  logoAccent: { color: colors.primary },
  searchBtn: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 18 },

  heroBanner: {
    margin: spacing.base,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  heroContent: { flex: 1 },
  heroLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: spacing.lg,
  },
  heroBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  heroBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 1,
  },
  heroEmoji: { fontSize: 64, marginLeft: spacing.md },

  section: { paddingHorizontal: spacing.base, marginTop: spacing.lg },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  seeAll: { fontSize: 12, color: colors.primary, fontWeight: "600" },

  catScroll: { paddingBottom: spacing.sm },
  catCard: {
    width: 86,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  catIcon: { fontSize: 28, marginBottom: spacing.xs },
  catName: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  catCount: { fontSize: 9, color: colors.textMuted, marginTop: 2 },

  productRow: { justifyContent: "space-between", marginBottom: 0 },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
    padding: spacing.xl,
  },

  adminCard: {
    margin: spacing.base,
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.base,
    gap: spacing.md,
  },
  adminIcon: { fontSize: 24 },
  adminTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  adminSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  adminArrow: { fontSize: 18, color: colors.textMuted, marginLeft: "auto" },
});