import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const taskType = searchParams.get('task') ?? 'tache3'

  const client = createServerClient()

  // Get today's topic (rotate daily by day-of-year)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )

  const { data: topics } = await client
    .from('topics')
    .select('*')
    .eq('task_type', taskType)
    .eq('is_active', true)
    .order('id')

  if (!topics || topics.length === 0) {
    return NextResponse.json({ error: 'Aucun sujet trouvé' }, { status: 404 })
  }

  const topic = topics[dayOfYear % topics.length]

  // Get ideas for this topic
  const { data: ideas } = await client
    .from('ideas_bank')
    .select('*')
    .eq('topic_id', topic.id)
    .order('position')

  // Get templates
  const { data: templates } = await client
    .from('templates')
    .select('*')
    .eq('task_type', taskType)
    .order('order_index')

  const pour = ideas?.filter((i) => i.position === 'pour').slice(0, 3) ?? []
  const contre = ideas?.filter((i) => i.position === 'contre').slice(0, 3) ?? []
  const sampleOpinion = ideas?.find((i) => i.sample_opinion)?.sample_opinion ?? ''

  return NextResponse.json({
    topic,
    ideas: { pour, contre, sample_opinion: sampleOpinion },
    templates: templates ?? [],
  })
}
