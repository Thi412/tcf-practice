import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const taskType = searchParams.get('task') ?? 'tache3'

  const client = createServerClient()
  const { data: topics } = await client
    .from('topics')
    .select('id, task_type, question, theme, difficulty')
    .eq('task_type', taskType)
    .eq('is_active', true)
    .order('theme')

  return NextResponse.json({ topics: topics ?? [] })
}
