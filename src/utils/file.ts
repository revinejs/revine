import fs from "fs-extra";

export async function copyTemplate(
  templateDir: string,
  destinationDir: string,
  force?: boolean
): Promise<void> {
  await fs.copy(templateDir, destinationDir, { overwrite: force });
}
