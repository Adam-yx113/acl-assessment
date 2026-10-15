import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/acl-assessment/",
  plugins: [react()],
  build: {
    outDir: "dist"
  },
  optimizeDeps: {
    include: ["exceljs"]
  }
});
