'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Loader2, Save, User, Phone, Mail, Briefcase, FileText, 
  Shield, LogOut, CreditCard, Lock, History, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Types
type SettingsTab = 'profile' | 'security' | 'billing'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // Form states
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      setEmail(user.email || '')

      const { data, error } = await supabase
        .from('users')
        .select('full_name, phone, job_title, bio, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) {
        setFullName(data.full_name || user.user_metadata.full_name || '')
        setPhone(data.phone || user.user_metadata.phone || '')
        setJobTitle(data.job_title || '')
        setBio(data.bio || '')
      } else {
        setFullName(user.user_metadata.full_name || '')
        setPhone(user.user_metadata.phone || '')
      }
    } catch (error) {
      console.error('Error loading user data', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        full_name: fullName,
        phone,
        job_title: jobTitle,
        bio,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('users').upsert(updates)
      if (error) throw error
      
      await supabase.auth.updateUser({
        data: { full_name: fullName, phone: phone }
      })

      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  async function confirmSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profil Public', icon: User, desc: 'Gérez vos informations personnelles' },
    { id: 'security', label: 'Sécurité', icon: Shield, desc: 'Mot de passe et authentification' },
    { id: 'billing', label: 'Abonnement', icon: CreditCard, desc: 'Factures et plans' },
  ]

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-20 px-4 md:px-8 pt-8">
        
        {/* Header Global */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez votre compte et vos préférences Inside AI.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
           
           {/* Sidebar Navigation */}
           <div className="lg:w-64 shrink-0 space-y-8">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative overflow-hidden",
                      activeTab === tab.id 
                        ? "bg-white/10 text-white shadow-lg shadow-black/20" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                     {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute left-0 top-0 w-[2px] h-full bg-[hsl(var(--primary))]" 
                        />
                     )}
                     <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[hsl(var(--primary))]" : "opacity-70")} />
                     {tab.label}
                  </button>
                ))}
              </nav>

              <div className="pt-8 border-t border-white/10">
                 <div className="px-4 mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Compte</p>
                 </div>
                 <button 
                   onClick={() => setShowLogoutModal(true)}
                   className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                 >
                    <LogOut className="h-4 w-4" /> Déconnexion
                 </button>
              </div>
           </div>

           {/* Main Content Area */}
           <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                
                {/* PROFIL TAB */}
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                     <div className="rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                           <div className="relative group">
                              <Avatar className="h-24 w-24 border-4 border-[#0A0A0F] shadow-2xl">
                                 <AvatarImage src={user?.user_metadata?.avatar_url} />
                                 <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-purple-600 text-2xl font-bold text-white">
                                   {fullName?.[0]?.toUpperCase() || 'U'}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-0 right-0 bg-[#1C1C21] border border-white/10 p-1.5 rounded-full text-white shadow-lg cursor-pointer hover:bg-white/20 transition-colors">
                                 <User className="h-4 w-4" />
                              </div>
                           </div>
                           <div className="flex-1">
                              <h2 className="text-xl font-bold text-white mb-1">Photo de profil</h2>
                              <p className="text-sm text-muted-foreground mb-4">Cette image sera visible par les autres membres de la communauté.</p>
                              <div className="flex gap-3">
                                 <Button variant="outline" size="sm" className="rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-white">Changer</Button>
                                 <Button variant="ghost" size="sm" className="rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300">Supprimer</Button>
                              </div>
                           </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                               <Input 
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className="bg-[#13131A] border-white/5 h-12 rounded-xl focus:border-[hsl(var(--primary))/0.5]" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Poste / Rôle</label>
                               <Input 
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  placeholder="ex: Product Designer"
                                  className="bg-[#13131A] border-white/5 h-12 rounded-xl focus:border-[hsl(var(--primary))/0.5]" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Email</label>
                               <Input 
                                  value={email}
                                  disabled
                                  className="bg-[#13131A] border-white/5 h-12 rounded-xl opacity-50 cursor-not-allowed" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                               <Input 
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="bg-[#13131A] border-white/5 h-12 rounded-xl focus:border-[hsl(var(--primary))/0.5]" 
                               />
                            </div>
                            <div className="col-span-2 space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Bio</label>
                               <Textarea 
                                  value={bio}
                                  onChange={(e) => setBio(e.target.value)}
                                  placeholder="Quelques mots à propos de vous..."
                                  className="bg-[#13131A] border-white/5 min-h-[100px] rounded-xl focus:border-[hsl(var(--primary))/0.5] resize-none" 
                               />
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-white/5 flex justify-end">
                            <Button 
                               onClick={updateProfile} 
                               disabled={saving}
                               className="bg-white text-black hover:bg-gray-200 rounded-xl px-8"
                            >
                               {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                               Enregistrer les modifications
                            </Button>
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                  <motion.div 
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                     <div className="rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                           <Lock className="h-5 w-5 text-[hsl(var(--primary))]" /> Mot de passe
                        </h2>
                        
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Ancien mot de passe</label>
                               <Input type="password" placeholder="••••••••" className="bg-[#13131A] border-white/5 h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-muted-foreground">Nouveau mot de passe</label>
                               <Input type="password" placeholder="••••••••" className="bg-[#13131A] border-white/5 h-12 rounded-xl" />
                            </div>
                            <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl mt-2">
                               Mettre à jour
                            </Button>
                        </div>
                     </div>

                     <div className="rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                           <History className="h-5 w-5 text-blue-400" /> Activité récente
                        </h2>
                        <div className="space-y-4">
                           {[1,2].map(i => (
                              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                 <div>
                                    <p className="text-sm font-medium text-white">Connexion depuis Windows 10</p>
                                    <p className="text-xs text-muted-foreground">Il y a 2 heures • Paris, Sénégal</p>
                                 </div>
                                 <Badge variant="outline" className="text-green-400 border-green-500/20 bg-green-500/10">Actif</Badge>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* BILLING TAB */}
                {activeTab === 'billing' && (
                  <motion.div 
                    key="billing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                     {/* Current Plan */}
                     <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0A0A0F] to-[#13131A] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-[hsl(var(--primary))/0.1] blur-3xl rounded-full" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <h2 className="text-2xl font-bold text-white">Plan Gratuit</h2>
                                 <Badge className="bg-white/10 hover:bg-white/10 text-white border-0">Actuel</Badge>
                              </div>
                              <p className="text-muted-foreground max-w-md">
                                 Vous profitez de l'accès standard à Coach Ella et à la communauté.
                              </p>
                           </div>
                           <Button className="bg-[hsl(var(--primary))] text-black hover:bg-[hsl(var(--primary))/0.9] rounded-xl h-12 px-6 font-semibold shadow-lg shadow-[hsl(var(--primary))/0.2]">
                              Passer à Premium 🚀
                           </Button>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                           {['Chat illimité avec Ella', 'Accès complet aux formations', 'Support prioritaire'].map((feature, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                 <CheckCircle2 className="h-4 w-4 text-[hsl(var(--primary))]" />
                                 {feature}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Payment Method */}
                     <div className="rounded-[2rem] border border-white/10 bg-[#0A0A0F] p-8">
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-xl font-bold text-white">Moyen de paiement</h2>
                           <Button variant="ghost" size="sm" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/0.1]">
                              Ajouter
                           </Button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                           <CreditCard className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                           <p className="text-sm text-muted-foreground">Aucune carte enregistrée</p>
                        </div>
                     </div>
                  </motion.div>
                )}

              </AnimatePresence>
           </div>
        </div>

        {/* LOGOUT MODAL */}
        <AnimatePresence>
          {showLogoutModal && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                {/* Modal */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md bg-[#13131A] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
                >
                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-red-500/10 blur-3xl rounded-full" />

                   <div className="relative z-10 text-center">
                      <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                         <AlertTriangle className="h-8 w-8 text-red-500" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">Déjà parti ? 😢</h3>
                      <p className="text-muted-foreground mb-8">
                         Il se passe plein de choses sur Inside AI en ce moment ! En vous déconnectant, vous risquez de manquer les dernières notifications de la communauté.
                      </p>

                      <div className="space-y-3">
                         <Button 
                           onClick={() => setShowLogoutModal(false)} 
                           className="w-full h-12 rounded-xl bg-white text-black hover:bg-gray-200 font-bold"
                         >
                            Rester connecté
                         </Button>
                         <Button 
                           onClick={confirmSignOut} 
                           variant="ghost"
                           className="w-full h-12 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white"
                         >
                            Me déconnecter quand même
                         </Button>
                      </div>
                   </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
