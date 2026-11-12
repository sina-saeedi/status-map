import { readFile, writeFile, mkdir } from "node:fs/promises";

const OUT_DIR = process.env.OUT_DIR ?? "out";
const TIMEOUT_MS = 10_000;
const SLOW_MS = 300;
const HISTORY_LIMIT = 144; // 24h at one check per 10 minutes

async function checkTarget(target) {
  const start = performance.now();
  try {
    const res = await fetch(target.url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const latencyMs = Math.round(performance.now() - start);
    res.body?.cancel();

    // Any response below 500 means the server is reachable
    if (res.status >= 500) {
      return { id: target.id, status: "down", latencyMs: null };
    }
    return {
      id: target.id,
      status: latencyMs > SLOW_MS ? "slow" : "up",
      latencyMs,
    };
  } catch {
    // network error or timeout
    return { id: target.id, status: "down", latencyMs: null };
  }
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const targets = JSON.parse(await readFile("data/targets.json", "utf8"));
  const t = new Date().toISOString();
  const results = await Promise.all(targets.map(checkTarget));

  await mkdir(OUT_DIR, { recursive: true });

  // 1. current snapshot
  await writeFile(
    `${OUT_DIR}/latest.json`,
    JSON.stringify({ updatedAt: t, targets: results }, null, 2)
  );

  // 2. history: append this run, keep only the last 24h
  const history = await readJson(`${OUT_DIR}/history.json`, {});
  for (const r of results) {
    const points = history[r.id] ?? [];
    points.push({ t, status: r.status, latencyMs: r.latencyMs });
    history[r.id] = points.slice(-HISTORY_LIMIT);
  }
  await writeFile(`${OUT_DIR}/history.json`, JSON.stringify(history));

  for (const r of results) {
    console.log(`${r.status.padEnd(5)} ${String(r.latencyMs ?? "-").padStart(5)} ms  ${r.id}`);
  }
}

main();