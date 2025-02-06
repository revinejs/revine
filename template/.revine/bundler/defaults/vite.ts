import react from "@vitejs/plugin-react";
import { revineLoggerPlugin } from "../viteLoggerPlugin";
import tailwindcss from "@tailwindcss/vite";

export const defaultViteConfig = {
  plugins: [react(), revineLoggerPlugin(), tailwindcss()],
  logLevel: "silent",

  server: {
    clearScreen: false,
    open: true,
    port: 3000,
    host: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
};
