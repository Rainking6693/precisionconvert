// Service Worker for PrecisionConvert.io
// Provides offline functionality and caching for PWA

const CACHE_NAME = 'precisionconvert-v2.3.0';
const STATIC_CACHE_NAME = 'precisionconvert-static-v2.3.0';
const DYNAMIC_CACHE_NAME = 'precisionconvert-dynamic-v2.3.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/MISSING_FEATURES_IMPLEMENTATION.js'
];

// Files that should be cached dynamically
const DYNAMIC_FILES = [
  '/blog.html',
  '/scientific-unit-converter.html',
  '/cooking-unit-converter.html'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('precisionconvert-')) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached files when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for essential CDNs)
  if (url.origin !== location.origin && !isEssentialExternal(url)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Fetch from network and cache dynamically
        return fetch(request)
          .then(networkResponse => {
            // Only cache successful responses
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              
              // Cache dynamic content
              if (shouldCacheDynamically(request.url)) {
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => {
                    cache.put(request, responseClone);
                  });
              }
            }
            
            return networkResponse;
          })
          .catch(error => {
            console.log('Service Worker: Network request failed', request.url, error);
            
            // Return offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return offline indicator for other requests
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'This feature requires an internet connection'
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
          });
      })
  );
});

// Background sync for conversion history
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-conversions') {
    event.waitUntil(syncConversions());
  }
});

// Push notifications for premium features
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const { action, data } = event;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes(location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          const url = data?.url || '/';
          return clients.openWindow(url);
        }
      })
  );
});

// Message handling for communication with main app
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        status: 'active'
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches()
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
      
    case 'CACHE_CONVERSION':
      cacheConversion(data)
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
  }
});

// Helper functions
function isEssentialExternal(url) {
  const essentialDomains = [
    'js.stripe.com',
    'www.googletagmanager.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  
  return essentialDomains.some(domain => url.hostname.includes(domain));
}

function shouldCacheDynamically(url) {
  // Cache HTML pages and essential resources
  return url.endsWith('.html') || 
         url.endsWith('.js') || 
         url.endsWith('.css') ||
         DYNAMIC_FILES.some(file => url.includes(file));
}

async function syncConversions() {
  try {
    // Get stored conversions that need syncing
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const conversions = await getStoredConversions();
    
    if (conversions.length > 0) {
      console.log('Service Worker: Syncing conversions', conversions.length);
      // Sync logic would go here if we had a backend
      // For now, just log that sync would happen
    }
  } catch (error) {
    console.error('Service Worker: Error syncing conversions', error);
  }
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith('precisionconvert-')) {
        return caches.delete(cacheName);
      }
    })
  );
}

async function cacheConversion(conversionData) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const key = `conversion-${Date.now()}`;
  const response = new Response(JSON.stringify(conversionData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=86400' // 24 hours
    }
  });
  
  return cache.put(key, response);
}

async function getStoredConversions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const keys = await cache.keys();
    const conversions = [];
    
    for (const key of keys) {
      if (key.url.includes('conversion-')) {
        const response = await cache.match(key);
        const data = await response.json();
        conversions.push(data);
      }
    }
    
    return conversions;
  } catch (error) {
    console.error('Service Worker: Error getting stored conversions', error);
    return [];
  }
}

// Periodic cleanup of old cached conversions
setInterval(() => {
  cleanupOldConversions();
}, 24 * 60 * 60 * 1000); // Daily cleanup

async function cleanupOldConversions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const keys = await cache.keys();
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const key of keys) {
      if (key.url.includes('conversion-')) {
        const timestamp = parseInt(key.url.split('conversion-')[1]);
        if (timestamp < oneDayAgo) {
          await cache.delete(key);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Error cleaning up old conversions', error);
  }
}

console.log('Service Worker: Loaded successfully');