/**
 * FASE 0 spike — proves Sandpack can:
 *  1. run a React (JSX) project in SandpackPreview
 *  2. run React Testing Library tests via SandpackTests against the user's component
 *  3. hide test files from the user (visibleFiles + hideTestsAndSupressLogs)
 *  4. read results programmatically (onComplete) to compute passed/total
 */
import { useCallback, useState } from 'react'
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  useSandpack,
} from '@codesandbox/sandpack-react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'

// Starter: increment works, decrement is broken, reset missing → expect 2/4 passing.
const APP_JS = `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1 data-testid="count">{count}</h1>
      <button data-testid="inc" onClick={() => setCount(count + 1)}>+</button>
      <button data-testid="dec" onClick={() => setCount(count + 1)}>-</button>
    </div>
  );
}
`

const TEST_JS = `import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("Counter", () => {
  test("renders initial count of 0", () => {
    render(<App />);
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  test("increments count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("inc"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  test("decrements count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("inc"));
    fireEvent.click(screen.getByTestId("dec"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});

test("reset button sets count to 0", () => {
  render(<App />);
  fireEvent.click(screen.getByTestId("inc"));
  fireEvent.click(screen.getByTestId("reset"));
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});
`

const files: SandpackFiles = {
  '/App.js': { code: APP_JS, active: true },
  '/App.test.js': { code: TEST_JS, hidden: true },
}

const FIXED_APP_JS = APP_JS.replace('data-testid="dec" onClick={() => setCount(count + 1)}', 'data-testid="dec" onClick={() => setCount(count - 1)}').replace('</div>', '  <button data-testid="reset" onClick={() => setCount(0)}>reset</button>\n    </div>')

// Simulates a user edit through the same updateFile path the editor uses.
function ApplyFixButton() {
  const { sandpack } = useSandpack()
  return (
    <button id="apply-fix" className="px-3 py-1 rounded bg-sky-700 text-sm" onClick={() => sandpack.updateFile('/App.js', FIXED_APP_JS)}>
      Apply fix (simulated edit)
    </button>
  )
}

// Minimal structural types (Spec/Describe/Test are not exported from the package index).
type TestNode = { name: string; status: string; errors: unknown[] }
type DescribeNode = { name: string; tests: Record<string, TestNode>; describes: Record<string, DescribeNode> }

function collect(node: DescribeNode, prefix: string[] = []): { name: string; status: string }[] {
  const own = Object.values(node.tests).map((t) => ({ name: [...prefix, t.name].join(' › '), status: t.status }))
  const nested = Object.values(node.describes).flatMap((d) => collect(d, [...prefix, d.name]))
  return [...own, ...nested]
}

export default function SpikePage() {
  const [results, setResults] = useState<{ name: string; status: string }[] | null>(null)
  const [runKey, setRunKey] = useState(0)
  const [hideTests, setHideTests] = useState(true)
  const [log, setLog] = useState<string[]>([])

  const onComplete = useCallback((specs: Record<string, unknown>) => {
    const all = Object.values(specs as Record<string, DescribeNode & { error?: unknown }>).flatMap((s) => collect(s))
    const errs = Object.entries(specs as Record<string, { error?: unknown }>)
      .filter(([, s]) => s.error)
      .map(([p]) => `file_error in ${p}`)
    setResults(all)
    const passed = all.filter((t) => t.status === 'pass').length
    setLog((l) => [...l, `[onComplete] ${passed}/${all.length} passed ${errs.join(', ')}`])
    // expose for automated checks
    ;(window as unknown as { __spike: unknown }).__spike = { passed, total: all.length, all, raw: specs }
  }, [])

  const passed = results?.filter((t) => t.status === 'pass').length ?? 0

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-bold">ReactRank — Sandpack spike</h1>
      <div className="flex gap-2 items-center text-sm">
        <button
          id="run-tests"
          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
          onClick={() => {
            setResults(null)
            setRunKey((k) => k + 1)
          }}
        >
          Run Tests (external, remount)
        </button>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={hideTests} onChange={(e) => setHideTests(e.target.checked)} />
          hideTestsAndSupressLogs
        </label>
        <span id="score" className="ml-4 font-mono">
          {results ? `${passed}/${results.length} tests passed` : 'no results yet'}
        </span>
      </div>

      <SandpackProvider
        template="react"
        theme="dark"
        files={files}
        customSetup={{
          dependencies: {
            '@testing-library/react': '^16.3.0',
            '@testing-library/dom': '^10.4.0',
            '@testing-library/jest-dom': '^6.6.3',
          },
        }}
        options={{ visibleFiles: ['/App.js', '/styles.css'], activeFile: '/App.js' }}
      >
        <div className="mb-2"><ApplyFixButton /></div>
        <SandpackLayout>
          <SandpackFileExplorer autoHiddenFiles style={{ height: 360 }} />
          <SandpackCodeEditor style={{ height: 360 }} showTabs />
          <SandpackPreview style={{ height: 360 }} />
        </SandpackLayout>
        {runKey > 0 && (
          <div className="mt-3">
            <SandpackTests
              key={runKey}
              watchMode
              hideTestsAndSupressLogs={hideTests}
              onComplete={onComplete}
              style={{ height: 260 }}
            />
          </div>
        )}
      </SandpackProvider>

      {results && (
        <ul id="results" className="font-mono text-sm">
          {results.map((t) => (
            <li key={t.name} className={t.status === 'pass' ? 'text-emerald-400' : 'text-red-400'}>
              {t.status === 'pass' ? '✓' : '✗'} {t.name}
            </li>
          ))}
        </ul>
      )}
      <pre id="log" className="text-xs text-slate-400">{log.join('\n')}</pre>
    </div>
  )
}
