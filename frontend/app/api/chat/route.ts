import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai, ASSISTANT_IDS } from '@/lib/openai/client'

// Helper pour déterminer si c'est une image
const isImage = (mimeType: string) => mimeType.startsWith('image/')

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
    const { attachments } = body || { attachments: [] }

    if (!message && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: 'Message or attachments required' }, { status: 400 })
    }

    let conversationId: string | null = null

    // 1. Gestion du Thread OpenAI & Conversation Supabase
    // On réutilise la logique robuste existante
    if (!threadId || threadId === 'undefined' || threadId === 'new' || typeof threadId !== 'string') {
      const thread = await openai.beta.threads.create()
      threadId = thread.id
      
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          thread_id: threadId,
          title: message ? (message.slice(0, 50) + (message.length > 50 ? '...' : '')) : 'Nouvelle analyse',
          assistant_id: ASSISTANT_IDS.CHAT
        })
        .select()
        .single()
      
      if (conversation) conversationId = conversation.id
    } else {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('thread_id', threadId)
        .single()
      
      if (conversation) {
        conversationId = conversation.id
      } else {
        // Fallback si le thread existe chez OpenAI mais pas Supabase
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

    if (!threadId) throw new Error('Failed to manage thread ID')

    // 2. Sauvegarder le message User dans Supabase (Immédiatement pour l'UX)
    if (conversationId) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: message || (attachments.length > 0 ? "Envoi de fichier(s)" : ""),
        attachments: attachments // On garde la trace des fichiers originaux
      })
    }

    // 3. PRÉPARATION DU CONTENU POUR OPENAI
    const openaiContent: any[] = []
    if (message) {
        openaiContent.push({ type: 'text', text: message })
    }

    const openaiAttachments: any[] = []

    // Traitement des fichiers attachés
    if (attachments && attachments.length > 0) {
        for (const file of attachments) {
            if (isImage(file.type)) {
                // POUR LES IMAGES : On utilise Vision (URL directe)
                openaiContent.push({
                    type: 'image_url',
                    image_url: { 
                        url: file.url, 
                        detail: 'auto' 
                    }
                })
            } else {
                // POUR LES DOCUMENTS (PDF, CSV, TXT...) : On doit UPLOADER chez OpenAI
                try {
                    console.log(`Downloading file from Supabase: ${file.url}`)
                    // 1. Télécharger le fichier depuis Supabase (URL publique)
                    const fileResponse = await fetch(file.url)
                    if (!fileResponse.ok) throw new Error(`Failed to fetch file: ${file.url}`)
                    
                    const blob = await fileResponse.blob()
                    
                    // 2. Convertir en File object compatible OpenAI
                    const openaiFile = await openai.files.create({
                        file: new File([blob], file.name, { type: file.type }),
                        purpose: 'assistants',
                    })

                    // 3. Ajouter l'ID à la liste des attachements du message
                    // On active Code Interpreter pour analyser les fichiers
                    openaiAttachments.push({
                        file_id: openaiFile.id,
                        tools: [{ type: 'code_interpreter' }, { type: 'file_search' }] 
                    })
                    console.log(`Uploaded file to OpenAI: ${openaiFile.id}`)

                } catch (err) {
                    console.error('Error uploading file to OpenAI:', err)
                    // On continue même si un fichier échoue, mais on log l'erreur
                }
            }
        }
    }

    // 4. Envoyer le message structuré à OpenAI
    // L'historique est géré automatiquement par le threadId !
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: openaiContent.length > 0 ? openaiContent : [{ type: 'text', text: 'Fichier envoyé' }],
      attachments: openaiAttachments.length > 0 ? openaiAttachments : undefined
    })

    // 5. Lancer l'Assistant (Run)
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_IDS.CHAT,
      // On peut forcer des instructions spécifiques ici si besoin
      additional_instructions: "L'utilisateur a peut-être envoyé des fichiers. Analyse-les en détail. Si c'est une image, décris ce que tu vois pour le contexte. Si c'est un document, lis-le avant de répondre."
    })

    // 6. Polling de la réponse
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    const startTime = Date.now()
    const TIMEOUT = 60000 // 60 secondes max pour l'analyse de fichiers

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      if (Date.now() - startTime > TIMEOUT) {
        throw new Error('Assistant timeout - Analyse trop longue')
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

        // 7. Sauvegarder la réponse dans Supabase
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
          conversationId: conversationId
        })
      }
    }

    // Gestion des erreurs OpenAI spécifiques
    if (runStatus.status === 'failed') {
        console.error('Run failed:', runStatus.last_error)
        return NextResponse.json(
            { error: `Assistant error: ${runStatus.last_error?.message || 'Unknown error'}` },
            { status: 500 }
        )
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
