import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Cheapest model for short tasks
export const CHEAP_MODEL = 'gpt-4o-mini'

export async function cheapCompletion(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 300
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: CHEAP_MODEL,
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })
  return response.choices[0]?.message?.content ?? ''
}
