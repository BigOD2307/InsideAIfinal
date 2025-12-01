'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbulb, Heart, Check, Sparkles, Zap } from 'lucide-react'
import { Tip } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const difficultyConfig = {
    beginner: { color: 'text-green-400 bg-green-400/10', label: 'Débutant' },
    intermediate: { color: 'text-yellow-400 bg-yellow-400/10', label: 'Intermédiaire' },
    advanced: { color: 'text-red-400 bg-red-400/10', label: 'Expert' },
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
            <Lightbulb className="h-3 w-3" />
            Daily Knowledge
          </div>
          <h1 className="font-title text-3xl font-semibold text-white">Tips IA Quotidiens</h1>
          <p className="max-w-lg text-muted-foreground">
            Une dose journalière d'intelligence pour affûter vos réflexes IA.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl border border-white/5 bg-white/5" />
          ))}
        </div>
      ) : tips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
          <div className="rounded-full bg-white/5 p-4">
            <Zap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-title mt-6 text-xl font-medium text-white">Les tips arrivent bientôt</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Nos experts compilent les meilleures pratiques actuelles. Revenez demain !
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, idx) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm transition hover:border-[hsl(var(--primary))/0.3] hover:bg-white/[0.02]"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <Badge 
                    variant="outline" 
                    className={`border-0 ${difficultyConfig[tip.difficulty].color}`}
                  >
                    {difficultyConfig[tip.difficulty].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(tip.created_at), 'd MMM', { locale: fr })}
                  </span>
                </div>
                
                <h3 className="font-title text-xl font-medium text-white group-hover:text-[hsl(var(--primary))]">
                  {tip.title}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{tip.category}</p>
                
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {tip.content}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-white/5 pt-4">
                <Button variant="ghost" size="sm" className="h-8 w-full gap-2 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white">
                  <Heart className="h-4 w-4" />
                  <span>J'aime</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-full gap-2 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white">
                  <Check className="h-4 w-4" />
                  <span>Appliqué</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
