import type { ChallengeProgress, Difficulty } from '../lib/types'

const DIFF_STYLES: Record<Difficulty, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10 ring-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 ring-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 ring-rose-400/30',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-semibold ring-1 ${DIFF_STYLES[difficulty]}`}>{difficulty}</span>
  )
}

export function TopicTag({ topic }: { topic: string }) {
  return <span className="rounded bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300">{topic}</span>
}

export type StatusLabel = 'Not started' | 'Attempted' | 'Solved'

export function statusOf(p?: ChallengeProgress): StatusLabel {
  if (p?.solved) return 'Solved'
  if (p && p.attempts > 0) return 'Attempted'
  return 'Not started'
}

const STATUS_STYLES: Record<StatusLabel, string> = {
  Solved: 'text-emerald-400',
  Attempted: 'text-amber-400',
  'Not started': 'text-slate-500',
}

export function StatusBadge({ status }: { status: StatusLabel }) {
  const icon = status === 'Solved' ? '✓' : status === 'Attempted' ? '◐' : '○'
  return (
    <span className={`text-xs font-medium ${STATUS_STYLES[status]}`}>
      {icon} {status}
    </span>
  )
}
