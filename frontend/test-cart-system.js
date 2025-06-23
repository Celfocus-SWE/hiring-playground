// Test script for Cart System
// Run this in the browser console to test the cart functionality

async function testCartSystem() {
  // Testing Cart System...
  
  try {
    // 1. Fetching products...
    const productsResponse = await fetch('http://localhost:8082/api/v1/products');
    const products = await productsResponse.json();
    
    if (productsResponse.ok && products.length > 0) {
      // Found products
      // First product
    } else {
      console.error('Failed to fetch products');
      return;
    }
    
    // 2. Fetching initial cart...
    const initialCartResponse = await fetch('http://localhost:8082/api/v1/carts/items');
    const initialCart = await initialCartResponse.json();
    
    if (initialCartResponse.ok) {
      // Cart has items initially
    } else {
      console.error('Failed to fetch initial cart');
      return;
    }
    
    // 3. Adding item to cart...
    const testItem = {
      itemId: products[0].sku,
      name: products[0].name,
      price: products[0].price,
      quantity: 1,
      imageUrl: products[0].imageUrl
    };
    
    const addItemResponse = await fetch('http://localhost:8082/api/v1/carts/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testItem)
    });
    
    if (addItemResponse.ok) {
      const addedItem = await addItemResponse.json();
      // Added item
    } else {
      console.error('Failed to add item:', addItemResponse.status);
      return;
    }
    
    // 4. Fetching updated cart...
    const updatedCartResponse = await fetch('http://localhost:8082/api/v1/carts/items');
    const updatedCart = await updatedCartResponse.json();
    
    if (updatedCartResponse.ok) {
      // Cart now has items
    } else {
      console.error('Failed to fetch updated cart');
      return;
    }
    
    // 5. Updating item quantity...
    const itemToUpdate = updatedCart.find(item => item.itemId === products[0].sku);
    
    if (itemToUpdate) {
      // Delete the item first
      const deleteResponse = await fetch(`http://localhost:8082/api/v1/carts/items/${itemToUpdate.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        // Deleted item with ID
      } else {
        console.error('Failed to delete item for update');
        return;
      }
      
      // Add item back with new quantity
      const updateItem = {
        ...testItem,
        quantity: 3
      };
      
      const updateResponse = await fetch('http://localhost:8082/api/v1/carts/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateItem)
      });
      
      if (updateResponse.ok) {
        const updatedItem = await updateResponse.json();
        // Updated item quantity
      } else {
        console.error('Failed to update item:', updateResponse.status);
        return;
      }
    } else {
      console.error('Failed to delete item:', deleteResponse.status);
      return;
    }
    
    // 6. Final cart state...
    const finalCartResponse = await fetch('http://localhost:8082/api/v1/carts/items');
    const finalCart = await finalCartResponse.json();
    
    if (finalCartResponse.ok) {
      // Final cart has items
      
      // Items:
      finalCart.forEach(item => {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        // Item details
      });
    } else {
      console.error('Failed to fetch final cart');
      return;
    }
    
  } catch (error) {
    console.error('Cart system test failed:', error);
  }
}

// Auto-run test when script loads
if (typeof window !== 'undefined') {
  // Wait for the page to load
  setTimeout(() => {
    testCartSystem().then(() => {
      // Cart system test completed!
    }).catch(error => {
      console.error('Test execution failed:', error);
    });
  }, 1000);
} 