# Adding a React challenge

A challenge is one folder under `src/challenges/`. You don't need to change any app code. The folder is picked up at build time with `import.meta.glob`.

```
src/challenges/<slug>/
  meta.json      metadata
  README.md      problem statement (Markdown + GFM tables)
  starter/       files the user edits (App.js, components/*.js, styles.css, ...)
  tests/         hidden *.test.js files
  solution/      the complete reference solution (same file names as starter/)
```

## meta.json

```json
{
  "slug": "my-challenge",
  "title": "My Challenge",
  "difficulty": "Easy",
  "topics": ["useState", "events"],
  "order": 6,
  "estimatedMinutes": 20,
  "language": "react",
  "activeFile": "/components/Widget.js"
}
```

- `slug` must match the folder name. It is also the URL: `/challenge/<slug>`.
- `difficulty` is `Easy`, `Medium` or `Hard`.
- `order` sets the position in the list.
- `activeFile` is optional: the file that opens first in the editor. The default is `/App.js`.

## Files and paths

- Sandpack runs the challenge with the `react` (Create React App) template. Every file in `starter/` is mounted at the root of the sandbox: `starter/components/Card.js` → `/components/Card.js`.
- The template's `/index.js` imports `./App` and `./styles.css`, so `starter/` should include `App.js` and `styles.css`.
- Files in `tests/` are mounted at the root too, so tests import with `./App` or `./components/Card`.
- `solution/` should contain the same files as `starter/`.

## Writing tests

- Use Jest + React Testing Library: `render`, `screen`, `fireEvent`, `waitFor` from `@testing-library/react`, and `import "@testing-library/jest-dom"`.
- Use `fireEvent` instead of `@testing-library/user-event`. Only the dependencies in `TEST_DEPENDENCIES` (`src/pages/ChallengePage.tsx`) are installed.
- Give each test a clear, behaviour-focused name ("increments count by step value"). Users only see the test names.
- Aim for 6–10 tests. The starter should fail most of them, and the solution must pass all of them.
- Query by `data-testid`, and list every required test id in `README.md`.
- **Mocking globals (e.g. `fetch`, `alert`)**: in Sandpack's runner, `global`/`window` and `globalThis` are *different* objects, and bare `fetch()`/`alert()` calls resolve through `globalThis`. Set the mock on all three and restore it afterwards (see `user-directory/tests/App.test.js`).
- **Create mocks inside each test, not in `beforeEach`.** Sandpack can register hooks from more than one evaluation of a test file, so a mock created in `beforeEach` may not be the one the component calls (see `pokemon-details/tests/App.test.js`, `setupMocks()`).
- **Similar file names in the same folder**: Sandpack's resolver can confuse `./Pokemon` with `./PokemonDetails.js`. Import such files with an explicit extension (`./Pokemon.js`).

## Verify

```bash
npm run verify                    # all challenges
npm run verify -- my-challenge    # just one
```

The script copies `starter/` and `solution/`, each together with `tests/`, into `.verify/` and runs them with Vitest. It fails if the solution doesn't pass 100% or if the starter already passes everything.

After the script passes, open the challenge in `npm run dev` and run the tests in the browser too. Sandpack's runner can behave differently from Node; the `fetch` mocking above is one example.
