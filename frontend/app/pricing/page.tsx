'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const PLANS = [
  {
    id: 'free',
    name: 'Découverte',
    price: 'Gratuit',
    period: 'toujours',
    description: 'Pour explorer la puissance de l\'IA.',
    features: [
      'Accès limité à Coach Ella',
      '3 recommandations / mois',
      'Accès lecture communauté',
      '1 rapport de veille hebdo',
    ],
    icon: Sparkles,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '89€',
    period: 'mois',
    description: 'Pour les managers qui veulent accélérer.',
    features: [
      'Chat IA illimité & rapide',
      'Recommandations illimitées',
      'Veille sectorielle quotidienne',
      'Accès complet communauté',
      'Support prioritaire 24/7',
    ],
    icon: Zap,
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Studio',
    price: 'Sur devis',
    period: 'annuel',
    description: 'Pour transformer toute votre organisation.',
    features: [
      'Tout le plan Pro inclus',
      'Agents IA sur-mesure',
      'Intégration CRM & Outils',
      'Formation des équipes',
      'Roadmap IA dédiée',
    ],
    icon: Crown,
    highlight: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSelectPlan = async (planId: string) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success(`Plan ${planId} activé avec succès !`)
    router.push('/loading')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsla(var(--indigo-bloom)/0.2),_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.1]" />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
            <Crown className="h-3 w-3" />
            Investissement
          </div>
          <h1 className="font-title text-4xl font-semibold leading-tight text-white md:text-5xl">
            Choisissez votre niveau de <span className="text-[hsl(var(--primary))]">pilotage.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Des offres claires, sans engagement, conçues pour grandir avec votre maturité IA.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`relative flex flex-col rounded-[2rem] border p-8 transition-all hover:scale-[1.02] ${
                  plan.highlight
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.03] shadow-[0_0_40px_-10px_hsl(var(--primary)/0.15)]'
                    : 'border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/20'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--primary))] px-4 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-lg">
                    Recommandé
                  </div>
                )}

                <div className="mb-8">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${
                    plan.highlight 
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-black' 
                      : 'border-white/10 bg-white/5 text-white'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-title text-2xl font-medium text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? 'text-[hsl(var(--primary))]' : 'text-white'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading}
                  className={`h-12 w-full rounded-full font-medium transition-all ${
                    plan.highlight
                      ? 'bg-[hsl(var(--primary))] text-black hover:bg-[hsl(var(--mauve-magic))] hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]'
                      : 'border border-white/10 bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  {plan.id === 'enterprise' ? 'Contacter le Studio' : 'Commencer maintenant'}
                  {plan.id !== 'enterprise' && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Vous avez une grande équipe ? <a href="#" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Discutons de vos besoins spécifiques</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
