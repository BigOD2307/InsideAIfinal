'use client'

import { Sidebar } from './sidebar'
import { Toaster } from '@/components/ui/sonner'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Global Background Pattern for the App */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_hsla(var(--indigo-bloom)/0.15),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]" />
      
      <Sidebar />
      
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
      </main>
      <Toaster />
    </div>
  )
}
