# ReactRank — Specification

A static, HackerRank-style practice site for React (and later PHP). Users read a challenge, edit code in an in-browser editor, see a live preview, and click **Run Tests**. The score is the number of hidden unit tests that pass. There is no backend, and the site deploys to Vercel.

## Tech stack
- Vite + React + TypeScript, Tailwind CSS
- `@codesandbox/sandpack-react` (v2.20) for the editor, preview and in-browser Jest runner
- `react-router-dom`, `react-markdown` + `remark-gfm`, `react-resizable-panels`
- Progress is kept in `localStorage`. There is no auth and no DB.

### Sandpack notes (verified against v2.20.0)
- `SandpackTests` only works with **browser-bundler (runtime) templates**. Use `template="react"`, **not** `vite-react`: the Vite templates run on Nodebox and have no test runner.
- Dependencies are set through `customSetup.dependencies`. The test libraries (`@testing-library/react`, `@testing-library/jest-dom`) go there as well.
- Hidden tests: leave them out of `visibleFiles` (and/or mark them `hidden: true`), and set `hideTestsAndSupressLogs` on `SandpackTests`.
- Results: `onComplete(specs: Record<string, Spec>)`. Each spec holds nested `describes`/`tests`, and each test has `{ name, status: "pass" | "fail", errors }`.

### Phase 0 findings (verified in Chrome)
- **`SandpackFileExplorer` ignores `visibleFiles`** and lists every file, including tests, unless it gets `autoHiddenFiles`. With `autoHiddenFiles`, only the files in `visibleFiles` are shown.
- **React `StrictMode` breaks `SandpackTests`.** Tests initialize, but `run-all-tests` never runs: the spinner shows forever and `onComplete` never fires. Without StrictMode it works. The app root does not use `<StrictMode>`.
- **Running tests programmatically**: SandpackTests has no imperative API. An external "Run Tests" button remounts `<SandpackTests key={runId} watchMode />`, and watch mode auto-runs every spec on init. A run takes about 5s once warm.
- **`onComplete` can fire more than once per run.** Scoring/attempts must dedupe per `runId`.
- The test runner runs against the current editor state (`updateFile` → re-run reflects the edits).

## Features
### `/` — Challenge list
Each card shows the title, topic tags, difficulty, status (Not started / Attempted / Solved) and best score. You can filter by topic and difficulty and search by title. A progress summary ("3/5 solved") sits at the top. In Phase 4 a language tab is added (All / React / PHP).

### `/challenge/:slug` — Workspace
- Left panel: the markdown description, plus a Solution tab. The Solution tab stays locked until the user scores 100% or confirms "Reveal solution".
- Middle panel: the code editor and a file explorer that shows only the starter files.
- Right panel: Preview and Tests tabs.
- Panels are resizable on desktop and stack on small screens.
- Buttons: Run Tests, Reset Code (asks for confirmation), Back.
- Results show "7/10 tests passed" and a percentage, listing only test names and pass/fail.
- Code auto-saves to localStorage for each challenge.

## Challenge data format
```
src/challenges/<slug>/
  meta.json      { slug, title, difficulty, topics[], order, estimatedMinutes, language? }
  README.md
  starter/       user-editable files (App.js, components/*.js, styles.css)
  tests/         *.test.js (hidden)
  solution/      reference solution
```
Challenges are loaded at build time with `import.meta.glob(..., { query: '?raw', import: 'default', eager: true })`. To add a challenge, add a folder. The steps are documented in `CONTRIBUTING-CHALLENGES.md`.

## localStorage
- `reactrank:progress` → `{ [slug]: { bestScore, lastScore, solved, attempts, updatedAt } }`
- `reactrank:code:<slug>` → `{ [path]: code }`
- Every access is wrapped in try/catch.

## Folder structure
```
src/
  main.tsx, App.tsx, index.css
  pages/ ChallengeList.tsx, ChallengePage.tsx
  components/ ...
  lib/ challenges.ts (glob loader), storage.ts, testResults.ts
  challenges/<slug>/...
scripts/verify-challenges/   local Jest run of each challenge's tests against its solution and starter
```

## Phases
0. **Spike**: prove that Sandpack can do preview, RTL tests, hidden tests and programmatic results.
1. **Core app**: list page, workspace, storage, dark IDE theme.
2. **Five React challenges** (Step Counter, Todo Filter, Signup Form Validation, User Directory Fetch, Product Sorter), plus a verification script.
3. **Deploy**: clean `npm run build`, `vercel.json` SPA rewrite, README.
4. **PHP track** (after confirmation): `@php-wasm/web` in a Web Worker with a 5s timeout, a JSON-marker test harness, and five PHP challenges.

Each phase ends with a summary and waits for confirmation. Commits are made per feature.
