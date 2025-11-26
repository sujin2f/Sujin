import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";
import { config } from "dotenv";
import util from "util";
config();
const execPromise = util.promisify(exec);

const dirTemp = path.join("temp");
const files = {
    envDev: ".env",
    envProd: ".env.production",
    package: "package.json",
};

// Version
let packageJson = await fs.promises.readFile(path.join(files.package), "utf-8");
packageJson = JSON.parse(packageJson);
const VERSION = packageJson.version;

// Overwrite VERSION info
let env = await fs.promises.readFile(path.join(files.envProd), "utf-8");
let envDev = await fs.promises.readFile(path.join(files.envDev), "utf-8");
env = env.replace(/VERSION=[0-9.beta-]+\n/g, "");
env += `VERSION=${VERSION}\n`;
envDev = env.replace(/VERSION=[0-9.beta-]+\n/g, "");
envDev += `VERSION=${VERSION}\n`;
await fs.promises.writeFile(path.join(files.envProd), envDev);
await fs.promises.writeFile(path.join(files.envDev), envDev);
console.log("🤟 \x1B[32m- Version updated. \x1B[0m");

// Check if Docker image exists
const image = `sujin2f/wordpress:${VERSION}`;
const { stdout, stderr } = await execPromise(`docker image ls ${image}`);
if (stdout.includes(image)) {
    console.error(`⛈️ Image ${image} already exists.`);
    process.exit(1);
}
if (stderr) {
    console.error(`👀 stderr: ${stderr}`);
    process.exit(1);
}

const createDirectories = async () => {
    console.log("🤟 \x1B[32m- Creating directories... \x1B[0m");
    await fs.promises.mkdir(dirTemp);
};

const backupFiles = async () => {
    console.log("🤟 \x1B[32m- Backup files... \x1B[0m");
    // .env
    await fs.promises.copyFile(
        path.join(files.envDev),
        path.join(dirTemp, files.envDev)
    );
};

const modifyFiles = async () => {
    console.log("🤟 \x1B[32m- Modifying files... \x1B[0m");
    // .env
    await fs.promises.unlink(path.join(files.envDev));
    await fs.promises.copyFile(
        path.join(files.envProd),
        path.join(files.envDev)
    );
    await fs.promises.writeFile(path.join(files.envDev), env);
};

const restoreFiles = async () => {
    console.log("🤟 \x1B[32m- Restore files... \x1B[0m");
    await fs.promises.unlink(path.join(files.envDev));
    await fs.promises.copyFile(
        path.join(dirTemp, files.envDev),
        path.join(files.envDev)
    );
    await fs.promises.rm(dirTemp, { recursive: true, force: true });
};

await createDirectories();
await backupFiles();
await modifyFiles();

console.log("🤟 \x1B[32m- Creating Docker image... \x1B[0m");
exec(`sudo docker build -t ${image} .`, async (error, stdout, stderr) => {
    if (error) {
        console.log("🤬 \x1B[31m- docker build error: \x1B[0m", error);
        await restoreFiles();
        return;
    }
    console.log(`👀 stdout: ${stdout}`);
    console.error(`👀 stderr: ${stderr}`);

    // Delay 1 sec for finishing build
    setTimeout(() => {}, 1000);

    console.log("🤟 \x1B[32m- Running docker compose... \x1B[0m");
    exec(
        `sudo docker-compose -f docker-compose.prod.yml up -d --remove-orphans`,
        async (error, stdout, stderr) => {
            if (error) {
                console.log(
                    "🤬 \x1B[31m- docker compose error: \x1B[0m",
                    error
                );
                await restoreFiles();
                return;
            }
            console.log(`👀 stdout: ${stdout}`);
            console.error(`👀 stderr: ${stderr}`);

            await restoreFiles();
        }
    );
});
