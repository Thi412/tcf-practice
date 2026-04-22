'use client'

import { useState } from 'react'

interface UpgradeResult {
  versions: Array<{
    text: string
    highlights: string[]
  }>
}

function highlightWords(text: string, highlights: string[]): React.ReactNode {
  if (!highlights || highlights.length === 0) return text

  let result = text
  const parts: React.ReactNode[] = []
  let remaining = text

  // Simple highlight: wrap each highlight word
  highlights.forEach((word) => {
    remaining = remaining.replace(
      new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
      `__HIGHLIGHT__$1__END__`
    )
  })

  const segments = remaining.split(/(__|__HIGHLIGHT__|__END__)/g)
  let inHighlight = false
  let i = 0
  for (const seg of remaining.split('__HIGHLIGHT__')) {
    if (i === 0) {
      if (seg) parts.push(seg)
    } else {
      const [highlighted, ...rest] = seg.split('__END__')
      parts.push(
        <mark key={i} className="highlight-word not-italic">
          {highlighted}
        </mark>
      )
      if (rest.join('')) parts.push(rest.join(''))
    }
    i++
  }

  return parts.length > 0 ? <>{parts}</> : text
}

const LEVEL_LABELS = ['B1', 'B2', 'C1']
const LEVEL_COLORS = [
  'bg-sky-100 border-sky-200 text-sky-700',
  'bg-violet-100 border-violet-200 text-violet-700',
  'bg-emerald-100 border-emerald-200 text-emerald-700',
]

export default function UpgradeSection() {
  const [sentence, setSentence] = useState('')
  const [result, setResult] = useState<UpgradeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpgrade() {
    if (!sentence.trim() || sentence.trim().length < 5) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        return
      }
      setResult(data.result)
    } catch {
      setError('Erreur de connexion. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-surface-3 overflow-hidden">
      <div className="p-4 bg-surface-1">
        <p className="font-semibold text-ink-1">✨ Améliore ta phrase</p>
        <p className="text-xs text-ink-3 mt-0.5">Écris une phrase et reçois 3 versions améliorées</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="relative">
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Ex: Le téléphone est utile pour communiquer."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-surface-3 text-sm text-ink-1
              placeholder:text-ink-4 focus:outline-none focus:ring-2 focus:ring-brand-400
              resize-none bg-white"
          />
          <span className="absolute bottom-2 right-3 text-xs text-ink-4">
            {sentence.length}/300
          </span>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading || sentence.trim().length < 5}
          className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm
            shadow-md shadow-sky-200 active:scale-95 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Amélioration en cours...
            </span>
          ) : (
            '✨ Upgrade'
          )}
        </button>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-2 animate-slide-up">
            <p className="text-xs font-semibold text-ink-3 uppercase tracking-widest">
              3 versions améliorées
            </p>
            {result.versions.map((v, i) => (
              <div
                key={i}
                className={`border rounded-xl p-3.5 ${LEVEL_COLORS[i] ?? 'bg-surface-1 border-surface-3'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {LEVEL_LABELS[i] ?? `V${i + 1}`}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {highlightWords(v.text, v.highlights)}
                </p>
                {v.highlights?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {v.highlights.map((w, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 bg-white/50 rounded-full font-medium"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
