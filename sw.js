const CACHE_NAME = 'hire-your-va-v1';
const assetsToCache = [
  '/',
  'index.html',
  'employee-dashboard.html',
  'admin-dashboard.html',
  'employee-leaves.html',
  'admin-leaves.html',
  'employee-holidays.html',
  'logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Added Push Notification Listener for background alerts
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Hire Your VA', body: 'New notification received!' };
    const options = {
        body: data.body,
        icon: 'logo.png',
        badge: 'logo.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
