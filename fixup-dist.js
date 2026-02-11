import os from "os";
import fs from "fs";
import path from "path";
import { globSync } from "glob";
import chokidar from "chokidar";

const ROOT = "dist";

/**
 * Read file contents.
 *
 * @param {string} file - file name
 * @returns {string} - file contents
 */
function readFile(file) {
  return fs.readFileSync(path.resolve(file), { encoding: "utf8", flag: "r" });
}

/**
 * Write file contents.
 *
 * @param {string} file - file name
 * @param {string} data - file contents
 */
function writeFile(file, data) {
  fs.writeFileSync(path.resolve(file), data, { encoding: "utf8" });
}

/**
 * Edit file contents.
 *
 * @param {string} file - file name
 * @param {function} callback - callback function
 */
function editFile(file, callback) {
  if (fs.existsSync(file)) {
    let data = readFile(file);
    data = callback(data);
    writeFile(file, data);
  }
}

/**
 * Fixup main bundle.
 *
 * @param {string} file - file name
 */
function fixupMainBundle(file) {
  if (/"use client";/.test(file)) return;

  editFile(file, (data) => {
    const regex = /import.*\r?\n/g;
    return ['"use client";', ...data.match(regex).map((line) => line.trim()), data.replaceAll(regex, "").trim()].join(
      os.EOL,
    );
  });
}

/**
 * Remove side effect imports.
 *
 * @param {string} file - file name
 */
function cleanupSideEffectImports(file) {
  editFile(file, (data) => {
    const regex = /import\s*['"]+[^'"]+['"]+;*\r?\n/g;
    return data.replaceAll(regex, "");
  });
}

/**
 * Fixup plugin's imports.
 *
 * @param {string} file - file name
 */
function fixupPluginsImports(file) {
  const parts = file.split(path.sep);
  if (parts.length === 4) {
    const plugin = parts[2];

    const parseImports = (data) => {
      const importsMatch = [...data.matchAll(/import\s*\{(.*)}\s*from\s*['"]\.\.\/\.\.\/(?:types|index).js['"]/g)];
      return importsMatch.length > 0 ? importsMatch[0][1].split(/[ ,]+/).filter(Boolean) : [];
    };

    editFile(file, (data) => {
      const imports = new Set();
      parseImports(data).forEach(imports.add, imports);
      parseImports(readFile(`src/plugins/${plugin}/index.ts`)).forEach(imports.add, imports);
      return data.replaceAll(
        /import\s*\{.*}\s*from\s*['"]\.\.\/\.\.\/types.js['"]/g,
        `import { ${Array.from(imports).join(", ")} } from '../../types.js'`,
      );
    });
  }
}

/**
 * Fixup plugin's module augmentation.
 *
 * @param {string} file - file name
 */
function fixupPluginsModuleAugmentation(file) {
  editFile(file, (data) => {
    const regex = /declare module "\.\.\/\.\.\/types.js"/g;
    return data.replaceAll(regex, 'declare module "yet-another-react-lightbox"');
  });
}

/**
 * Run all fix-ups.
 *
 * @param {boolean} [watchMode] - watch mode flag
 */
function fixup(watchMode) {
  try {
    fixupMainBundle(`${ROOT}/index.js`);

    globSync(`${ROOT}/**/*.{js,d\\.ts}`).forEach((file) => {
      cleanupSideEffectImports(file);
    });

    globSync(`${ROOT}/plugins/**/index.d.ts`).forEach((file) => {
      fixupPluginsModuleAugmentation(file);
      fixupPluginsImports(file);
    });

    globSync(`${ROOT}/**/*-*.{js,d\\.ts}`).forEach((file) => {
      // eslint-disable-next-line no-console
      console.error(`Unexpected chunk: ${file}${os.EOL}`);

      if (!watchMode) {
        process.exit(1);
      }
    });
  } catch (error) {
    if (watchMode) {
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      throw error;
    }
  }
}

/**
 * Run all fix-ups in watch mode.
 */
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

/**
 * Main entrypoint.
 */
function main() {
  if ([...process.argv].includes("-w")) {
    watch();
  } else {
    fixup();
  }
}

main();
