'use client'

import { useState } from 'react'

interface Template {
  title: string
  content: string
  order_index: number
}

interface TemplateSectionProps {
  templates: Template[]
  taskType: 'tache2' | 'tache3'
}

export default function TemplateSection({ templates, taskType }: TemplateSectionProps) {
  const [open, setOpen] = useState(false)

  const defaultTache3 = [
    {
      title: '📌 Introduction',
      content: "Personnellement, je pense que [sujet] est un sujet très important.\nJe vais vous donner deux raisons principales.",
    },
    {
      title: '1️⃣ Premier argument',
      content: "Premièrement, [argument 1].\nPar exemple, [exemple concret].\nC'est pourquoi je pense que...",
    },
    {
      title: '2️⃣ Deuxième argument',
      content: "Deuxièmement, [argument 2].\nEn effet, [développement].\nCela montre que...",
    },
    {
      title: '🏁 Conclusion',
      content: "En conclusion, je suis convaincu(e) que [position].\nPour toutes ces raisons, [résumé].",
    },
  ]

  const defaultTache2 = [
    {
      title: '👋 Ouverture',
      content: "Bonjour ! Je voudrais vous poser quelques questions, si vous permettez.",
    },
    {
      title: '❓ 13 questions types',
      content: "1. Depuis combien de temps faites-vous cela ?\n2. Qu'est-ce qui vous a motivé ?\n3. Comment vous êtes-vous préparé(e) ?\n4. Quels sont les avantages selon vous ?\n5. Y a-t-il des inconvénients ?\n6. À quelle fréquence le faites-vous ?\n7. Où pratiquez-vous cela ?\n8. Avec qui le faites-vous en général ?\n9. Qu'est-ce que cela vous apporte ?\n10. Avez-vous eu des difficultés au début ?\n11. Que conseilleriez-vous à quelqu'un qui débute ?\n12. Est-ce que cela a changé votre quotidien ?\n13. Quels sont vos projets pour l'avenir dans ce domaine ?",
    },
    {
      title: '🤝 Clôture polie',
      content: "Merci beaucoup pour vos réponses, c'était très intéressant !",
    },
  ]

  const displayTemplates =
    templates.length > 0
      ? templates.map((t) => ({ title: t.title, content: t.content }))
      : taskType === 'tache3'
      ? defaultTache3
      : defaultTache2

  return (
    <div className="rounded-2xl border border-surface-3 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-surface-1 hover:bg-surface-2 transition-colors"
      >
        <span className="font-semibold text-ink-1">🧩 Structure</span>
        <span className={`text-ink-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="p-4 space-y-3 animate-slide-up">
          {displayTemplates.map((t, i) => (
            <div key={i} className="bg-white border border-surface-3 rounded-xl p-3">
              <p className="text-sm font-semibold text-ink-1 mb-2">{t.title}</p>
              <p className="text-sm text-ink-3 whitespace-pre-line leading-relaxed">{t.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}