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

    // Récupérer le profil utilisateur pour personnaliser
    const { data: profile } = await supabase
      .from('users')
      .select('job_title, industry, experience_level')
      .eq('id', user.id)
      .single()

    // Créer un thread pour la veille
    const thread = await openai.beta.threads.create()

    const prompt = `Génère un rapport de veille IA personnalisé pour un professionnel.
${profile?.job_title ? `Métier: ${profile.job_title}` : ''}
${profile?.industry ? `Industrie: ${profile.industry}` : ''}
${profile?.experience_level ? `Niveau: ${profile.experience_level}` : ''}

Le rapport doit inclure:
- Les dernières innovations IA pertinentes
- Comment les utiliser dans son contexte professionnel
- Des exemples concrets et actionnables
- Les tendances à surveiller

Format: Titre, Résumé, Contenu détaillé avec sections.`

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    })

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_IDS.VEILLE || ASSISTANT_IDS.CHAT, // Fallback si pas configuré
    })

    // Attendre la réponse
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id as any)
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id as any)
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id)
      const assistantMessage = messages.data[0]
      const content = assistantMessage.content[0]

      if ('text' in content) {
        const reportContent = content.text.value
        
        // Parser le contenu pour extraire titre et résumé
        const lines = reportContent.split('\n')
        const title = lines.find((l) => l.startsWith('#') || l.startsWith('##'))?.replace(/^#+\s*/, '') || 'Rapport de veille IA'
        const summary = lines.slice(0, 3).join(' ').substring(0, 200) + '...'

        // Sauvegarder dans la base de données
        const { data: report, error } = await supabase
          .from('ai_veille')
          .insert({
            user_id: user.id,
            title,
            content: reportContent,
            summary,
          })
          .select()
          .single()

        if (error) {
          console.error('Error saving report:', error)
        }

        return NextResponse.json({
          report: {
            id: report?.id || Date.now().toString(),
            user_id: user.id,
            title,
            content: reportContent,
            summary,
            created_at: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Veille API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

