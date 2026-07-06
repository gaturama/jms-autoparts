import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export const ProductRating: React.FC<ProductRatingProps> = ({
  rating,
  reviewCount,
  size = 14,
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <View style={styles.row}>
      {stars.map((filled, i) => (
        <Ionicons
          key={i}
          name={filled ? 'star' : 'star-outline'}
          size={size}
          color={filled ? colors.star : colors.starEmpty}
        />
      ))}
      <Text style={[styles.rating, { fontSize: size - 2 }]}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size - 3 }]}>({reviewCount})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontWeight: '400' },
  rating: { fontWeight: '700', color: colors.textSecondary, marginLeft: 4 },
  count: { color: colors.textMuted },
});