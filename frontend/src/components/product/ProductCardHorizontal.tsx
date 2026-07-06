import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Product } from "../../types/product.types";
import { useCart } from "../../context/CartContext";
import { PriceTag } from "./PriceTag";
import { ProductRating } from "./ProductRating";
import { Badge } from "../common/Badge";
import { resolveProductImage } from "../../utils/imageHelpers";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

interface ProductCardHorizontalProps {
  product: Product;
  onPress: () => void;
  showAddToCart?: boolean;
}

export const ProductCardHorizontal: React.FC<ProductCardHorizontalProps> = ({
  product,
  onPress,
  showAddToCart = true,
}) => {
  const { addItem, isInCart } = useCart();
  const [imageSource, setImageSource] = useState<{ uri: string } | number>(
    require("../../assets/images/placeholder-product.png"),
  );

  useEffect(() => {
    resolveProductImage(product._id).then(setImageSource);
  }, [product._id]);

  const inCart = isInCart(product._id);
  const hasDiscount =
    !!product.originalPrice && product.originalPrice > product.price;
  const category =
    typeof product.category === "object" ? product.category.name : null;

  const handleAdd = () => {
    if (product.stock > 0) addItem(product);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -
              {Math.round(
                ((product.originalPrice! - product.price) /
                  product.originalPrice!) *
                  100,
              )}
              %
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
          {category && <Text style={styles.category}>{category}</Text>}
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <ProductRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size={12}
        />

        <View style={styles.bottomRow}>
          <PriceTag
            price={product.price}
            originalPrice={product.originalPrice}
            size="sm"
          />

          {product.stock === 0 ? (
            <Badge label="Esgotado" variant="error" />
          ) : product.stock <= 3 ? (
            <Badge label={`${product.stock} un.`} variant="warning" />
          ) : null}
        </View>
      </View>

      {showAddToCart && (
        <TouchableOpacity
          style={[
            styles.cartBtn,
            inCart && styles.cartBtnActive,
            product.stock === 0 && styles.cartBtnDisabled,
          ]}
          onPress={handleAdd}
          disabled={product.stock === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.cartBtnText}>{inCart ? "✓" : "+"}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  imageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: colors.cardAlt,
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  discountBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountText: { fontSize: 9, fontWeight: "800", color: colors.white },

  info: { flex: 1, padding: spacing.sm, justifyContent: "space-between" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 3,
  },
  brand: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
  },
  category: { fontSize: 9, color: colors.textMuted },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 17,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  cartBtn: {
    width: 36,
    alignSelf: "stretch",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBtnActive: { backgroundColor: colors.success },
  cartBtnDisabled: { backgroundColor: colors.border },
  cartBtnText: { fontSize: 20, color: colors.white, fontWeight: "700" },
});
