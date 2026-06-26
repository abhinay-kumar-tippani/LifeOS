"use client";

import { useEffect } from "react";

// Registers the service worker on mount. This is the only thing needed
// for PWA installability beyond the manifest (which Next.js auto-links).
// Placed in the root layout so it runs once regardless of which page loads first.
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        // Not critical — the app works fine without it, just won't be installable
        console.warn("SW registration failed:", err);
      });
    }
  }, []);

  return null;
}
