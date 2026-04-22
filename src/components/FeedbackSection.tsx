'use client'

import { useState } from 'react'

interface FeedbackSectionProps {
  taskType: 'tache2' | 'tache3'
}

interface FeedbackResult {
  mistakes: string[]
  improved: string
  level: 'A2' | 'B1' | 'B2' | 'C1'
}

const LEVEL_COLORS: Record<string, string> = {
  A2: 'bg-rose-100 text-rose-700 border-rose-200',
  B1: 'bg-amber-100 text-amber-700 border-amber-200',
  B2: 'bg-sky-100 text-sky-700 border-sky-200',
  C1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

export default function FeedbackSection({ taskType }: FeedbackSectionProps) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<FeedbackResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [limitInfo, setLimitInfo] = useState<{ used: number; limit: number } | null>(null)

  async function handleFeedback() {
    if (!text.trim() || text.trim().length < 10) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, taskType }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setResult(data.result)
      setLimitInfo({ used: data.used, limit: data.limit })
    } catch {
      setError('Erreur de connexion. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-surface-3 overflow-hidden">
      <div className="p-4 bg-surface-1 border-b border-surface-3">
        <p className="font-semibold text-ink-1">📊 Feedback IA</p>
        <p className="text-xs text-ink-3 mt-0.5">Colle ce que tu as dit pour une analyse rapide</p>
        {limitInfo && (
          <p className="text-xs text-ink-4 mt-1">
            {limitInfo.used}/{limitInfo.limit} utilisés aujourd'hui
          </p>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écris ou colle ici ce que tu as dit pendant ta pratique..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-surface-3 text-sm text-ink-1
              placeholder:text-ink-4 focus:outline-none focus:ring-2 focus:ring-brand-400
              resize-none bg-white"
          />
          <span className="absolute bottom-2 right-3 text-xs text-ink-4">
            {text.length}/600
          </span>
        </div>

        <button
          onClick={handleFeedback}
          disabled={loading || text.trim().length < 10}
          className="w-full py-3.5 rounded-xl bg-ink-1 text-white font-semibold text-sm
            shadow-md active:scale-95 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Analyse en cours...
            </span>
          ) : (
            '📊 Analyser'
          )}
        </button>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3 animate-slide-up">
            {/* Level badge */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-3 uppercase tracking-widest">
                Niveau estimé
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${LEVEL_COLORS[result.level] ?? 'bg-surface-2'}`}>
                {result.level}
              </span>
            </div>

            {/* Mistakes */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">
                ⚠️ Points à améliorer
              </p>
              <ul className="space-y-1.5">
                {result.mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improved version */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                ✅ Version améliorée
              </p>
              <p className="text-sm text-emerald-800 italic leading-relaxed">
                "{result.improved}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
