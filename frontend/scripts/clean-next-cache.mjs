import { rmSync } from "fs";
import { join } from "path";

const root = join(import.meta.dirname, "..");
for (const dir of [".next", "node_modules/.cache"]) {
  try {
    rmSync(join(root, dir), { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  } catch {
    /* ignore */
  }
}
