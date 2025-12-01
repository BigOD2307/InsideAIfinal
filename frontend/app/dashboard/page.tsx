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
  Newspaper,
  Activity,
  CheckCircle2,
  Target,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [question, setQuestion] = useState('')
  
  // Real Data States
  const [roadmap, setRoadmap] = useState<any[]>([])
  const [roadmapProgress, setRoadmapProgress] = useState(0)
  const [veilleItems, setVeilleItems] = useState<any[]>([])
  const [communityStats, setCommunityStats] = useState({ online: 0, lastPost: null as any })
  
  const router = useRouter()

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUser(user)

        // 1. Calculer la Roadmap réelle
        // Check profile
        const { data: profile } = await supabase.from('users').select('job_title, bio, phone').eq('id', user.id).single()
        const isProfileDone = !!(profile?.job_title && profile?.phone);

        // Check messages (Ella)
        const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        const isChatDone = (msgCount || 0) > 0;

        // Check community
        const { count: postCount } = await supabase.from('community_messages').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        const isCommunauteDone = (postCount || 0) > 0;

        const tasks = [
           { id: 'profile', label: "Compléter mon profil pro", done: isProfileDone, link: '/settings' },
           { id: 'chat', label: "Lancer une analyse avec Ella", done: isChatDone, link: '/chat' },
           { id: 'communaute', label: "Se présenter à la communauté", done: isCommunauteDone, link: '/communaute' },
        ]
        setRoadmap(tasks)
        setRoadmapProgress((tasks.filter(t => t.done).length / tasks.length) * 100)

        // 2. Charger la Veille Réelle
        const { data: news } = await supabase
            .from('veille_items')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(3)
        setVeilleItems(news || [])

        // 3. Stats Communauté Réelles
        // Note: "En ligne" est difficile sans Presence, on simule un chiffre basé sur l'heure ou random pour l'instant
        // Mais on prend le dernier vrai post
        const { data: lastPosts } = await supabase
            .from('community_messages_with_users')
            .select('user_full_name, content, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        
        setCommunityStats({
            online: Math.floor(Math.random() * (45 - 12 + 1) + 12), // Simulation "Vivant"
            lastPost: lastPosts
        })

      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRealData()
  }, [])

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    router.push(`/chat?q=${encodeURIComponent(question)}`)
  }

  const allTasksDone = roadmapProgress === 100

  if (loading) return (
      <MainLayout>
          <div className="flex h-full items-center justify-center bg-[#05050A]">
              <Loader2 className="h-10 w-10 animate-spin text-white/20" />
          </div>
      </MainLayout>
  )

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto h-full bg-[#05050A] relative">
        
        <div className="mx-auto min-h-full max-w-7xl p-6 md:p-8 space-y-8 relative z-10">
          
          {/* 1. HERO SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-[#0F0F16] to-[#0A0A0F] p-8 md:p-10 shadow-2xl group"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_hsla(var(--primary)/0.1),_transparent_60%)]" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
               <div className="space-y-4 max-w-2xl">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10 px-3 py-1">
                     👋 Brief du Jour
                  </Badge>
                  <h1 className="font-title text-3xl md:text-4xl font-bold text-white leading-tight">
                    Bonjour {user?.user_metadata?.full_name?.split(' ')[0] || 'Expert'}. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                        {allTasksDone ? "Votre cockpit est pleinement opérationnel." : "Finalisons votre installation."}
                    </span>
                  </h1>
                  
                  {/* Real News Feed */}
                  <div className="grid gap-3 mt-4">
                     {veilleItems.length > 0 ? veilleItems.map((item, i) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/news">
                           <TrendingUp className={cn("h-4 w-4 shrink-0", i === 0 ? "text-green-400" : "text-blue-400")} />
                           <span className="line-clamp-1 group-hover/news:text-white transition-colors">{item.title}</span>
                           <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
                               {formatDistanceToNow(new Date(item.published_at), { addSuffix: true, locale: fr })}
                           </span>
                        </div>
                     )) : (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Chargement du flux d'actualité...
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex-shrink-0 relative hidden md:block">
                  <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-b from-[hsl(var(--primary))] to-purple-600 p-1">
                     <div className="h-full w-full rounded-full bg-[#0F0F16] flex items-center justify-center relative overflow-hidden">
                        <Sparkles className="h-12 w-12 text-[hsl(var(--primary))]" />
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 2. COACH ELLA (Center Stage) */}
            <div className={cn("space-y-6 transition-all duration-500", allTasksDone ? "lg:col-span-8" : "lg:col-span-8")}>
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="rounded-[2rem] border border-white/10 bg-[#13131A] p-1"
               >
                  <div className="bg-[#0A0A0F] rounded-[1.8rem] p-8 relative overflow-hidden">
                     <div className="absolute -right-10 -top-10 h-40 w-40 bg-blue-500/10 blur-3xl rounded-full" />
                     
                     <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                           <Sparkles className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-white">Coach Ella</h2>
                           <p className="text-xs text-muted-foreground">Mode Stratège activé</p>
                        </div>
                     </div>

                     <form onSubmit={handleQuickAsk} className="relative mb-6">
                        <input 
                           type="text" 
                           value={question}
                           onChange={(e) => setQuestion(e.target.value)}
                           placeholder="Posez une question stratégique..." 
                           className="w-full h-16 pl-6 pr-16 rounded-2xl bg-[#13131A] border border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-lg"
                        />
                        <button type="submit" className="absolute right-2 top-2 h-12 w-12 bg-blue-500 hover:bg-blue-400 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20">
                           <ArrowRight className="h-5 w-5" />
                        </button>
                     </form>
                  </div>
               </motion.div>

               {/* 3. DISCOVERY FEED (Dynamic Width) */}
               <div className={cn("grid gap-6", allTasksDone ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2")}>
                  <Link href="/veille" className="group">
                     <div className="h-full rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-6 hover:border-white/20 transition-all relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                              <Activity className="h-5 w-5 text-orange-400" />
                           </div>
                           <Badge className="bg-orange-500/10 text-orange-400 border-0">Actif</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Radar Veille</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {veilleItems.length} signaux faibles détectés.
                        </p>
                     </div>
                  </Link>

                  <Link href="/communaute" className="group">
                     <div className="h-full rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-6 hover:border-white/20 transition-all relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-purple-400" />
                           </div>
                           <div className="flex -space-x-2">
                              {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full bg-gray-700 border border-[#0A0A0F]" />)}
                           </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Communauté</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                           {communityStats.lastPost 
                                ? `Dernier message de ${communityStats.lastPost.user_full_name}` 
                                : "Rejoignez la discussion en direct."}
                        </p>
                     </div>
                  </Link>
               </div>
            </div>

            {/* 4. SIDEBAR (Roadmap OR Level Up) */}
            <div className="lg:col-span-4 space-y-6">
               
               <AnimatePresence mode="wait">
               {!allTasksDone ? (
                   <motion.div 
                      key="roadmap"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-6 relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Target className="h-32 w-32 text-[hsl(var(--primary))]" />
                      </div>
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                         <Target className="h-4 w-4 text-[hsl(var(--primary))]" /> Onboarding
                      </h3>
                      
                      <div className="space-y-6 relative z-10">
                         <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                               <span className="text-gray-300">Progression</span>
                               <span className="text-[hsl(var(--primary))] font-bold">{Math.round(roadmapProgress)}%</span>
                            </div>
                            <Progress value={roadmapProgress} className="h-2 bg-white/5" />
                         </div>

                         <div className="space-y-3">
                            {roadmap.map((task, i) => (
                               <Link key={i} href={task.done ? '#' : task.link} className={cn("block", task.done && "pointer-events-none")}>
                                   <div className="flex items-center gap-3 group cursor-pointer">
                                      <div className={cn(
                                         "h-6 w-6 rounded-full flex items-center justify-center border transition-all shrink-0",
                                         task.done 
                                            ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" 
                                            : "border-white/20 group-hover:border-white/40"
                                      )}>
                                         {task.done && <CheckCircle2 className="h-4 w-4 text-black" />}
                                      </div>
                                      <span className={cn(
                                         "text-sm transition-colors",
                                         task.done ? "text-muted-foreground line-through" : "text-gray-200 group-hover:text-white"
                                      )}>
                                         {task.label}
                                      </span>
                                   </div>
                               </Link>
                            ))}
                         </div>
                      </div>
                   </motion.div>
               ) : (
                   <motion.div 
                      key="levelup"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[2rem] bg-gradient-to-b from-[#1C1C24] to-[#0A0A0F] border border-white/10 p-6 text-center h-full flex flex-col justify-center"
                   >
                      <div className="relative inline-block mb-6 mx-auto">
                         <svg className="h-32 w-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.8" strokeDashoffset="0" className="text-[hsl(var(--primary))]" />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-white">100%</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Expert</span>
                         </div>
                      </div>
                      <h3 className="font-bold text-white mb-2 text-lg">Setup Terminé 🚀</h3>
                      <p className="text-sm text-muted-foreground mb-6">Votre environnement est optimisé. Continuez à explorer pour débloquer le niveau "Master".</p>
                   </motion.div>
               )}
               </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
