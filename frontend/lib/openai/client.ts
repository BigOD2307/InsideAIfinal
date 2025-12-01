import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// IDs des assistants OpenAI
export const ASSISTANT_IDS = {
  // Coach Ella - L'Experte IA
  CHAT: process.env.OPENAI_ASSISTANT_ID || 'asst_d0dP7bYg4s6AqmUWopE4UQba',
} as const
