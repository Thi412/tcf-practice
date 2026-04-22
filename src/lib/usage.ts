import { createServerClient } from './supabase'

const DAILY_LIMITS = {
  free: 2,
  pro: 20,
}

export async function checkUsageLimit(
  userId: string,
  action: 'feedback' | 'upgrade',
  tier: 'free' | 'pro' = 'free'
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const client = createServerClient()
  const today = new Date().toISOString().split('T')[0]

  const { data } = await client
    .from('usage_tracking')
    .select('count')
    .eq('user_id', userId)
    .eq('action', action)
    .eq('date', today)
    .single()

  const used = data?.count ?? 0
  const limit = DAILY_LIMITS[tier]
  return { allowed: used < limit, used, limit }
}

export async function incrementUsage(
  userId: string,
  action: 'feedback' | 'upgrade'
): Promise<void> {
  const client = createServerClient()
  const today = new Date().toISOString().split('T')[0]

  // Upsert: insert or increment
  const { data: existing } = await client
    .from('usage_tracking')
    .select('id, count')
    .eq('user_id', userId)
    .eq('action', action)
    .eq('date', today)
    .single()

  if (existing) {
    await client
      .from('usage_tracking')
      .update({ count: existing.count + 1 })
      .eq('id', existing.id)
  } else {
    await client.from('usage_tracking').insert({
      user_id: userId,
      action,
      date: today,
      count: 1,
    })
  }
}

// Simple anonymous user ID via fingerprint (no auth required for MVP)
export function getAnonymousId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0] ?? 'unknown'
  const ua = request.headers.get('user-agent') ?? ''
  return Buffer.from(`${ip}-${ua}`).toString('base64').slice(0, 32)
}
