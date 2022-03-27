/**
 * Environment settings helpers
 */

import path from "path";
import fs from "fs";

/**
 * Get if the current server is development server
 * @return {boolean}
 */
const rootDir =
    process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, "../../")
        : path.resolve(__dirname, "../../../../");
export const publicDir = path.resolve(rootDir, "public");

export const baseDir = path.resolve(
    rootDir,
    ".build",
    process.env.NODE_ENV || ""
);

/**
 * Get the bundle folder
 * @return {string[]}
 */
export const bundles = (): string[] => {
    const manifest = path.resolve(baseDir, "frontend", "asset-manifest.json");
    const raw = fs.readFileSync(manifest).toString();
    return JSON.parse(raw).entrypoints;
};

// export const rootDir = path.resolve(__dirname, '../../')
// export const publicDir = path.resolve(rootDir, 'public')
// export const baseDirDev = path.resolve(rootDir, 'dist')
// export const baseDirProd = path.resolve(rootDir, 'build', 'frontend')
// export const bundles = (): string[] => {
//     const dir = isDev()
//         ? path.resolve(baseDirDev, 'static', 'js')
//         : path.resolve(baseDirDev, 'static', 'js')
//     return fs.readdirSync(dir).filter((file: string) => !file.endsWith('.map'))
// }
