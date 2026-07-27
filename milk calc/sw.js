const CACHE_NAME = 'milk-calculator-v1'; // Versioning is good for cache updates
const urlsToCache = [
  'milk-calculator.html',
  // Add any other static assets here if you had them (e.g., images, custom fonts)
  // For this setup, only the HTML file is strictly necessary to cache for offline use.
];

// --- Install Event ---
// This event fires when the service worker is first installed.
self.addEventListener('install', (event) => {
  // event.waitUntil() ensures the service worker doesn't terminate until the promise is resolved.
  // We want to wait until the cache is opened and all specified URLs are added to it.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Add all files to the cache
      })
  );
});

// --- Fetch Event ---
// This event fires every time a network request is made within the scope of the service worker.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request) // Try to match the requested resource in the cache
      .then((response) => {
        // If a cached response is found, return it.
        if (response) {
          return response;
        }
        // If not found in cache, fallback to the network.
        // This part is less critical for a purely offline app but good practice.
        return fetch(event.request);
      })
  );
});

// --- Activate Event ---
// This event fires after the service worker has been installed and is ready to control clients.
// It's typically used for cleaning up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Define the current cache name(s) we want to keep.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If a cache name is found that is NOT in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});