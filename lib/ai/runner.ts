import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const PROJECT_ROOT = process.cwd();
const AI_ENGINE_DIR = path.join(PROJECT_ROOT, "ai-engine");

export async function runAiPipeline(): Promise<void> {
  const python = process.env.PYTHON_PATH ?? "python3";
  const script = path.join(AI_ENGINE_DIR, "main.py");

  await execFileAsync(python, [script], {
    cwd: PROJECT_ROOT,
    timeout: 120_000,
    env: { ...process.env, PYTHONPATH: AI_ENGINE_DIR },
  });
}
