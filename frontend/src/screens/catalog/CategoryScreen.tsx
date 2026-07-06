import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStackParamList } from '../../types/navigation.types';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProdutoCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Header } from '../../components/layout/Header';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { STATIC_CATEGORIES } from '../../data/categories';

type Route = RouteProp<AppStackParamList, 'Category'>;
type Nav = StackNavigationProp<AppStackParamList>;

export default function CategoryScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { slug, name } = route.params;

  const staticCat = STATIC_CATEGORIES.find((c) => c.slug === slug);
  const { products, isLoading, isRefreshing, loadMore, refresh } = useProducts({ category: slug });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header
        title={name}
        subtitle={staticCat ? slug : undefined}
        onBack={() => navigation.goBack()}
      />

      {isLoading && products.length === 0 ? (
        <LoadingSpinner fullScreen label="Carregando..." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(i) => i._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshing={isRefreshing}
          onRefresh={refresh}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
            />
          )}
          ListHeaderComponent={
            <Text style={styles.count}>
              {products.length} {products.length === 1 ? 'produto' : 'produtos'}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="Nenhum produto nesta categoria"
              subtitle="Volte em breve, estamos sempre atualizando o estoque."
              actionLabel="Voltar"
              onAction={() => navigation.goBack()}
            />
          }
          ListFooterComponent={isLoading && products.length > 0 ? <LoadingSpinner /> : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.base, paddingBottom: spacing['3x1'] },
  row: { justifyContent: 'space-between' },
  count: {
    fontSize: 11, color: colors.textMuted, fontWeight: '600',
    letterSpacing: 0.5, marginBottom: spacing.md, textTransform: 'uppercase',
  },
});