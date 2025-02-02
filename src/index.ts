#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

// Get directory paths in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .version("0.1.0")
  .argument("<project-name>")
  .action(async (projectName: string) => {
    const templateDir = path.join(__dirname, "../template");
    const projectDir = path.resolve(projectName);

    // Check if directory exists
    if (fs.existsSync(projectDir)) {
      console.log(
        chalk.red(`Error: Directory "${projectName}" already exists.`)
      );
      process.exit(1);
    }

    try {
      console.log(chalk.cyan(`Creating project in ${projectDir}...`));
      fs.mkdirpSync(projectDir);
      fs.copySync(templateDir, projectDir);

      // Update package.json name
      const packageJsonPath = path.join(projectDir, "package.json");
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      // Install dependencies
      console.log(chalk.cyan("Installing dependencies..."));
      spawnSync("npm", ["install"], {
        stdio: "inherit",
        cwd: projectDir,
      });

      console.log(
        chalk.green("\nSuccess! Created project at"),
        chalk.yellow(projectDir)
      );
      console.log(chalk.cyan("\nStart developing with:"));
      console.log(`  cd ${projectName}`);
      console.log("  npm run dev\n");
    } catch (error) {
      console.log(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
