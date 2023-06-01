/* eslint-disable import/no-extraneous-dependencies */

import os from "os";
import fs from "fs";
import path from "path";
import { globSync } from "glob";
import chokidar from "chokidar";

const ROOT = "dist";

function readFile(file) {
    return fs.readFileSync(path.resolve(file), { encoding: "utf8", flag: "r" });
}

function writeFile(file, data) {
    fs.writeFileSync(path.resolve(file), data, { encoding: "utf8" });
}

function editFile(file, callback) {
    if (fs.existsSync(file)) {
        let data = readFile(file);
        data = callback(data);
        writeFile(file, data);
    }
}

function fixupMainBundle(file) {
    editFile(file, (data) => {
        const regex = /import.*\r?\n/g;
        return [
            "'use client';",
            ...data.match(regex).map((line) => line.trim()),
            data.replaceAll(regex, "").trim(),
        ].join(os.EOL);
    });
}

function cleanupSideEffectImports(file) {
    editFile(file, (data) => {
        const regex = /import\s*['"]+[^'"]+['"]+;*\r?\n/g;
        return data.replaceAll(regex, "");
    });
}

function fixupCssDefinitions(file) {
    writeFile(`${file}.d.ts`, ["declare const styles: unknown;", "export default styles;"].join(os.EOL));
}

function fixupModuleAugmentation(file) {
    editFile(file, (data) => {
        const regex = /declare module "\.\.\/\.\.\/types.js"/g;
        return data.replaceAll(regex, 'declare module "yet-another-react-lightbox"');
    });
}

function fixup(watchMode) {
    try {
        fixupMainBundle(`${ROOT}/index.js`);

        globSync(`${ROOT}/**/*.{js,d\\.ts}`).forEach((file) => {
            cleanupSideEffectImports(file);
        });

        globSync(`${ROOT}/**/*.css`).forEach((file) => {
            fixupCssDefinitions(file);
        });

        globSync(`${ROOT}/plugins/**/index.d.ts`).forEach((file) => {
            fixupModuleAugmentation(file);
        });

        globSync(`${ROOT}/**/*-*.{js,d\\.ts}`).forEach((file) => {
            // eslint-disable-next-line no-console
            console.error(`Unexpected chunk: ${file}${os.EOL}`);

            if (!watchMode) {
                process.exit(1);
            }
        });
    } catch (err) {
        //
    }
}

function watch() {
    let timeout;
    let running = false;
    chokidar.watch(ROOT).on("all", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!running) {
                running = true;
                try {
                    fixup(true);
                } finally {
                    running = false;
                }
            }
        }, 3_000);
    });
}

if ([...process.argv].includes("-w")) {
    watch();
} else {
    fixup();
}
