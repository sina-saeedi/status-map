import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const OUT_DIR = process.env.OUT_DIR ?? "out";
const LABEL = "outage";
const DOWN_CHECKS = 2;

const gh = (...args) => execFileSync("gh", args, { encoding: "utf8" });

const targets = JSON.parse(await readFile("data/targets.json", "utf8"));
const history = JSON.parse(await readFile(`${OUT_DIR}/history.json`, "utf8"));

gh("label", "create", LABEL, "--color", "D73A4A", "--force");

const openIssues = JSON.parse(
  gh("issue", "list", "--label", LABEL, "--state", "open",
     "--json", "number,body", "--limit", "100")
);

for (const t of targets) {
  const points = history[t.id] ?? [];
  const recent = points.slice(-DOWN_CHECKS);
  const latest = points.at(-1);
  const isDown =
    recent.length === DOWN_CHECKS && recent.every((p) => p.status === "down");

  const marker = `<!-- target:${t.id} -->`;
  const open = openIssues.find((i) => i.body.includes(marker));

  if (isDown && !open) {
    gh("issue", "create",
       "--title", `🔴 ${t.name} is down`,
       "--label", LABEL,
       "--body", `${marker}\n${t.url} failed ${DOWN_CHECKS} checks in a row.\n\nFirst failure: ${recent[0].t}`);
    console.log(`opened issue for ${t.id}`);
  } else if (open && latest && latest.status !== "down") {
    gh("issue", "comment", String(open.number),
       "--body", `✅ Recovered at ${latest.t} (${latest.latencyMs} ms).`);
    gh("issue", "close", String(open.number));
    console.log(`closed issue for ${t.id}`);
  }
}