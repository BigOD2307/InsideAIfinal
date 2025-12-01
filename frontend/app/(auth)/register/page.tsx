'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, ArrowRight, Check, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            phone: phone 
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
      if (data.user) {
        toast.success('Compte créé ! Vérifiez vos emails.')
        router.push('/login')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white lg:grid lg:grid-cols-2">
      
      {/* Left Side - Visual */}
      <div className="relative hidden h-full flex-col justify-between overflow-hidden border-r border-white/10 bg-[#030014] p-12 lg:flex order-2 lg:order-1">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_rgba(120,119,198,0.15),_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,_rgba(76,29,149,0.15),_transparent_50%)]" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center">
           <span className="text-5xl tracking-tighter text-white" style={{ fontFamily: 'var(--font-blaka)' }}>inside.ai</span>
        </div>

        {/* Features List */}
        <div className="relative z-10 max-w-md space-y-10">
          <div>
             <h2 className="text-4xl font-bold leading-tight tracking-tight mb-6">
               Prenez une longueur d'avance avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Inside AI.</span>
             </h2>
             <p className="text-lg text-gray-400">
               Rejoignez la communauté des professionnels africains qui façonnent le futur avec l'IA.
             </p>
          </div>
          
          <ul className="space-y-6">
            {[
              'Formation personnalisée par secteur',
              'Veille technologique automatisée',
              'Accès à la communauté d\'experts',
              'Certifications reconnues'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-gray-500 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          Déjà plus de 500 membres actifs
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-[#030014] order-1 lg:order-2">
        <div className="mx-auto w-full max-w-md space-y-8 relative">
          
          {/* Decor */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">Créer un compte 🚀</h1>
            <p className="mt-2 text-gray-400">
              Démarrez votre formation gratuite dès aujourd'hui.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nom complet</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Numéro de téléphone</label>
              <Input
                type="tel"
                placeholder="+221 XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email professionnel</label>
              <Input
                type="email"
                placeholder="nom@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Mot de passe</label>
              <Input
                type="password"
                placeholder="Minimum 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 w-full rounded-xl bg-white text-black hover:bg-gray-200 font-semibold transition-all text-base mt-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>Commencer l'aventure <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500">
            En vous inscrivant, vous acceptez nos <Link href="#" className="underline hover:text-white">conditions d'utilisation</Link>.
          </p>

          <div className="text-center text-sm text-gray-400">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline underline-offset-4 transition-all">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
