import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
   plugins: [react(), tailwindcss()],
   base: "./",
   build: {
      outDir: "../",
      emptyOutDir: false,
      assetsDir: "assets",
      rollupOptions: {
         output: {
            assetFileNames: "assets/[name]-[hash][extname]",
            chunkFileNames: "assets/[name]-[hash].js",
            entryFileNames: "assets/[name]-[hash].js",
         },
      },
   },
});
