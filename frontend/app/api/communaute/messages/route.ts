import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channel') || 'general'

    const { data: messages, error } = await supabase
      .from('community_messages_with_users') 
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error('Error fetching community messages:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, channelId, attachments } = body // Ajout de attachments

    if ((!content || !content.trim()) && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: 'Content or attachments required' }, { status: 400 })
    }

    const { data: message, error } = await supabase
      .from('community_messages')
      .insert({
        user_id: user.id,
        channel_id: channelId || 'general',
        content: content ? content.trim() : '',
        attachments: attachments || [] // Sauvegarde en base
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('Error posting message:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

