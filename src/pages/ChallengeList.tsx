import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { allTopics, challenges } from '../lib/challenges'
import { getProgress } from '../lib/storage'
import type { Difficulty } from '../lib/types'
import { DifficultyBadge, StatusBadge, TopicTag, statusOf } from '../components/Badges'
import { Navbar } from '../components/Navbar'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

export default function ChallengeList() {
  const progress = useMemo(() => getProgress(), [])
  const [query, setQuery] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')

  const filtered = challenges.filter(
    (c) =>
      c.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      (difficulty === 'All' || c.difficulty === difficulty) &&
      (topics.length === 0 || topics.some((t) => c.topics.includes(t))),
  )

  const solved = challenges.filter((c) => progress[c.slug]?.solved).length
  const pct = challenges.length ? Math.round((solved / challenges.length) * 100) : 0

  const toggleTopic = (t: string) => setTopics((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <section className="mb-8 rounded-lg border border-slate-800 bg-[#141c28] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">React Practice</h1>
              <p className="mt-1 text-sm text-slate-400">
                Pick a challenge, write React code in the browser, and run the hidden tests to get your score.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white" data-testid="progress-summary">
                {solved}/{challenges.length} <span className="text-base font-medium text-slate-400">solved</span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </section>

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-full shrink-0 space-y-5 md:w-56">
            <input
              type="search"
              placeholder="Search challenges..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded border border-slate-700 bg-[#0b1018] px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Difficulty</h3>
              <div className="flex flex-wrap gap-1.5 md:flex-col">
                {(['All', ...DIFFICULTIES] as const).map((d) => (
                  <label key={d} className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input type="radio" name="difficulty" checked={difficulty === d} onChange={() => setDifficulty(d)} className="accent-emerald-500" />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Topics</h3>
              <div className="flex flex-wrap gap-1.5 md:flex-col">
                {allTopics.map((t) => (
                  <label key={t} className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={topics.includes(t)} onChange={() => toggleTopic(t)} className="accent-emerald-500" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex-1 space-y-3">
            {filtered.length === 0 && (
              <p className="rounded border border-dashed border-slate-700 p-8 text-center text-slate-500">
                No challenges match your filters.
              </p>
            )}
            {filtered.map((c) => {
              const p = progress[c.slug]
              const status = statusOf(p)
              return (
                <article
                  key={c.slug}
                  className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-[#141c28] p-4 transition hover:border-slate-600 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-white">{c.title}</h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <DifficultyBadge difficulty={c.difficulty} />
                      <span>~{c.estimatedMinutes} min</span>
                      <span>·</span>
                      <StatusBadge status={status} />
                      {p && p.attempts > 0 && <span>· Best score: {p.bestScore}%</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.topics.map((t) => (
                        <TopicTag key={t} topic={t} />
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/challenge/${c.slug}`}
                    className={status === 'Solved' ? 'btn-secondary justify-center' : 'btn-primary justify-center'}
                  >
                    {status === 'Solved' ? 'Solve again' : status === 'Attempted' ? 'Continue' : 'Solve challenge'}
                  </Link>
                </article>
              )
            })}
          </section>
        </div>
      </main>
    </div>
  )
}
