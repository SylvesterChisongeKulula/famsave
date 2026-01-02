import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174, // Change this to any available port
    strictPort: true, // Prevents Vite from switching ports
  },
});
                    