import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => Promise<void>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.get<T>(key).then((saved) => {
      if (saved !== null) setStoredValue(saved);
      setIsLoading(false);
    });
  }, [key]);

  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      const next =
        typeof value === 'function'
          ? (value as (prev: T) => T)(storedValue)
          : value;
      setStoredValue(next);
      await storage.set(key, next);
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoading];
}