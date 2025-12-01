'use client'

import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  MessageSquare, 
  Users, 
  Zap, 
  Lightbulb, 
  ArrowRight, 
  TrendingUp,
  Newspaper
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [question, setQuestion] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUser(user)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    router.push(`/chat?q=${encodeURIComponent(question)}`)
  }

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto h-full">
        <div className="mx-auto min-h-full max-w-7xl p-6 md:p-10 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-title text-3xl md:text-4xl font-bold text-white">
                Cockpit
              </h1>
              <p className="mt-2 text-muted-foreground">
                Bon retour, {user?.user_metadata?.full_name?.split(' ')[0] || 'Pilote'}. Prêt à accélérer votre business ?
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
               <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[hsl(var(--primary))] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--primary))]"></span>
                  </span>
                  Systèmes IA opérationnels
               </div>
            </motion.div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Coach & Inspirations */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. COACH ELLA (Hero Card) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8 shadow-2xl"
              >
                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-[hsl(var(--primary))/0.15] blur-[100px]" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary))/0.3] bg-[hsl(var(--primary))/0.1] px-3 py-1 text-xs font-medium text-[hsl(var(--primary))]">
                    <Sparkles className="h-3 w-3" />
                    Votre Consultant IA
                  </div>
                  <h2 className="font-title text-3xl font-bold text-white mb-3">Coach Ella</h2>
                  <p className="text-muted-foreground max-w-lg mb-8 text-lg">
                    Stratégie, rédaction, analyse... Je suis là pour vous faire gagner du temps. Sur quoi travaillons-nous aujourd'hui ?
                  </p>

                  <form onSubmit={handleQuickAsk} className="relative group max-w-xl">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Demandez-moi un plan marketing, un audit..."
                      className="w-full h-14 pl-5 pr-14 rounded-2xl border border-white/10 bg-black/40 text-white placeholder:text-muted-foreground/50 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))/0.2] focus:ring-2 transition-all outline-none backdrop-blur-xl"
                    />
                    <button 
                      type="submit"
                      className="absolute right-1.5 top-1.5 h-11 w-11 flex items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-black hover:bg-[hsl(var(--mauve-magic))] transition-colors shadow-lg"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                     {['Générer 5 idées de posts', 'Analyser mon marché', 'Optimiser mon offre'].map((tag) => (
                       <button 
                          key={tag}
                          onClick={() => setQuestion(tag)}
                          className="whitespace-nowrap rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground hover:border-[hsl(var(--primary))/0.3] hover:text-white transition-all"
                       >
                          {tag}
                       </button>
                     ))}
                  </div>
                </div>
              </motion.div>

              {/* 2. INSPIRATIONS / TIPS DU JOUR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <DashboardCard 
                    title="Tip du jour" 
                    icon={Lightbulb}
                    delay={0.1}
                    className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20"
                 >
                    <div className="mt-4">
                      <p className="text-sm text-gray-200 font-medium leading-relaxed">
                        "Utilisez le framework AIDA (Attention, Intérêt, Désir, Action) dans vos prompts pour générer des emails de vente plus percutants."
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-amber-400/80">
                         <Zap className="h-3 w-3" />
                         <span>Actionnable immédiatement</span>
                      </div>
                    </div>
                 </DashboardCard>

                 <DashboardCard 
                    title="Outil Tendance" 
                    icon={Zap}
                    delay={0.2}
                    className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20"
                 >
                    <div className="mt-4">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xl">M</div>
                         <div>
                            <h4 className="font-bold text-white">Midjourney v6</h4>
                            <span className="text-xs text-purple-400">Génération d'images</span>
                         </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        La nouvelle version permet d'intégrer du texte lisible dans vos images. Parfait pour vos visuels réseaux sociaux.
                      </p>
                    </div>
                 </DashboardCard>
              </div>
            </div>

            {/* RIGHT COLUMN: Veille & Community */}
            <div className="space-y-6">
              
              {/* 3. VEILLE STRATÉGIQUE (Vertical Feed) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-[2rem] border border-white/10 bg-[#0F0F13] p-6 h-full min-h-[400px]"
              >
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-white flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-blue-400" />
                      Veille Stratégique
                    </h3>
                    <Link href="/veille" className="text-xs text-muted-foreground hover:text-white transition-colors">Voir tout</Link>
                 </div>
                 
                 <div className="space-y-4 relative">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/5" />
                    
                    {[
                      { title: "OpenAI lance GPT-4o", date: "Aujourd'hui", tag: "Major" },
                      { title: "Google intègre Gemini dans Workspace", date: "Hier", tag: "Google" },
                      { title: "Nouvelle loi IA en Europe : Impacts", date: "2 jours", tag: "Régulation" },
                      { title: "L'IA générative pour le e-commerce", date: "3 jours", tag: "Retail" }
                    ].map((item, i) => (
                      <div key={i} className="relative pl-6 group cursor-pointer">
                         <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#0F0F13] bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                         <h4 className="text-sm text-gray-200 font-medium group-hover:text-blue-400 transition-colors line-clamp-1">{item.title}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">{item.date}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">{item.tag}</span>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-white/5">
                    <Button variant="outline" className="w-full justify-between text-xs h-10 border-white/10 bg-transparent hover:bg-white/5 hover:text-white group">
                       Lire le récap hebdo
                       <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </div>
              </motion.div>

              {/* 4. COMMUNAUTÉ (Mini widget) */}
              <DashboardCard 
                title="Communauté" 
                icon={Users}
                delay={0.4}
                className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10"
              >
                <div className="mt-4">
                   <div className="flex items-center justify-between mb-3">
                      <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                              <div key={i} className="h-8 w-8 rounded-full border-2 border-[#0F0F13] bg-gray-700" />
                          ))}
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">+12 en ligne</span>
                   </div>
                   <p className="text-xs text-muted-foreground mb-4">
                      Rejoignez la discussion sur "L'IA pour les PME"
                   </p>
                   <Link href="/communaute">
                      <Button size="sm" className="w-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 border-0">
                          Rejoindre
                      </Button>
                   </Link>
                </div>
              </DashboardCard>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// Helper Component
function DashboardCard({ title, icon: Icon, children, className, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 p-6 backdrop-blur-sm bg-[#0F0F13]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white text-sm flex items-center gap-2">
            <Icon className="h-4 w-4 opacity-70" />
            {title}
        </h3>
      </div>
      {children}
    </motion.div>
  )
}
