'use client'

import { useState, useEffect } from 'react'

interface Keyword {
  id: string
  word: string
  emoji: string
  questions: string[]
}

const DEFAULT_KEYWORDS: Keyword[] = [
  { id: '1', word: 'Prix / Coût', emoji: '💰', questions: ["Quel est le prix ?", "Combien ça coûte ?", "C'est cher ou abordable ?", "Y a-t-il des réductions ?"] },
  { id: '2', word: 'Durée / Fréquence', emoji: '⏱️', questions: ["Depuis combien de temps ?", "À quelle fréquence ?", "Combien d'heures par semaine ?", "Depuis quand avez-vous commencé ?"] },
  { id: '3', word: 'Lieu / Endroit', emoji: '📍', questions: ["Où est-ce que vous faites ça ?", "Dans quel endroit précisément ?", "C'est loin de chez vous ?", "Vous y allez comment ?"] },
  { id: '4', word: 'Motivation / Raison', emoji: '💡', questions: ["Pourquoi avez-vous choisi ça ?", "Qu'est-ce qui vous a motivé ?", "Comment vous avez découvert ça ?", "Qu'est-ce qui vous plaît le plus ?"] },
  { id: '5', word: 'Avantages', emoji: '✅', questions: ["Quels sont les avantages selon vous ?", "Qu'est-ce que ça vous apporte ?", "En quoi c'est utile ?", "Qu'est-ce que vous aimez le plus ?"] },
  { id: '6', word: 'Inconvénients', emoji: '⚠️', questions: ["Y a-t-il des inconvénients ?", "Qu'est-ce qui est difficile ?", "Avez-vous rencontré des problèmes ?", "C'est contraignant parfois ?"] },
  { id: '7', word: 'Personnes / Entourage', emoji: '👥', questions: ["Vous le faites seul(e) ou avec d'autres ?", "Qui vous a initié à ça ?", "Votre famille est-elle impliquée ?", "Avez-vous rencontré des gens grâce à ça ?"] },
  { id: '8', word: 'Début / Apprentissage', emoji: '🎓', questions: ["C'était difficile au début ?", "Comment vous avez appris ?", "Vous avez pris des cours ?", "Quel conseil pour un débutant ?"] },
  { id: '9', word: 'Futur / Projets', emoji: '🚀', questions: ["Quels sont vos projets pour l'avenir ?", "Vous voulez progresser dans ce domaine ?", "Vous imaginez faire ça longtemps ?", "Vous avez des objectifs précis ?"] },
  { id: '10', word: 'Changement / Impact', emoji: '🔄', questions: ["Est-ce que ça a changé votre vie ?", "Quel impact sur votre quotidien ?", "Vous êtes différent(e) depuis que vous faites ça ?", "Qu'est-ce qui a changé pour vous ?"] },
  { id: '11', word: 'Comparaison', emoji: '⚖️', questions: ["C'est mieux qu'avant ?", "Vous préférez ça ou autre chose ?", "Comment c'était avant ?", "Par rapport aux autres, c'est similaire ?"] },
  { id: '12', word: 'Ressources / Matériel', emoji: '🛠️', questions: ["Quel équipement vous utilisez ?", "Vous avez besoin de matériel spécial ?", "Où vous achetez ce qu'il vous faut ?", "C'est facile à trouver ?"] },
]

const STORAGE_KEY = 'tcf_keywords_v1'

function loadKeywords(): Keyword[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_KEYWORDS
}

function saveKeywords(kws: Keyword[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(kws)) } catch {}
}

// ── Single keyword card ──────────────────────────────────────────
function KeywordCard({
  keyword,
  onUpdate,
  onDelete,
}: {
  keyword: Keyword
  onUpdate: (kw: Keyword) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editWord, setEditWord] = useState(keyword.word)
  const [editEmoji, setEditEmoji] = useState(keyword.emoji)
  const [editQuestions, setEditQuestions] = useState(keyword.questions.join('\n'))
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  function copyQuestion(q: string, idx: number) {
    navigator.clipboard.writeText(q)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  function saveEdit() {
    const questions = editQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
    onUpdate({ ...keyword, word: editWord, emoji: editEmoji, questions })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="border-2 border-brand-300 bg-brand-50 rounded-2xl p-4 space-y-3 animate-slide-up">
        <div className="flex gap-2">
          <input
            value={editEmoji}
            onChange={(e) => setEditEmoji(e.target.value)}
            className="w-14 text-center px-2 py-2 rounded-xl border border-surface-3 text-lg bg-white"
            maxLength={2}
          />
          <input
            value={editWord}
            onChange={(e) => setEditWord(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-surface-3 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="Nom du mot-clé"
          />
        </div>
        <div>
          <p className="text-xs text-ink-3 mb-1.5 font-medium">
            Questions (une par ligne)
          </p>
          <textarea
            value={editQuestions}
            onChange={(e) => setEditQuestions(e.target.value)}
            rows={5}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-3 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            placeholder={"Quel est le prix ?\nCombien ça coûte ?"}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveEdit}
            className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold active:scale-95"
          >
            ✅ Sauvegarder
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-2.5 bg-surface-2 text-ink-3 rounded-xl text-sm font-semibold"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all
      ${expanded ? 'border-brand-300 bg-brand-50' : 'border-surface-3 bg-white'}`}>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-between p-3.5 text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{keyword.emoji}</span>
            <span className="font-semibold text-sm text-ink-1">{keyword.word}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-4 bg-surface-2 px-2 py-0.5 rounded-full">
              {keyword.questions.length}
            </span>
            <span className={`text-ink-3 text-xs transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </button>
        {/* Edit / Delete buttons */}
        <div className="flex items-center gap-1 pr-2">
          <button
            type="button"
            onClick={() => { setEditing(true); setExpanded(false) }}
            className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-sm hover:bg-amber-100 transition-colors"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(keyword.id)}
            className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-sm hover:bg-rose-100 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3.5 pb-3.5 space-y-2 animate-slide-up">
          <div className="border-t border-brand-200 pt-3 space-y-1.5">
            {keyword.questions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => copyQuestion(q, i)}
                className={`w-full text-left flex items-center justify-between gap-3
                  px-3 py-2.5 rounded-xl text-sm transition-all
                  ${copiedIdx === i
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-white border border-surface-2 text-ink-2 hover:border-brand-200 active:scale-98'
                  }`}
              >
                <span className="font-medium">{q}</span>
                <span className="text-base flex-shrink-0">
                  {copiedIdx === i ? '✅' : '📋'}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-4 text-center pt-1">
            Appuyez pour copier
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main KeywordBank ─────────────────────────────────────────────
export default function KeywordBank() {
  const [open, setOpen] = useState(false)
  const [keywords, setKeywords] = useState<Keyword[]>(DEFAULT_KEYWORDS)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [newEmoji, setNewEmoji] = useState('🔑')
  const [newQuestions, setNewQuestions] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    setKeywords(loadKeywords())
  }, [])

  function updateKeyword(updated: Keyword) {
    const next = keywords.map((k) => (k.id === updated.id ? updated : k))
    setKeywords(next)
    saveKeywords(next)
  }

  function deleteKeyword(id: string) {
    const next = keywords.filter((k) => k.id !== id)
    setKeywords(next)
    saveKeywords(next)
  }

  function addKeyword() {
    if (!newWord.trim()) return
    const questions = newQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
    const newKw: Keyword = {
      id: Date.now().toString(),
      word: newWord.trim(),
      emoji: newEmoji || '🔑',
      questions: questions.length > 0 ? questions : ["Pouvez-vous m'en dire plus ?"],
    }
    const next = [...keywords, newKw]
    setKeywords(next)
    saveKeywords(next)
    setNewWord('')
    setNewEmoji('🔑')
    setNewQuestions('')
    setShowAddForm(false)
  }

  function resetToDefault() {
    if (confirm('Remettre les mots-clés par défaut ?')) {
      setKeywords(DEFAULT_KEYWORDS)
      saveKeywords(DEFAULT_KEYWORDS)
    }
  }

  const filtered = search
    ? keywords.filter(
        (k) =>
          k.word.toLowerCase().includes(search.toLowerCase()) ||
          k.questions.some((q) => q.toLowerCase().includes(search.toLowerCase()))
      )
    : keywords

  return (
    <div className="rounded-2xl border border-surface-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-surface-1 hover:bg-surface-2 transition-colors"
      >
        <div>
          <span className="font-semibold text-ink-1">🗝️ Mots-clés pour poser des questions</span>
          <p className="text-xs text-ink-3 mt-0.5 text-left">
            {keywords.length} thèmes · cliquez pour modifier
          </p>
        </div>
        <span className={`text-ink-3 transition-transform duration-200 ml-2 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="animate-slide-up">
          {/* Search + Add */}
          <div className="px-4 pt-3 pb-2 flex gap-2">
            <input
              type="text"
              placeholder="🔍 Chercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-surface-3
                focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold active:scale-95"
            >
              + Ajouter
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <div className="mx-4 mb-3 p-4 bg-surface-1 border border-surface-3 rounded-2xl space-y-3 animate-slide-up">
              <p className="font-semibold text-sm text-ink-1">➕ Nouveau mot-clé</p>
              <div className="flex gap-2">
                <input
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className="w-14 text-center px-2 py-2 rounded-xl border border-surface-3 text-lg bg-white"
                  maxLength={2}
                  placeholder="🔑"
                />
                <input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-surface-3 text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-brand-400"
                  placeholder="Ex: Santé, Famille..."
                />
              </div>
              <textarea
                value={newQuestions}
                onChange={(e) => setNewQuestions(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-surface-3 text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                placeholder={"Une question par ligne :\nVous êtes en bonne santé ?\nVous faites du sport ?"}
              />
              <div className="flex gap-2">
                <button
                  onClick={addKeyword}
                  className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold active:scale-95"
                >
                  ✅ Ajouter
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 bg-surface-2 text-ink-3 rounded-xl text-sm font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Keywords list */}
          <div className="px-4 pb-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.map((keyword) => (
              <KeywordCard
                key={keyword.id}
                keyword={keyword}
                onUpdate={updateKeyword}
                onDelete={deleteKeyword}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-ink-3 py-4 text-sm">Aucun résultat</p>
            )}
          </div>

          {/* Reset */}
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={resetToDefault}
              className="w-full py-2 text-xs text-ink-4 hover:text-ink-3 transition-colors"
            >
              Remettre par défaut
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
