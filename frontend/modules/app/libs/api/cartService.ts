export interface CartItem {
  id?: string;
  itemId: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
}

const API_BASE_URL = 'http://localhost:8082/api/v1';

// Debug function that can be called from browser console
export const debugCart = {
  async getCurrentState() {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/items`);
      const items = await response.json();
      return items;
    } catch (error) {
      console.error('Failed to get cart state:', error);
    }
  },
  
  async clearCart() {
    try {
      const items = await this.getCurrentState();
      for (const item of items) {
        if (item.id) {
          await fetch(`${API_BASE_URL}/carts/items/${item.id}`, {
            method: 'DELETE',
          });
        }
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  },
  
  async addTestItem() {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: 'TEST001',
          name: 'Test Item',
          price: 10.99,
          quantity: 1,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorText = await response.text();
        console.error('Failed to add test item:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error adding test item:', error);
    }
  },
  
  async analyzeCart() {
    try {
      const items = await this.getCurrentState();
      
      items.forEach((item: CartItem, index: number) => {
        // Analysis logic without console.log
      });
      
      const itemsWithoutId = items.filter((item: CartItem) => !item.id);
      if (itemsWithoutId.length > 0) {
        console.warn(`⚠️ Found ${itemsWithoutId.length} items without ID:`, itemsWithoutId);
      }
      
      const duplicateItemIds = items.reduce((acc: Record<string, number>, item: CartItem) => {
        acc[item.itemId] = (acc[item.itemId] || 0) + 1;
        return acc;
      }, {});
      
      const duplicates = Object.entries(duplicateItemIds).filter(([itemId, count]) => (count as number) > 1);
      if (duplicates.length > 0) {
        console.warn('⚠️ Found duplicate itemIds:', duplicates);
      }
    } catch (error) {
      console.error('Error analyzing cart:', error);
    }
  }
};

// Make debugCart available globally for browser console access
if (typeof window !== 'undefined') {
  (window as any).debugCart = debugCart;
}

export const cartService = {
  async getCartItems(): Promise<CartItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/items`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cart items: ${response.status}`);
      }
      
      const items = await response.json();
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      throw new Error('Unable to load cart items. Please try again later.');
    }
  },

  async addToCart(item: {
    itemId: string;
    name: string;
    price: number;
    quantity?: number;
    imageUrl?: string;
  }): Promise<CartItem> {
    // Set default quantity if not provided
    const itemWithQuantity = { ...item, quantity: item.quantity || 1 };
    
    // Check if item already exists in cart
    const currentItems = await this.getCartItems();
    const existingItem = currentItems.find(cartItem => cartItem.itemId === item.itemId);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + itemWithQuantity.quantity;
      return this.updateCartItem(item.itemId, newQuantity);
    }
    
    // Add new item to cart
    return this._addNewItemToCart(itemWithQuantity);
  },

  async _addNewItemToCart(item: {
    itemId: string;
    name: string;
    price: number;
    quantity?: number;
    imageUrl?: string;
  }): Promise<CartItem> {
    // Retry logic for adding item
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/carts/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        
        if (response.ok) {
          const result = await response.json();
          return result;
        }
        
        const errorText = await response.text();
        console.warn(`Attempt ${attempt} failed: ${response.status} - ${errorText}`);
        
        // Check if it's a duplicate ID error
        if (errorText.toLowerCase().includes('duplicate id')) {
          const items = await this.getCartItems();
          const existingItem = items.find(cartItem => cartItem.itemId === item.itemId);
          if (existingItem) {
            return existingItem;
          }
        }
        
        // If this is the last attempt, throw the error
        if (attempt === 3) {
          throw new Error(`Failed to add item to cart: ${response.status} - ${errorText}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 200 * attempt));
        
      } catch (error) {
        console.error(`Error adding item (attempt ${attempt}):`, error);
        
        // If this is the last attempt, throw the error
        if (attempt === 3) {
          throw new Error(`Failed to add item to cart after 3 attempts`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 200 * attempt));
      }
    }
    
    throw new Error('Failed to add item to cart after multiple attempts');
  },

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    // Get current items to find the item details
    const items = await this.getCartItems();
    
    if (!Array.isArray(items)) {
      throw new Error('Failed to load cart items');
    }
    
    const itemToUpdate = items.find(item => item.itemId === itemId);
    
    if (!itemToUpdate) {
      console.error('Item not found in cart for update');
      throw new Error('Failed to update cart item');
    }
    
    // Try PUT request first (our custom server supports this)
    try {
      const putPayload = {
        itemId: itemToUpdate.itemId,
        quantity: quantity,
        price: itemToUpdate.price,
        name: itemToUpdate.name,
      };
      
      const putResponse = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(putPayload),
      });
      
      if (putResponse.ok) {
        const result = await putResponse.json();
        return result;
      } else {
        const errorText = await putResponse.text();
        console.warn(`PUT request failed: ${putResponse.status} - ${errorText}`);
        throw new Error(`Failed to update cart item`);
      }
      
    } catch (error) {
      console.error('Error with PUT request:', error);
      throw new Error(`Failed to update cart item`);
    }
  },

  async removeFromCart(itemId: string): Promise<void> {
    try {
      // Use DELETE with itemId as the parameter (our custom server supports this)
      const response = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Failed to remove item ${itemId} from cart: ${response.status} - ${errorText}`);
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  },

  async clearCart(): Promise<void> {
    try {
      // Get all items and delete them one by one
      const items = await this.getCartItems();
      
      for (const item of items) {
        if (item.id) {
          const response = await fetch(`${API_BASE_URL}/carts/items/${item.id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            console.error(`Failed to delete item ${item.itemId}: ${response.status}`);
            throw new Error('Failed to clear cart');
          }
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  },

  // Debug functions
  debugCart: {
    async getCurrentState() {
      const items = await cartService.getCartItems();
      return items;
    },

    async clearCart() {
      const items = await cartService.getCartItems();
      for (const item of items) {
        if (item.id) {
          await fetch(`${API_BASE_URL}/carts/items/${item.id}`, {
            method: 'DELETE',
          });
        }
      }
    },

    async addTestItem() {
      const testItem = {
        itemId: 'TEST001',
        name: 'Test Item',
        price: 10.99,
        quantity: 1,
      };
      
      const result = await cartService.addToCart(testItem);
      return result;
    },

    async analyzeCart() {
      const items = await cartService.getCartItems();
      
      items.forEach((item: CartItem, index: number) => {
        // Analysis logic without console.log
      });
      
      const itemsWithoutId = items.filter(item => !item.id);
      if (itemsWithoutId.length > 0) {
        console.warn(`⚠️ Found ${itemsWithoutId.length} items without ID:`, itemsWithoutId);
      }
      
      const itemIdCounts = new Map<string, number>();
      items.forEach(item => {
        itemIdCounts.set(item.itemId, (itemIdCounts.get(item.itemId) || 0) + 1);
      });
      
      const duplicates = Array.from(itemIdCounts.entries())
        .filter(([_, count]) => count > 1)
        .map(([itemId, count]) => [itemId, count]);
      
      if (duplicates.length > 0) {
        console.warn('⚠️ Found duplicate itemIds:', duplicates);
      }
      
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('Total value: $', totalValue.toFixed(2));
    },
  },
}; 