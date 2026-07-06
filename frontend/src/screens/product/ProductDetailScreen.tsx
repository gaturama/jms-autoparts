import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppStackParamList } from "../../types/navigation.types";
import { Product, Review } from "../../types/product.types";
import { productService } from "../../service/productService";
import { wishlistService } from "../../service/wishlistService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { PriceTag } from "../../components/product/PriceTag";
import { ProductRating } from "../../components/product/ProductRating";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { resolveProductImage } from "../../utils/imageHelpers";
import { formatDateFull } from "../../utils/formatDate";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Route = RouteProp<AppStackParamList, "ProductDetail">;
type Nav = StackNavigationProp<AppStackParamList>;

export default function ProductDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { productId } = route.params;
  const { addItem, isInCart, getQuantity } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imageSource, setImageSource] = useState<{ uri: string } | number>(
    require("../../assets/images/placeholder-product.png"),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc",
  );
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      productService.getById(productId),
      productService.getReviews(productId),
    ])
      .then(([p, r]) => {
        setProduct(p);
        setReviews(r);
        return resolveProductImage(productId);
      })
      .then(setImageSource)
      .catch(() => Alert.alert("Erro", "Produto não encontrado"))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) return;
    addItem(product);
    Alert.alert("Adicionado", `${product.name} foi adicionado ao carrinho.`, [
      { text: "Continuar", style: "cancel" },
      {
        text: "Ver carrinho",
        onPress: () => navigation.navigate("MainTabs", {
          screen: "CartTab",
          params: undefined,
        }),
      },
    ]);
  };

  const toggleWishlist = async () => {
    if (!user) {
      Alert.alert("Login necessário", "Faça login para salvar produtos.");
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistService.remove(productId);
        setInWishlist(false);
      } else {
        await wishlistService.add(productId);
        setInWishlist(true);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a lista de desejos.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert("Login necessário", "Faça login para avaliar.");
      return;
    }
    if (!reviewForm.comment.trim() || reviewForm.comment.length < 5) {
      Alert.alert("Erro", "Comentário muito curto (mín. 5 caracteres).");
      return;
    }
    setSubmittingReview(true);
    try {
      const newReview = await productService.createReview(
        productId,
        reviewForm,
      );
      setReviews((prev) => [newReview, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      Alert.alert("Avaliação enviada", "Obrigado pelo seu feedback!");
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao enviar avaliação",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading)
    return <LoadingSpinner fullScreen label="Carregando produto..." />;
  if (!product) return null;

  const inCart = isInCart(product._id);
  const cartQty = getQuantity(product._id);
  const category =
    typeof product.category === "object" ? product.category : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title={product.name}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            onPress={toggleWishlist}
            disabled={wishlistLoading}
            style={styles.wishBtn}
          >
            {wishlistLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons
                name={inWishlist ? "heart" : "heart-outline"}
                size={22}
                color={inWishlist ? colors.primary : colors.textSecondary}
              />
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          {product.stock === 0 && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>ESGOTADO</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
            {category && <Badge label={category.name} variant="default" />}
            {product.isFeatured && (
              <Badge label="DESTAQUE" variant="accent" />
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <ProductRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size={16}
          />

          <View style={styles.priceSpacer}>
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />
          </View>

          <View style={styles.stockRow}>
            <View
              style={[
                styles.stockDot,
                {
                  backgroundColor:
                    product.stock > 0 ? colors.success : colors.error,
                },
              ]}
            />
            <Text style={styles.stockText}>
              {product.stock === 0
                ? "Sem estoque"
                : product.stock <= 5
                  ? `Últimas ${product.stock} unidades`
                  : `${product.stock} em estoque`}
            </Text>
            {inCart && (
              <Text style={styles.inCartText}>• {cartQty} no carrinho</Text>
            )}
          </View>
        </View>

        <View style={styles.tabs}>
          {(["desc", "specs", "reviews"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === "desc"
                  ? "Descrição"
                  : tab === "specs"
                    ? "Especif."
                    : `Avaliações (${reviews.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "desc" && (
            <>
              <Text style={styles.description}>{product.description}</Text>
              {product.tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {product.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={styles.skuText}>SKU: {product.sku}</Text>
            </>
          )}

          {activeTab === "specs" && (
            <View style={styles.specsTable}>
              {Object.entries(product.specs).length === 0 ? (
                <Text style={styles.noSpecs}>
                  Nenhuma especificação cadastrada.
                </Text>
              ) : (
                Object.entries(product.specs).map(([key, value], i) => (
                  <View
                    key={key}
                    style={[styles.specRow, i % 2 === 0 && styles.specRowAlt]}
                  >
                    <Text style={styles.specKey}>{key}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === "reviews" && (
            <View>
              {user && (
                <View style={styles.reviewForm}>
                  <Text style={styles.reviewFormTitle}>SUA AVALIAÇÃO</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() =>
                          setReviewForm((f) => ({ ...f, rating: s }))
                        }
                      >
                        <Ionicons
                          name={s <= reviewForm.rating ? "star" : "star-outline"}
                          size={26}
                          color={s <= reviewForm.rating ? colors.star : colors.starEmpty}
                        />
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.starLabel}>{reviewForm.rating}/5</Text>
                  </View>
                  <View style={styles.commentInput}>
                    <Text
                      style={styles.commentPlaceholder}
                      onPress={() => {
                        Alert.prompt(
                          "Seu comentário",
                          "Descreva sua experiência com o produto",
                          (text) =>
                            setReviewForm((f) => ({
                              ...f,
                              comment: text ?? "",
                            })),
                          "plain-text",
                          reviewForm.comment,
                        );
                      }}
                    >
                      {reviewForm.comment ||
                        "Toque para escrever seu comentário..."}
                    </Text>
                  </View>
                  <Button
                    label="Enviar avaliação"
                    onPress={handleSubmitReview}
                    isLoading={submittingReview}
                    size="sm"
                    style={styles.reviewSubmitBtn}
                  />
                </View>
              )}

              {reviews.length === 0 ? (
                <Text style={styles.noReviews}>
                  Seja o primeiro a avaliar este produto.
                </Text>
              ) : (
                reviews.map((r) => (
                  <View key={r._id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>
                          {r.user.name[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.reviewMeta}>
                        <Text style={styles.reviewUser}>{r.user.name}</Text>
                        <Text style={styles.reviewDate}>
                          {formatDateFull(r.createdAt)}
                        </Text>
                      </View>
                      <View style={styles.reviewRating}>
                        <Ionicons name="star" size={12} color={colors.star} />
                        <Text style={styles.reviewRatingText}>
                          {r.rating}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{r.comment}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>TOTAL</Text>
          <PriceTag price={product.price} size="md" />
        </View>
        <Button
          label={
            product.stock === 0
              ? "Esgotado"
              : inCart
                ? `No carrinho (${cartQty})`
                : "Adicionar ao carrinho"
          }
          onPress={handleAddToCart}
          disabled={product.stock === 0}
          variant={inCart ? "secondary" : "primary"}
          size="lg"
          style={styles.cartBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  wishBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  wishIcon: { fontSize: 22 },

  imageWrapper: {
    height: 280,
    backgroundColor: colors.cardAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldOutText: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.error,
    letterSpacing: 4,
  },

  infoSection: {
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  brand: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 2,
  },
  productName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  priceSpacer: { marginVertical: spacing.md },
  stockRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { fontSize: 12, color: colors.textSecondary, fontWeight: "500" },
  inCartText: { fontSize: 12, color: colors.success, fontWeight: "600" },

  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: "600", color: colors.textMuted },
  tabTextActive: { color: colors.primary, fontWeight: "700" },

  tabContent: { padding: spacing.base },

  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: colors.textMuted },
  skuText: { fontSize: 11, color: colors.textMuted, marginTop: spacing.md },

  specsTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  specRow: { flexDirection: "row", padding: spacing.md },
  specRowAlt: { backgroundColor: colors.cardAlt },
  specKey: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  specValue: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: "right",
  },
  noSpecs: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    padding: spacing.xl,
  },

  reviewForm: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  reviewFormTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  starLabel: { fontSize: 12, color: colors.textMuted, marginLeft: spacing.xs },
  commentInput: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 70,
    marginBottom: spacing.md,
  },
  commentPlaceholder: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  reviewSubmitBtn: { alignSelf: "flex-end" },

  noReviews: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    padding: spacing.xl,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  reviewAvatarText: { fontSize: 14, fontWeight: "700", color: colors.white },
  reviewMeta: { flex: 1 },
  reviewUser: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  reviewDate: { fontSize: 10, color: colors.textMuted },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  reviewRatingText: { fontSize: 12, color: colors.star, fontWeight: "700" },
  reviewComment: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.base,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  bottomPrice: { flex: 1 },
  bottomPriceLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  cartBtn: { flex: 2 },
});