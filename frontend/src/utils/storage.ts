import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`[storage] Failed to set key: ${key}`);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      console.error(`[storage] Failed to remove key: ${key}`);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {
      console.error('[storage] Failed to clear storage');
    }
  },
};

export const STORAGE_KEYS = {
  TOKEN: '@autoparts:token',
  USER: '@autoparts:user',
  CART: '@autoparts:cart',
  PRODUCT_IMAGES: (id: string) => `@autoparts:img:${id}`,
} as const;