import { CartItem } from '../api/cartService';
import { Product } from './products/src/lib/types';

const API_BASE_URL = 'http://localhost:8082/api/v1';

// Browser storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'celfocus_products',
  CART_ITEMS: 'celfocus_cart_items',
  LAST_SYNC: 'celfocus_last_sync',
  PENDING_CHANGES: 'celfocus_pending_changes'
} as const;

// Event types for data updates
export const DATA_EVENTS = {
  PRODUCTS_UPDATED: 'products_updated',
  CART_UPDATED: 'cart_updated',
  OFFLINE_MODE: 'offline_mode',
  ONLINE_MODE: 'online_mode'
} as const;

// Pending change types
interface PendingChange {
  id: string;
  type: 'ADD_TO_CART' | 'UPDATE_CART_ITEM' | 'REMOVE_FROM_CART' | 'CLEAR_CART';
  data: any;
  timestamp: number;
  retryCount: number;
}

class DataManager {
  private static instance: DataManager;
  private isOnline: boolean = true; // Default to true for SSR
  private wasOffline: boolean = false; // Track if we've been offline before
  private pendingChanges: PendingChange[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private isInitialized: boolean = false;

  private constructor() {
    // Don't initialize immediately to avoid SSR issues
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Initialize method to be called on client side
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.isOnline = navigator.onLine;
    this.wasOffline = false; // Reset on initialization
    this.initializeOnlineStatus();
    this.loadPendingChanges();
    this.initializeServiceWorker();
    this.isInitialized = true;
  }

  // Online/Offline Status Management
  private initializeOnlineStatus() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      const wasOffline = !this.isOnline;
      this.isOnline = true;
      
      // Only emit ONLINE_MODE if we were previously offline
      if (wasOffline) {
        this.emit(DATA_EVENTS.ONLINE_MODE);
        this.syncPendingChanges();
      }
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.wasOffline = true; // Mark that we've been offline
      this.emit(DATA_EVENTS.OFFLINE_MODE);
    });
  }

  // Event System
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Browser Storage Management
  private saveToStorage(key: string, data: any) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save to storage: ${key}`, error);
    }
  }

  private loadFromStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load from storage: ${key}`, error);
      return null;
    }
  }

  // Products Management
  async getProducts(): Promise<Product[]> {
    try {
      if (this.isOnline && typeof window !== 'undefined') {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        this.saveToStorage(STORAGE_KEYS.PRODUCTS, products);
        this.emit(DATA_EVENTS.PRODUCTS_UPDATED, products);
        return products;
      } else {
        // Return cached data when offline or during SSR
        const cachedProducts = this.loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS);
        return cachedProducts || [];
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Return cached data on error
      const cachedProducts = this.loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS);
      return cachedProducts || [];
    }
  }

  // Cart Management
  async getCartItems(): Promise<CartItem[]> {
    try {
      if (this.isOnline && typeof window !== 'undefined') {
        const response = await fetch(`${API_BASE_URL}/carts/items`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cartItems = await response.json();
        this.saveToStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
        this.emit(DATA_EVENTS.CART_UPDATED, cartItems);
        // Notify service worker of cart data
        this.notifyServiceWorker(cartItems, 'cart_updated');
        return cartItems;
      } else {
        // Return cached data when offline or during SSR
        const cachedCartItems = this.loadFromStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS);
        return cachedCartItems || [];
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      // Return cached data on error
      const cachedCartItems = this.loadFromStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS);
      return cachedCartItems || [];
    }
  }

  async addToCart(item: {
    itemId: string;
    name: string;
    price: number;
    quantity?: number;
    imageUrl?: string;
  }): Promise<CartItem> {
    const change: PendingChange = {
      id: `add_${Date.now()}_${Math.random()}`,
      type: 'ADD_TO_CART',
      data: item,
      timestamp: Date.now(),
      retryCount: 0
    };

    if (this.isOnline && typeof window !== 'undefined') {
      try {
        const result = await this.performAddToCart(item);
        await this.refreshCartData();
        return result;
      } catch (error) {
        this.addPendingChange(change);
        throw error;
      }
    } else {
      // Offline mode or SSR - add to pending changes and update local cache
      this.addPendingChange(change);
      const currentCart = this.loadFromStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS) || [];
      const existingItem = currentCart.find(i => i.itemId === item.itemId);
      
      if (existingItem) {
        existingItem.quantity += (item.quantity || 1);
      } else {
        const newItem: CartItem = {
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          imageUrl: item.imageUrl
        };
        currentCart.push(newItem);
      }
      
      this.saveToStorage(STORAGE_KEYS.CART_ITEMS, currentCart);
      this.emit(DATA_EVENTS.CART_UPDATED, currentCart);
      // Notify service worker of cart data
      this.notifyServiceWorker(currentCart, 'cart_updated');
      
      return existingItem || currentCart[currentCart.length - 1];
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    const change: PendingChange = {
      id: `update_${Date.now()}_${Math.random()}`,
      type: 'UPDATE_CART_ITEM',
      data: { itemId, quantity },
      timestamp: Date.now(),
      retryCount: 0
    };

    if (this.isOnline && typeof window !== 'undefined') {
      try {
        const result = await this.performUpdateCartItem(itemId, quantity);
        await this.refreshCartData();
        return result;
      } catch (error) {
        this.addPendingChange(change);
        throw error;
      }
    } else {
      // Offline mode or SSR - update local cache
      this.addPendingChange(change);
      const currentCart = this.loadFromStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS) || [];
      const item = currentCart.find(i => i.itemId === itemId);
      
      if (item) {
        item.quantity = quantity;
        this.saveToStorage(STORAGE_KEYS.CART_ITEMS, currentCart);
        this.emit(DATA_EVENTS.CART_UPDATED, currentCart);
        // Notify service worker of cart data
        this.notifyServiceWorker(currentCart, 'cart_updated');
        return item;
      }
      
      throw new Error('Item not found in cart');
    }
  }

  async removeFromCart(itemId: string): Promise<void> {
    const change: PendingChange = {
      id: `remove_${Date.now()}_${Math.random()}`,
      type: 'REMOVE_FROM_CART',
      data: { itemId },
      timestamp: Date.now(),
      retryCount: 0
    };

    if (this.isOnline && typeof window !== 'undefined') {
      try {
        await this.performRemoveFromCart(itemId);
        await this.refreshCartData();
      } catch (error) {
        this.addPendingChange(change);
        throw error;
      }
    } else {
      // Offline mode or SSR - update local cache
      this.addPendingChange(change);
      const currentCart = this.loadFromStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS) || [];
      const filteredCart = currentCart.filter(item => item.itemId !== itemId);
      this.saveToStorage(STORAGE_KEYS.CART_ITEMS, filteredCart);
      this.emit(DATA_EVENTS.CART_UPDATED, filteredCart);
      // Notify service worker of cart data
      this.notifyServiceWorker(filteredCart, 'cart_updated');
    }
  }

  async clearCart(): Promise<void> {
    const change: PendingChange = {
      id: `clear_${Date.now()}_${Math.random()}`,
      type: 'CLEAR_CART',
      data: {},
      timestamp: Date.now(),
      retryCount: 0
    };

    if (this.isOnline && typeof window !== 'undefined') {
      try {
        await this.performClearCart();
        await this.refreshCartData();
      } catch (error) {
        this.addPendingChange(change);
        throw error;
      }
    } else {
      // Offline mode or SSR - clear local cache
      this.addPendingChange(change);
      this.saveToStorage(STORAGE_KEYS.CART_ITEMS, []);
      this.emit(DATA_EVENTS.CART_UPDATED, []);
      // Notify service worker of cart data
      this.notifyServiceWorker([], 'cart_updated');
    }
  }

  // Pending Changes Management
  private addPendingChange(change: PendingChange) {
    this.pendingChanges.push(change);
    this.saveToStorage(STORAGE_KEYS.PENDING_CHANGES, this.pendingChanges);
  }

  private loadPendingChanges() {
    this.pendingChanges = this.loadFromStorage<PendingChange[]>(STORAGE_KEYS.PENDING_CHANGES) || [];
  }

  private async syncPendingChanges() {
    if (this.pendingChanges.length === 0) return;

    const changesToProcess = [...this.pendingChanges];
    this.pendingChanges = [];

    for (const change of changesToProcess) {
      try {
        switch (change.type) {
          case 'ADD_TO_CART':
            await this.performAddToCart(change.data);
            break;
          case 'UPDATE_CART_ITEM':
            await this.performUpdateCartItem(change.data.itemId, change.data.quantity);
            break;
          case 'REMOVE_FROM_CART':
            await this.performRemoveFromCart(change.data.itemId);
            break;
          case 'CLEAR_CART':
            await this.performClearCart();
            break;
        }
      } catch (error) {
        console.error(`Failed to sync change ${change.id}:`, error);
        change.retryCount++;
        if (change.retryCount < 3) {
          this.pendingChanges.push(change);
        }
      }
    }

    this.saveToStorage(STORAGE_KEYS.PENDING_CHANGES, this.pendingChanges);
    await this.refreshCartData();
  }

  // API Operations
  private async performAddToCart(item: any): Promise<CartItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (!response || !response.ok) {
        throw new Error(`Failed to add to cart: ${response?.status || 'Network error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  private async performUpdateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      if (!response || !response.ok) {
        throw new Error(`Failed to update cart item: ${response?.status || 'Network error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  private async performRemoveFromCart(itemId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
        method: 'DELETE'
      });

      if (!response || !response.ok) {
        throw new Error(`Failed to remove from cart: ${response?.status || 'Network error'}`);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  private async performClearCart(): Promise<void> {
    const cartItems = await this.getCartItems();
    for (const item of cartItems) {
      // Use itemId if id is not available
      const itemId = item.id || item.itemId;
      if (itemId) {
        await this.performRemoveFromCart(itemId);
      }
    }
  }

  // Data Refresh
  private async refreshCartData() {
    try {
      const cartItems = await this.getCartItems();
      this.emit(DATA_EVENTS.CART_UPDATED, cartItems);
    } catch (error) {
      console.error('Failed to refresh cart data:', error);
    }
  }

  // Utility Methods
  getPendingChangesCount(): number {
    return this.pendingChanges.length;
  }

  isOnlineMode(): boolean {
    return this.isOnline;
  }

  // Force refresh all data
  async refreshAllData() {
    await this.getProducts();
    await this.getCartItems();
  }

  // Service Worker Integration
  private async initializeServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          // Cache updated from service worker
          this.refreshAllData();
        }
      });

      // Register for background sync if available
      if ('sync' in registration) {
        // Background sync available
      }
    } catch (error) {
      console.error('Service worker initialization failed:', error);
    }
  }

  // Notify service worker of cart data changes
  private async notifyServiceWorker(data: any, type: string) {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: 'CACHE_CART_DATA',
        cartData: data
      });
    } catch (error) {
      console.error('Failed to notify service worker:', error);
    }
  }
}

export const dataManager = DataManager.getInstance();
export default dataManager; 