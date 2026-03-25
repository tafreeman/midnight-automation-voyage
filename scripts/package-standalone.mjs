import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const trainingAppDir = path.join(repoRoot, "training-app");
const practiceAppDir = path.join(repoRoot, "practice-app");
const outputDir = path.join(repoRoot, "standalone-dist");
const isWsl = process.platform === "linux" && Boolean(process.env.WSL_DISTRO_NAME);

function toWindowsPath(value) {
  const normalized = path.resolve(value);

  if (!normalized.startsWith("/mnt/")) {
    return normalized;
  }

  const driveLetter = normalized[5].toUpperCase();
  const rest = normalized.slice(7).replace(/\//g, "\\");
  return `${driveLetter}:\\${rest}`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with status ${result.status}`);
  }
}

function copyDist(appDir, targetName) {
  const source = path.join(appDir, "dist");
  const target = path.join(outputDir, targetName);

  if (!existsSync(source)) {
    throw new Error(`Missing dist directory for ${targetName}: ${source}`);
  }

  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

function copyFile(source, target) {
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(source, target);
}

function runPnpm(args, cwd, env = process.env) {
  if (isWsl) {
    const windowsCwd = toWindowsPath(cwd);
    run("cmd.exe", ["/c", `cd /d ${windowsCwd} && pnpm ${args.join(" ")}`], {
      env,
    });
    return;
  }

  run("pnpm", args, {
    cwd,
    env,
  });
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

runPnpm(["build"], practiceAppDir);

runPnpm(["build"], trainingAppDir, {
  ...process.env,
  VITE_PRACTICE_URL: "../practice/index.html",
});

runPnpm(["build", "--config", "vite.first-playwright-tests.config.ts"], trainingAppDir, {
  ...process.env,
  VITE_PRACTICE_URL: "../practice/index.html",
});

copyDist(practiceAppDir, "practice");
copyDist(trainingAppDir, "training");
copyFile(
  path.join(trainingAppDir, "dist-first-playwright-tests", "first-playwright-tests.html"),
  path.join(outputDir, "training", "first-playwright-tests.html"),
);
