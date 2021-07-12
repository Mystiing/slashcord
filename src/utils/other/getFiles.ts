import fs from "fs";

export default function getFiles(dir: string) {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  let allFiles: [string, string][] = [];

  for (const file of files) {
    if (file.isDirectory()) {
      allFiles = [...allFiles, ...getFiles(`${dir}/${file.name}`)];
    } else if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      !file.name.endsWith(".d.ts")
    ) {
      let fileName: string | string[] = file.name
        .replace(/\\/g, "/")
        .split("/");
      fileName = fileName[fileName.length - 1];
      fileName = fileName.split(".")[0].toLowerCase();

      allFiles.push([`${dir}/${file.name}`, fileName]);
    }
  }
  return allFiles;
}
