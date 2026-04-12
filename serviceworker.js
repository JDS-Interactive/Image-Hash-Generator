const CACHE_NAME = "image-hash-generator-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.json",
  "./ImageHashGenerator.ico",
  "./assets/image-hash-hero.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch (offline-first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});