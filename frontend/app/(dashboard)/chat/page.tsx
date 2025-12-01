'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Bot, User, ChevronDown, Paperclip, MessageSquare, Plus, Loader2, X, FileIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Message, Conversation } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Attachment {
    url: string
    name: string
    type: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(true)
  
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // 1. Initial Load: Conversations & URL Params
  useEffect(() => {
    fetchConversations()
    
    const urlThreadId = searchParams.get('threadId')
    if (urlThreadId) {
      setThreadId(urlThreadId)
      loadHistory(urlThreadId)
    }

    // Check for initial question from Dashboard
    const initialQuestion = searchParams.get('q')
    if (initialQuestion && !urlThreadId) {
       setTimeout(() => setInput(initialQuestion), 100)
    }
  }, []) // Run once on mount

  // 2. Fetch Conversations List
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations')
      const data = await res.json()
      if (data.conversations) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Failed to load conversations', error)
    }
  }

  // 3. Load History
  const loadHistory = async (tid: string) => {
    setLoadingHistory(true)
    setMessages([]) // Clear current view
    try {
      const res = await fetch(`/api/chat/history?threadId=${tid}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to load history', error)
      toast.error("Impossible de charger l'historique")
    } finally {
      setLoadingHistory(false)
    }
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        
        setAttachments(prev => [...prev, { url: data.url, name: data.name, type: data.type }])
        toast.success("Fichier ajouté")
    } catch (error) {
        console.error('Upload error:', error)
        toast.error("Erreur lors de l'upload")
    } finally {
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input
    // Allow sending if there are attachments even if text is empty
    if ((!textToSend.trim() && attachments.length === 0) || loading || isUploading) return

    const attachmentsToSend = [...attachments]

    // Optimistic UI Update
    const optimisticMsg: Message = {
      id: Date.now().toString(),
      conversation_id: threadId || 'temp',
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
      // @ts-ignore
      attachments: attachmentsToSend
    }
    setMessages((prev) => [...prev, optimisticMsg])
    
    setInput('')
    setAttachments([])
    setLoading(true)
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: textToSend,
            threadId: threadId, // Send current threadId if exists
            attachments: attachmentsToSend
        }),
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      // If new thread created, update state & URL
      if (data.threadId && data.threadId !== threadId) {
        setThreadId(data.threadId)
        router.push(`/chat?threadId=${data.threadId}`, { scroll: false })
        fetchConversations() // Refresh sidebar to show new chat
      }

      // Add assistant response
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: data.conversationId || 'temp',
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (error) {
      console.error('Error:', error)
      toast.error("Erreur de communication avec l'assistant")
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setThreadId(null)
    setInput('')
    setAttachments([])
    router.push('/chat') // Clear URL params
    toast.success("Nouvelle conversation")
  }

  const handleSelectConversation = (conv: Conversation) => {
    if (conv.thread_id === threadId) return
    setThreadId(conv.thread_id)
    router.push(`/chat?threadId=${conv.thread_id}`)
    loadHistory(conv.thread_id)
    // On mobile, close sidebar after selection could be nice
  }

  const suggestions = [
    { label: 'Audit Support', prompt: 'Analyse mes derniers tickets support et détecte les points de friction majeurs.', icon: '🔍' },
    { label: 'Rédaction', prompt: 'Rédige une réponse pour un client mécontent de la livraison.', icon: '✍️' },
    { label: 'Stratégie', prompt: 'Quels sont les 3 meilleurs cas d\'usage de l\'IA pour réduire mon temps de réponse ?', icon: '🚀' },
  ]

  return (
    <div className="flex h-full w-full bg-[#05050A] text-white overflow-hidden relative selection:bg-[hsl(var(--primary))/0.3]">
      
      {/* Sidebar Historique */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: showHistory ? 280 : 0, opacity: showHistory ? 1 : 0 }}
        className="hidden md:flex flex-col border-r border-white/5 bg-[#0A0A0F] h-full overflow-hidden shrink-0"
      >
          <div className="p-4 flex items-center justify-between border-b border-white/5">
             <span className="text-sm font-bold text-white">Vos discussions</span>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => setShowHistory(false)}>
                 <ChevronDown className="h-4 w-4 rotate-90" />
             </Button>
          </div>
          
          <div className="p-3">
             <Button onClick={handleNewChat} variant="outline" className="w-full justify-start gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Plus className="h-4 w-4" />
                Nouvelle conversation
             </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
              {conversations.length === 0 ? (
                  <p className="text-xs text-center text-muted-foreground py-4">Aucune conversation</p>
              ) : (
                  conversations.map((conv) => (
                      <Button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-sm font-normal truncate px-3 py-6",
                            conv.thread_id === threadId ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                         <MessageSquare className="mr-3 h-4 w-4 shrink-0 opacity-70" />
                         <div className="flex flex-col items-start overflow-hidden">
                            <span className="truncate w-full">{conv.title || 'Nouvelle discussion'}</span>
                            <span className="text-[10px] text-muted-foreground/60">
                                {format(new Date(conv.created_at), 'dd MMM', { locale: fr })}
                            </span>
                         </div>
                      </Button>
                  ))
              )}
          </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
          
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-3 z-10 bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              {!showHistory && (
                  <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)} className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-white">
                      <MessageSquare className="h-4 w-4" />
                  </Button>
              )}
              <div className="relative">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))/0.2] to-indigo-500/20 text-[hsl(var(--primary))] border border-[hsl(var(--primary))/0.2] shadow-lg shadow-[hsl(var(--primary))/0.1]">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#05050A]" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white flex items-center gap-2">
                  Coach Ella
                  <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px] text-muted-foreground font-normal border border-white/5">Beta</span>
                </h1>
                <p className="text-[10px] text-muted-foreground">Toujours en ligne</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={handleNewChat} className="hidden sm:flex h-8 text-xs text-muted-foreground hover:text-white">
                  <Plus className="mr-1 h-3 w-3" /> Nouveau
               </Button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent w-full">
            <div className="w-full max-w-4xl mx-auto min-h-full flex flex-col px-4 pb-32 pt-6">
                
                {loadingHistory ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                    {messages.length === 0 && !loading ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col items-center justify-center text-center my-auto"
                        >
                            <div className="mb-6 relative group cursor-default">
                                <div className="absolute inset-0 bg-[hsl(var(--primary))/0.2] blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative h-24 w-24 bg-gradient-to-b from-[#1a1a24] to-[#05050A] rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                    <Bot className="h-10 w-10 text-[hsl(var(--primary))]" />
                                </div>
                            </div>
                            
                            <h2 className="font-title text-2xl md:text-3xl font-medium tracking-tight mb-8 text-white">
                              Comment puis-je vous aider ?
                            </h2>
                            
                            <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                                {suggestions.map((s, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                        onClick={() => handleSend(s.prompt)}
                                        className="group flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[hsl(var(--primary))/0.3] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                    >
                                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{s.icon}</span>
                                        <div>
                                            <p className="text-xs font-medium text-white mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">{s.label}</p>
                                            <p className="text-[10px] text-muted-foreground opacity-0 h-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">{s.prompt}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-6 w-full">
                            {messages.map((message) => (
                                <motion.div 
                                    key={message.id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full gap-4",
                                        message.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8 border border-white/10 bg-[#1a1a24] shrink-0 shadow-sm mt-1">
                                            <AvatarFallback className="bg-transparent text-[hsl(var(--primary))]">
                                                <Bot className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className={cn(
                                        "relative max-w-[85%] lg:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm",
                                        message.role === 'user' 
                                            ? "bg-[#2F2F35] text-white rounded-br-sm" 
                                            : "bg-transparent border border-white/10 text-gray-100 rounded-bl-sm"
                                    )}>
                                        <div className="text-[15px] leading-relaxed">
                                            {/* @ts-ignore */}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {/* @ts-ignore */}
                                                    {message.attachments.map((att, i) => (
                                                        att.type.startsWith('image/') ? (
                                                            <img key={i} src={att.url} alt="attachment" className="max-h-40 rounded-lg border border-white/10" />
                                                        ) : (
                                                            <div key={i} className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/10">
                                                                <FileIcon className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-xs truncate max-w-[150px]">{att.name}</span>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            )}

                                            {message.role === 'assistant' ? (
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#0d0d12] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl"
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                            )}
                                        </div>
                                    </div>

                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8 border border-white/10 bg-[#2F2F35] shrink-0 mt-1">
                                            <AvatarFallback className="bg-transparent text-white">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="flex w-full gap-4 justify-start">
                                    <Avatar className="h-8 w-8 border border-white/10 bg-[#1a1a24] shrink-0 shadow-sm mt-1">
                                        <AvatarFallback className="bg-transparent text-[hsl(var(--primary))]">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-transparent border border-white/10 rounded-3xl rounded-bl-sm px-6 py-4 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                    </AnimatePresence>
                )}
            </div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 w-full p-4 lg:p-6 bg-gradient-to-t from-[#05050A] via-[#05050A] to-transparent z-20">
            <div className="max-w-4xl mx-auto relative">
                
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                   <div className="flex gap-2 mb-2 overflow-x-auto pb-2 px-1">
                       {attachments.map((att, i) => (
                           <div key={i} className="relative shrink-0 h-16 w-16 rounded-lg border border-white/10 overflow-hidden group bg-[#1C1C21]">
                               {att.type.startsWith('image/') ? (
                                   <img src={att.url} alt="preview" className="h-full w-full object-cover" />
                               ) : (
                                   <div className="h-full w-full flex items-center justify-center">
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

                <motion.div 
                    layoutId="input-container"
                    className={cn(
                        "relative flex flex-col gap-2 p-3 rounded-[24px] bg-[#1C1C21]/90 border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300",
                        "focus-within:border-[hsl(var(--primary))/0.3] focus-within:bg-[#1C1C21] focus-within:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.15)]"
                    )}
                >
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Poser une question à Coach Ella..."
                        className="min-h-[24px] max-h-[200px] w-full resize-none border-0 bg-transparent px-2 py-1 text-white placeholder:text-white/30 focus-visible:ring-0 text-base leading-relaxed custom-scrollbar"
                        disabled={loading}
                        rows={1}
                    />
                    
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1">
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
                        </div>
                        <Button 
                            onClick={() => handleSend()} 
                            disabled={loading || isUploading || (!input.trim() && attachments.length === 0)}
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full transition-all duration-300",
                                (input.trim() || attachments.length > 0)
                                    ? "bg-[hsl(var(--primary))] text-black hover:bg-[hsl(var(--primary))/0.9] shadow-[0_0_15px_-3px_hsl(var(--primary)/0.4)]" 
                                    : "bg-[#2F2F35] text-white/20 cursor-not-allowed"
                            )}
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </Button>
                    </div>
                </motion.div>
                <p className="text-center text-[10px] text-white/20 mt-3 font-medium tracking-wide">
                    Coach Ella peut faire des erreurs. Vérifiez les informations importantes.
                </p>
            </div>
          </div>
      </div>
    </div>
  )
}
