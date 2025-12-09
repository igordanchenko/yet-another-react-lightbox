import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "dev",
  plugins: [react()],
  server: { allowedHosts: [".local"] },
});
