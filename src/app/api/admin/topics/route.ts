import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const client = createServerClient()
  const { data, error } = await client.from('topics').select('*').order('task_type').order('theme')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ topics: data ?? [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { task_type, question, theme, difficulty } = body
  if (!task_type || !question || !theme || !difficulty) return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  const client = createServerClient()
  const { data, error } = await client.from('topics').insert({ task_type, question, theme, difficulty, is_active: true }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ topic: data })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, task_type, question, theme, difficulty, is_active } = body
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  const client = createServerClient()
  const { data, error } = await client.from('topics').update({ task_type, question, theme, difficulty, is_active }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ topic: data })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  const client = createServerClient()
  const { error } = await client.from('topics').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
