import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cheapCompletion } from '@/lib/openai'
import { withCache } from '@/lib/cache'

const SYSTEM_PROMPT = `Tu es un coach TCF. Donne UNE idée simple et UNE phrase prête à dire (niveau B1-B2).
Réponds en JSON UNIQUEMENT.
Format: {"idea":"idée courte","sentence":"Phrase complète à dire."}`

export async function POST(request: NextRequest) {
  try {
    const { topicId, question, exclude = [] } = await request.json()

    // 1. Try database first (free, instant)
    if (topicId) {
      const client = createServerClient()
      const { data } = await client
        .from('ideas_bank')
        .select('idea, ready_sentence')
        .eq('topic_id', topicId)
        .not('idea', 'in', `(${exclude.map((e: string) => `"${e}"`).join(',') || '""'})`)
        .order('id')

      if (data && data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)]
        return NextResponse.json({
          idea: random.idea,
          sentence: random.ready_sentence,
          source: 'db',
        })
      }
    }

    // 2. Fallback: AI (cached by question)
    if (!question) {
      return NextResponse.json({ error: 'Question requise' }, { status: 400 })
    }

    const cacheKey = `sos:${question}`
    const raw = await withCache(cacheKey, () =>
      cheapCompletion(
        SYSTEM_PROMPT,
        `Question TCF: "${question.slice(0, 200)}"`,
        120
      )
    )

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      result = {
        idea: 'Ce sujet est important dans la société moderne',
        sentence: 'À mon avis, ce sujet mérite une réflexion approfondie car il touche à notre vie quotidienne.',
      }
    }

    return NextResponse.json({ ...result, source: 'ai' })
  } catch (error) {
    console.error('SOS Ideas error:', error)
    // Hardcoded fallback — never fails
    return NextResponse.json({
      idea: 'Ce sujet a des avantages et des inconvénients',
      sentence: 'À mon avis, il est important de considérer les deux côtés de cette question.',
      source: 'fallback',
    })
  }
}
