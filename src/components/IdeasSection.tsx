'use client'

import { useState } from 'react'

interface IdeasSectionProps {
  pour: Array<{ idea: string; ready_sentence: string }>
  contre: Array<{ idea: string; ready_sentence: string }>
  sampleOpinion: string
}

function IdeaCard({ idea, sentence }: { idea: string; sentence: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-white border border-surface-3 rounded-xl p-3 card-hover transition-all"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-1">{idea}</p>
        <span className="text-ink-4 ml-2">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <p className="mt-2 text-sm text-ink-3 italic border-t border-surface-2 pt-2">
          "{sentence}"
        </p>
      )}
    </button>
  )
}

export default function IdeasSection({ pour, contre, sampleOpinion }: IdeasSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-surface-3 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-surface-1 hover:bg-surface-2 transition-colors"
      >
        <span className="font-semibold text-ink-1">💡 Plus d'idées</span>
        <span className={`text-ink-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="p-4 space-y-4 animate-slide-up">
          {/* POUR */}
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
              ✅ Pour
            </p>
            <div className="space-y-2">
              {pour.map((item, i) => (
                <IdeaCard key={i} idea={item.idea} sentence={item.ready_sentence} />
              ))}
            </div>
          </div>

          {/* CONTRE */}
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">
              ❌ Contre
            </p>
            <div className="space-y-2">
              {contre.map((item, i) => (
                <IdeaCard key={i} idea={item.idea} sentence={item.ready_sentence} />
              ))}
            </div>
          </div>

          {/* Sample opinion */}
          {sampleOpinion && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
              <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
                🧠 Exemple d'opinion
              </p>
              <p className="text-sm text-ink-2 italic">"{sampleOpinion}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
