import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../types/navigation.types';
import { Product } from '../../types/product.types';
import { productService } from '../../service/productService';
import { ProductCard } from '../../components/product/ProdutoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';
import { STATIC_CATEGORIES } from '../../data/categories';

type Nav = StackNavigationProp<AppStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    productService
      .search(debouncedQuery)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Buscar pneus, rodas, óleo..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        {isLoading && <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />}
        {!!query && !isLoading && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.divider} />

      {!hasSearched ? (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>NAVEGUE POR CATEGORIA</Text>
          <View style={styles.catGrid}>
            {STATIC_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.slug}
                style={styles.catPill}
                onPress={() => navigation.navigate('Category', { slug: cat.slug, name: cat.name })}
                activeOpacity={0.8}
              >
                <Ionicons name="construct-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.catPillText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : results.length === 0 && !isLoading ? (
        <EmptyState
          icon="search-outline"
          title={`Sem resultados para "${query}"`}
          subtitle="Tente buscar por marca, categoria ou nome do produto"
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(i) => i._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
            </Text>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm, gap: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  backIcon: { fontSize: 22, color: colors.textPrimary, fontWeight: '300' },
  input: {
    flex: 1, height: 42, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, color: colors.textPrimary, fontSize: 14,
  },
  loader: { position: 'absolute', right: spacing.xl },
  clearBtn: { padding: spacing.xs },
  clearText: { fontSize: 14, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border },

  suggestions: { padding: spacing.base },
  suggestionsTitle: {
    fontSize: 11, fontWeight: '800', color: colors.textMuted,
    letterSpacing: 2, marginBottom: spacing.md,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  catPillIcon: { fontSize: 14 },
  catPillText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  resultCount: {
    fontSize: 12, color: colors.textMuted, fontWeight: '600',
    marginBottom: spacing.md, letterSpacing: 0.3,
  },
  list: { padding: spacing.base, paddingBottom: spacing['3x1'] },
  row: { justifyContent: 'space-between' },
});