import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai, ASSISTANT_IDS } from '@/lib/openai/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body
    let { threadId } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let conversationId: string | null = null
    let isNewThread = false

    // 1. Gestion du Thread OpenAI & Conversation Supabase
    if (!threadId || threadId === 'undefined' || threadId === 'new' || typeof threadId !== 'string') {
      console.log('Creating new thread...')
      const thread = await openai.beta.threads.create()
      threadId = thread.id
      isNewThread = true
      console.log('New OpenAI thread created:', threadId)

      // Créer la conversation dans Supabase
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          thread_id: threadId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''), // Titre basé sur le 1er message
          assistant_id: ASSISTANT_IDS.CHAT
        })
        .select()
        .single()

      if (convError) {
        console.error('Error creating conversation in Supabase:', convError)
        // On continue même si l'erreur DB survient, pour ne pas bloquer le chat (mais l'historique sera cassé)
      } else {
        conversationId = conversation.id
      }
    } else {
      // Récupérer l'ID de conversation existant
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('thread_id', threadId)
        .single()
      
      if (conversation) {
        conversationId = conversation.id
      } else {
        // Cas rare : threadId existe chez OpenAI mais pas dans Supabase (ex: vieilles convs)
        // On le recrée
         const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          thread_id: threadId,
          title: 'Conversation récupérée',
          assistant_id: ASSISTANT_IDS.CHAT
        })
        .select()
        .single()
        if (newConv) conversationId = newConv.id
      }
    }

    if (!threadId) {
      throw new Error('Failed to create or retrieve thread ID')
    }

    // 2. Sauvegarder le message User dans Supabase
    if (conversationId) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: message
      })
    }

    // 3. Envoyer à OpenAI
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    })

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_IDS.CHAT,
    })

    // 4. Attendre la réponse
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    const startTime = Date.now()
    const TIMEOUT = 30000

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      if (Date.now() - startTime > TIMEOUT) {
        throw new Error('Assistant timeout')
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(threadId)
      const assistantMessage = messages.data[0]
      const content = assistantMessage.content[0]

      if ('text' in content) {
        const responseText = content.text.value

        // 5. Sauvegarder la réponse Assistant dans Supabase
        if (conversationId) {
          await supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: responseText
          })
        }

        return NextResponse.json({
          response: responseText,
          threadId: threadId,
          conversationId: conversationId // On renvoie aussi l'ID Supabase utile pour le front
        })
      }
    }

    return NextResponse.json(
      { error: 'Failed to get response', status: runStatus.status },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
