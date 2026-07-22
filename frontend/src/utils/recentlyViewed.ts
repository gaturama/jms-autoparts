import { storage, STORAGE_KEYS } from "./storage";

const MAX_ITEMS = 20;

export const addRecentlyViewed = async (productId: string): Promise<void> => {
  const current =
    (await storage.get<string[]>(STORAGE_KEYS.RECENTLY_VIEWED)) ?? [];
  const withoutCurrent = current.filter((id) => id !== productId);
  const updated = [productId, ...withoutCurrent].slice(0, MAX_ITEMS);
  await storage.set(STORAGE_KEYS.RECENTLY_VIEWED, updated);
};

export const getRecentlyViewedIds = async (): Promise<string[]> => {
  return (await storage.get<string[]>(STORAGE_KEYS.RECENTLY_VIEWED)) ?? [];
};

export const clearRecentlyViewed = async (): Promise<void> => {
  await storage.remove(STORAGE_KEYS.RECENTLY_VIEWED);
};
