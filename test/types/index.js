/* eslint-disable import/no-extraneous-dependencies */

import path from "path";
import fse from "fs-extra";
import child_process from "child_process";
import { fileURLToPath } from "node:url";

function resolve(...paths) {
    return fileURLToPath(new URL(path.join(...paths), import.meta.url));
}

function execSync(cmd) {
    child_process.execSync(cmd, { cwd: resolve(), timeout: 300_000, stdio: "inherit" });
}

execSync("npm install --no-save");

function copySync(file) {
    const target = resolve("node_modules", "yet-another-react-lightbox", file);
    fse.removeSync(target);
    fse.copySync(resolve("..", "..", file), target);
}

copySync("dist");
copySync("package.json");

execSync("npm run build");
