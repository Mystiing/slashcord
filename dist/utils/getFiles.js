"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function getFiles(dir) {
    const files = fs_1.default.readdirSync(dir, {
        withFileTypes: true,
    });
    let allFiles = [];
    for (const file of files) {
        if (file.isDirectory()) {
            allFiles = [...allFiles, ...getFiles(`${dir}/${file.name}`)];
        }
        else if (file.name.endsWith(".js") ||
            file.name.endsWith(".ts") ||
            !file.name.endsWith(".d.ts")) {
            let fileName = file.name
                .replace(/\\/g, "/")
                .split("/");
            fileName = fileName[fileName.length - 1];
            fileName = fileName.split(".")[0].toLowerCase();
            allFiles.push([`${dir}/${file.name}`, fileName]);
        }
    }
    return allFiles;
}
exports.default = getFiles;
