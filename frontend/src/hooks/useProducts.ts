import { useCallback, useEffect, useState } from 'react';
import { Product, ProductFilters } from '../types/product.types';
import { productService } from '../service/productService';

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