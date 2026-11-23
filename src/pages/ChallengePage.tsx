import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Group, Panel, Separator } from 'react-resizable-panels'
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from '@codesandbox/sandpack-react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { getChallenge } from '../lib/challenges'
import { clearCode, getChallengeProgress, loadCode, markSolutionRevealed, recordAttempt, saveCode } from '../lib/storage'
import type { Challenge, ChallengeProgress, FileMap, RunResult } from '../lib/types'
import { DifficultyBadge } from '../components/Badges'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Navbar } from '../components/Navbar'
import { useTestRunner } from '../components/useTestRunner'
import { useMediaQuery } from '../components/useMediaQuery'
import { sandpackTheme } from '../components/sandpackTheme'

export const TEST_DEPENDENCIES = {
  '@testing-library/react': '^16.3.0',
  '@testing-library/dom': '^10.4.0',
  '@testing-library/jest-dom': '^6.6.3',
}

export default function ChallengePage() {
  const { slug = '' } = useParams()
  const challenge = getChallenge(slug)
  if (!challenge) {
    return (
      <div className="flex h-full flex-col">
        <Navbar />
        <div className="m-auto text-center">
          <h1 className="text-2xl font-bold text-white">Challenge not found</h1>
          <p className="mt-2 text-slate-400">There is no challenge called “{slug}”.</p>
          <Link to="/" className="btn-primary mt-4">
            Back to challenges
          </Link>
        </div>
      </div>
    )
  }
  // key → fresh state when navigating between challenges
  return <ChallengeWorkspace key={challenge.slug} challenge={challenge} />
}

function ChallengeWorkspace({ challenge }: { challenge: Challenge }) {
  const [resetKey, setResetKey] = useState(0)

  const files = useMemo<SandpackFiles>(() => {
    const saved = loadCode(challenge.slug) ?? {}
    const out: SandpackFiles = {}
    for (const [path, code] of Object.entries(challenge.starter)) {
      out[path] = { code: typeof saved[path] === 'string' ? saved[path] : code }
    }
    for (const [path, code] of Object.entries(challenge.tests)) {
      out[path] = { code, hidden: true, readOnly: true }
    }
    return out
    // resetKey: recompute after "Reset Code"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, resetKey])

  const visibleFiles = Object.keys(challenge.starter)
  const activeFile =
    challenge.activeFile && visibleFiles.includes(challenge.activeFile)
      ? challenge.activeFile
      : visibleFiles.includes('/App.js')
        ? '/App.js'
        : visibleFiles[0]

  return (
    <SandpackProvider
      key={resetKey}
      template="react"
      theme={sandpackTheme}
      files={files}
      customSetup={{ dependencies: TEST_DEPENDENCIES }}
      options={{ visibleFiles, activeFile, initMode: 'immediate', recompileMode: 'delayed', recompileDelay: 400 }}
      style={{ height: '100%' }}
    >
      <Workspace challenge={challenge} onReset={() => setResetKey((k) => k + 1)} />
    </SandpackProvider>
  )
}

type LeftTab = 'description' | 'solution'
type RightTab = 'preview' | 'tests'

function Workspace({ challenge, onReset }: { challenge: Challenge; onReset: () => void }) {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [progress, setProgress] = useState<ChallengeProgress | undefined>(() => getChallengeProgress(challenge.slug))
  const [result, setResult] = useState<RunResult | null>(null)
  const [leftTab, setLeftTab] = useState<LeftTab>('description')
  const [rightTab, setRightTab] = useState<RightTab>('preview')
  const [confirm, setConfirm] = useState<'reset' | 'reveal' | null>(null)
  const [filesOpen, setFilesOpen] = useState(() => localStorage.getItem('rr:filesOpen') !== '0')
  const toggleFiles = () =>
    setFilesOpen((open) => {
      localStorage.setItem('rr:filesOpen', open ? '0' : '1')
      return !open
    })

  const onFinished = useCallback(
    (r: RunResult) => {
      setResult(r)
      setProgress(recordAttempt(challenge.slug, r.percent))
    },
    [challenge.slug],
  )
  const runner = useTestRunner(challenge.expectedTestCount, onFinished)

  useAutoSave(challenge)

  const runTests = () => {
    setRightTab('tests')
    runner.run()
  }

  const solutionUnlocked = !!(progress?.solved || progress?.solutionRevealed)

  const left = (
    <PanelShell
      tabs={
        <>
          <TabButton active={leftTab === 'description'} onClick={() => setLeftTab('description')}>
            Description
          </TabButton>
          <TabButton active={leftTab === 'solution'} onClick={() => setLeftTab('solution')}>
            {solutionUnlocked ? 'Solution' : '🔒 Solution'}
          </TabButton>
        </>
      }
    >
      {leftTab === 'description' ? (
        <div className="prose-rr p-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{challenge.readme}</ReactMarkdown>
        </div>
      ) : solutionUnlocked ? (
        <SolutionView files={challenge.solution} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="text-4xl">🔒</div>
          <p className="text-sm text-slate-300">The solution unlocks when you pass all tests (100%).</p>
          <button className="btn-secondary" onClick={() => setConfirm('reveal')}>
            Reveal solution
          </button>
        </div>
      )}
    </PanelShell>
  )

  const middle = (
    <div className="flex h-full min-h-0 bg-[#0e141e]">
      {filesOpen ? (
        <div className="hidden w-40 shrink-0 overflow-auto border-r border-slate-800 sm:block">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Files</span>
            <button
              type="button"
              onClick={toggleFiles}
              title="Collapse files"
              aria-label="Collapse files"
              aria-expanded={true}
              className="rounded px-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
            >
              «
            </button>
          </div>
          <SandpackFileExplorer autoHiddenFiles style={{ height: 'auto' }} />
        </div>
      ) : (
        <div className="hidden w-7 shrink-0 flex-col items-center border-r border-slate-800 py-2 sm:flex">
          <button
            type="button"
            onClick={toggleFiles}
            title="Expand files"
            aria-label="Expand files"
            aria-expanded={false}
            className="rounded px-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
          >
            »
          </button>
          <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 [writing-mode:vertical-rl]">
            Files
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <SandpackCodeEditor showTabs showLineNumbers closableTabs={false} style={{ height: '100%' }} />
      </div>
    </div>
  )

  // Both right-hand tabs stay mounted (hidden with CSS) so switching tabs never reloads the preview.
  const right = (
    <PanelShell
      tabs={
        <>
          <TabButton active={rightTab === 'preview'} onClick={() => setRightTab('preview')}>
            Preview
          </TabButton>
          <TabButton active={rightTab === 'tests'} onClick={() => setRightTab('tests')}>
            Tests
            {result && (
              <span className={`ml-1.5 text-xs ${result.percent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.passed}/{result.total}
              </span>
            )}
          </TabButton>
        </>
      }
    >
      <div className={rightTab === 'preview' ? 'h-full' : 'hidden'}>
        <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton style={{ height: '100%' }} />
      </div>
      <div className={rightTab === 'tests' ? 'h-full overflow-auto' : 'hidden'}>
        <TestResults status={runner.status} result={result} />
      </div>
    </PanelShell>
  )

  return (
    <div className="flex h-full flex-col">
      <Navbar>
        <span className="hidden text-slate-600 sm:inline">/</span>
        <h1 className="truncate text-sm font-semibold text-white">{challenge.title}</h1>
        <DifficultyBadge difficulty={challenge.difficulty} />
        {progress?.solved && <span className="text-xs text-emerald-400">✓ Solved</span>}
        <div className="ml-auto flex items-center gap-2">
          <button className="btn-ghost" onClick={() => navigate('/')}>
            ← Back
          </button>
          <button className="btn-secondary" onClick={() => setConfirm('reset')}>
            Reset Code
          </button>
          <button className="btn-primary" onClick={runTests} disabled={runner.status === 'running'}>
            {runner.status === 'running' ? 'Running…' : '▶ Run Tests'}
          </button>
        </div>
      </Navbar>

      {runner.frame}

      {isDesktop ? (
        <Group orientation="horizontal" className="min-h-0 flex-1">
          <Panel defaultSize="30" minSize="15">
            {left}
          </Panel>
          <Separator className="resize-handle" />
          <Panel defaultSize="40" minSize="20">
            {middle}
          </Panel>
          <Separator className="resize-handle" />
          <Panel defaultSize="30" minSize="15">
            {right}
          </Panel>
        </Group>
      ) : (
        <div className="flex-1 space-y-2 overflow-auto p-2">
          <div className="h-[60vh] overflow-hidden rounded border border-slate-800">{left}</div>
          <div className="h-[70vh] overflow-hidden rounded border border-slate-800">{middle}</div>
          <div className="h-[60vh] overflow-hidden rounded border border-slate-800">{right}</div>
        </div>
      )}

      <ConfirmDialog
        open={confirm === 'reset'}
        title="Reset code?"
        message="Your changes for this challenge will be replaced with the original starter code. This cannot be undone."
        confirmLabel="Reset"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          clearCode(challenge.slug)
          onReset()
        }}
      />
      <ConfirmDialog
        open={confirm === 'reveal'}
        title="Reveal solution?"
        message="Try a little longer first? Seeing the solution is a great way to learn, but you will learn more by solving it yourself."
        confirmLabel="Reveal"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          markSolutionRevealed(challenge.slug)
          setProgress(getChallengeProgress(challenge.slug))
        }}
      />
    </div>
  )
}

/** Saves the user's visible files to localStorage (debounced). */
function useAutoSave(challenge: Challenge) {
  const { sandpack } = useSandpack()
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const out: FileMap = {}
      for (const path of Object.keys(challenge.starter)) {
        const f = sandpack.files[path]
        if (f) out[path] = f.code
      }
      saveCode(challenge.slug, out)
    }, 500)
    return () => window.clearTimeout(timer.current)
  }, [sandpack.files, challenge])
}

function PanelShell({ tabs, children }: { tabs: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#141c28]">
      <div className="flex shrink-0 border-b border-slate-800 bg-[#0e141e] px-2">{tabs}</div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`tab ${active ? 'tab-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

function TestResults({ status, result }: { status: string; result: RunResult | null }) {
  if (status === 'running') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
        <p className="text-sm">Running tests…</p>
      </div>
    )
  }
  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-400">
        <p className="text-sm">
          Click <span className="font-semibold text-emerald-400">▶ Run Tests</span> to check your solution against the
          hidden test cases.
        </p>
        {status === 'booting' && <p className="text-xs text-slate-500">(Test runner is still loading…)</p>}
      </div>
    )
  }
  const color = result.percent === 100 ? 'bg-emerald-500' : result.percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-lg font-semibold text-white" data-testid="score">
          {result.passed}/{result.total} tests passed
        </div>
        <div className="text-2xl font-bold text-white">{result.percent}%</div>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full ${color}`} style={{ width: `${result.percent}%` }} />
      </div>
      {result.percent === 100 && (
        <p className="mt-3 rounded bg-emerald-500/10 p-2 text-sm text-emerald-300">
          🎉 All tests passed! The solution tab is now unlocked.
        </p>
      )}
      {result.error && (
        <pre className="mt-3 whitespace-pre-wrap rounded bg-rose-500/10 p-2 text-xs text-rose-300">{result.error}</pre>
      )}
      <ul className="mt-4 space-y-1">
        {result.tests.map((t) => (
          <li key={t.name} className="flex items-start gap-2 rounded bg-[#0e141e] px-3 py-2 text-sm">
            <span className={t.status === 'pass' ? 'text-emerald-400' : 'text-rose-400'}>
              {t.status === 'pass' ? '✓' : '✗'}
            </span>
            <span className="text-slate-200">{t.name}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">Test code is hidden. Only test names and results are shown.</p>
    </div>
  )
}

function SolutionView({ files }: { files: FileMap }) {
  return (
    <div className="space-y-4 p-4">
      {Object.entries(files).map(([path, code]) => (
        <div key={path}>
          <div className="mb-1 font-mono text-xs text-slate-400">{path}</div>
          <pre className="overflow-x-auto rounded bg-[#0b1018] p-3 font-mono text-xs leading-relaxed text-slate-200 ring-1 ring-slate-800">
            {code}
          </pre>
        </div>
      ))}
    </div>
  )
}
