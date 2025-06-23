'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import { cartService, CartItem } from '../api/cartService';
import { useToast } from '../utils/useToast';
import { dataManager, DATA_EVENTS } from '../services/data-manager';
import { useClientSide } from '../utils/useClientSide';

interface CartContextType {
  cart: { items: CartItem[] };
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOnline: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean };

const cartReducer = (state: { cart: { items: CartItem[] }; isOnline: boolean }, action: CartAction) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: { items: action.payload } };
    case 'ADD_ITEM': {
      const { productId, quantity } = action.payload;
      const existingItem = state.cart.items.find(item => item.itemId === productId);
      
      if (existingItem) {
        const updatedItems = state.cart.items.map(item =>
          item.itemId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return { ...state, cart: { items: updatedItems } };
      } else {
        // Create a new cart item with minimal required fields
        const newItem: CartItem = { 
          itemId: productId, 
          quantity,
          price: 0, // Will be updated when we get product details
          name: 'Product' // Will be updated when we get product details
        };
        return { ...state, cart: { items: [...state.cart.items, newItem] } };
      }
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.cart.items.filter(item => item.itemId !== action.payload);
      return { ...state, cart: { items: updatedItems } };
    }
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const updatedItems = state.cart.items.map(item =>
        item.itemId === productId ? { ...item, quantity } : item
      );
      return { ...state, cart: { items: updatedItems } };
    }
    case 'CLEAR_CART':
      return { ...state, cart: { items: [] } };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const isClient = useClientSide();
  const toast = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    cart: { items: [] },
    isOnline: true
  });

  // Initialize on client side
  useEffect(() => {
    if (isClient) {
      dataManager.initialize();
      dispatch({ type: 'SET_ONLINE_STATUS', payload: dataManager.isOnlineMode() });
      loadCartFromStorage();
    }
  }, [isClient]);

  // Listen to data manager events
  useEffect(() => {
    if (!isClient) return;

    const handleCartUpdate = (updatedCartItems: CartItem[]) => {
      dispatch({ type: 'SET_CART', payload: updatedCartItems });
    };

    const handleOnlineMode = () => {
      dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    };

    const handleOfflineMode = () => {
      dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
    };

    dataManager.on(DATA_EVENTS.CART_UPDATED, handleCartUpdate);
    dataManager.on(DATA_EVENTS.ONLINE_MODE, handleOnlineMode);
    dataManager.on(DATA_EVENTS.OFFLINE_MODE, handleOfflineMode);

    return () => {
      dataManager.off(DATA_EVENTS.CART_UPDATED, handleCartUpdate);
      dataManager.off(DATA_EVENTS.ONLINE_MODE, handleOnlineMode);
      dataManager.off(DATA_EVENTS.OFFLINE_MODE, handleOfflineMode);
    };
  }, [isClient]);

  const loadCartFromStorage = async () => {
    try {
      const cachedCartItems = await dataManager.getCartItems();
      dispatch({ type: 'SET_CART', payload: cachedCartItems });
    } catch (error) {
      console.warn('Failed to load cart from storage:', error);
      // Keep empty cart if loading fails
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!state.isOnline) {
      // When offline, only update local state
      dispatch({ type: 'ADD_ITEM', payload: { productId, quantity } });
      // Store in local storage for offline persistence
      const updatedItems = [...state.cart.items];
      const existingItem = updatedItems.find(item => item.itemId === productId);
          if (existingItem) {
        existingItem.quantity += quantity;
        toast.success(`Added ${quantity} more to cart (offline mode)`);
          } else {
        updatedItems.push({ 
          itemId: productId, 
          quantity,
          price: 0,
          name: 'Product'
        });
        toast.success('Item added to cart (offline mode)');
      }
      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('celfocus_cart_items', JSON.stringify(updatedItems));
      }
      return;
    }

    try {
      // For online mode, use the data manager
      // We need to get product details first to add to cart properly
      const products = await dataManager.getProducts();
      const product = products.find(p => p.sku === productId);
      
      if (product) {
        await dataManager.addToCart({
          itemId: product.sku,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageUrl: product.imageUrl
        });
        toast.success(`Added ${product.name} to cart`);
      } else {
        // Fallback if product not found
        console.warn('Product not found, adding with basic info');
        dispatch({ type: 'ADD_ITEM', payload: { productId, quantity } });
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Fallback to local update if API fails
      dispatch({ type: 'ADD_ITEM', payload: { productId, quantity } });
      toast.error('Failed to add to cart. Added locally.');
    }
  };

  const removeFromCart = async (productId: string) => {
    const itemToRemove = state.cart.items.find(item => item.itemId === productId);
    
    if (!state.isOnline) {
      // When offline, only update local state
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      // Store in local storage for offline persistence
      const updatedItems = state.cart.items.filter(item => item.itemId !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('celfocus_cart_items', JSON.stringify(updatedItems));
      }
      toast.success(`Removed ${itemToRemove?.name || 'item'} from cart (offline mode)`);
      return;
    }

    try {
      await dataManager.removeFromCart(productId);
      toast.success(`Removed ${itemToRemove?.name || 'item'} from cart`);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Fallback to local update if API fails
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      toast.error('Failed to remove from cart. Removed locally.');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const itemToUpdate = state.cart.items.find(item => item.itemId === productId);
    
    if (!state.isOnline) {
      // When offline, only update local state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      // Store in local storage for offline persistence
      const updatedItems = state.cart.items.map(item =>
        item.itemId === productId ? { ...item, quantity } : item
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('celfocus_cart_items', JSON.stringify(updatedItems));
      }
      toast.success(`Updated quantity to ${quantity} (offline mode)`);
      return;
    }

    try {
      await dataManager.updateCartItem(productId, quantity);
      toast.success(`Updated quantity to ${quantity}`);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Fallback to local update if API fails
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      toast.error('Failed to update quantity. Updated locally.');
    }
  };

  const clearCart = async () => {
    if (!state.isOnline) {
      // When offline, only update local state
      dispatch({ type: 'CLEAR_CART' });
      // Store in local storage for offline persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('celfocus_cart_items', JSON.stringify([]));
      }
      toast.success('Cart cleared (offline mode)');
      return;
    }

    try {
      await dataManager.clearCart();
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Fallback to local update if API fails
      dispatch({ type: 'CLEAR_CART' });
      toast.error('Failed to clear cart. Cleared locally.');
    }
  };

  const value: CartContextType = {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOnline: state.isOnline
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
