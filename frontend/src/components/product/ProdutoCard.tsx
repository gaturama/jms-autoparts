import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  type ImageSourcePropType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types/product.types';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';
import { formatCurrency, formatDiscount } from '../../utils/formatCurrency';
import { resolveProductImage } from '../../utils/imageHelpers';
import { Badge } from '../common/Badge';

const CARD_WIDTH = (Dimensions.get('window').width - spacing.base * 2 - spacing.sm) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(
      require("../../assets/images/placeholder-product.png"),
    );
  
    useEffect(() => {
      const loadImage = async () => {
        const source = await resolveProductImage(product._id, product.slug);
        setImageSource(source);
      };
  
      loadImage();
    }, [product._id, product.slug]);

  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {formatDiscount(product.originalPrice!, product.price)}
            </Text>
          </View>
        )}
        {product.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={11} color={colors.textInverse} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.star} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>{formatCurrency(product.originalPrice!)}</Text>
          )}
        </View>

        {product.stock === 0 && (
          <Badge label="Esgotado" variant="error" style={styles.stockBadge} />
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <Badge label={`Últimas ${product.stock} un.`} variant="warning" style={styles.stockBadge} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  imageContainer: { position: 'relative', height: 150, backgroundColor: colors.cardAlt },
  image: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute', top: spacing.xs, left: spacing.xs,
    backgroundColor: colors.primary, borderRadius: radius.sm,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  discountText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  featuredBadge: {
    position: 'absolute', top: spacing.xs, right: spacing.xs,
    backgroundColor: colors.accent, borderRadius: radius.sm,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  featuredText: { color: colors.textInverse, fontSize: 10, fontWeight: '800' },
  body: { padding: spacing.sm },
  brand: { fontSize: 9, fontWeight: '700', color: colors.primary, letterSpacing: 1, marginBottom: 2 },
  name: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, lineHeight: 16, marginBottom: spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  ratingText: { fontSize: 11, color: colors.star, fontWeight: '600', marginLeft: 3 },
  reviewCount: { fontSize: 10, color: colors.textMuted, marginLeft: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { fontSize: 15, fontWeight: '800', color: colors.accent },
  originalPrice: { fontSize: 10, color: colors.textMuted, textDecorationLine: 'line-through' },
  stockBadge: { marginTop: spacing.xs },
});