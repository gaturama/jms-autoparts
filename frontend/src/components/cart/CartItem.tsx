import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, type ImageSourcePropType } from "react-native";
import { CartItem as CartItemType } from "../../types/cart.types";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";
import { formatCurrency } from "../../utils/formatCurrency";
import { resolveProductImage } from "../../utils/imageHelpers";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";

interface CartItemProps {
  item: CartItemType;
}

export const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(
    require("../../assets/images/placeholder-product.png"),
  );

  useEffect(() => {
    const loadImage = async () => {
      const source = await resolveProductImage(
        item.product._id,
        item.product.slug,
      );

      setImageSource(source);
    };

    loadImage();
  }, [item.product._id, item.product.slug]);

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.brand}>{item.product.brand.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.product.price)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => removeItem(item.product._id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash" size={20} color="#f5f5f5" />
        </TouchableOpacity>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.product._id, item.quantity - 1)}
            style={styles.qtyBtn}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.product._id, item.quantity + 1)}
            style={styles.qtyBtn}
            disabled={item.quantity >= item.product.stock}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtotal}>
          {formatCurrency(item.product.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  image: { width: 90, height: 90, backgroundColor: colors.cardAlt },
  info: { flex: 1, padding: spacing.sm },
  brand: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 16,
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
    marginTop: spacing.xs,
  },
  controls: {
    padding: spacing.sm,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  deleteBtn: { padding: spacing.xs },
  deleteText: { fontSize: 14 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
    lineHeight: 20,
  },
  qty: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    minWidth: 20,
    textAlign: "center",
  },
  subtotal: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
});
