'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  User, 
  Users, 
  Briefcase, 
  Zap, 
  GraduationCap, 
  Search, 
  Mic, 
  MicOff,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ... (Types & Data & Components definitions remain same) ...

// --- Types & Data ---

type QuestionType = 'single_select' | 'multi_select' | 'text_voice'

interface Option {
  id: string
  label: string
  icon?: any
  description?: string
}

interface Step {
  id: number
  type: QuestionType
  title: string
  subtitle: string
  options?: Option[]
  placeholder?: string
}

const ONBOARDING_STEPS: Step[] = [
  {
    id: 1,
    type: 'single_select',
    title: "Quel est votre profil ?",
    subtitle: "Cela nous permet d'adapter l'expérience à votre contexte professionnel.",
    options: [
      { id: 'solo', label: 'Solopreneur / Freelance', icon: User, description: 'Je travaille seul et je veux optimiser mon temps.' },
      { id: 'employee', label: 'Salarié / Manager', icon: Briefcase, description: 'Je veux monter en compétence et briller au bureau.' },
      { id: 'team', label: 'Entreprise / Équipe', icon: Users, description: 'Nous voulons former nos collaborateurs.' },
    ]
  },
  {
    id: 2,
    type: 'multi_select',
    title: "Vos objectifs principaux ?",
    subtitle: "Sélectionnez tout ce qui s'applique pour personnaliser votre fil d'actualité.",
    options: [
      { id: 'training', label: 'Se former à l\'IA', icon: GraduationCap, description: 'Tutoriels et cours pratiques.' },
      { id: 'monitoring', label: 'Veille Technologique', icon: Search, description: 'Rester à jour sur les derniers outils.' },
      { id: 'productivity', label: 'Productivité & Automation', icon: Zap, description: 'Gagner du temps au quotidien.' },
      { id: 'community', label: 'Réseautage', icon: Building2, description: 'Échanger avec d\'autres experts.' },
    ]
  },
  {
    id: 3,
    type: 'text_voice',
    title: "Un défi spécifique ?",
    subtitle: "Dites-nous ce qui vous bloque aujourd'hui. Notre IA analysera votre réponse pour configurer votre coach.",
    placeholder: "Ex: Je perds trop de temps à trier mes emails, je ne sais pas quel outil utiliser pour..."
  }
]

// --- Components ---

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div 
          key={idx}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            idx <= currentStep ? "w-8 bg-[hsl(var(--primary))]" : "w-2 bg-white/10"
          )}
        />
      ))}
    </div>
  )
}

const SelectionCard = ({ 
  option, 
  selected, 
  onClick, 
  multi = false 
}: { 
  option: Option; 
  selected: boolean; 
  onClick: () => void; 
  multi?: boolean 
}) => {
  const Icon = option.icon

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-300",
        selected 
          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.1] shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]" 
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-purple-500/5"
      )}
    >
      <div className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
        selected ? "bg-[hsl(var(--primary))] text-black" : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
      )}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      
      <div className="flex-1">
        <h3 className={cn("font-medium transition-colors", selected ? "text-white" : "text-gray-200")}>
          {option.label}
        </h3>
        {option.description && (
          <p className="mt-1 text-sm text-muted-foreground group-hover:text-gray-400 transition-colors">
            {option.description}
          </p>
        )}
      </div>

      <div className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
        selected 
          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-black" 
          : "border-white/20 bg-transparent"
      )}>
        {selected && <Check className="h-3.5 w-3.5" />}
      </div>
    </motion.div>
  )
}

const AudioVisualizer = ({ isRecording }: { isRecording: boolean }) => (
  <div className="flex items-center gap-1 h-5 mx-3">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        animate={isRecording ? {
          height: [4, Math.random() * 20 + 4, 4],
          backgroundColor: ['hsla(var(--primary))', '#EC4899', 'hsla(var(--indigo-bloom))']
        } : {
          height: 4,
          backgroundColor: 'rgba(255,255,255,0.1)'
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          delay: i * 0.05,
          ease: "easeInOut"
        }}
        className="w-1 rounded-full"
      />
    ))}
  </div>
)

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ x: number, y: number, scale: number, opacity: number, duration: number, width: number, height: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3,
      duration: Math.random() * 10 + 10,
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/5 rounded-full"
          initial={{
            x: p.x + "%",
            y: p.y + "%",
            scale: p.scale,
            opacity: p.opacity
          }}
          animate={{
            y: [null, Math.random() * -100],
            opacity: [null, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: p.width + "px",
            height: p.height + "px",
          }}
        />
      ))}
    </div>
  )
}

// --- Main Component ---

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(true)

  // Check if user already completed onboarding
  useEffect(() => {
    const checkStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase
                .from('users')
                .select('onboarding_completed')
                .eq('id', user.id)
                .single()
            
            if (profile?.onboarding_completed) {
                router.replace('/dashboard')
            }
        }
        setLoading(false)
    }
    checkStatus()
  }, [router])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const instance = new SpeechRecognition()
      instance.continuous = true
      instance.interimResults = true
      instance.lang = 'fr-FR'
      
      instance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        setInputValue(prev => {
           return transcript
        })
      }
      
      instance.onerror = (event: any) => {
        console.error(event)
        setIsRecording(false)
      }

      setRecognition(instance)
    }
  }, [])

  const handleToggleRecord = () => {
    if (!recognition) return toast.error("Reconnaissance vocale non supportée")
    
    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  const handleOptionSelect = (stepId: number, optionId: string, type: QuestionType) => {
    setAnswers(prev => {
      const current = prev[stepId]
      if (type === 'single_select') {
        return { ...prev, [stepId]: optionId }
      } else {
        // Multi select logic
        const currentArray = Array.isArray(current) ? current : []
        if (currentArray.includes(optionId)) {
          return { ...prev, [stepId]: currentArray.filter((id: string) => id !== optionId) }
        } else {
          return { ...prev, [stepId]: [...currentArray, optionId] }
        }
      }
    })
  }

  const handleNext = async () => {
    // Save text input if needed
    if (ONBOARDING_STEPS[currentStep].type === 'text_voice') {
      answers[ONBOARDING_STEPS[currentStep].id] = inputValue
    }

    // Validation
    const currentAnswer = answers[ONBOARDING_STEPS[currentStep].id]
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      if (ONBOARDING_STEPS[currentStep].type === 'text_voice' && !inputValue.trim()) {
        toast.error("Veuillez répondre à la question")
        return
      } else if (ONBOARDING_STEPS[currentStep].type !== 'text_voice') {
        toast.error("Veuillez sélectionner une option")
        return
      }
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('users')
          .update({
            onboarding_completed: true,
            onboarding_data: { 
                ...answers,
                // Map specific answers to columns if needed, otherwise store as JSON
                role: answers[1],
                goals: answers[2],
                challenges: inputValue
            }
          })
          .eq('id', user.id)
      }
      toast.success("Profil configuré !")
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la sauvegarde")
    }
  }

  if (loading) {
      return (
          <div className="min-h-screen w-full bg-[#05050A] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]"></div>
          </div>
      )
  }

  const step = ONBOARDING_STEPS[currentStep]

  return (
    <div className="min-h-screen w-full bg-[#05050A] text-white font-sans selection:bg-[hsl(var(--primary))/0.3] overflow-hidden">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-[#05050A] to-transparent">
        <div className="flex items-center gap-2">
           <span className="font-blaka text-2xl text-white" style={{ fontFamily: 'var(--font-blaka)' }}>inside.ai</span>
        </div>
        <div className="text-sm text-muted-foreground hidden md:block">
          Setup Assistant
        </div>
        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-white" onClick={() => toast.info("Besoin d'aide ? Contactez support@inside.ai")}>
          Aide
        </Button>
      </header>

      {/* Background Gradients & Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingParticles />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[hsl(var(--primary))/0.08] blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[hsl(var(--indigo-bloom))/0.08] blur-[120px] animate-pulse duration-[15000ms]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-10">
        <div className="w-full max-w-4xl">
          
          {/* Step Indicator */}
          <div className="flex justify-center">
            <StepIndicator currentStep={currentStep} totalSteps={ONBOARDING_STEPS.length} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start"
            >
              {/* Left Column: Question & Context */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="font-title text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                    {step.title}
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-md">
                    {step.subtitle}
                  </p>
                </motion.div>

                {/* Text Input Area if needed */}
                {step.type === 'text_voice' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <div className={cn(
                      "relative rounded-2xl border bg-white/5 p-1 transition-all duration-500",
                      isRecording 
                        ? "border-[hsl(var(--primary))] shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)]" 
                        : "border-white/10 focus-within:border-[hsl(var(--primary))/0.5] focus-within:bg-white/[0.07]"
                    )}>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={step.placeholder}
                            className="min-h-[200px] w-full resize-none bg-transparent p-4 text-lg outline-none placeholder:text-muted-foreground/30"
                            autoFocus
                        />
                        <div className="flex items-center justify-between border-t border-white/5 p-2">
                             <span className="text-xs text-muted-foreground pl-2">
                                {inputValue.length} caractères
                             </span>
                             
                             <div className="flex items-center">
                               {isRecording && <AudioVisualizer isRecording={isRecording} />}
                               
                               <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={handleToggleRecord}
                                  className={cn(
                                      "h-10 w-10 rounded-xl transition-all relative",
                                      isRecording ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "hover:bg-white/10"
                                  )}
                               >
                                  {isRecording && (
                                    <span className="absolute inset-0 rounded-xl animate-ping bg-red-500/20" />
                                  )}
                                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                               </Button>
                             </div>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-[hsl(var(--primary))]" />
                        L'IA analyse votre réponse en temps réel
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Right Column: Options or Visuals */}
              <div className="space-y-4">
                {step.options && step.options.map((option, idx) => {
                  const isSelected = step.type === 'single_select' 
                    ? answers[step.id] === option.id
                    : (answers[step.id] || []).includes(option.id)

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <SelectionCard 
                        option={option}
                        selected={isSelected}
                        onClick={() => handleOptionSelect(step.id, option.id, step.type)}
                        multi={step.type === 'multi_select'}
                      />
                    </motion.div>
                  )
                })}

                {/* Visual decoration for text input step if no options */}
                {!step.options && (
                   <div className="hidden lg:flex h-full min-h-[300px] items-center justify-center rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-8 relative overflow-hidden group">
                      {/* Floating elements for visual interest */}
                      <motion.div 
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 h-20 w-20 rounded-full bg-[hsl(var(--primary))/0.1] blur-xl"
                      />
                      <motion.div 
                        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-[hsl(var(--indigo-bloom))/0.1] blur-2xl"
                      />
                      
                      <div className="text-center space-y-6 relative z-10">
                         <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[hsl(var(--primary))/0.1] text-[hsl(var(--primary))] shadow-[0_0_50px_-10px_hsl(var(--primary)/0.3)] ring-1 ring-[hsl(var(--primary))/0.2]">
                            <Sparkles className="h-10 w-10" />
                         </div>
                         <div>
                           <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">Configuration IA</h3>
                           <p className="mt-2 text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                              Notre modèle analyse vos besoins pour générer un cockpit personnalisé instantanément.
                           </p>
                         </div>
                      </div>
                   </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="fixed bottom-0 left-0 w-full border-t border-white/5 bg-[#05050A]/80 backdrop-blur-lg p-6 lg:static lg:mt-16 lg:border-none lg:bg-transparent lg:p-0 z-40">
             <div className="mx-auto flex max-w-4xl items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)}
                    disabled={currentStep === 0}
                    className="text-muted-foreground hover:text-white transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>

                <Button
                    onClick={handleNext}
                    size="lg"
                    className="rounded-full bg-[hsl(var(--primary))] px-8 font-semibold text-black shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--mauve-magic))] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:scale-105 transition-all duration-300"
                >
                    {currentStep === ONBOARDING_STEPS.length - 1 ? 'Terminer' : 'Continuer'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
