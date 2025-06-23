// Test script for Add to Cart functionality
// This script tests the add to cart behavior

async function testAddToCart() {
  // Testing Add to Cart Functionality...

  try {
    const productsResponse = await fetch(
      'http://localhost:8082/api/v1/products'
    );
    const products = await productsResponse.json();

    if (productsResponse.ok && products.length > 0) {
      // Found products
    } else {
      console.error('Failed to fetch products');
      return;
    }

    // 2. Clearing cart...
    const cartItems = await fetch('http://localhost:8082/api/v1/carts/items');
    const currentItems = await cartItems.json();

    // Delete all existing items
    for (const item of currentItems) {
      if (item.id) {
        await fetch(`http://localhost:8082/api/v1/carts/items/${item.id}`, {
          method: 'DELETE',
        });
      }
    }

    // Cart cleared

    // 3. Adding item to cart (first time)...
    const firstAddResponse = await fetch(
      'http://localhost:8082/api/v1/carts/items',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: products[0].sku,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
        }),
      }
    );

    if (firstAddResponse.ok) {
      const addedItem = await firstAddResponse.json();
      // Added item
    } else {
      console.error('Failed to add item:', firstAddResponse.status);
      return;
    }

    // 4. Checking cart after first add...
    const itemsAfterFirstAddResponse = await fetch(
      'http://localhost:8082/api/v1/carts/items'
    );
    const itemsAfterFirstAdd = await itemsAfterFirstAddResponse.json();

    if (itemsAfterFirstAddResponse.ok) {
      // Cart has items
      // Total quantity
    } else {
      console.error('Failed to fetch cart after first add');
      return;
    }

    // 5. Adding the same item again (should increase quantity)...
    const secondAddResponse = await fetch(
      'http://localhost:8082/api/v1/carts/items',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: products[0].sku,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
        }),
      }
    );

    if (secondAddResponse.ok) {
      const secondAddedItem = await secondAddResponse.json();
      // Added item again
    } else {
      console.error('Failed to add item again:', secondAddResponse.status);
      return;
    }

    // 6. Checking final cart state...
    const finalCartResponse = await fetch(
      'http://localhost:8082/api/v1/carts/items'
    );
    const finalCartItems = await finalCartResponse.json();

    if (finalCartResponse.ok) {
      // Final cart has items

      // Items:
      finalCartItems.forEach((item) => {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        // Item details
      });

      const totalQuantity = finalCartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = finalCartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      // Total Quantity
      // Total Price
    } else {
      console.error('Failed to fetch final cart');
      return;
    }

    // Add to cart functionality test completed!
    // Expected behavior:
    // - First add: Creates new item with quantity 1
    // - Second add: Should either create duplicate OR update quantity to 2
    // - The frontend logic should handle this by updating quantity instead of creating duplicates
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Auto-run test when script loads
if (typeof window !== 'undefined') {
  // Wait for the page to load
  setTimeout(() => {
    testAddToCart()
      .then(() => {
        // Test completed!
      })
      .catch((error) => {
        console.error('Test execution failed:', error);
      });
  }, 1000);
}
