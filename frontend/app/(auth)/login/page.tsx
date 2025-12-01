'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, ArrowRight, Brain, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (!data.user) throw new Error('Aucun utilisateur retourné')

      // Récupérer le profil pour vérifier le statut de l'onboarding
      // Note: On s'assure que la requête est bien envoyée après l'authentification
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.warn('Erreur récupération profil:', profileError)
      }

      toast.success('Connexion réussie')
      
      // Petit délai pour l'UX et laisser le temps au cookie de se set
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirection conditionnelle
      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (error: any) {
      let msg = 'Erreur de connexion'
      if (error.message?.includes('Invalid login')) msg = 'Identifiants incorrects'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white lg:grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="relative hidden h-full flex-col justify-between overflow-hidden border-r border-white/10 bg-[#030014] p-12 lg:flex">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_rgba(120,119,198,0.1),_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_rgba(76,29,149,0.1),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        {/* Logo */}
        <div className="relative z-10 flex items-center">
           <span className="text-5xl tracking-tighter text-white" style={{ fontFamily: 'var(--font-blaka)' }}>inside.ai</span>
        </div>

        {/* Testimonial / Content */}
        <div className="relative z-10 max-w-md space-y-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
               <span className="relative flex h-2 w-2">
                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                 <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
               </span>
               Formation & Veille IA
             </div>
             <h2 className="text-4xl font-bold leading-tight tracking-tight">
               Votre coach personnel pour maîtriser <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">l'Intelligence Artificielle.</span>
             </h2>
          </div>
          
          <div className="grid gap-4">
            {[
              { icon: Brain, title: "Coach Ella", desc: "Assistance IA personnalisée 24/7" },
              { icon: Zap, title: "Veille Active", desc: "Ne ratez aucune innovation clé" },
              { icon: Target, title: "Micro-learning", desc: "Progressez 5 minutes par jour" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:bg-white/[0.05]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-gray-500">
          © 2024 Inside AI. Plateforme éducative.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-[#030014]">
        <div className="mx-auto w-full max-w-md space-y-8 relative">
          
          {/* Decor for form */}
          <div className="absolute -top-20 -right-20 h-64 w-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">Bon retour 👋</h1>
            <p className="mt-2 text-gray-400">
              Connectez-vous pour accéder à votre veille et à Coach Ella.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                <Link href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                  Oublié ?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 w-full rounded-xl bg-white text-black hover:bg-gray-200 font-semibold transition-all text-base shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#030014] px-2 text-gray-500">Nouveau sur Inside AI ?</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300 hover:underline underline-offset-4 transition-all">
              Créer un compte gratuitement
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
