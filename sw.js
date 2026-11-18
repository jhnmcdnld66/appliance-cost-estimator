// Service worker: keeps a copy of every file so the app works offline.
// Online it always fetches fresh files first (so old and new versions never mix);
// offline it falls back to the saved copy.
// When you change the file list below, bump CACHE_VERSION.
var CACHE_VERSION = "ace-v6";
var FILES = [
  "./", "index.html", "styles.css", "config.js", "app.js", "compare.js", "manifest.webmanifest",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
  "pages/about.html", "pages/privacy.html", "pages/disclaimer.html",
  "pages/space-heater-cost.html", "pages/find-electric-rate.html", "pages/watts-vs-kwh.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE_VERSION).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: "reload" }); }));
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(function (res) {
    if (res.ok) {
      var copy = res.clone();
      caches.open(CACHE_VERSION).then(function (c) { c.put(e.request, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true });
  }));
});
