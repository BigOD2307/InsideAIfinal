import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseAnonKey !== 'REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE'

if (typeof window !== 'undefined') {
  setTimeout(() => {
    if (!isConfigured) {
      console.warn('⚠️ Configuration Supabase manquante ou incorrecte!')
    }
  }, 0)
}

export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          cache: 'no-store', // Disable cache for auth requests
        }).catch(err => {
          // Suppress network errors in console during development hot reloads
          if (process.env.NODE_ENV === 'development') return new Response(null, { status: 500 })
          throw err
        })
      }
    }
  }
)

export const isSupabaseConfigured = () => isConfigured
