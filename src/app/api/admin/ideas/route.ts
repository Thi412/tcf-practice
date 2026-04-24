import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topicId = searchParams.get('topicId')
  if (!topicId) return NextResponse.json({ error: 'topicId manquant' }, { status: 400 })
  const client = createServerClient()
  const { data, error } = await client.from('ideas_bank').select('*').eq('topic_id', topicId).order('position')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ideas: data ?? [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { topic_id, idea, ready_sentence, position, sample_opinion } = body
  if (!topic_id || !idea || !ready_sentence || !position) return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  const client = createServerClient()
  const { data, error } = await client.from('ideas_bank').insert({ topic_id, idea, ready_sentence, position, sample_opinion: sample_opinion || null }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ idea: data })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, idea, ready_sentence, position, sample_opinion } = body
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  const client = createServerClient()
  const { data, error } = await client.from('ideas_bank').update({ idea, ready_sentence, position, sample_opinion: sample_opinion || null }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ idea: data })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  const client = createServerClient()
  const { error } = await client.from('ideas_bank').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
