import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // auto-update service worker
      manifest: {
        "name": "FlameDesk",
        "short_name": "FlameDesk",
        "theme_color": "#5748b4",
        "background_color": "#1f1e24",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "icons": [
            {
                "src" : "/Logos/maskable_icon.png",
                "sizes": "196x196",
                "type" : "image/png",
                "purpose": "any maskable"
            },
            {
                "src": "/Logos/Logo_192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/Logos/Logo_256.png",
                "sizes": "256x256",
                "type": "image/png"
            },
            {
                "src": "/Logos/Logo_384.png",
                "sizes": "384x384",
                "type": "image/png"
            },
            {
                "src": "/Logos/Logo_512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
      },
    }),
  ],
});
