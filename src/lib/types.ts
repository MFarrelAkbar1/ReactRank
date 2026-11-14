export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Language = 'react' | 'php'

export interface ChallengeMeta {
  slug: string
  title: string
  difficulty: Difficulty
  topics: string[]
  order: number
  estimatedMinutes: number
  language?: Language
  /** File opened in the editor first (defaults to /App.js). */
  activeFile?: string
}

/** Map of Sandpack path (e.g. "/App.js") → file contents. */
export type FileMap = Record<string, string>

export interface Challenge extends ChallengeMeta {
  language: Language
  readme: string
  starter: FileMap
  tests: FileMap
  solution: FileMap
  /** Number of test()/it() calls found in the hidden tests (used when a run crashes). */
  expectedTestCount: number
}

export interface ChallengeProgress {
  bestScore: number // 0–100
  lastScore: number // 0–100
  solved: boolean
  attempts: number
  updatedAt: number
  solutionRevealed?: boolean
}

export type ProgressMap = Record<string, ChallengeProgress>

export interface TestResult {
  name: string
  status: 'pass' | 'fail'
}

export interface RunResult {
  tests: TestResult[]
  passed: number
  total: number
  percent: number
  /** Set when the code failed to compile or the test file crashed. */
  error?: string
}
