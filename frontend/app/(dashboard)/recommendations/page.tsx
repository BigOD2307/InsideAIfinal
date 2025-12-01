'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Sparkles, ExternalLink, ArrowRight, SlidersHorizontal, Bookmark, Star, Search, Grid, List } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface Recommendation {
  name: string
  description: string
  useCase: string
  link?: string
  category?: string
  impact?: 'High' | 'Medium' | 'Low'
  tags?: string[]
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('ai_recommendations')
          .select('recommendations')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data?.recommendations) {
          setRecommendations(data.recommendations)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0F0F16] p-10 shadow-2xl">
        <div className="absolute top-0 right-0 h-96 w-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-400 mb-6">
              <Zap className="h-4 w-4" />
              Stack IA Personnalisée
            </div>
            <h1 className="font-title text-5xl md:text-6xl font-bold text-white tracking-tight">
              Explorer
            </h1>
            <p className="mt-4 text-xl text-muted-foreground/80 max-w-2xl leading-relaxed">
              Une sélection sur-mesure d'outils pour votre métier. <br className="hidden md:block" />
              Nous avons analysé 500+ solutions pour ne garder que celles qui vous feront gagner du temps.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <Button size="lg" className="h-12 rounded-xl bg-white text-black hover:bg-white/90 shadow-lg font-semibold">
               <Sparkles className="mr-2 h-4 w-4" />
               Générer ma stack
             </Button>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="sticky top-0 z-20 bg-[#05050A]/80 backdrop-blur-xl py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0F0F13] p-2">
           <div className="flex items-center gap-3 px-4 flex-1 w-full">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher un outil (ex: CRM, Rédaction, Vidéo...)" 
                className="bg-transparent text-white placeholder:text-muted-foreground/50 outline-none w-full h-10"
              />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar px-2 pb-2 md:pb-0">
              <Button variant="ghost" size="sm" className="bg-white/10 text-white hover:bg-white/20 rounded-lg">
                 Tous
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg">
                 Productivité
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg">
                 Marketing
              </Button>
              <div className="w-[1px] h-6 bg-white/10 mx-2 hidden md:block" />
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-black/40 text-white shadow-sm">
                    <Grid className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground hover:text-white">
                    <List className="h-4 w-4" />
                 </Button>
              </div>
           </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] animate-pulse rounded-[2.5rem] border border-white/5 bg-white/[0.02]" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/10 bg-[#0A0A0F] p-12 text-center">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-3xl bg-white/5 p-8 border border-white/10">
               <Sparkles className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <h2 className="font-title text-3xl font-bold text-white mb-3">Votre stack est vide</h2>
          <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
            Discutez avec Coach Ella pour définir vos besoins. <br/>
            Nous générerons ensuite une liste d'outils parfaitement adaptée à votre profil.
          </p>
          <Button 
             size="lg" 
             variant="outline"
             className="h-12 px-8 rounded-full border-yellow-500/30 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-500/50"
          >
            Configurer mon profil
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col justify-between rounded-[2.5rem] border border-white/10 bg-[#0F0F16] p-1 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/5 hover:border-white/20"
            >
              <div className="h-full rounded-[2.3rem] bg-[#13131A] p-7 flex flex-col relative overflow-hidden">
                {/* Background Glow on Hover */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:border-yellow-500/30 group-hover:text-yellow-400 transition-all duration-300 shadow-lg">
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                  {rec.category && (
                    <Badge variant="outline" className="border-white/10 bg-black/40 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-1 backdrop-blur-md">
                      {rec.category}
                    </Badge>
                  )}
                </div>
                
                <div className="relative z-10">
                   <h3 className="font-title text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors tracking-tight">{rec.name}</h3>
                   
                   <p className="text-[15px] leading-relaxed text-muted-foreground/90 mb-6 line-clamp-3">
                     {rec.description}
                   </p>

                   <div className="space-y-4 mt-auto">
                     <div className="rounded-2xl bg-black/20 p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Zap className="h-3 w-3" /> Impact Business
                       </p>
                       <p className="text-sm text-gray-200 font-medium leading-snug">{rec.useCase}</p>
                     </div>
                     
                     {rec.tags && (
                       <div className="flex flex-wrap gap-2">
                         {rec.tags.map(tag => (
                           <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-lg border border-transparent hover:border-white/10 transition-colors">
                              #{tag}
                           </span>
                         ))}
                       </div>
                     )}
                   </div>
                </div>
              </div>

              <div className="px-7 py-5 flex items-center gap-3">
                {rec.link ? (
                   <Button className="flex-1 h-12 rounded-2xl bg-white text-black hover:bg-gray-100 text-sm font-bold shadow-lg shadow-white/5 group/btn overflow-hidden relative" asChild>
                     <a href={rec.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                       <span className="relative z-10 flex items-center gap-2">
                          Découvrir l'outil <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                       </span>
                     </a>
                   </Button>
                ) : (
                  <Button className="flex-1 h-12 rounded-2xl bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5" disabled>
                    Bientôt disponible
                  </Button>
                )}
                <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
