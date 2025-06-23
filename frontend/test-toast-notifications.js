// Toast Notification Test Script
// This script tests the toast notification system

// Test basic notifications
function testBasicNotifications() {
  // Testing basic notifications
  
  // Test success notification
  window.toastNotification.success('This is a success message!', 'Success');
  
  // Test error notification
  window.toastNotification.error('This is an error message!', 'Error');
  
  // Test info notification
  window.toastNotification.info('This is an info message!', 'Info');
  
  // Test warning notification
  window.toastNotification.warning('This is a warning message!', 'Warning');
}

// Test custom options
function testCustomOptions() {
  // Testing custom options
  
  // Test with custom duration
  window.toastNotification.success('Custom duration (10 seconds)', 'Custom Duration', {
    duration: 10000
  });
  
  // Test with custom position
  window.toastNotification.info('Top right position', 'Custom Position', {
    position: 'top-right'
  });
  
  // Test with custom styling
  window.toastNotification.warning('Custom styling', 'Custom Style', {
    style: {
      backgroundColor: '#ff6b6b',
      color: 'white'
    }
  });
}

// Test disable/enable functionality
function testDisableEnable() {
  // Testing disable functionality
  
  window.toastNotification.disable();
  
  // Notifications disabled. Trying to show a notification...
  window.toastNotification.success('This should not show');
  
  // Testing enable functionality
  window.toastNotification.enable();
  
  // This should show now
  window.toastNotification.success('Notifications re-enabled!');
}

// Test clear functionality
function testClear() {
  // Testing clear functionality
  
  // Show multiple notifications
  window.toastNotification.success('Notification 1');
  window.toastNotification.info('Notification 2');
  window.toastNotification.warning('Notification 3');
  
  // Clear all after 2 seconds
  setTimeout(() => {
    window.toastNotification.clear();
    // All notifications cleared!
  }, 2000);
}

// Test different positions
function testPositions() {
  // Testing different positions
  
  window.toastNotification.success('Top Left', 'Position Test', { position: 'top-left' });
  window.toastNotification.info('Top Center', 'Position Test', { position: 'top-center' });
  window.toastNotification.warning('Top Right', 'Position Test', { position: 'top-right' });
  
  setTimeout(() => {
    window.toastNotification.success('Bottom Left', 'Position Test', { position: 'bottom-left' });
    window.toastNotification.info('Bottom Center', 'Position Test', { position: 'bottom-center' });
    window.toastNotification.warning('Bottom Right', 'Position Test', { position: 'bottom-right' });
  }, 1000);
}

// Test notifications without auto-close
function testNoAutoClose() {
  // Testing notifications without auto-close
  
  window.toastNotification.success('This notification will not auto-close', 'No Auto-Close', {
    autoClose: false
  });
  
  window.toastNotification.info('This one will auto-close in 5 seconds', 'Auto-Close', {
    duration: 5000
  });
}

// Test notifications without close button
function testNoCloseButton() {
  // Testing notifications without close button
  
  window.toastNotification.warning('No close button - will auto-close in 3 seconds', 'No Close Button', {
    showCloseButton: false,
    duration: 3000
  });
  
  window.toastNotification.error('Has close button - click to close', 'Has Close Button', {
    showCloseButton: true,
    autoClose: false
  });
}

// Test long messages
function testLongMessages() {
  // Testing long messages
  
  const longMessage = 'This is a very long message that should wrap to multiple lines. It contains a lot of text to test how the notification handles long content. The message should be properly formatted and readable.';
  
  window.toastNotification.info(longMessage, 'Long Message Test');
}

// Test multiple notifications
function testMultipleNotifications() {
  // Testing multiple notifications
  
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      window.toastNotification.success(`Notification ${i}`, `Batch ${i}`);
    }, i * 500);
  }
  
  // Disabling notifications again
  setTimeout(() => {
    window.toastNotification.disable();
  }, 4000);
}

// Main test function
function runAllTests() {
  // Toast notification testing complete!
  // Try calling window.toastNotification.enable() to re-enable notifications
  
  testBasicNotifications();
  
  setTimeout(testCustomOptions, 2000);
  setTimeout(testDisableEnable, 4000);
  setTimeout(testClear, 6000);
  setTimeout(testPositions, 8000);
  setTimeout(testNoAutoClose, 10000);
  setTimeout(testNoCloseButton, 12000);
  setTimeout(testLongMessages, 14000);
  setTimeout(testMultipleNotifications, 16000);
}

// Auto-run tests when script loads
if (typeof window !== 'undefined' && window.toastNotification) {
  // Toast notification test script loaded!
  // Available test functions:
  //   - testToast.success(message, title)
  //   - testToast.error(message, title)
  //   - testToast.info(message, title)
  //   - testToast.warning(message, title)
  //   - testToast.enable()
  //   - testToast.disable()
  //   - testToast.clear()
  //   - testToast.isEnabled()
  
  // Make test functions available globally
  window.testToast = {
    success: (message, title) => window.toastNotification.success(message, title),
    error: (message, title) => window.toastNotification.error(message, title),
    info: (message, title) => window.toastNotification.info(message, title),
    warning: (message, title) => window.toastNotification.warning(message, title),
    enable: () => window.toastNotification.enable(),
    disable: () => window.toastNotification.disable(),
    clear: () => window.toastNotification.clear(),
    isEnabled: () => window.toastNotification.isNotificationsEnabled(),
    runAll: runAllTests
  };
  
  // Auto-run tests after a short delay
  setTimeout(runAllTests, 1000);
} 