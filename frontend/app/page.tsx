import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import LandingPage from '@/components/landing/landing-page'

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si l'utilisateur est connecté, vérifier s'il a complété l'onboarding
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (!profile?.onboarding_completed) {
      redirect('/onboarding')
    } else {
      redirect('/dashboard')
    }
  }

  // Afficher la page d'accueil pour les utilisateurs non connectés
  return <LandingPage />
}
