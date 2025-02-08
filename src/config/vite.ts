import fs from "fs-extra";

export async function updateViteConfig(filePath: string) {
  let viteConfigContent = await fs.readFile(filePath, "utf-8");

  // Insert Tailwind import after the React plugin import.
  viteConfigContent = viteConfigContent.replace(
    'import react from "@vitejs/plugin-react";',
    "import react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';"
  );

  // Insert Tailwind plugin into the plugins array.
  viteConfigContent = viteConfigContent.replace(
    "plugins: [react(), revineLoggerPlugin()]",
    "plugins: [\n    react(),\n    revineLoggerPlugin(),\n    tailwindcss()\n  ]"
  );

  await fs.writeFile(filePath, viteConfigContent);
}
