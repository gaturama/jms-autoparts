import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { formatCurrency, formatDiscount } from '../../utils/formatCurrency';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag: React.FC<PriceTagProps> = ({ price, originalPrice, size = 'md' }) => {
  const hasDiscount = !!originalPrice && originalPrice > price;
  const fs = size === 'sm' ? 14 : size === 'md' ? 20 : 28;

  return (
    <View style={styles.container}>
      <Text style={[styles.price, { fontSize: fs }]}>{formatCurrency(price)}</Text>
      {hasDiscount && (
        <View style={styles.discountRow}>
          <Text style={styles.original}>{formatCurrency(originalPrice!)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{formatDiscount(originalPrice!, price)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 4 },
  price: { fontWeight: '900', color: colors.accent },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  original: { fontSize: 12, color: colors.textMuted, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  discountText: { fontSize: 10, fontWeight: '800', color: colors.white },
});