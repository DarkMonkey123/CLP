const CACHE_NAME = 'autotech-hub-v7';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/styles.css',
  './css/catalog.css',
  './css/simulator.css',
  './css/polish.css',
  './js/data.js',
  './js/catalog.js',
  './js/storage.js',
  './js/simulator.js',
  './js/app.js',
  './assets/images/app-icon.svg',
  './assets/images/app-icon-192.png',
  './assets/images/app-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(APP_SHELL.map(async asset => {
        const url = new URL(asset, self.registration.scope);
        const response = await fetch(new Request(url, { cache: 'reload' }));
        if (!response.ok) throw new Error(`Failed to cache app asset: ${asset}`);
        await cache.put(url, response);
      })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('autotech-hub-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then(cachedResponse => cachedResponse || Response.error()))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, response.clone()))
              .catch(error => console.error('Failed to update app asset cache:', error))
          );
        }
        return response;
      })
      .catch(() => caches.match(request).then(cachedResponse => cachedResponse || Response.error()))
  );
});
