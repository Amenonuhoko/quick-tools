// Network-first: always serve the latest deploy when online, fall back to cache offline.
const CACHE = 'quick-tools';
const ASSETS = ['./', 'index.html', 'ruler.html', 'level.html', 'shape.html', 'ppi.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(res => {
        if (res.ok) { const copy = res.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(req, copy))); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || Response.error()))
  );
});
