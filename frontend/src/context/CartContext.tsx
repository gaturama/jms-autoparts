import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem, CartState } from '../types/cart.types';
import { Product } from '../types/product.types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface CartContextData extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

const calcCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    storage.get<CartItem[]>(STORAGE_KEYS.CART).then((saved) => {
      if (saved) setItems(saved);
    });
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEYS.CART, items);
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product._id === product._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product._id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product._id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product._id === productId),
    [items]
  );

  const getQuantity = useCallback(
    (productId: string) => items.find((i) => i.product._id === productId)?.quantity ?? 0,
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        total: calcTotal(items),
        itemCount: calcCount(items),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};