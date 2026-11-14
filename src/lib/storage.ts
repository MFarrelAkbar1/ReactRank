import type { ChallengeProgress, FileMap, ProgressMap } from './types'

const PROGRESS_KEY = 'reactrank:progress'
const codeKey = (slug: string) => `reactrank:code:${slug}`

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or disabled — ignore */
  }
}

export function getProgress(): ProgressMap {
  return read<ProgressMap>(PROGRESS_KEY, {})
}

export function getChallengeProgress(slug: string): ChallengeProgress | undefined {
  return getProgress()[slug]
}

export function recordAttempt(slug: string, score: number): ChallengeProgress {
  const all = getProgress()
  const prev = all[slug]
  const next: ChallengeProgress = {
    ...prev,
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    lastScore: score,
    solved: (prev?.solved ?? false) || score === 100,
    attempts: (prev?.attempts ?? 0) + 1,
    updatedAt: Date.now(),
  }
  all[slug] = next
  write(PROGRESS_KEY, all)
  return next
}

export function markSolutionRevealed(slug: string) {
  const all = getProgress()
  const prev = all[slug]
  all[slug] = {
    bestScore: prev?.bestScore ?? 0,
    lastScore: prev?.lastScore ?? 0,
    solved: prev?.solved ?? false,
    attempts: prev?.attempts ?? 0,
    solutionRevealed: true,
    updatedAt: Date.now(),
  }
  write(PROGRESS_KEY, all)
}

export function loadCode(slug: string): FileMap | null {
  return read<FileMap | null>(codeKey(slug), null)
}

export function saveCode(slug: string, files: FileMap) {
  write(codeKey(slug), files)
}

export function clearCode(slug: string) {
  try {
    localStorage.removeItem(codeKey(slug))
  } catch {
    /* ignore */
  }
}
