import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// IDs des assistants OpenAI
export const ASSISTANT_IDS = {
  CHAT: process.env.OPENAI_ASSISTANT_CHAT_ID || 'asst_d0dP7bYg4s6AqmUWopE4UQba',
  VEILLE: process.env.OPENAI_ASSISTANT_VEILLE_ID || '',
  COMMUNAUTE: process.env.OPENAI_ASSISTANT_COMMUNAUTE_ID || '',
  RECOMMANDATION: process.env.OPENAI_ASSISTANT_RECOMMANDATION_ID || '',
} as const

