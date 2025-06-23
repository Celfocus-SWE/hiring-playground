const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8082/api/v1';

async function testCartEndpoints() {
  console.log('🧪 Testing Cart Endpoints with imageUrl support...\n');

  try {
    // Test 1: GET - Retrieve all cart items
    console.log('1️⃣ Testing GET /carts/items');
    const getResponse = await fetch(`${BASE_URL}/carts/items`);
    const getItems = await getResponse.json();
    console.log('   ✅ GET successful');
    console.log('   📦 Current cart items:', getItems.length);
    getItems.forEach(item => {
      console.log(`      - ${item.name} (${item.quantity}x) - Image: ${item.imageUrl ? '✅' : '❌'}`);
    });
    console.log('');

    // Test 2: POST - Add new item with imageUrl
    console.log('2️⃣ Testing POST /carts/items (new item with imageUrl)');
    const newItem = {
      itemId: 'TEST_IMAGE_001',
      name: 'Test Product with Image',
      price: 29.99,
      quantity: 2,
      imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
    };
    
    const postResponse = await fetch(`${BASE_URL}/carts/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    
    if (postResponse.ok) {
      const addedItem = await postResponse.json();
      console.log('   ✅ POST successful');
      console.log(`   📦 Added item: ${addedItem.name} with imageUrl: ${addedItem.imageUrl ? '✅' : '❌'}`);
    } else {
      console.log('   ❌ POST failed:', postResponse.status);
    }
    console.log('');

    // Test 3: POST - Update existing item (should preserve imageUrl)
    console.log('3️⃣ Testing POST /carts/items (update existing item)');
    const updateItem = {
      itemId: 'TEST_IMAGE_001',
      name: 'Test Product with Image (Updated)',
      price: 29.99,
      quantity: 1,
      imageUrl: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
    };
    
    const updateResponse = await fetch(`${BASE_URL}/carts/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateItem)
    });
    
    if (updateResponse.ok) {
      const updatedItem = await updateResponse.json();
      console.log('   ✅ Update successful');
      console.log(`   📦 Updated item: ${updatedItem.name} (qty: ${updatedItem.quantity}) with imageUrl: ${updatedItem.imageUrl ? '✅' : '❌'}`);
    } else {
      console.log('   ❌ Update failed:', updateResponse.status);
    }
    console.log('');

    // Test 4: PUT - Update quantity while preserving imageUrl
    console.log('4️⃣ Testing PUT /carts/items/:id (update quantity)');
    const putResponse = await fetch(`${BASE_URL}/carts/items/TEST_IMAGE_001`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 5 })
    });
    
    if (putResponse.ok) {
      const putItem = await putResponse.json();
      console.log('   ✅ PUT successful');
      console.log(`   📦 PUT item: ${putItem.name} (qty: ${putItem.quantity}) with imageUrl: ${putItem.imageUrl ? '✅' : '❌'}`);
    } else {
      console.log('   ❌ PUT failed:', putResponse.status);
    }
    console.log('');

    // Test 5: GET - Verify all items still have imageUrl
    console.log('5️⃣ Testing GET /carts/items (verify imageUrl preservation)');
    const finalGetResponse = await fetch(`${BASE_URL}/carts/items`);
    const finalItems = await finalGetResponse.json();
    console.log('   ✅ GET successful');
    console.log('   📦 Final cart items:');
    finalItems.forEach(item => {
      console.log(`      - ${item.name} (${item.quantity}x) - Image: ${item.imageUrl ? '✅' : '❌'}`);
    });
    console.log('');

    // Test 6: DELETE - Remove test item
    console.log('6️⃣ Testing DELETE /carts/items/:id');
    const deleteResponse = await fetch(`${BASE_URL}/carts/items/TEST_IMAGE_001`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      console.log('   ✅ DELETE successful');
    } else {
      console.log('   ❌ DELETE failed:', deleteResponse.status);
    }
    console.log('');

    // Test 7: Final verification
    console.log('7️⃣ Final verification - GET /carts/items');
    const finalResponse = await fetch(`${BASE_URL}/carts/items`);
    const finalItemsAfterDelete = await finalResponse.json();
    console.log('   ✅ Final GET successful');
    console.log(`   📦 Items after cleanup: ${finalItemsAfterDelete.length}`);
    
    const itemsWithImages = finalItemsAfterDelete.filter(item => item.imageUrl);
    console.log(`   🖼️ Items with images: ${itemsWithImages.length}/${finalItemsAfterDelete.length}`);
    
    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testCartEndpoints();
}

module.exports = { testCartEndpoints }; 