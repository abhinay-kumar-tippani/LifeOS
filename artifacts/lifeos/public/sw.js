// Minimal service worker for PWA installability.
// Chrome requires a service worker with a fetch handler to show the "Add to Home Screen" prompt.
// This doesn't cache anything — offline-first caching for habit data is handled at the
// React Query level (see Step 5), not here.

self.addEventListener("install", (event) => {
  // Activate immediately, don't wait for existing tabs to close
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all open tabs right away
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass through — let the network handle everything.
  // We're only here to satisfy Chrome's installability requirement.
  event.respondWith(fetch(event.request));
});
