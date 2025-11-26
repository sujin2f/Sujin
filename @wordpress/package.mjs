import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";
import { config } from "dotenv";
import util from "util";
config();
const execPromise = util.promisify(exec);

const dirTemp = path.join("temp");
const files = {
    env: ".env",
    package: "package.json",
};

// Version
let packageJson = await fs.promises.readFile(path.join(files.package), "utf-8");
packageJson = JSON.parse(packageJson);
const VERSION = packageJson.version;

// Overwrite VERSION info
let env = await fs.promises.readFile(path.join(files.env), "utf-8");
env = env.replace(/VERSION=[0-9.beta-]+\n/g, "");
env += `VERSION=${VERSION}\n`;
await fs.promises.writeFile(path.join(files.env), envDev);
console.log("🤟 \x1B[32m- Version updated. \x1B[0m");

// Check if Docker image exists
const image = `sujin2f/wordpress:${VERSION}`;
const { stdout } = await execPromise(`sudo docker image ls ${image}`);
if (stdout.includes(image)) {
    console.error(`⛈️ Image ${image} already exists.`);
    process.exit(1);
}

console.log("🤟 \x1B[32m- Creating Docker image... \x1B[0m");
exec(`sudo docker build -t ${image} .`, async (error, stdout, stderr) => {
    if (error) {
        console.log("🤬 \x1B[31m- docker build error: \x1B[0m", error);
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
                return;
            }
            console.log(`👀 stdout: ${stdout}`);
            console.error(`👀 stderr: ${stderr}`);
        }
    );
});
