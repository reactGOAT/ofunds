const CACHE_NAME = 'ofunds-v2';
const urlsToCache = [
  '/',
  '/dashboard',
  '/cards',
  '/history',
  '/notifications',
  '/login',
  '/manifest.json',
  // Add other critical assets
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  '/_next/static/chunks/app/_app-client.js',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests - let them fail normally
  if (event.request.url.includes('/api/')) return;

  // Skip Next.js dev server HMR requests and browser extensions
  if (event.request.url.includes('/_next/webpack-hmr') || event.request.url.includes('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('Failed to cache response:', error);
              });

            return response;
          })
          .catch((error) => {
            // For navigation requests, return the offline page
            if (event.request.destination === 'document') {
              return caches.match('/login');
            }

            // For other requests, just fail
            return new Response('Offline', { 
              status: 503, 
              statusText: 'Service Unavailable' 
            });
          });
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
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .catch((error) => {
        console.error('Failed to clean up old caches:', error);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  // This could sync queued transactions, messages, etc.
  console.log('Background sync triggered');
}

// Push notifications with enhanced handling
self.addEventListener('push', (event) => {
  let data = {
    title: 'Ofunds',
    body: 'New notification from Ofunds',
    icon: '/ofunds-icon.png',
    badge: '/ofunds-icon.png',
    tag: 'ofunds-notification',
    data: {
      url: '/notifications',
      dateOfArrival: Date.now(),
    }
  };

  // Try to parse push data
  if (event.data) {
    try {
      const pushData = event.data.json();
      data = {
        ...data,
        ...pushData,
        data: {
          ...data.data,
          ...(pushData.data || {}),
        }
      };
    } catch (e) {
      // If not JSON, use text as body
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/ofunds-icon.png',
    badge: data.badge || '/ofunds-icon.png',
    tag: data.tag || 'ofunds-notification',
    vibrate: [100, 50, 100],
    requireInteraction: true,
    renotify: true,
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/ofunds-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/ofunds-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling with improved navigation
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there's already a window open
          for (const client of windowClients) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              client.navigate(urlToOpen);
              return;
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
  // 'dismiss' action just closes the notification (already done above)
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});
