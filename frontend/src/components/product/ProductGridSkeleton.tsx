import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../styles/spacing';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 6 }) => {
  const rows = Math.ceil(count / 2);

  return (
    <View>
      {Array.from({ length: rows }).map((_, i) => {
        const hasSecond = i * 2 + 1 < count;
        return (
          <View key={i} style={styles.row}>
            <ProductCardSkeleton />
            <View style={{ width: spacing.sm }} />
            {hasSecond ? <ProductCardSkeleton /> : <View style={{ flex: 1 }} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: spacing.md },
});