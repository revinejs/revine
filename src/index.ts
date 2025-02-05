#!/usr/bin/env node
import { Command } from "commander";
import { createProject } from "./commands/createProject.js";

const program = new Command();

program
  .version("0.1.0")
  .argument("<project-name>")
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (projectName: string, options: { force?: boolean }) => {
    await createProject(projectName, options);
  });

program.parse(process.argv);
