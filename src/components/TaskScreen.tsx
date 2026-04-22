'use client'

import { useEffect, useState } from 'react'
import SosIdeas from './SosIdeas'
import IdeasSection from './IdeasSection'
import TemplateSection from './TemplateSection'
import UpgradeSection from './UpgradeSection'
import RecordingSection from './RecordingSection'
import FeedbackSection from './FeedbackSection'
import TopicPicker from './TopicPicker'
import KeywordBank from './KeywordBank'
import type { DailyQuestion } from '@/lib/types'

interface Topic {
  id: string
  task_type: string
  question: string
  theme: string
  difficulty: string
}

interface TaskScreenProps {
  taskType: 'tache2' | 'tache3'
}

const TASK_LABELS: Record<string, string> = {
  tache2: 'Tâche 2 · Interview',
  tache3: 'Tâche 3 · Monologue',
}

export default function TaskScreen({ taskType }: TaskScreenProps) {
  const [data, setData] = useState<DailyQuestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [taskType])

  async function fetchData(topicId?: string) {
    setLoading(true)
    setError('')
    try {
      const url = topicId
        ? `/api/daily?task=${taskType}&topicId=${topicId}`
        : `/api/daily?task=${taskType}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Erreur de chargement')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Impossible de charger les données. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  function handleTopicSelect(topic: Topic) {
    fetchData(topic.id)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">📚</div>
          <p className="text-ink-3 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="text-4xl">😕</div>
          <p className="text-ink-2 font-medium">{error || 'Données non disponibles'}</p>
          <button
            onClick={() => fetchData()}
            className="px-5 py-2.5 bg-brand-500 text-white rounded-xl font-semibold text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const { topic, ideas, templates } = data

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-surface-2 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-ink-3 uppercase tracking-widest">
              {TASK_LABELS[taskType]}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-bold
            ${topic.difficulty === 'B2'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-sky-100 text-sky-700'
            }`}>
            {topic.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">
        {/* 1. Question Block */}
        <div className="bg-gradient-to-br from-ink-1 to-slate-700 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Sujet du jour
            </p>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-lg flex-shrink-0">
              🏷 {topic.theme}
            </span>
          </div>
          <p className="text-lg font-semibold leading-snug mb-4">
            {topic.question}
          </p>
          {/* Topic picker inside question card */}
          <TopicPicker
            taskType={taskType}
            currentTopicId={topic.id}
            onSelect={handleTopicSelect}
          />
        </div>

        {/* 2. SOS Ideas */}
        <SosIdeas topicId={topic.id} question={topic.question} />

        {/* 3. Keyword Bank — only for Tâche 2 */}
        {taskType === 'tache2' && <KeywordBank />}

        {/* 4. Ideas Section */}
        <IdeasSection
          pour={ideas.pour}
          contre={ideas.contre}
          sampleOpinion={ideas.sample_opinion}
        />

        {/* 5. Template */}
        <TemplateSection templates={templates} taskType={taskType} />

        {/* 6. Upgrade */}
        <UpgradeSection />

        {/* 7. Recording */}
        <RecordingSection taskType={taskType} />

        {/* 8. Feedback */}
        <FeedbackSection taskType={taskType} />
      </div>
    </div>
  )
}
