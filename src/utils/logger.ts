import chalk from "chalk";

export function logInfo(message: string) {
  console.log(chalk.cyan(message));
}

export function logError(message: string, error?: any) {
  console.error(chalk.red(message), error || "");
}
