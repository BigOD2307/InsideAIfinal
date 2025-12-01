'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Sparkles, Calendar, ArrowRight, Loader2, TrendingUp, Search, Filter, Globe, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Type definitions
type VeilleItem = {
    id: string;
    title: string;
    summary: string;
    category: string;
    source_url: string | null;
    published_at: string;
    created_at: string;
}

export default function VeillePage() {
  const [items, setItems] = useState<VeilleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const fetchVeille = async () => {
      try {
          setLoading(true)
          const { data, error } = await supabase
              .from('veille_items')
              .select('*')
              .order('published_at', { ascending: false })
          
          if (error) throw error
          setItems(data || [])
      } catch (error) {
          console.error('Error fetching veille:', error)
          toast.error('Erreur lors du chargement de la veille')
      } finally {
          setLoading(false)
      }
  }

  useEffect(() => {
      fetchVeille()
  }, [])

  const handleRefresh = async () => {
    setGenerating(true)
    // Simulation d'un refresh réseau pour l'UX
    await new Promise(resolve => setTimeout(resolve, 1500))
    await fetchVeille()
    setGenerating(false)
    toast.success("Radar mis à jour avec succès")
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#0F0F16] to-black p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-md shadow-lg shadow-blue-500/10"
            >
              <Globe className="h-4 w-4 animate-pulse" />
              Radar IA Actif • Scan en temps réel
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-title text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
              >
                Veille <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Stratégique</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-xl text-muted-foreground/80 leading-relaxed"
              >
                Ne subissez plus l'actualité IA. <br className="hidden md:block" />
                Nous filtrons le bruit pour extraire les signaux faibles qui impacteront votre business.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
             <Button 
              onClick={handleRefresh} 
              disabled={generating}
              size="lg"
              className="h-14 rounded-2xl bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all text-base font-semibold px-8"
            >
              {generating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
              {generating ? 'Analyse du marché...' : 'Actualiser le radar'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky top-0 z-30 backdrop-blur-xl bg-[#05050A]/80 py-2"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 rounded-2xl border border-white/10 bg-[#0F0F13] p-2 shadow-lg">
           <div className="flex-1 flex items-center gap-3 px-4 h-12 w-full">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Filtrer par mots-clés (ex: LLM, Apple, NVIDIA...)"
                className="flex-1 bg-transparent text-white placeholder:text-muted-foreground/50 outline-none h-full"
              />
           </div>
           <div className="flex items-center gap-2 pr-2 overflow-x-auto max-w-full md:max-w-fit no-scrollbar pb-2 md:pb-0">
              {['Tous', 'Modèles', 'Outils', 'Régulation', 'Business'].map((filter, i) => (
                <button 
                  key={filter}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${i === 0 ? 'bg-white text-black' : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'}`}
                >
                  {filter}
                </button>
              ))}
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/10 shrink-0">
                 <Filter className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </motion.div>

      {/* Reports Grid - Real Data */}
      {loading && items.length === 0 ? (
           <div className="flex h-64 items-center justify-center">
               <Loader2 className="h-8 w-8 animate-spin text-white/20" />
           </div>
      ) : items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex min-h-[500px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/10 bg-[#0A0A0F] p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsla(var(--primary)/0.05),_transparent_70%)]" />
          
          <div className="relative mb-8">
             <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/10 duration-[3s]" />
             <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1a1a24] to-black border border-white/10 shadow-2xl">
               <Newspaper className="h-10 w-10 text-blue-400" />
             </div>
          </div>
          <h2 className="font-title text-3xl font-medium text-white mb-4">Le radar est vide</h2>
          <p className="max-w-md text-muted-foreground text-lg mb-8 leading-relaxed">
            Aucune donnée n'a été trouvée dans la base de données.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#0F0F16] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)]"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-sm">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm">
                      {format(new Date(item.published_at), 'dd MMM', { locale: fr })}
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-title text-xl font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground/80 line-clamp-4">
                  {item.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {/* Tags fictifs basés sur la catégorie pour l'instant */}
                   {['AI Trends', 'Market Watch'].map((tag, i) => (
                      <span key={i} className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-white/5 group-hover:border-white/10 transition-colors">
                        #{tag}
                      </span>
                   ))}
                </div>
              </div>

              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/5 pt-5">
                <div className="flex -space-x-2">
                   {/* Fake readers for social proof */}
                   {[1,2,3].map(i => (
                     <div key={i} className="h-7 w-7 rounded-full border-2 border-[#0F0F16] bg-gradient-to-br from-gray-700 to-gray-900" />
                   ))}
                </div>
                {item.source_url && (
                    <Button variant="ghost" size="sm" asChild className="h-9 rounded-full text-xs font-medium hover:bg-blue-500/10 hover:text-blue-400 transition-colors gap-1 cursor-pointer">
                        <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                            Lire la source
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
