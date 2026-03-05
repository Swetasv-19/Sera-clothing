"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { wishlistService, WishlistItem } from "@/services/wishlist.service";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  count: number;
}

type WishlistAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_WISHLIST"; payload: WishlistItem[] }
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "UPDATE_ITEM"; payload: WishlistItem };

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  count: 0,
};

const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction,
): WishlistState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_WISHLIST":
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
        count: action.payload.length,
      };
    case "ADD_ITEM":
      return {
        ...state,
        items: [action.payload, ...state.items],
        count: state.count + 1,
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
        count: Math.max(0, state.count - 1),
      };
    case "CLEAR_WISHLIST":
      return { ...state, items: [], count: 0 };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId ? action.payload : item,
        ),
      };
    default:
      return state;
  }
};

interface WishlistContextType extends WishlistState {
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistService.getWishlist();
      if (response.success) {
        // The API may return: data as WishlistItem[] directly
        // or data as { items: WishlistItem[] } (nested wishlist doc)
        const raw = response.data as any;
        const items: WishlistItem[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)
            ? raw.items
            : [];
        dispatch({ type: "SET_WISHLIST", payload: items });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: response.message || "Failed to fetch wishlist",
        });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch wishlist" });
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistService.addToWishlist(productId);
      if (response.success) {
        await fetchWishlist(); // re-sync from server
        toast.success("Added to wishlist!", {
          style: {
            background: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--divider)",
            borderRadius: "0.75rem",
          },
        });
      } else {
        toast.error(response.message || "Failed to add to wishlist");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      toast.error("Failed to add to wishlist");
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        await fetchWishlist(); // re-sync from server
        toast.success("Removed from wishlist");
      } else {
        toast.error(response.message || "Failed to remove from wishlist");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Error removing from wishlist:", error);
    }
  };

  const clearWishlist = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistService.clearWishlist();
      if (response.success) {
        dispatch({ type: "CLEAR_WISHLIST" });
        toast.success("Wishlist cleared");
      } else {
        toast.error(response.message || "Failed to clear wishlist");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      toast.error("Failed to clear wishlist");
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Error clearing wishlist:", error);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some((item) => {
      // productId may be a populated object or a plain string
      const id =
        typeof item.productId === "object"
          ? (item.productId as any)?._id
          : item.productId;
      return id === productId;
    });
  };

  const moveWishlistToCart = async (productId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistService.moveWishlistToCart(productId);
      if (response.success) {
        await fetchWishlist(); // item removed from wishlist server-side
        toast.success("Moved to cart!");
      } else {
        toast.error(response.message || "Failed to move to cart");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      toast.error("Failed to move to cart");
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Error moving to cart:", error);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // Fetch wishlist when user logs in; clear it when user logs out
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      dispatch({ type: "CLEAR_WISHLIST" });
    }
  }, [user]);

  const value: WishlistContextType = {
    ...state,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    moveWishlistToCart,
    toggleWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
