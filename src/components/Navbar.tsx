import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function Navbar({ children }: { children?: ReactNode }) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-slate-800 bg-[#0b1018] px-4">
      <Link to="/" className="flex items-center gap-2 font-bold text-white">
        <span className="grid h-7 w-7 place-items-center rounded bg-emerald-500 text-sm text-black">R</span>
        <span>
          React<span className="text-emerald-400">Rank</span>
        </span>
      </Link>
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
    </header>
  )
}
