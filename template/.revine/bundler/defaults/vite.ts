import react from "@vitejs/plugin-react";

export const defaultViteConfig = {
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    host: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
};
