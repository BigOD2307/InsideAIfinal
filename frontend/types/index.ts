export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  job_title?: string
  industry?: string
  experience_level?: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  assistant_id: string
  thread_id: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface VeilleReport {
  id: string
  user_id: string
  title: string
  content: string
  summary: string
  sources?: string[]
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  content: string
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  user?: User
}

export interface Tip {
  id: string
  title: string
  content: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
}

