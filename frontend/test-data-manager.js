// Test script for Data Manager
// Run this in the browser console to test the data manager functionality

async function testDataManager() {
  // Testing Data Manager...
  
  try {
    // Test data manager structure
    if (window.dataManager) {
      // Data Manager structure created successfully
    } else {
      console.error('Data Manager not found');
      return;
    }
    
    // Test browser storage
    const testData = { test: 'value', timestamp: Date.now() };
    localStorage.setItem('test_storage', JSON.stringify(testData));
    const retrievedData = JSON.parse(localStorage.getItem('test_storage'));
    
    if (retrievedData && retrievedData.test === 'value') {
      // Browser storage working correctly
    } else {
      console.error('Browser storage not working correctly');
    }
    
    // Clean up test data
    localStorage.removeItem('test_storage');
    
    // Test online status
    if (typeof navigator.onLine !== 'undefined') {
      // Online status
    } else {
      console.error('Online status not available');
    }
    
    // Test event system
    let eventReceived = false;
    const testCallback = () => { eventReceived = true; };
    
    window.dataManager.on('test_event', testCallback);
    window.dataManager.emit('test_event');
    
    if (eventReceived) {
      // Event system working
    } else {
      console.error('Event system not working');
    }
    
    window.dataManager.off('test_event', testCallback);
    
  } catch (error) {
    console.error('Data Manager test failed:', error);
  }
}

// Auto-run test when script loads
if (typeof window !== 'undefined') {
  // Wait for data manager to be available
  setTimeout(() => {
    testDataManager().then(() => {
      // Data Manager tests completed!
    }).catch(error => {
      console.error('Test execution failed:', error);
    });
  }, 2000);
} 