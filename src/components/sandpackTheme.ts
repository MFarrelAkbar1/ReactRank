import type { SandpackTheme } from '@codesandbox/sandpack-react'

/** VS Code / HackerRank-like dark theme. */
export const sandpackTheme: SandpackTheme = {
  colors: {
    surface1: '#0e141e',
    surface2: '#1f2937',
    surface3: '#1a2332',
    clickable: '#94a3b8',
    base: '#cbd5e1',
    disabled: '#475569',
    hover: '#f1f5f9',
    accent: '#34d399',
    error: '#fb7185',
    errorSurface: '#3b1d24',
  },
  syntax: {
    plain: '#d4d4d4',
    comment: { color: '#6a9955', fontStyle: 'italic' },
    keyword: '#c586c0',
    tag: '#569cd6',
    punctuation: '#a3a3a3',
    definition: '#dcdcaa',
    property: '#9cdcfe',
    static: '#b5cea8',
    string: '#ce9178',
  },
  font: {
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "JetBrains Mono", Consolas, "Courier New", monospace',
    size: '13px',
    lineHeight: '20px',
  },
}
