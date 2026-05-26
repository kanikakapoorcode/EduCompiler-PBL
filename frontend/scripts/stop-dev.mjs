import { execSync } from "node:child_process";

const ports = [3000, 3002];

function killPort(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped process ${pid} on port ${port}`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* no listener */
  }
}

for (const port of ports) {
  killPort(port);
}

console.log("Ports 3000 and 3002 are free.");
