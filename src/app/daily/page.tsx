'use client'

import { useState } from 'react'
import TaskScreen from '@/components/TaskScreen'

type ActiveTask = 'tache2' | 'tache3'

export default function DailyPage() {
  const [activeTask, setActiveTask] = useState<ActiveTask>('tache3')

  const today = new Date().toLocaleDateString('fr-CA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Daily header */}
      <div className="px-4 pt-5 pb-3 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔥</span>
          <div>
            <h1 className="text-xl font-bold text-ink-1">Pratique du jour</h1>
            <p className="text-xs text-ink-4 capitalize">{today}</p>
          </div>
        </div>

        {/* Task switcher */}
        <div className="flex gap-2 bg-surface-2 rounded-xl p-1">
          {(['tache3', 'tache2'] as ActiveTask[]).map((task) => (
            <button
              key={task}
              onClick={() => setActiveTask(task)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${activeTask === task
                  ? 'bg-white text-ink-1 shadow-sm'
                  : 'text-ink-3 hover:text-ink-2'
                }`}
            >
              {task === 'tache3' ? '🗣️ Tâche 3' : '🎤 Tâche 2'}
            </button>
          ))}
        </div>
      </div>

      {/* Task content */}
      <TaskScreen key={activeTask} taskType={activeTask} />
    </div>
  )
}
