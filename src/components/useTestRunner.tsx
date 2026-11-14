import { useCallback, useEffect, useRef, useState } from 'react'
import { useSandpackClient } from '@codesandbox/sandpack-react'
import type { RunResult, TestResult } from '../lib/types'

/**
 * Custom headless test runner.
 *
 * Instead of <SandpackTests> (which needs remounting + watch mode to be triggered
 * from outside, and re-runs on every keystroke), we register ONE hidden bundler
 * iframe for the whole page and dispatch "run-all-tests" only when the user clicks
 * Run Tests. Results are collected from the Jest events the bundler posts back.
 */

type TestEndEvent = {
  name: string
  blocks: string[]
  path: string
  status: 'pass' | 'fail'
}

type RunnerStatus = 'booting' | 'ready' | 'running'

const RUN_TIMEOUT_MS = 60_000
const RETRY_AFTER_MS = 4_000
const CODE_ERROR_HINT = 'Your code has an error, so the tests could not run. Open the Preview tab to see the full error.'

export function useTestRunner(expectedTotal: number, onFinished: (r: RunResult) => void) {
  const { iframe, listen, dispatch } = useSandpackClient()
  const [status, setStatus] = useState<RunnerStatus>('booting')

  const runningRef = useRef(false)
  const pendingRef = useRef(false) // run requested before the bundler finished booting
  const startedRef = useRef(false) // bundler acknowledged the run (total_test_start)
  const retryRef = useRef<number | undefined>(undefined)
  const readyRef = useRef(false)
  const resultsRef = useRef(new Map<string, TestResult>())
  const fileErrorRef = useRef<string | null>(null)
  const lastErrorRef = useRef<string | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)
  const onFinishedRef = useRef(onFinished)
  onFinishedRef.current = onFinished

  const finish = useCallback(
    (error?: string) => {
      if (!runningRef.current) return // dedupe: only one result per run
      runningRef.current = false
      window.clearTimeout(timeoutRef.current)
      window.clearTimeout(retryRef.current)
      const tests = [...resultsRef.current.values()]
      const passed = error ? 0 : tests.filter((t) => t.status === 'pass').length
      const total = Math.max(expectedTotal, tests.length)
      setStatus('ready')
      onFinishedRef.current({
        tests,
        passed,
        total,
        percent: total ? Math.round((passed / total) * 100) : 0,
        error,
      })
    },
    [expectedTotal],
  )

  const dispatchRun = useCallback(() => {
    pendingRef.current = false
    resultsRef.current = new Map()
    fileErrorRef.current = null
    lastErrorRef.current = null
    startedRef.current = false
    dispatch({ type: 'run-all-tests' })
    // A run requested while the bundler is recompiling can be dropped silently: retry once.
    window.clearTimeout(retryRef.current)
    retryRef.current = window.setTimeout(() => {
      if (runningRef.current && !startedRef.current) dispatch({ type: 'run-all-tests' })
    }, RETRY_AFTER_MS)
  }, [dispatch])

  useEffect(() => {
    const unsubscribe = listen((msg) => {
      const m = msg as Record<string, unknown> & { type: string }

      if (m.type === 'done') {
        if (!readyRef.current) {
          readyRef.current = true
          setStatus((s) => (s === 'booting' ? 'ready' : s))
        }
        if (pendingRef.current && runningRef.current) dispatchRun()
        return
      }

      // Failing assertions also emit "show-error"; only remember it in case the run produces no results.
      if (m.type === 'action' && m.action === 'show-error' && runningRef.current) {
        lastErrorRef.current = `${String(m.title ?? 'Error')}: ${String(m.message ?? '')}`.slice(0, 400)
        return
      }

      if (m.type !== 'test' || !runningRef.current) return

      switch (m.event) {
        case 'total_test_start':
          startedRef.current = true
          break
        case 'test_end': {
          const t = m.test as TestEndEvent
          const name = [...t.blocks, t.name].join(' › ')
          resultsRef.current.set(`${t.path}::${name}`, { name, status: t.status === 'pass' ? 'pass' : 'fail' })
          break
        }
        case 'file_error': {
          const err = m.error as { message?: string } | undefined
          fileErrorRef.current = err?.message ?? 'Test file crashed'
          break
        }
        case 'total_test_end': {
          const reason = fileErrorRef.current ?? lastErrorRef.current ?? 'No tests were executed.'
          finish(
            resultsRef.current.size === 0
              ? `${CODE_ERROR_HINT}\n\n${reason}`.slice(0, 500)
              : undefined,
          )
          break
        }
      }
    })
    return unsubscribe
  }, [listen, finish, dispatchRun])

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current)
      window.clearTimeout(retryRef.current)
    },
    [],
  )

  const run = useCallback(() => {
    if (runningRef.current) return
    runningRef.current = true
    setStatus('running')
    timeoutRef.current = window.setTimeout(() => finish('Timed out while running tests (60s). Check for infinite loops.'), RUN_TIMEOUT_MS)
    // Give the editor's debounced update time to reach the bundler before running.
    window.setTimeout(() => {
      if (!runningRef.current) return
      if (!readyRef.current) pendingRef.current = true
      else dispatchRun()
    }, 600)
  }, [dispatchRun, finish])

  const frame = <iframe ref={iframe} title="ReactRank test runner" style={{ display: 'none' }} />

  return { run, status, frame }
}
