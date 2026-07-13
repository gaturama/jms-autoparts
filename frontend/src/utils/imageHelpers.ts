import { ImageSourcePropType } from 'react-native';
import { storage, STORAGE_KEYS } from './storage';
import { getBundledProductImage } from '../data/productImage';

export const saveProductImage = async (productId: string, base64: string): Promise<void> => {
  await storage.set(STORAGE_KEYS.PRODUCT_IMAGES(productId), base64);
};

export const getProductImage = async (productId: string): Promise<string | null> => {
  return storage.get<string>(STORAGE_KEYS.PRODUCT_IMAGES(productId));
};

export const removeProductImage = async (productId: string): Promise<void> => {
  await storage.remove(STORAGE_KEYS.PRODUCT_IMAGES(productId));
};

export const uriToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const resolveProductImage = async (
  productId: string,
  slug?: string
): Promise<ImageSourcePropType> => {
  const bundled = getBundledProductImage(slug);
  if (bundled) return bundled;

  const base64 = await getProductImage(productId);
  if (base64) return { uri: base64 };

  return require('../assets/images/placeholder-product.png');
};