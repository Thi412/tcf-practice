import { NextRequest, NextResponse } from 'next/server'
import { cheapCompletion } from '@/lib/openai'
import { withCache } from '@/lib/cache'
import { checkUsageLimit, incrementUsage, getAnonymousId } from '@/lib/usage'

const SYSTEM_PROMPT = `Tu es un coach TCF. Améliore la phrase en 3 versions B1→B2→C1.
Réponds en JSON UNIQUEMENT.
Format: {"versions":[{"text":"phrase améliorée","highlights":["mot avancé 1","mot avancé 2"]}]}
Exactement 3 versions, chaque highlights contient 2-3 mots avancés utilisés.`

export async function POST(request: NextRequest) {
  try {
    const { sentence } = await request.json()

    if (!sentence || sentence.trim().length < 5) {
      return NextResponse.json({ error: 'Phrase trop courte' }, { status: 400 })
    }

    const userId = getAnonymousId(request)
    const { allowed, used, limit } = await checkUsageLimit(userId, 'upgrade', 'free')

    if (!allowed) {
      return NextResponse.json(
        {
          error: `Limite atteinte: ${used}/${limit} upgrades aujourd'hui.`,
          limitReached: true,
        },
        { status: 429 }
      )
    }

    const cacheKey = `upgrade:${sentence.trim()}`

    const raw = await withCache(cacheKey, () =>
      cheapCompletion(
        SYSTEM_PROMPT,
        `Phrase originale: "${sentence.slice(0, 300)}"`,
        400
      )
    )

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      result = {
        versions: [
          { text: raw.slice(0, 200), highlights: [] },
        ],
      }
    }

    await incrementUsage(userId, 'upgrade')

    return NextResponse.json({ result, used: used + 1, limit })
  } catch (error) {
    console.error('Upgrade API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
