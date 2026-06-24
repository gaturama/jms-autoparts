import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ScrollView, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStackParamList } from '../../types/navigation.types';
import { ProductFilters } from '../../types/product.types';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProdutoCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { CategoryChip } from '../../components/category/CategoryChip';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';
import { STATIC_CATEGORIES } from '../../data/categories';

type Nav = StackNavigationProp<AppStackParamList>;

const SORT_OPTIONS = [
  { label: 'Mais recentes', value: 'newest' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais avaliados', value: 'rating' },
] as const;

export default function CatalogScreen() {
  const navigation = useNavigation<Nav>();
  const [filters, setFilters] = useState<ProductFilters>({ sort: 'newest' });
  const [showSort, setShowSort] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const { products, isLoading, isRefreshing, loadMore, refresh } = useProducts(filters);

  const selectCategory = useCallback(
    (slug: string) => {
      const next = selectedCat === slug ? null : slug;
      setSelectedCat(next);
      setFilters((f) => ({ ...f, category: next ?? undefined, page: 1 }));
    },
    [selectedCat]
  );

  const selectSort = (value: string) => {
    setFilters((f) => ({ ...f, sort: value as ProductFilters['sort'] }));
    setShowSort(false);
  };

  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? 'Ordenar';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>CATÁLOGO</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.actionIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowSort(true)}
            >
              <Text style={styles.actionIcon}>⇅</Text>
              <Text style={styles.actionLabel} numberOfLines={1}>{currentSort}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          <TouchableOpacity
            style={[styles.allChip, !selectedCat && styles.allChipActive]}
            onPress={() => selectCategory('')}
          >
            <Text style={[styles.allChipText, !selectedCat && styles.allChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {STATIC_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.slug}
              name={cat.name}
              icon={cat.icon}
              color={cat.color}
              isSelected={selectedCat === cat.slug}
              onPress={() => selectCategory(cat.slug)}
            />
          ))}
        </ScrollView>
        <View style={styles.divider} />
      </View>

      {/* Products */}
      {isLoading && products.length === 0 ? (
        <LoadingSpinner fullScreen label="Carregando produtos..." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
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
          ListEmptyComponent={
            <EmptyState
              emoji="📦"
              title="Nenhum produto encontrado"
              subtitle="Tente mudar os filtros ou a categoria selecionada"
              actionLabel="Limpar filtros"
              onAction={() => {
                setFilters({ sort: 'newest' });
                setSelectedCat(null);
              }}
            />
          }
          ListFooterComponent={
            isLoading && products.length > 0 ? <LoadingSpinner /> : null
          }
        />
      )}

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide" onRequestClose={() => setShowSort(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSort(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>ORDENAR POR</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.sortOption, filters.sort === opt.value && styles.sortOptionActive]}
                onPress={() => selectSort(opt.value)}
              >
                <Text style={[styles.sortLabel, filters.sort === opt.value && styles.sortLabelActive]}>
                  {opt.label}
                </Text>
                {filters.sort === opt.value && <Text style={styles.sortCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  title: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, letterSpacing: 3 },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    maxWidth: 140,
  },
  actionIcon: { fontSize: 14 },
  actionLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', flexShrink: 1 },

  catScroll: { paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  allChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.card, marginRight: spacing.sm,
  },
  allChipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  allChipText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  allChipTextActive: { color: colors.primary, fontWeight: '700' },

  divider: { height: 1, backgroundColor: colors.border },

  list: { padding: spacing.base, paddingBottom: spacing['3x1'] },
  row: { justifyContent: 'space-between' },

  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderWidth: 1, borderColor: colors.border, padding: spacing.xl, paddingBottom: spacing['3x1'],
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: colors.border,
    borderRadius: radius.full, alignSelf: 'center', marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 12, fontWeight: '800', color: colors.textMuted,
    letterSpacing: 2, marginBottom: spacing.lg,
  },
  sortOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sortOptionActive: { borderBottomColor: colors.primary },
  sortLabel: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  sortLabelActive: { color: colors.primary, fontWeight: '700' },
  sortCheck: { fontSize: 16, color: colors.primary, fontWeight: '700' },
});