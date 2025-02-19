import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist", // Vercel 預設讀取 "dist"
  },
  server: {
    fs: {
      allow: ["."], // 允許訪問專案目錄，避免某些路由問題
    },
  },
});
