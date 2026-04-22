import { NextRequest, NextResponse } from 'next/server'
import { cheapCompletion } from '@/lib/openai'
import { withCache, hashInput } from '@/lib/cache'
import { checkUsageLimit, incrementUsage, getAnonymousId } from '@/lib/usage'
import type { FeedbackResult } from '@/lib/types'

const SYSTEM_PROMPT = `Tu es un examinateur TCF Canada. Analyse le texte et réponds en JSON UNIQUEMENT.
Format: {"mistakes":["erreur1","erreur2","erreur3"],"improved":"version améliorée","level":"B1"}
Règles: max 3 erreurs, max 120 mots total, niveau parmi A2/B1/B2/C1.`

export async function POST(request: NextRequest) {
  try {
    const { text, taskType } = await request.json()

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: 'Texte trop court' }, { status: 400 })
    }

    const userId = getAnonymousId(request)
    const { allowed, used, limit } = await checkUsageLimit(userId, 'feedback', 'free')

    if (!allowed) {
      return NextResponse.json(
        {
          error: `Limite atteinte: ${used}/${limit} feedbacks aujourd'hui. Revenez demain! 🌙`,
          limitReached: true,
        },
        { status: 429 }
      )
    }

    const cacheKey = `feedback:${taskType}:${text}`

    const raw = await withCache(cacheKey, () =>
      cheapCompletion(
        SYSTEM_PROMPT,
        `Tâche: ${taskType}\nTexte: "${text.slice(0, 600)}"`,
        250
      )
    )

    let result: FeedbackResult
    try {
      result = JSON.parse(raw)
    } catch {
      // Fallback if JSON parse fails
      result = {
        mistakes: ['Analyse non disponible'],
        improved: raw.slice(0, 200),
        level: 'B1',
      }
    }

    await incrementUsage(userId, 'feedback')

    return NextResponse.json({ result, used: used + 1, limit })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
