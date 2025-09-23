// Minimal SW to avoid 404 and unregister any previous service worker
// This SW immediately unregisters itself and takes control to ensure cleanup.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const regs = await self.registration.unregister();
        // Optionally, clear caches created by older SWs
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
      } catch (e) {
        // no-op
      } finally {
        // Claim clients so the page is controlled and can reload without SW
        await self.clients.claim();
      }
    })()
  );
});

self.addEventListener('fetch', (event) => {
  // Pass-through: do not intercept
  return;
});
