"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { cartService, DbCart } from "@/services/cart.service";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const STORAGE_KEY = "sera-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save cart:", e);
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Map DB items to frontend CartItem interface
  const mapDbCartToItems = (dbCart: DbCart): CartItem[] => {
    return dbCart.items.map((item) => {
      // If productId is populated, use it. Otherwise gracefully fallback.
      const product = item.productId as any;

      return {
        id:
          item._id ||
          `${product?._id || Math.random()}-${item.variant || "novariant"}`, // Ensure unique ID for React key
        name: product?.name || "Unknown Product",
        price: item.price,
        image: product?.images?.[0] || "",
        quantity: item.quantity,
        variant: item.variant,
      };
    });
  };

  // Hydrate from API or localStorage
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (user) {
        try {
          const dbCart = await cartService.getCart();
          setItems(mapDbCartToItems(dbCart));
        } catch (error) {
          console.error("Failed to fetch cart from server:", error);
        }
      } else {
        setItems(loadCart());
      }
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  // Persist whenever items change (ONLY for guest users)
  const didMount = React.useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!user) {
      saveCart(items);
    }
  }, [items, user]);

  // Cross-tab sync (ONLY for guest users)
  useEffect(() => {
    if (user) return; // DB carts don't cross-tab sync via storage event right now
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setItems(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [user]);

  const addToCart = useCallback(
    async (newItem: CartItem) => {
      if (user) {
        try {
          // The product detail page passes productId-variant as the newItem.id.
          // We need the raw productId for the DB. We'll extract it carefully.
          // In the ProductDetailPage: `id: product._id + (variant ? "-" + variant : "")`
          // So raw productId is the first part before `-`.
          const cleanProductId = newItem.id.split("-")[0];

          const dbCart = await cartService.addToCart(
            cleanProductId,
            newItem.quantity,
            newItem.variant,
          );
          setItems(mapDbCartToItems(dbCart));
        } catch (e) {
          console.error("Failed to add to server cart:", e);
        }
      } else {
        setItems((prev) => {
          const existingIdx = prev.findIndex(
            (i) => i.id === newItem.id && i.variant === newItem.variant,
          );
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: updated[existingIdx].quantity + newItem.quantity,
            };
            return updated;
          }
          return [...prev, newItem];
        });
      }
    },
    [user],
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (user) {
        try {
          const dbCart = await cartService.removeFromCart(id);
          setItems(mapDbCartToItems(dbCart));
        } catch (e) {
          console.error("Failed to remove from server cart:", e);
        }
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [user],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity < 1) return;
      if (user) {
        try {
          const dbCart = await cartService.updateCartItem(id, quantity);
          setItems(mapDbCartToItems(dbCart));
        } catch (e) {
          console.error("Failed to update server cart quantity:", e);
        }
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
        );
      }
    },
    [user],
  );

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        const dbCart = await cartService.clearCart();
        setItems(mapDbCartToItems(dbCart));
      } catch (e) {
        console.error("Failed to clear server cart:", e);
      }
    } else {
      setItems([]);
    }
  }, [user]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {!loading && children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
