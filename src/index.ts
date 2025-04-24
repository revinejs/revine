#!/usr/bin/env node
import { Command } from "commander";
import { createProject } from "./commands/createProject.js";

const program = new Command();

// Main command handler for direct project creation
const handleProjectCreation = async (projectName: string, options: { force?: boolean }) => {
  await createProject(projectName, options);
};

// Root command (npx revine my-app)
program
  .version("0.1.0")
  .argument("[project-name]")
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (projectName: string, options: { force?: boolean }) => {
    if (projectName) {
      await handleProjectCreation(projectName, options);
    } else {
      program.help();
    }
  });

// Create subcommand (npx revine create my-app)
program
  .command("create")
  .argument("<project-name>")
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (projectName: string, options: { force?: boolean }) => {
    await handleProjectCreation(projectName, options);
  });

program.parse(process.argv);
