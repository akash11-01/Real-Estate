import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        // jab bhi requestin /api se start hogi ye targer automatic starting me add ho jayega url ke
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  base: "./",
  plugins: [react()],
});
