'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Zap,
  Globe,
  Layout,
  MessageSquare,
  CheckCircle2,
  Search,
  Settings,
  Lock,
  Bell,
  RefreshCw,
  ChevronRight,
  Menu,
  X,
  Twitter,
  Linkedin,
  Github,
  GraduationCap,
  Newspaper,
  Users
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'

// --- Components ---

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
      </span>
      {children}
    </div>
  )
}

// --- Main Page Component ---

export default function LandingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center">
             <span className="text-4xl tracking-tighter text-white" style={{ fontFamily: 'var(--font-blaka)' }}>inside.ai</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="#community" className="hover:text-white transition-colors">Communauté</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="#blog" className="hover:text-white transition-colors">Blog</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Connexion</Link>
            <Link href="/register">
              <Button className="h-9 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-gray-200 transition-all">
                Rejoindre la liste
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main className="relative pt-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-20 text-center md:py-32">
          {/* Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />

          <div className="mx-auto max-w-4xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge>L'IA pour les professionnels africains</Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60"
            >
              Maîtrisez l'IA.<br />
              Accélérez votre carrière.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-gray-400 leading-relaxed"
            >
              Formation active, veille technologique automatisée et micro-learning quotidien.
              Rejoignez la première plateforme d'IA dédiée à l'excellence opérationnelle en Afrique.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button className="h-12 rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-gray-200 transition-all">
                  Commencer gratuitement
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto mt-20 max-w-6xl"
          >
            <div className="group relative rounded-xl border border-white/10 bg-[#0A0A0F]/80 p-2 backdrop-blur-sm shadow-2xl shadow-purple-900/20">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              <div className="overflow-hidden rounded-lg border border-white/5 bg-[#0E0E12]">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-white/5 bg-[#13131A] px-4 py-3">
                   <div className="flex gap-2">
                     <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                     <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                     <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                   </div>
                   <div className="h-6 w-64 rounded-md bg-white/5"></div>
                   <div className="h-4 w-4 rounded-full bg-white/10"></div>
                </div>
                {/* Mockup Content Area (Abstract) */}
                <div className="grid grid-cols-[240px_1fr] min-h-[600px]">
                   {/* Sidebar */}
                   <div className="border-r border-white/5 bg-[#111116] p-4 space-y-4">
                      <div className="space-y-2">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-8 rounded-md bg-white/5 w-full animate-pulse" style={{animationDelay: `${i*100}ms`}}></div>
                        ))}
                      </div>
                   </div>
                   {/* Main Content */}
                   <div className="p-8 space-y-8 bg-gradient-to-br from-[#0E0E12] to-black">
                      <div className="grid grid-cols-3 gap-6">
                         <div className="h-32 rounded-xl border border-white/5 bg-white/[0.02] p-6">
                            <p className="text-sm text-gray-500">Tips Lus</p>
                            <p className="text-3xl font-bold text-white mt-2">84</p>
                            <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full w-[70%] bg-purple-500 rounded-full"></div>
                            </div>
                         </div>
                         <div className="h-32 rounded-xl border border-white/5 bg-white/[0.02] p-6">
                            <p className="text-sm text-gray-500">Conversations Ella</p>
                            <p className="text-3xl font-bold text-white mt-2">12h</p>
                            <div className="mt-4 h-10 w-full">
                               {/* Mini sparkline */}
                               <svg className="w-full h-full text-green-500/50" viewBox="0 0 100 20" preserveAspectRatio="none">
                                  <path d="M0 15 Q 20 5 40 12 T 80 8 T 100 10" stroke="currentColor" strokeWidth="2" fill="none" />
                               </svg>
                            </div>
                         </div>
                         <div className="h-32 rounded-xl border border-white/5 bg-white/[0.02] p-6">
                            <p className="text-sm text-gray-500">Niveau IA</p>
                            <p className="text-3xl font-bold text-white mt-2">Avancé</p>
                            <div className="flex gap-1 mt-4">
                               {[1,2,3,4].map(star => <div key={star} className="h-4 w-4 bg-purple-500/50 rounded-full"></div>)}
                               <div className="h-4 w-4 bg-white/10 rounded-full"></div>
                            </div>
                         </div>
                      </div>
                      {/* Big Graph Area */}
                      <div className="h-80 rounded-xl border border-white/5 bg-white/[0.01] relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="text-center space-y-4">
                                <Sparkles className="h-12 w-12 text-purple-500 mx-auto animate-pulse" />
                                <p className="text-lg font-medium text-white">Analyse de veille en cours...</p>
                                <p className="text-sm text-gray-500">Recherche de tendances pour votre secteur</p>
                             </div>
                          </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            {/* Glow under dashboard */}
            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl -z-10 rounded-[3rem] opacity-40" />
          </motion.div>
        </section>

        {/* --- LOGOS --- */}
        <section className="border-t border-white/5 bg-[#030014] py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-sm font-medium text-gray-500">Rejoignez les professionnels de</p>
            <div className="mt-10 grid grid-cols-2 gap-8 opacity-50 grayscale md:grid-cols-4 lg:grid-cols-8">
              {['Orange', 'MTN', 'Canal+', 'Ecobank', 'Wave', 'Jumia', 'Sunu', 'Baobab'].map((logo) => (
                <div key={logo} className="flex items-center justify-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="font-bold">{logo}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- BENTO GRID FEATURES --- */}
        <section id="features" className="py-32 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Votre boîte à outils complète<br />
                pour dompter l'IA.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
              {/* Card 1: Coach Ella (Small) */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E12] p-8 transition-colors hover:border-purple-500/50 md:row-span-2"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/10" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-8 h-48 rounded-xl border border-white/5 bg-black/40 p-4 flex flex-col justify-end space-y-3">
                     <div className="self-end max-w-[80%] rounded-2xl rounded-tr-sm bg-purple-600 p-3 text-xs text-white">
                       Comment puis-je automatiser mes rapports ?
                     </div>
                     <div className="self-start max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 p-3 text-xs text-gray-300">
                       Je peux t'aider à configurer un agent de veille qui scannera le web pour toi...
                     </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Coach Ella</h3>
                  <p className="mt-2 text-sm text-gray-400">Une assistante IA disponible 24/7 pour vous guider, corriger vos prompts et structurer votre pensée.</p>
                </div>
              </motion.div>

              {/* Card 2: Veille Stratégique (Wide) */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E12] p-8 transition-colors hover:border-purple-500/50 md:col-span-2"
              >
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
                <div className="relative z-10">
                   <div className="flex justify-between items-start">
                      <div>
                        <Badge>Automatisé</Badge>
                        <h3 className="mt-4 text-2xl font-semibold text-white">Veille Stratégique</h3>
                        <p className="mt-2 max-w-md text-sm text-gray-400">Recevez chaque matin l'essentiel de l'actualité IA pour votre métier, sans bruit.</p>
                      </div>
                      <div className="hidden md:block">
                         <Newspaper className="h-32 w-32 text-purple-500/20" />
                      </div>
                   </div>
                   <div className="mt-8 h-40 rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm p-4 relative overflow-hidden flex gap-4 items-center">
                      <div className="h-24 w-20 rounded-lg bg-white/5 animate-pulse"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 rounded-full bg-white/10"></div>
                        <div className="h-3 w-full rounded-full bg-white/5"></div>
                        <div className="h-3 w-1/2 rounded-full bg-white/5"></div>
                      </div>
                   </div>
                </div>
              </motion.div>

              {/* Card 3: Communauté (Medium) */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E12] p-8 transition-colors hover:border-purple-500/50 md:col-span-1"
              >
                <h3 className="text-4xl font-bold text-white">+500</h3>
                <span className="inline-flex items-center text-sm text-green-400">
                  Membres actifs
                </span>
                <div className="mt-8 flex -space-x-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-12 w-12 rounded-full border-2 border-[#0E0E12] bg-gradient-to-br from-gray-700 to-gray-600"></div>
                   ))}
                </div>
                <h3 className="mt-6 text-lg font-semibold">Communauté</h3>
                <p className="mt-1 text-sm text-gray-400">Échangez avec l'élite tech africaine.</p>
              </motion.div>

              {/* Card 4: Micro-learning (Medium) */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E12] p-8 transition-colors hover:border-purple-500/50 md:col-span-1"
              >
                <div className="flex h-full flex-col justify-between">
                   <div className="flex items-center justify-center py-8">
                      {/* Abstract 3D Icon */}
                      <div className="relative h-24 w-24">
                         <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full" />
                         <div className="relative h-full w-full border-2 border-purple-400/50 bg-purple-900/20 backdrop-blur-md rounded-xl rotate-45 flex items-center justify-center transform transition-transform group-hover:rotate-90">
                            <Zap className="h-10 w-10 text-white" />
                         </div>
                      </div>
                   </div>
                   <div>
                      <h3 className="text-lg font-semibold">Tips Quotidiens</h3>
                      <p className="mt-1 text-sm text-gray-400">Micro-learning pour progresser chaque jour.</p>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FEATURES LIST (Elevate your SEO) --- */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-7xl rounded-[3rem] border border-white/10 bg-[#0A0A0F] p-10 md:p-20 overflow-hidden relative">
             <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none" />
             
             <div className="grid gap-16 lg:grid-cols-2">
                <div>
                   <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-8">
                      Une plateforme,<br />
                      des possibilités infinies.
                   </h2>
                   
                   <div className="grid gap-y-8 gap-x-12 sm:grid-cols-2">
                      {[
                        { title: 'Formation Active', icon: GraduationCap, desc: 'Apprenez en faisant avec des cas réels.' },
                        { title: 'Veille Sectorielle', icon: Newspaper, desc: 'Restez à jour sur votre industrie.' },
                        { title: 'Prompt Engineering', icon: MessageSquare, desc: 'Bibliothèque de prompts optimisés.' },
                        { title: 'Networking', icon: Users, desc: 'Connectez-vous aux experts locaux.' },
                        { title: 'Outils Validés', icon: CheckCircle2, desc: 'Sélection des meilleurs outils IA.' },
                        { title: 'Support 24/7', icon: Bell, desc: 'Coach Ella toujours disponible.' },
                      ].map((feature, i) => (
                         <div key={i} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-purple-400">
                               <feature.icon className="h-4 w-4" />
                               <span className="font-semibold text-white">{feature.title}</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                         </div>
                      ))}
                   </div>
                </div>
                
                {/* Right Side Visual */}
                <div className="relative hidden lg:block">
                    <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 to-transparent rounded-2xl" />
                    <div className="h-full w-full rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 flex items-center justify-center">
                       <div className="grid grid-cols-2 gap-4 w-full max-w-sm opacity-80">
                          <div className="h-32 rounded-lg bg-white/5 border border-white/5 animate-pulse"></div>
                          <div className="h-32 rounded-lg bg-white/5 border border-white/5"></div>
                          <div className="h-32 rounded-lg bg-white/5 border border-white/5"></div>
                          <div className="h-32 rounded-lg bg-white/5 border border-white/5 animate-pulse delay-100"></div>
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section id="community" className="py-32 px-6 text-center relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10" />
           
           <h2 className="text-4xl font-bold mb-4">La voix de nos membres</h2>
           <p className="text-gray-400 mb-16">Découvrez comment Inside AI transforme les carrières en Afrique.</p>

           <div className="mx-auto max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-3xl border border-white/10 bg-[#0A0A0F]/80 p-12 backdrop-blur-md"
              >
                 <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-lg -z-10 opacity-50" />
                 
                 <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 bg-gray-800">
                       <div className="h-full w-full bg-gradient-to-br from-purple-400 to-pink-400" />
                    </div>
                    <div className="text-left">
                       <p className="text-2xl font-medium leading-relaxed text-white">
                         "Inside AI m'a permis de comprendre concrètement comment intégrer l'IA dans mes processus marketing. C'est une révolution pour mon agence."
                       </p>
                       <div className="mt-6">
                          <p className="font-bold text-white">Fatou Diop</p>
                          <p className="text-sm text-purple-400">Marketing Manager @ Dakar Digital</p>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* --- PRICING --- */}
        <section id="pricing" className="py-32 px-6">
           <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-4xl font-bold mb-4">Tarifs simples</h2>
              <p className="text-gray-400 mb-8">Investissez dans votre avenir professionnel.</p>

              <div className="mb-16 flex items-center justify-center gap-4">
                 <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Mensuel</span>
                 <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                 <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>Annuel (-20%)</span>
              </div>

              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                 {/* Free Plan */}
                 <div className="rounded-3xl border border-white/10 bg-[#0E0E12] p-8 text-left flex flex-col">
                    <div className="mb-8">
                       <h3 className="text-xl font-bold text-white">Découverte</h3>
                       <p className="text-3xl font-bold mt-4 text-white">Gratuit</p>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-400">
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Accès limité à Coach Ella</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> 3 Recommandations / mois</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Accès communauté (lecture)</li>
                    </ul>
                    <Button className="w-full rounded-full border border-white/10 bg-transparent text-white hover:bg-white/5 py-6">
                       Commencer
                    </Button>
                 </div>

                 {/* Pro Plan (Popular) */}
                 <div className="relative rounded-3xl border border-purple-500/50 bg-[#13131A] p-8 text-left flex flex-col shadow-2xl shadow-purple-900/20 scale-105 z-10">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                       <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAIRE</span>
                    </div>
                    <div className="mb-8">
                       <h3 className="text-xl font-bold text-white">Pro</h3>
                       <p className="text-3xl font-bold mt-4 text-white">15,000<span className="text-sm font-normal text-gray-400"> FCFA/mo</span></p>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Coach Ella Illimité</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Veille IA personnalisée</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Tips quotidiens avancés</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Support prioritaire</li>
                    </ul>
                    <Button className="w-full rounded-full bg-purple-600 text-white hover:bg-purple-700 py-6 shadow-lg shadow-purple-500/25">
                       Devenir Pro
                    </Button>
                 </div>

                 {/* Enterprise Plan */}
                 <div className="rounded-3xl border border-white/10 bg-[#0E0E12] p-8 text-left flex flex-col">
                    <div className="mb-8">
                       <h3 className="text-xl font-bold text-white">Entreprise</h3>
                       <p className="text-3xl font-bold mt-4 text-white">Sur devis</p>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-400">
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Tout du plan Pro</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Comptes multiples</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Formation équipe</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Manager dédié</li>
                    </ul>
                    <Button className="w-full rounded-full border border-white/10 bg-transparent text-white hover:bg-white/5 py-6">
                       Contacter l'équipe
                    </Button>
                 </div>
              </div>
           </div>
        </section>

        {/* --- CTA FOOTER --- */}
        <section className="py-20 px-6">
           <div className="mx-auto max-w-5xl relative overflow-hidden rounded-[3rem] bg-gradient-to-b from-[#1A1A24] to-black border border-white/10 p-16 md:p-24 text-center">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-500/10 blur-[100px] pointer-events-none" />

              <h2 className="relative z-10 text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                 Ne ratez pas la<br />révolution IA.
              </h2>

              <div className="relative z-10 mx-auto max-w-md flex flex-col sm:flex-row gap-4">
                 <input 
                   type="email" 
                   placeholder="Votre email professionnel" 
                   className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                 />
                 <Button className="rounded-full bg-white px-8 py-6 text-black font-semibold hover:bg-gray-200">
                    Rejoindre
                 </Button>
              </div>
              <div className="relative z-10 mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                 <span>Pas de carte requise</span>
                 <span>•</span>
                 <span>Essai gratuit disponible</span>
              </div>
           </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 bg-black py-20 px-6">
           <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                 <div className="flex items-center mb-6">
                    <span className="text-4xl tracking-tighter text-white" style={{ fontFamily: 'var(--font-blaka)' }}>inside.ai</span>
                 </div>
                 <p className="text-gray-400 text-sm mb-6 max-w-xs">
                   La première plateforme d'intelligence artificielle conçue pour les professionnels africains.
                 </p>
                 <div className="flex gap-4">
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="h-5 w-5" /></Link>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <h4 className="font-bold text-white">Produit</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="#" className="hover:text-white">Coach Ella</Link></li>
                    <li><Link href="#" className="hover:text-white">Veille IA</Link></li>
                    <li><Link href="#" className="hover:text-white">Tarifs</Link></li>
                    <li><Link href="#" className="hover:text-white">Communauté</Link></li>
                 </ul>
              </div>

              <div className="space-y-4">
                 <h4 className="font-bold text-white">Ressources</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="#" className="hover:text-white">Blog</Link></li>
                    <li><Link href="#" className="hover:text-white">Guide IA</Link></li>
                    <li><Link href="#" className="hover:text-white">Webinaires</Link></li>
                    <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                 </ul>
              </div>

              <div className="space-y-4">
                 <h4 className="font-bold text-white">Légal</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="#" className="hover:text-white">Confidentialité</Link></li>
                    <li><Link href="#" className="hover:text-white">CGU</Link></li>
                    <li><Link href="#" className="hover:text-white">Mentions légales</Link></li>
                 </ul>
              </div>
           </div>
           <div className="mx-auto mt-20 max-w-7xl border-t border-white/5 pt-8 text-center text-xs text-gray-600">
              © 2024 Inside AI. Fait avec ❤️ pour l'Afrique.
           </div>
        </footer>

      </main>
    </div>
  )
}
