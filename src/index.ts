#!/usr/bin/env node

import chalk from "chalk";
import { spawnSync } from "child_process";
import { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";

// Get directory paths in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .version("0.1.0")
  .argument("<project-name>")
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (projectName: string, options: { force?: boolean }) => {
    const templateDir = path.join(__dirname, "../template");
    const projectDir = path.resolve(projectName);
    const isCurrentDir = [".", "./"].includes(projectName);

    // ... [keep existing directory checks the same] ...

    try {
      console.log(chalk.cyan(`Creating project in ${projectDir}...`));
      fs.copySync(templateDir, projectDir, { overwrite: options.force });

      // Update package.json with ESM configuration
      const packageJsonPath = path.join(projectDir, "package.json");
      const packageJson = await fs.readJson(packageJsonPath);
      const finalProjectName = isCurrentDir
        ? path.basename(projectDir)
        : projectName;

      packageJson.name = finalProjectName;
      packageJson.type = "module"; // Add ESM type declaration

      const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

      // Add Tailwind prompt
      const { useTailwind } = await inquirer.prompt([
        {
          type: "confirm",
          name: "useTailwind",
          message: "Would you like to set up Tailwind CSS?",
          default: true,
        },
      ]);

      // Add Tailwind v4 dependencies if selected
      if (useTailwind) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          tailwindcss: "^4.0.0",
          "@tailwindcss/vite": "^4.0.0",
        };
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      // Update README
      const readmePath = path.join(projectDir, "README.md");
      let readmeContent = fs.readFileSync(readmePath, "utf-8");
      readmeContent = readmeContent.replace(
        /%PROJECT_NAME%/g,
        finalProjectName
      );
      fs.writeFileSync(readmePath, readmeContent);

      // Install dependencies with error handling
      console.log(chalk.cyan("\nInstalling dependencies..."));
      const installResult = spawnSync(npmCmd, ["install"], {
        stdio: "inherit",
        cwd: projectDir,
        shell: true,
      });

      if (installResult.error || installResult.status !== 0) {
        console.log(
          chalk.red("\nError installing dependencies!", installResult.error)
        );
        console.log(chalk.yellow("Try running manually: npm install"));
        process.exit(1);
      }

      // Setup Tailwind after dependencies are installed
      if (useTailwind) {
        console.log(chalk.cyan("\nSetting up Tailwind CSS v4..."));

        // Update Vite config to add Tailwind plugin
        const viteConfigPath = path.join(projectDir, "vite.config.ts");
        let viteConfigContent = fs.readFileSync(viteConfigPath, "utf-8");

        // Add Tailwind import
        viteConfigContent = viteConfigContent.replace(
          "import react from '@vitejs/plugin-react';",
          "import react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';"
        );

        // Add Tailwind plugin to existing config
        viteConfigContent = viteConfigContent.replace(
          "plugins: [react()]",
          "plugins: [\n    react(),\n    tailwindcss()\n  ]"
        );

        fs.writeFileSync(viteConfigPath, viteConfigContent);
        fs.writeFileSync(viteConfigPath, viteConfigContent);

        // Create CSS file with import
        const cssDir = path.join(projectDir, "src", "styles");
        fs.ensureDirSync(cssDir);
        fs.writeFileSync(
          path.join(cssDir, "global.css"),
          "@import 'tailwindcss';\n"
        );

        // Add CSS import to main.tsx
        const mainTsxPath = path.join(projectDir, "src", "main.tsx");
        const mainContent = `import './styles/global.css';\n${fs.readFileSync(
          mainTsxPath,
          "utf-8"
        )}`;
        fs.writeFileSync(mainTsxPath, mainContent);
      }

      console.log(
        chalk.green("\nSuccess! Created project at"),
        chalk.yellow(projectDir)
      );
      console.log(chalk.cyan("\nStart developing with:"));
      if (!isCurrentDir) console.log(`  cd ${projectName}`);
      console.log("  npm run dev\n");
    } catch (error) {
      console.log(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
