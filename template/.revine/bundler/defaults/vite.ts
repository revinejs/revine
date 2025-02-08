import react from "@vitejs/plugin-react";
import { revineLoggerPlugin } from "../viteLoggerPlugin";

export const defaultViteConfig = {
  plugins: [react(), revineLoggerPlugin()],
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
