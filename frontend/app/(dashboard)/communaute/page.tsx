'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Hash,
  Search,
  Bell,
  Sparkles,
  Send,
  Loader2,
  MoreHorizontal,
  Paperclip,
  X,
  FileIcon,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Attachment {
  url: string
  name: string
  type: string
}

interface CommunityMessage {
  id: string
  channel_id: string
  content: string
  created_at: string
  user_id: string
  user_full_name?: string
  user_avatar_url?: string
  user_job_title?: string
  attachments?: Attachment[]
}

const CHANNELS = [
  { id: 'general', name: 'Général', icon: Hash },
  { id: 'annonces', name: 'Annonces', icon: Bell },
  { id: 'outils', name: 'Outils IA', icon: Sparkles },
  { id: 'support', name: 'Entraide', icon: Users },
]

export default function CommunautePage() {
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [activeChannel, setActiveChannel] = useState('general')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const currentUserRef = useRef<any>(null) // Ref pour accès dans useEffect
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Auth & Realtime Setup
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      currentUserRef.current = user // Mise à jour de la ref
    }
    getUser()

    // Subscribe to Realtime changes
    const channel = supabase
      .channel('community_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `channel_id=eq.${activeChannel}`
        },
        async (payload) => {
          // Stratégie anti-doublon robuste :
          // Si c'est notre message, on vérifie si on l'a déjà ajouté récemment (via optimistic UI)
          // On utilise currentUserRef.current pour avoir la valeur à jour sans dépendance
          if (payload.new.user_id === currentUserRef.current?.id) {
             // On cherche un message identique ajouté dans les 5 dernières secondes
             const potentialDuplicate = messages.find(m => 
                 m.content === payload.new.content && 
                 m.user_id === currentUserRef.current.id &&
                 // On compare les dates si elles existent, sinon on assume que c'est le doublon
                 (new Date(payload.new.created_at).getTime() - new Date(m.created_at).getTime() < 5000)
             );
             
             // Si on trouve un doublon potentiel (même contenu, même user, temps proche), on ignore l'événement realtime
             // SAUF si c'est un autre onglet (mais pour l'instant on simplifie)
             // Amélioration : vérifier si on a déjà cet ID exact (peu probable avec optimistic ID)
             
             // Pour être sûr : on ignore simplement TOUS les messages realtime venant de nous-même pour l'instant
             // car on suppose que l'optimistic UI a marché.
             // C'est la stratégie la plus safe pour éviter les doublons visuels immédiats.
             return; 
          }

          const { data } = await supabase
            .from('community_messages_with_users')
            .select('*')
            .eq('id', payload.new.id)
            .single()
            
          if (data) {
            setMessages((prev) => {
                if (prev.find(m => m.id === data.id)) return prev
                return [...prev, data]
            })
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeChannel])

  // 2. Fetch Messages on Channel Change
  useEffect(() => {
    fetchMessages()
  }, [activeChannel])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loadingMessages])

  const fetchMessages = async () => {
    setLoadingMessages(true)
    try {
      const response = await fetch(`/api/communaute/messages?channel=${activeChannel}`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (data.error) throw new Error(data.error)

      setAttachments(prev => [...prev, { url: data.url, name: data.name, type: data.type }])
      toast.success("Fichier ajouté")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Erreur lors de l'upload")
    } finally {
      setIsUploading(false)
      // Reset input to allow selecting same file again
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if ((!newMessage.trim() && attachments.length === 0) || loading || isUploading) return

    const textToSend = newMessage
    const attachmentsToSend = [...attachments]
    
    // Clear UI immediately
    setNewMessage('')
    setAttachments([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    
    // Optimistic Update
    const optimisticMsg: CommunityMessage = {
        id: Date.now().toString(),
        channel_id: activeChannel,
        content: textToSend,
        created_at: new Date().toISOString(),
        user_id: currentUser?.id || 'temp',
        user_full_name: currentUser?.user_metadata?.full_name || 'Moi',
        user_avatar_url: currentUser?.user_metadata?.avatar_url,
        user_job_title: currentUser?.user_metadata?.job_title,
        attachments: attachmentsToSend
    }
    setMessages(prev => [...prev, optimisticMsg])
    
    setLoading(true)

    try {
      await fetch('/api/communaute/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            content: textToSend,
            channelId: activeChannel,
            attachments: attachmentsToSend
        }),
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error("Erreur d'envoi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#05050A] rounded-tl-3xl">
      
      {/* Left Sidebar - Channels */}
      <div className="w-64 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0A0A0F] pt-6">
        <div className="px-6 mb-8">
          <h2 className="font-title text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
            Inside<span className="text-white/50">Community</span>
          </h2>
        </div>
        
        <div className="flex-1 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-bold text-muted-foreground/50 uppercase tracking-wider flex items-center justify-between">
             Salons textuels
             <PlusIcon />
          </div>
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                activeChannel === channel.id 
                  ? "bg-white/10 text-white" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-gray-200"
              )}
            >
              <channel.icon className={cn("h-4 w-4", activeChannel === channel.id ? "text-[hsl(var(--primary))]" : "opacity-50 group-hover:opacity-100")} />
              {channel.name}
              {activeChannel === channel.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-white/5 bg-[#0F0F13]">
           <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-white/10">
                <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-[hsl(var(--primary))/0.1] text-[hsl(var(--primary))] text-xs">
                    {currentUser?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-white truncate">{currentUser?.user_metadata?.full_name || 'Utilisateur'}</p>
                 <p className="text-[10px] text-muted-foreground truncate">En ligne</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#05050A] relative">
        
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#05050A]/95 backdrop-blur-xl sticky top-0 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
             <Hash className="h-5 w-5 text-muted-foreground" />
             <div>
                <h3 className="font-bold text-white">{CHANNELS.find(c => c.id === activeChannel)?.name}</h3>
                <p className="text-xs text-muted-foreground">Discussion générale sur l'IA</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2 items-center">
                {[1,2,3].map(i => (
                   <div key={i} className="h-7 w-7 rounded-full border-2 border-[#05050A] bg-gray-800" />
                ))}
                <span className="text-xs text-muted-foreground ml-3">24 en ligne</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10" />
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                <Search className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
           {loadingMessages ? (
              <div className="flex flex-col gap-4 mt-10">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse opacity-50">
                       <div className="h-10 w-10 rounded-full bg-white/10" />
                       <div className="space-y-2 flex-1">
                          <div className="h-4 w-32 rounded bg-white/10" />
                          <div className="h-4 w-full max-w-md rounded bg-white/10" />
                       </div>
                    </div>
                 ))}
              </div>
           ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                 <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4 rotate-3">
                    <Hash className="h-10 w-10 text-muted-foreground" />
                 </div>
                 <h3 className="text-xl font-medium text-white">C'est le début !</h3>
                 <p className="text-muted-foreground mt-2">Soyez le premier à lancer la discussion dans ce salon.</p>
              </div>
           ) : (
              messages.map((msg, idx) => {
                  const isMe = msg.user_id === currentUser?.id;
                  const showHeader = idx === 0 || messages[idx - 1].user_id !== msg.user_id || (new Date(msg.created_at).getTime() - new Date(messages[idx - 1].created_at).getTime() > 60000 * 5);
                  
                  return (
                    <motion.div
                        key={msg.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("group flex gap-4", showHeader ? "mt-6" : "mt-1")}
                    >
                        {showHeader ? (
                             <Avatar className="h-10 w-10 border border-white/10 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                                <AvatarImage src={msg.user_avatar_url} />
                                <AvatarFallback className="bg-[hsl(var(--primary))/0.1] text-[hsl(var(--primary))] font-bold">
                                    {msg.user_full_name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-10" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                           {showHeader && (
                               <div className="flex items-baseline gap-2 mb-1">
                                  <span className={cn("font-semibold hover:underline cursor-pointer", isMe ? "text-[hsl(var(--primary))]" : "text-white")}>
                                     {msg.user_full_name || 'Utilisateur'}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                     {format(new Date(msg.created_at), 'HH:mm', { locale: fr })}
                                  </span>
                                  {msg.user_job_title && (
                                     <Badge variant="secondary" className="h-4 px-1 bg-white/5 text-[9px] text-muted-foreground border-0 hover:bg-white/10">
                                        {msg.user_job_title}
                                     </Badge>
                                  )}
                               </div>
                           )}
                           
                           {msg.content && (
                               <p className={cn(
                                   "text-[15px] leading-relaxed text-gray-300 whitespace-pre-wrap break-words",
                                   !showHeader && "hover:bg-white/[0.02] -ml-2 pl-2 rounded py-0.5 transition-colors" 
                               )}>
                                  {msg.content}
                               </p>
                           )}

                           {/* Attachments Display */}
                           {msg.attachments && msg.attachments.length > 0 && (
                               <div className="flex flex-wrap gap-2 mt-2">
                                   {msg.attachments.map((att, i) => (
                                       att.type.startsWith('image/') ? (
                                           <div key={i} className="relative group/img overflow-hidden rounded-xl border border-white/10 max-w-sm">
                                               <img src={att.url} alt="attachment" className="max-h-60 object-cover" />
                                               <a 
                                                 href={att.url} 
                                                 target="_blank" 
                                                 rel="noopener noreferrer"
                                                 className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                                               >
                                                   <Download className="h-6 w-6 text-white" />
                                               </a>
                                           </div>
                                       ) : (
                                           <a 
                                             key={i} 
                                             href={att.url} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors max-w-xs"
                                           >
                                               <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                   <FileIcon className="h-5 w-5" />
                                               </div>
                                               <div className="flex-1 min-w-0">
                                                   <p className="text-sm font-medium text-white truncate">{att.name || 'Fichier'}</p>
                                                   <p className="text-[10px] text-muted-foreground">Document</p>
                                               </div>
                                           </a>
                                       )
                                   ))}
                               </div>
                           )}
                        </div>
                    </motion.div>
                  )
              })
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Sticky Bottom */}
        <div className="p-4 bg-[#05050A] border-t border-white/5 shrink-0">
           
           {/* Attachments Preview */}
           {attachments.length > 0 && (
               <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                   {attachments.map((att, i) => (
                       <div key={i} className="relative shrink-0 h-16 w-16 rounded-lg border border-white/10 overflow-hidden group">
                           {att.type.startsWith('image/') ? (
                               <img src={att.url} alt="preview" className="h-full w-full object-cover" />
                           ) : (
                               <div className="h-full w-full bg-white/5 flex items-center justify-center">
                                   <FileIcon className="h-6 w-6 text-muted-foreground" />
                               </div>
                           )}
                           <button 
                             onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                             className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                               <X className="h-3 w-3" />
                           </button>
                       </div>
                   ))}
               </div>
           )}

           <div className="relative bg-[#0A0A0F] rounded-xl border border-white/10 focus-within:border-white/20 transition-colors p-3">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Envoyer un message dans #${CHANNELS.find(c => c.id === activeChannel)?.name}...`}
                className="min-h-[20px] max-h-[200px] w-full resize-none border-0 bg-transparent p-0 text-white placeholder:text-muted-foreground/50 focus-visible:ring-0 text-base custom-scrollbar"
                rows={1}
              />
              <div className="flex justify-between items-center mt-2 pt-2">
                 <div className="flex gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx" 
                    />
                    <Button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-white hover:bg-white/5"
                    >
                       {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-white hover:bg-white/5">
                       <Sparkles className="h-4 w-4" />
                    </Button>
                 </div>
                 <Button 
                    onClick={() => handleSendMessage()} 
                    disabled={loading || isUploading || (!newMessage.trim() && attachments.length === 0)}
                    size="sm"
                    className={cn(
                        "h-8 px-4 rounded-lg transition-all font-medium",
                        (newMessage.trim() || attachments.length > 0) ? "bg-white text-black hover:bg-white/90" : "bg-white/5 text-muted-foreground"
                    )}
                 >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Envoyer"}
                 </Button>
              </div>
           </div>
           <div className="text-center mt-2">
               <p className="text-[10px] text-muted-foreground">
                   **Astuce :** Tapez <span className="font-mono bg-white/10 px-1 rounded text-white">/</span> pour les commandes IA.
               </p>
           </div>
        </div>
      </div>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className || "h-3 w-3"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    )
}
