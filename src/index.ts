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
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (projectName: string, options: { force?: boolean }) => {
    const templateDir = path.join(__dirname, "../template");
    const projectDir = path.resolve(projectName);
    const isCurrentDir = [".", "./"].includes(projectName);

    if (fs.existsSync(projectDir)) {
      if (!isCurrentDir && !options.force) {
        console.log(
          chalk.red(`Error: Directory "${projectName}" already exists.`)
        );
        process.exit(1);
      }

      // Check if directory is empty (ignore .git)
      const existingFiles = fs
        .readdirSync(projectDir)
        .filter((file) => file !== ".git");
      if (existingFiles.length > 0 && !options.force) {
        console.log(
          chalk.red(`Error: Directory "${projectName}" is not empty.`)
        );
        console.log(chalk.yellow("Use --force to override existing files"));
        process.exit(1);
      }
    } else {
      fs.mkdirpSync(projectDir);
    }

    try {
      console.log(chalk.cyan(`Creating project in ${projectDir}...`));
      fs.copySync(templateDir, projectDir, {
        overwrite: options.force,
      });

      // Update package.json name
      const packageJsonPath = path.join(projectDir, "package.json");
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      // Update README
      const readmePath = path.join(projectDir, "README.md");
      let readmeContent = fs.readFileSync(readmePath, "utf-8");
      const finalProjectName = isCurrentDir
        ? path.basename(projectDir)
        : projectName;
      readmeContent = readmeContent.replace(
        /%PROJECT_NAME%/g,
        finalProjectName
      );
      fs.writeFileSync(readmePath, readmeContent);

      // Install dependencies with error handling
      console.log(chalk.cyan("\nInstalling dependencies..."));
      const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
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
