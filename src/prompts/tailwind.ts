import inquirer from "inquirer";

export async function askForTailwindSetup(): Promise<boolean> {
  const { useTailwind } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useTailwind",
      message: "Would you like to set up Tailwind CSS?",
      default: true,
    },
  ]);
  return useTailwind;
}
