import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // Zielverzeichnis
    assetsDir: "assets", // Ordner für statische Assets
    rollupOptions: {
      external: ['@mediapipe/hands'],
      output: {
        manualChunks: {
          'vendor': [
            // Common libraries that don't change often
            'react',
            'react-dom',
            'react-router-dom',
            // Add other major dependencies here
          ],
          // You can add more chunks as needed
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
});
