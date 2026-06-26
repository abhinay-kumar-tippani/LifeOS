import type { MetadataRoute } from "next";

// Next.js auto-serves this as /manifest.webmanifest and links it in <head>.
// Using the .ts route convention avoids a separate public/manifest.json
// and lets us keep the config type-safe.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LifeOS — Your Productivity Operating System",
    short_name: "LifeOS",
    description:
      "Plan your day, build streaks, run Pomodoro sessions, and reflect in one calm dashboard.",
    start_url: "/dashboard",
    // standalone: no browser chrome, looks like a native app
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    // Step 4: PWA shortcut — long-press the home icon to jump straight to habits
    shortcuts: [
      {
        name: "Check Habits",
        short_name: "Habits",
        url: "/dashboard?shortcut=habits",
        description: "Jump straight to today's habit checklist",
        icons: [{ src: "/logo.svg", sizes: "any" }],
      },
    ],
  };
}
