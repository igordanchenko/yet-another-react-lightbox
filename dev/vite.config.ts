import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  root: "dev",
  plugins: [react()],
  server: {
    allowedHosts: [".local"],
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
