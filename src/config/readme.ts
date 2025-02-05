import fs from "fs-extra";

export async function updateReadme(filePath: string, projectName: string) {
  let readmeContent = await fs.readFile(filePath, "utf-8");
  readmeContent = readmeContent.replace(/%PROJECT_NAME%/g, projectName);
  await fs.writeFile(filePath, readmeContent);
}
