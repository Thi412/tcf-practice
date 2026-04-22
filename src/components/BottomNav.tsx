'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/daily', label: 'Daily', emoji: '🔥' },
  { href: '/tache2', label: 'Tâche 2', emoji: '🎤' },
  { href: '/tache3', label: 'Tâche 3', emoji: '🗣️' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky bottom-0 bg-white border-t border-surface-3 z-50 pb-safe">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors relative
                ${isActive ? 'text-brand-600 tab-active' : 'text-ink-3 hover:text-ink-2'}`}
            >
              <span className="text-xl leading-none">{tab.emoji}</span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
