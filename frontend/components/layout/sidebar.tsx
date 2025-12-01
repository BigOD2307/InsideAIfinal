'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MessageSquare, 
  Newspaper, 
  Users, 
  Lightbulb,
  Settings,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Bot,
  ChevronRight,
  ChevronLeft,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navigation = [
  { name: 'Cockpit', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Coach Ella', href: '/chat', icon: Bot },
  { name: 'Veille IA', href: '/veille', icon: Newspaper },
  { name: 'Communauté', href: '/communaute', icon: Users },
  { name: 'Explorer', href: '/recommendations', icon: Zap },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  // On garde une largeur fixe pour le layout (le placeholder)
  // Mais le sidebar lui-même va s'étendre

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        if (data) setUser(data)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const expanded = isHovered

  return (
    // Container placeholder qui garde l'espace dans le layout (toujours petit)
    <div className="relative z-50 hidden h-screen w-20 flex-col lg:flex shrink-0">
      
      {/* Le vrai Sidebar qui s'anime */}
      <motion.div 
        initial={{ width: 80 }}
        animate={{ width: expanded ? 288 : 80 }} 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 h-screen flex flex-col border-r border-white/5 bg-[#05050A] shadow-2xl z-50",
          // Si on veut un effet de verre pour le fond quand étendu
          expanded && "bg-[#05050A]/95 backdrop-blur-xl"
        )}
      >
        {/* Logo */}
        <div className={cn("p-6 flex items-center h-20", expanded ? "justify-start" : "justify-center")}>
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-indigo-600 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-2xl font-medium tracking-tight text-white" style={{ fontFamily: 'var(--font-blaka)' }}>inside.ai</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 space-y-2 px-3 mt-6 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
              
              const LinkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 overflow-hidden',
                    isActive ? 'text-white' : 'text-muted-foreground hover:text-white',
                    expanded ? "justify-start" : "justify-center"
                  )}
                >
                  {/* Active Background & Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))/0.15] to-transparent border-l-2 border-[hsl(var(--primary))]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={cn("relative z-10 h-5 w-5 shrink-0 transition-colors", isActive ? "text-[hsl(var(--primary))]" : "text-muted-foreground group-hover:text-white")} />
                  
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 flex-1 overflow-hidden whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isActive && expanded && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative z-10 ml-auto"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary))]" />
                    </motion.div>
                  )}
                </Link>
              )

              return !expanded ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-black border-white/10 text-white ml-2 font-medium z-[60]">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.name}>{LinkContent}</div>
              )
            })}
          </nav>
        </TooltipProvider>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className={cn(
            "group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:border-white/10",
            expanded ? "p-4" : "p-2 flex justify-center"
          )}>
            <div className={cn("flex items-center gap-3", expanded ? "mb-4" : "justify-center")}>
              <Avatar className="h-9 w-9 border border-white/10 bg-black shrink-0">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))/0.2] to-indigo-900/50 text-[hsl(var(--primary))] font-medium text-xs">
                  {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              {expanded && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="truncate font-medium text-white text-sm">{user?.full_name || 'Utilisateur'}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email || ''}</p>
                </motion.div>
              )}
            </div>
            
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid gap-1"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-full justify-start rounded-lg text-xs text-muted-foreground hover:bg-white/5 hover:text-white" 
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="mr-2 h-3 w-3" />
                    Paramètres
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full justify-start rounded-lg text-xs text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  Déconnexion
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
