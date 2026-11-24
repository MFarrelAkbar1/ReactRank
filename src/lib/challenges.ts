import type { Challenge, ChallengeMeta, Difficulty, FileMap } from './types'

// All files are bundled at build time. Adding a folder under src/challenges/ is enough to add a challenge.
const metaFiles = import.meta.glob<ChallengeMeta>('../challenges/*/meta.json', { eager: true, import: 'default' })
const rawFiles = import.meta.glob<string>(
  ['../challenges/*/README.md', '../challenges/*/{starter,tests,solution}/**/*'],
  { eager: true, query: '?raw', import: 'default' },
)

const FOLDER_RE = /^\.\.\/challenges\/([^/]+)\/(starter|tests|solution)\/(.+)$/

function collectFiles(slugDir: string, kind: 'starter' | 'tests' | 'solution'): FileMap {
  const out: FileMap = {}
  for (const [path, content] of Object.entries(rawFiles)) {
    const m = path.match(FOLDER_RE)
    if (m && m[1] === slugDir && m[2] === kind) out['/' + m[3]] = content
  }
  return out
}

function countTests(tests: FileMap): number {
  return Object.values(tests).reduce((n, code) => n + (code.match(/^\s*(?:test|it)\s*\(/gm)?.length ?? 0), 0)
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }

export const challenges: Challenge[] = Object.entries(metaFiles)
  .map(([path, meta]) => {
    const dir = path.split('/')[2]
    const tests = collectFiles(dir, 'tests')
    return {
      ...meta,
      slug: meta.slug ?? dir,
      language: meta.language ?? 'react',
      readme: rawFiles[`../challenges/${dir}/README.md`] ?? '',
      starter: collectFiles(dir, 'starter'),
      tests,
      solution: collectFiles(dir, 'solution'),
      expectedTestCount: countTests(tests),
    } satisfies Challenge
  })
  .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.order - b.order)

export function getChallenge(slug: string): Challenge | undefined {
  return challenges.find((c) => c.slug === slug)
}

export const allTopics: string[] = [...new Set(challenges.flatMap((c) => c.topics))].sort()
