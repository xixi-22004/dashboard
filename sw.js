// 个人云台 Service Worker - 离线缓存
const CACHE_NAME = 'dashboard-v1';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'favicon.png',
  'apple-touch-icon.png',
  'icon-48x48.png',
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-144x144.png',
  'icon-168x168.png',
  'icon-192x192.png',
  'icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
