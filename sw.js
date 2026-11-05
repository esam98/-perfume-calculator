const CACHE = 'perfume-calc-v1';
const HOSTS = ['cdn.jsdelivr.net', 'www.gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && !HOSTS.includes(u.hostname)) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : null) || Response.error()))
  );
});
