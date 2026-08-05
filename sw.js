const CACHE_VERSION = 'v2';
const CACHE_NAME = `jozinites-cache-${CACHE_VERSION}`;
const FILES = ['/', '/index.html', '/styles.css', '/app.js', '/links.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
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

// Helper: stale-while-revalidate for JSON endpoints like links.json
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkFetch = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.ok) cache.put(request, networkResponse.clone());
    return networkResponse;
  }).catch(() => null);
  return networkFetch || cachedResponse;
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Use stale-while-revalidate for links.json
  if (url.pathname.endsWith('/links.json')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // For navigation requests, serve cache-first (app shell)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(resp => resp || fetch(event.request))
    );
    return;
  }

  // For other GET requests, try cache first, then network
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  }
});
