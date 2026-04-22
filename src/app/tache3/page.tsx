import BottomNav from '@/components/BottomNav'
import TaskScreen from '@/components/TaskScreen'

export default function Tache3Page() {
  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-5 pb-3 bg-white border-b border-surface-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗣️</span>
            <div>
              <h1 className="text-xl font-bold text-ink-1">Tâche 3</h1>
              <p className="text-xs text-ink-4">Monologue · 4 min 15 sec</p>
            </div>
          </div>
        </div>
        <TaskScreen taskType="tache3" />
      </main>
      <BottomNav />
    </>
  )
}
