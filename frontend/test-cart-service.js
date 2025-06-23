// Test script for Cart Service Logic
// This script tests the cart service logic without making actual API calls

// Mock cart service functions
const mockCartService = {
  items: [],
  
  addToCart(item) {
    // addToCart called with item
    
    // Check if item already exists
    const existingItem = this.items.find(cartItem => cartItem.itemId === item.itemId);
    
    if (existingItem) {
      // Existing item found
      existingItem.quantity += item.quantity;
      return existingItem;
    } else {
      // Item does not exist, adding new item
      const newItem = {
        id: `${item.itemId}_${Date.now()}`,
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      };
      this.items.push(newItem);
      return newItem;
    }
  },
  
  updateCartItem(itemId, quantity) {
    // updateCartItem called with itemId and quantity
    
    // Current items in updateCartItem
    const itemToUpdate = this.items.find(item => item.itemId === itemId);
    
    if (!itemToUpdate) {
      throw new Error('Item not found');
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items = this.items.filter(item => item.itemId !== itemId);
      return null;
    }
    
    // Found item to update
    // Current quantity, Target quantity
    itemToUpdate.quantity = quantity;
    return itemToUpdate;
  },
  
  getCartItems() {
    return [...this.items];
  },
  
  clearCart() {
    this.items = [];
  }
};

// Test the cart service logic
async function testCartServiceLogic() {
  // Testing Cart Service Logic...
  
  try {
    // 1. Adding SKUTEST2 for the first time...
    const result1 = mockCartService.addToCart({
      itemId: 'SKUTEST2',
      name: 'Test Product 2',
      price: 25.00,
      quantity: 2
    });
    
    // Result 1
    
    // 2. Adding SKUTEST2 again (should update quantity)...
    const result2 = mockCartService.addToCart({
      itemId: 'SKUTEST2',
      name: 'Test Product 2',
      price: 25.00,
      quantity: 1
    });
    
    // Result 2
    
    // 3. Checking final cart state...
    const finalItems = mockCartService.getCartItems();
    // Final cart items
    
    // Test completed!
    
  } catch (error) {
    console.error('Cart service test failed:', error);
  }
}

// Auto-run test when script loads
if (typeof window !== 'undefined') {
  // Wait for the page to load
  setTimeout(() => {
    testCartServiceLogic().then(() => {
      // Cart service test completed!
    }).catch(error => {
      console.error('Test execution failed:', error);
    });
  }, 1000);
} 