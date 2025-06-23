// Test script for Mock Server
// Run this in the browser console to test the mock server endpoints

async function testMockServer() {
  // Testing Mock Server...
  
  try {
    // Test products endpoint
    const productsResponse = await fetch('http://localhost:8082/api/v1/products');
    const productsData = await productsResponse.json();
    
    if (productsResponse.ok) {
      // Products endpoint works
    } else {
      console.error('Products endpoint failed:', productsResponse.status);
    }
    
    // Test cart items endpoint
    const cartResponse = await fetch('http://localhost:8082/api/v1/carts/items');
    const cartData = await cartResponse.json();
    
    if (cartResponse.ok) {
      // Cart items endpoint works
    } else {
      console.error('Cart items endpoint failed:', cartResponse.status);
    }
    
    // Test adding item to cart
    const testItem = {
      itemId: 'TEST001',
      name: 'Test Product',
      price: 29.99,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/150'
    };
    
    const addResponse = await fetch('http://localhost:8082/api/v1/carts/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testItem)
    });
    
    if (addResponse.ok) {
      const addedItem = await addResponse.json();
      // Add to cart works
    } else {
      console.error('Add to cart failed:', addResponse.status);
    }
    
    // Test raw items endpoint (for debugging)
    const rawResponse = await fetch('http://localhost:8082/items');
    const rawData = await rawResponse.json();
    
    if (rawResponse.ok) {
      // Raw items endpoint works
    } else {
      console.error('Raw items endpoint failed:', rawResponse.status);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Auto-run test when script loads
if (typeof window !== 'undefined') {
  // Starting mock server tests...
  
  // Wait a bit for the page to load
  setTimeout(() => {
    testMockServer().then(() => {
      // Tests completed!
    }).catch(error => {
      console.error('Test execution failed:', error);
    });
  }, 1000);
} 