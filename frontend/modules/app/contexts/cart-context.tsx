import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../libs/api/cartService';
import { dataManager, DATA_EVENTS } from '../libs/services/data-manager';
import { useClientSide } from '../libs/utils/useClientSide';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (item: {
    itemId: string;
    name: string;
    price: number;
    quantity?: number;
    imageUrl?: string;
  }) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  pendingChangesCount: number;
  isOnline: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true); // Default to true for SSR
  const isClient = useClientSide();

  // Initialize data manager on client side
  useEffect(() => {
    if (isClient) {
      dataManager.initialize();
      setIsOnline(dataManager.isOnlineMode());
    }
  }, [isClient]);

  // Load initial cart data only on client side
  useEffect(() => {
    if (isClient) {
      loadCartData();
    }
  }, [isClient]);

  // Listen to data manager events
  useEffect(() => {
    if (!isClient) return;

    const handleCartUpdate = (items: CartItem[]) => {
      setCartItems(items);
      setLoading(false);
      setError(null);
    };

    const handleOnlineMode = () => {
      setIsOnline(true);
      setError(null);
    };

    const handleOfflineMode = () => {
      setIsOnline(false);
    };

    // Subscribe to events
    dataManager.on(DATA_EVENTS.CART_UPDATED, handleCartUpdate);
    dataManager.on(DATA_EVENTS.ONLINE_MODE, handleOnlineMode);
    dataManager.on(DATA_EVENTS.OFFLINE_MODE, handleOfflineMode);

    // Update pending changes count
    const updatePendingCount = () => {
      setPendingChangesCount(dataManager.getPendingChangesCount());
    };

    // Initial pending count
    updatePendingCount();

    // Set up interval to check pending changes
    const interval = setInterval(updatePendingCount, 1000);

    return () => {
      dataManager.off(DATA_EVENTS.CART_UPDATED, handleCartUpdate);
      dataManager.off(DATA_EVENTS.ONLINE_MODE, handleOnlineMode);
      dataManager.off(DATA_EVENTS.OFFLINE_MODE, handleOfflineMode);
      clearInterval(interval);
    };
  }, [isClient]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await dataManager.getCartItems();
      setCartItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: {
    itemId: string;
    name: string;
    price: number;
    quantity?: number;
    imageUrl?: string;
  }) => {
    try {
      setError(null);
      await dataManager.addToCart(item);
      // Cart items will be updated via the event listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      throw err;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      await dataManager.updateCartItem(itemId, quantity);
      // Cart items will be updated via the event listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);
      await dataManager.removeFromCart(itemId);
      // Cart items will be updated via the event listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await dataManager.clearCart();
      // Cart items will be updated via the event listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    }
  };

  const refreshCart = async () => {
    await loadCartData();
  };

  const value: CartContextType = {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    pendingChangesCount,
    isOnline
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 