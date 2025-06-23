// Service Worker for Celfocus Shopping App PWA
const CACHE_NAME = 'celfocus-shopping-v1';
const STATIC_CACHE = 'celfocus-static-v1';
const DYNAMIC_CACHE = 'celfocus-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE = [
  '/api/v1/products',
  '/api/v1/carts/items'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        // Caching static files
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        // Service Worker installed
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              // Deleting old cache
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Service Worker activated
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle other requests
  event.respondWith(fetch(request));
});

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the successful response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed, trying cache:', error);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for API requests
  return new Response(
    JSON.stringify({ 
      error: 'Offline - Data not available',
      offline: true 
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Static file fetch failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Background sync for cart updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }
});

// Sync cart data when back online
async function syncCartData() {
  try {
    const pendingChanges = await getPendingChanges();
    
    if (pendingChanges.length > 0) {
      // Syncing pending cart changes
      
      for (const change of pendingChanges) {
        try {
          // Processing cart change
          await processCartChange(change);
        } catch (error) {
          console.error('Failed to process cart change:', error);
        }
      }
      
      // Clearing pending cart changes
      await clearPendingChanges();
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

// Helper functions for background sync
async function getPendingChanges() {
  // Implementation would depend on how pending changes are stored
  return [];
}

async function processCartChange(change) {
  // Implementation would depend on the change type
}

async function clearPendingChanges() {
  // Implementation would depend on how pending changes are stored
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Celfocus', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CART_DATA') {
    // Service Worker received message
    cacheCartData(event.data.cartData);
  }
});

// Cache cart data for offline use
async function cacheCartData(cartData) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(cartData), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put('/api/v1/carts/items', response);
  } catch (error) {
    console.error('Failed to cache cart data:', error);
  }
} 