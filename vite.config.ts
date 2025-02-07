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
            'react',
            'react-dom',
            '@tensorflow/tfjs',
            '@tensorflow/tfjs-backend-webgl',
            '@tensorflow/tfjs-core',
            'tone'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
});
