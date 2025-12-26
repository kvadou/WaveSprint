// Supabase database client and helper functions
import { createClient } from '@supabase/supabase-js'

import type {
  Lead,
  LeadInsert,
  IntakeSession,
  IntakeSessionInsert,
  IntakeMessage,
  IntakeMessageInsert,
  MvpPrompt,
  MvpPromptInsert,
} from '@/types/database';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function createLead(data: LeadInsert): Promise<Lead> {
  const { data: lead, error } = await supabase
    .from('leads')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return lead
}

export async function createIntakeSession(data: IntakeSessionInsert): Promise<IntakeSession> {
  const { data: session, error } = await supabase
    .from('intake_sessions')
    .insert({
      ...data,
      state_json: data.state_json || {},
    })
    .select()
    .single()
  
  if (error) throw error
  return session
}

export async function updateIntakeSessionState(
  sessionId: string,
  state: any
): Promise<void> {
  const { error } = await supabase
    .from('intake_sessions')
    .update({ state_json: state })
    .eq('id', sessionId)
  
  if (error) throw error
}

export async function appendIntakeMessage(data: IntakeMessageInsert): Promise<IntakeMessage> {
  const { data: message, error } = await supabase
    .from('intake_messages')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return message
}

export async function saveMvpPrompt(data: MvpPromptInsert): Promise<MvpPrompt> {
  const { data: prompt, error } = await supabase
    .from('mvp_prompts')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return prompt
}

export async function getIntakeSession(sessionId: string): Promise<IntakeSession | null> {
  const { data, error } = await supabase
    .from('intake_sessions')
    .select()
    .eq('id', sessionId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export async function getIntakeMessages(sessionId: string): Promise<IntakeMessage[]> {
  const { data, error } = await supabase
    .from('intake_messages')
    .select()
    .eq('intake_session_id', sessionId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching intake messages:', error)
    return []
  }
  return data || []
}

export async function getMvpPrompt(sessionId: string): Promise<MvpPrompt | null> {
  const { data, error } = await supabase
    .from('mvp_prompts')
    .select()
    .eq('intake_session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    console.error('Error fetching MVP prompt:', error)
    return null
  }
  return data
}

export async function updateIntakeSessionStatus(
  sessionId: string,
  status: 'in_progress' | 'complete'
): Promise<void> {
  const { error } = await supabase
    .from('intake_sessions')
    .update({ status })
    .eq('id', sessionId)
  
  if (error) throw error
}

export async function listLeadsForAdmin(limit = 50, offset = 0): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select()
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }
  return data || []
}

export async function listSessionsForAdmin(limit = 50, offset = 0): Promise<IntakeSession[]> {
  const { data, error } = await supabase
    .from('intake_sessions')
    .select('*, leads(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
  return data || []
}

