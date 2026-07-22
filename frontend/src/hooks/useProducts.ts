import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Product, ProductFilters } from '../types/product.types';
import { productService } from '../service/productService';
import { getRecentlyViewedIds } from '../utils/recentlyViewed';

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(
    async (p = 1, refresh = false) => {
      try {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(p === 1);

        const result = await productService.list({ ...filters, page: p, limit: 20 });

        setProducts((prev) => (p === 1 ? result.data : [...prev, ...result.data]));
        setHasNext(result.pagination.hasNext);
        setPage(p);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [JSON.stringify(filters)]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const loadMore = useCallback(() => {
    if (hasNext && !isLoading) load(page + 1);
  }, [hasNext, isLoading, page, load]);

  const refresh = useCallback(() => load(1, true), [load]);

  return { products, isLoading, isRefreshing, error, hasNext, loadMore, refresh };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .getFeatured()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { products, isLoading };
}

/**
 * Busca os produtos completos correspondentes ao histórico de
 * "vistos recentemente" salvo no AsyncStorage. Recarrega toda vez
 * que a tela ganha foco, para refletir visualizações recém-feitas.
 */
export function useRecentlyViewedProducts(excludeId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const ids = (await getRecentlyViewedIds()).filter((id) => id !== excludeId);
      if (ids.length === 0) {
        setProducts([]);
        return;
      }

      const results = await Promise.all(
        ids.slice(0, 10).map((id) => productService.getById(id).catch(() => null))
      );

      const found = results.filter((p): p is Product => p !== null);
      // Mantém a ordem original (mais recente primeiro)
      const ordered = ids
        .map((id) => found.find((p) => p._id === id))
        .filter((p): p is Product => !!p);

      setProducts(ordered);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [excludeId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { products, isLoading };
}

export function useRelatedProducts(categoryId?: string, excludeId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    productService
      .list({ category: categoryId, limit: 8 })
      .then((res) => {
        setProducts(res.data.filter((p) => p._id !== excludeId).slice(0, 6));
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [categoryId, excludeId]);

  return { products, isLoading };
}