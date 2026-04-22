'use client'

import { useState } from 'react'

interface SosIdeasProps {
  topicId: string
  question: string
}

interface SosResult {
  idea: string
  sentence: string
}

export default function SosIdeas({ topicId, question }: SosIdeasProps) {
  const [result, setResult] = useState<SosResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [usedIdeas, setUsedIdeas] = useState<string[]>([])
  const [visible, setVisible] = useState(false)

  async function fetchIdea() {
    setLoading(true)
    try {
      const res = await fetch('/api/sos-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, question, exclude: usedIdeas }),
      })
      const data = await res.json()
      if (data.idea) {
        setResult(data)
        setUsedIdeas((prev) => [...prev, data.idea])
        setVisible(true)
      }
    } catch {
      // Instant fallback
      setResult({
        idea: 'Ce sujet est important dans la vie moderne',
        sentence: 'À mon avis, ce sujet mérite une attention particulière dans notre société.',
      })
      setVisible(true)
    } finally {
      setLoading(false)
    }
  }

  function handleClick() {
    setVisible(false)
    setTimeout(() => fetchIdea(), visible ? 200 : 0)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full py-4 px-5 rounded-2xl font-semibold text-base
          bg-gradient-to-r from-orange-400 to-rose-400 text-white
          shadow-lg shadow-orange-200 active:scale-95 transition-all
          disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin text-xl">⏳</span>
            <span>Une seconde...</span>
          </>
        ) : (
          <>
            <span className="text-xl">😵</span>
            <span>Je suis à court d'idées</span>
          </>
        )}
      </button>

      {visible && result && (
        <div className="animate-bounce-in bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Idée</p>
              <p className="text-ink-1 font-medium">{result.idea}</p>
            </div>
          </div>
          <div className="border-t border-amber-200" />
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">🗣️</span>
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Phrase prête</p>
              <p className="text-ink-1 italic">"{result.sentence}"</p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="w-full py-2 text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            Autre idée →
          </button>
        </div>
      )}
    </div>
  )
}
