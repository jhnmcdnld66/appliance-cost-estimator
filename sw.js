// Service worker: caches every file so the app works offline.
// When you change any file, bump CACHE_VERSION so phones pick up the update.
var CACHE_VERSION = "ace-v1";
var FILES = [
  "./", "index.html", "styles.css", "config.js", "app.js", "manifest.webmanifest",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
  "pages/about.html", "pages/privacy.html", "pages/disclaimer.html",
  "pages/space-heater-cost.html", "pages/find-electric-rate.html", "pages/watts-vs-kwh.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE_VERSION).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request);
  }));
});
