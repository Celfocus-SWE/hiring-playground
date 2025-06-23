// Cart API Debug Script
// This script provides debugging functions for the cart API

const debugCart = {
  async getItems() {
    try {
      const response = await fetch('http://localhost:8082/api/v1/carts/items');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get cart items:', error);
      return [];
    }
  },

  async addItem(itemId, name, price, quantity = 1) {
    try {
      const response = await fetch('http://localhost:8082/api/v1/carts/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId,
          name,
          price,
          quantity
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to add item:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error adding item:', error);
      return null;
    }
  },

  async updateItem(itemId, quantity) {
    try {
      // First get the item to update
      const items = await this.getItems();
      const itemToUpdate = items.find(item => item.itemId === itemId);
      
      if (!itemToUpdate) {
        console.error('Item not found:', itemId);
        return null;
      }

      // Delete the existing item
      const deleteResponse = await fetch(`http://localhost:8082/api/v1/carts/items/${itemToUpdate.id}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        // Deleted existing item
      } else {
        console.error('Failed to delete item for update:', deleteResponse.status);
        return null;
      }

      // Add the item back with new quantity
      const addResponse = await fetch('http://localhost:8082/api/v1/carts/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId: itemToUpdate.itemId,
          name: itemToUpdate.name,
          price: itemToUpdate.price,
          quantity: quantity
        })
      });

      if (addResponse.ok) {
        const data = await addResponse.json();
        return data;
      } else {
        console.error('Failed to update item:', addResponse.status);
        return null;
      }
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  },

  async removeItem(itemId) {
    try {
      // First get the item to remove
      const items = await this.getItems();
      const itemToRemove = items.find(item => item.itemId === itemId);
      
      if (!itemToRemove) {
        console.error('Item not found:', itemId);
        return false;
      }

      const response = await fetch(`http://localhost:8082/api/v1/carts/items/${itemToRemove.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Removed item from cart
        return true;
      } else {
        console.error('Failed to remove item:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  },

  async clearCart() {
    try {
      const items = await this.getItems();
      
      for (const item of items) {
        const response = await fetch(`http://localhost:8082/api/v1/carts/items/${item.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Deleted item
        } else {
          console.error(`Failed to delete item: ${item.itemId}`);
        }
      }
      
      // Cart cleared
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }
};

// Make debugCart available globally
if (typeof window !== 'undefined') {
  window.debugCart = debugCart;
  
  // Available debug functions:
  //   - debugCart.getItems() - Get all cart items
  //   - debugCart.addItem(itemId, name, price, quantity) - Add item to cart
  //   - debugCart.updateItem(itemId, quantity) - Update item quantity
  //   - debugCart.removeItem(itemId) - Remove item from cart
  //   - debugCart.clearCart() - Clear all items
} 