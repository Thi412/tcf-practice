import { createServerClient } from './supabase'
import crypto from 'crypto'

export function hashInput(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex')
}

export async function getCachedResponse(inputHash: string): Promise<string | null> {
  const client = createServerClient()
  const { data } = await client
    .from('cache_ai')
    .select('output')
    .eq('input_hash', inputHash)
    .single()
  return data?.output ?? null
}

export async function setCachedResponse(inputHash: string, input: string, output: string): Promise<void> {
  const client = createServerClient()
  await client.from('cache_ai').upsert({
    input_hash: inputHash,
    input_text: input.slice(0, 500),
    output,
    created_at: new Date().toISOString(),
  })
}

export async function withCache(
  key: string,
  fn: () => Promise<string>
): Promise<string> {
  const hash = hashInput(key)
  const cached = await getCachedResponse(hash)
  if (cached) return cached
  const result = await fn()
  await setCachedResponse(hash, key, result)
  return result
}
