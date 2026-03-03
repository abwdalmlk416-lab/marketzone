import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@shared/schema";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  total: number;
  storeId: number | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculate total safely handling string/number types
  const total = items.reduce((sum, item) => sum + (parseFloat(item.price as string) * item.quantity), 0);
  
  // A cart usually belongs to a single store in marketplaces
  const storeId = items.length > 0 ? items[0].storeId : null;

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      // Check if trying to add from a different store
      if (prev.length > 0 && prev[0].storeId !== product.storeId) {
        // In a real app, prompt user. Here we just clear and replace for simplicity.
        return [{ ...product, quantity }];
      }

      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, storeId }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
