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

    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Créer un thread pour les recommandations
    const thread = await openai.beta.threads.create()
    
    const prompt = `Génère des recommandations d'outils IA personnalisées pour cet utilisateur:
        
Profil professionnel: ${profile?.job_title || 'Non spécifié'}
Secteur: ${profile?.industry || 'Non spécifié'}
Niveau: ${profile?.experience_level || 'Non spécifié'}
Besoins: ${profile?.ai_needs || 'Non spécifiés'}
Objectifs: ${JSON.stringify(profile?.onboarding_data || {})}

Génère 5-8 recommandations d'outils IA pertinents avec:
- Nom de l'outil
- Description courte
- Cas d'usage
- Lien (si disponible)

Format JSON avec un tableau d'objets.`

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    })

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_IDS.RECOMMANDATION || ASSISTANT_IDS.CHAT,
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
        // Parser la réponse JSON
        try {
          const jsonMatch = content.text.value.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            
            // Sauvegarder dans la base de données
            const { data: recommendation, error } = await supabase
              .from('ai_recommendations')
              .insert({
                user_id: user.id,
                recommendations: parsed,
              })
              .select()
              .single()

            if (error) {
              console.error('Error saving recommendations:', error)
            }

            // Marquer l'onboarding comme complété
            await supabase
              .from('users')
              .update({ onboarding_completed: true })
              .eq('id', user.id)

            return NextResponse.json({
              recommendations: parsed,
              recommendationId: recommendation?.id,
            })
          }
        } catch (e) {
          console.error('Error parsing recommendations:', e)
          return NextResponse.json(
            { error: 'Failed to parse recommendations' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Recommendations API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


