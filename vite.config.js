import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: ["@ckeditor/ckeditor5-build-classic"], // Excluye CKEditor si ya lo tienes en node_modules
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Suprimir advertencias de dependencias SCSS
      },
    },
  },
});
