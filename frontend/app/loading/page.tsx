'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Zap, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const LOADING_STEPS = [
  { id: 1, text: 'Analyse de votre profil...', icon: Sparkles },
  { id: 2, text: 'Génération de recommandations personnalisées...', icon: Zap },
  { id: 3, text: 'Préparation de votre dashboard...', icon: CheckCircle2 },
]

export default function LoadingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        // Récupérer les réponses de l'onboarding
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        // Simuler les étapes de chargement
        for (let i = 0; i < LOADING_STEPS.length; i++) {
          setCurrentStep(i)
          await new Promise(resolve => setTimeout(resolve, 1500))
        }

        // Générer les recommandations via l'API route
        const response = await fetch('/api/recommendations/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.recommendations) {
            setRecommendations(data.recommendations)
          }
        } else {
          console.error('Error generating recommendations:', await response.text())
        }

        setIsComplete(true)
        
        // Rediriger vers le dashboard après 1 seconde
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)

      } catch (error) {
        console.error('Error generating recommendations:', error)
        // En cas d'erreur, rediriger quand même vers le dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    }

    generateRecommendations()
  }, [router])

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] px-6 py-10 text-[hsl(var(--foreground))]">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[hsl(var(--background-secondary))]"
        >
          <Sparkles className="h-10 w-10 text-[hsl(var(--primary))]" />
        </motion.div>
        <h1 className="text-3xl font-semibold">Préparation de votre espace Inside AI…</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Nous consolidons votre profil, génèrons vos recommandations et synchronisons les rapports de veille. Gardez cette fenêtre ouverte.
        </p>

        <div className="mt-12 w-full space-y-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[hsl(var(--background-secondary))] p-6 text-left">
          {LOADING_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
                className="flex items-center gap-4"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                    isCompleted
                      ? 'border-[rgba(255,255,255,0.08)] bg-white/5 text-emerald-300'
                      : isActive
                      ? 'border-white bg-white text-black'
                      : 'border-[rgba(255,255,255,0.08)] text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Étape {index + 1}</p>
                  <p className="text-base text-white">{step.text}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 text-left sm:flex-row sm:items-center">
          <div className="flex-1 text-sm text-muted-foreground">
            Synchronisation Supabase • Assistants OpenAI • Vérification RLS
          </div>
          <div className="h-2 flex-1 rounded-full bg-[rgba(255,255,255,0.06)]">
            <motion.div
              className="h-full rounded-full bg-[hsl(var(--primary))]"
              initial={{ width: '0%' }}
              animate={{ width: isComplete ? '100%' : `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[hsl(var(--background-secondary))] px-6 py-4 text-sm text-muted-foreground"
          >
            Vos recommandations sont prêtes. Nous vous redirigeons vers le dashboard.
          </motion.div>
        )}
      </div>
    </div>
  )
}

