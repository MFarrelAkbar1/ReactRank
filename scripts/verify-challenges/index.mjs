#!/usr/bin/env node
/**
 * Verifies every React challenge locally:
 *   - solution/ must pass 100% of tests/
 *   - starter/  must NOT pass 100% (the feature is not implemented yet)
 *
 * For each challenge and variant it copies the files plus the hidden tests into
 * .verify/<slug>/<variant>/ and runs them all with Vitest (Jest-compatible API).
 *
 * Usage: npm run verify            (all challenges)
 *        npm run verify -- step-counter todo-filter
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const challengesDir = join(root, "src", "challenges");
const outDir = join(root, ".verify");
const VARIANTS = ["starter", "solution"];

const only = process.argv.slice(2);
const slugs = readdirSync(challengesDir).filter((slug) => {
  const metaPath = join(challengesDir, slug, "meta.json");
  if (!existsSync(metaPath)) return false;
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  return (meta.language ?? "react") === "react" && (only.length === 0 || only.includes(slug));
});

rmSync(outDir, { recursive: true, force: true });
for (const slug of slugs) {
  for (const variant of VARIANTS) {
    const dest = join(outDir, slug, variant);
    mkdirSync(dest, { recursive: true });
    cpSync(join(challengesDir, slug, variant), dest, { recursive: true });
    cpSync(join(challengesDir, slug, "tests"), dest, { recursive: true });
  }
}

const resultsFile = join(outDir, "results.json");
const run = spawnSync(
  process.execPath,
  [join(root, "node_modules", "vitest", "vitest.mjs"), "run", "--config", "scripts/verify-challenges/vitest.config.mjs", "--reporter=json", "--outputFile=" + resultsFile],
  { cwd: root, stdio: ["ignore", "ignore", "pipe"], encoding: "utf8" },
);
if (!existsSync(resultsFile)) {
  console.error(run.stderr);
  console.error("Vitest did not produce results.");
  process.exit(1);
}

const report = JSON.parse(readFileSync(resultsFile, "utf8"));
const summary = {}; // slug -> variant -> {passed,total,failures[],fileError}
for (const file of report.testResults) {
  const rel = file.name.replace(/\\/g, "/").split("/.verify/")[1];
  const [slug, variant] = rel.split("/");
  const s = ((summary[slug] ??= {})[variant] ??= { passed: 0, total: 0, failures: [], fileError: null });
  for (const a of file.assertionResults) {
    s.total++;
    if (a.status === "passed") s.passed++;
    else s.failures.push(a.fullName || a.title);
  }
  if (file.assertionResults.length === 0 && file.message) s.fileError = file.message.split("\n")[0];
}

let ok = true;
const pad = (s, n) => String(s).padEnd(n);
console.log("\n" + pad("Challenge", 26) + pad("Starter", 14) + pad("Solution", 14) + "Result");
console.log("-".repeat(66));
for (const slug of slugs) {
  const st = summary[slug]?.starter ?? { passed: 0, total: 0 };
  const so = summary[slug]?.solution ?? { passed: 0, total: 0, failures: ["no results"] };
  const solutionOk = so.total > 0 && so.passed === so.total;
  const starterOk = st.passed < so.total;
  const pass = solutionOk && starterOk;
  ok &&= pass;
  console.log(
    pad(slug, 26) + pad(`${st.passed}/${so.total || st.total}`, 14) + pad(`${so.passed}/${so.total}`, 14) + (pass ? "OK" : "FAIL"),
  );
  if (!solutionOk) {
    if (so.fileError) console.log("    solution file error: " + so.fileError);
    for (const f of so.failures) console.log("    solution failed: " + f);
  }
  if (!starterOk) console.log("    starter passes every test (it should fail most of them)");
}
console.log("");
process.exit(ok ? 0 : 1);
