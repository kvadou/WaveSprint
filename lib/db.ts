// Supabase database client and helper functions
import { createClient } from '@supabase/supabase-js'

import type {
  Lead,
  LeadInsert,
  LeadUpdate,
  LeadWithStage,
  PipelineStage,
  Activity,
  ActivityInsert,
  Template,
  ScheduledMessage,
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

// ============ Pipeline Stage Functions ============

export async function getPipelineStages(): Promise<PipelineStage[]> {
  const { data, error } = await supabase
    .from('pipeline_stages')
    .select()
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching pipeline stages:', error)
    return []
  }
  return data || []
}

// ============ Lead CRM Functions ============

export async function getLeadById(leadId: string): Promise<LeadWithStage | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, pipeline_stage:pipeline_stages(*)')
    .eq('id', leadId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching lead:', error)
    return null
  }
  return data
}

export async function getLeadsWithStages(
  limit = 50,
  offset = 0,
  stageId?: string
): Promise<LeadWithStage[]> {
  let query = supabase
    .from('leads')
    .select('*, pipeline_stage:pipeline_stages(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (stageId) {
    query = query.eq('pipeline_stage_id', stageId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leads with stages:', error)
    return []
  }
  return data || []
}

export async function updateLead(leadId: string, updates: LeadUpdate): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error)
    return null
  }
  return data
}

export async function moveLeadToStage(leadId: string, stageId: string): Promise<Lead | null> {
  return updateLead(leadId, { pipeline_stage_id: stageId })
}

export async function updateLeadScore(leadId: string, score: number): Promise<Lead | null> {
  return updateLead(leadId, { lead_score: score })
}

export async function addLeadNote(leadId: string, note: string): Promise<Lead | null> {
  return updateLead(leadId, { notes: note })
}

export async function addLeadTags(leadId: string, newTags: string[]): Promise<Lead | null> {
  // First get current tags
  const lead = await getLeadById(leadId)
  if (!lead) return null

  const existingTags = lead.tags || []
  const mergedTags = [...new Set([...existingTags, ...newTags])]

  return updateLead(leadId, { tags: mergedTags })
}

export async function scheduleFollowup(leadId: string, followupDate: Date): Promise<Lead | null> {
  return updateLead(leadId, { next_followup_at: followupDate.toISOString() })
}

// ============ Activity Functions ============

export async function createActivity(data: ActivityInsert): Promise<Activity | null> {
  const { data: activity, error } = await supabase
    .from('activities')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error creating activity:', error)
    return null
  }
  return activity
}

export async function getActivitiesForLead(
  leadId: string,
  limit = 50
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select()
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching activities:', error)
    return []
  }
  return data || []
}

export async function logEmailSent(
  leadId: string,
  subject: string,
  content: string
): Promise<Activity | null> {
  return createActivity({
    lead_id: leadId,
    type: 'email_sent',
    title: subject,
    content,
    metadata: {},
    created_by: 'user',
  })
}

export async function logSmsSent(
  leadId: string,
  content: string
): Promise<Activity | null> {
  return createActivity({
    lead_id: leadId,
    type: 'sms_sent',
    title: 'SMS Sent',
    content,
    metadata: {},
    created_by: 'user',
  })
}

export async function logNote(
  leadId: string,
  content: string
): Promise<Activity | null> {
  return createActivity({
    lead_id: leadId,
    type: 'note',
    title: 'Note Added',
    content,
    metadata: {},
    created_by: 'user',
  })
}

export async function logAiChat(
  leadId: string,
  content: string,
  metadata: Record<string, any> = {}
): Promise<Activity | null> {
  return createActivity({
    lead_id: leadId,
    type: 'ai_chat',
    title: 'AI Conversation',
    content,
    metadata,
    created_by: 'ai_agent',
  })
}

// ============ Template Functions ============

export async function getTemplates(type?: 'email' | 'sms'): Promise<Template[]> {
  let query = supabase
    .from('templates')
    .select()
    .eq('is_active', true)
    .order('name')

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }
  return data || []
}

export async function getTemplateById(templateId: string): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .select()
    .eq('id', templateId)
    .single()

  if (error) {
    console.error('Error fetching template:', error)
    return null
  }
  return data
}

// ============ Scheduled Message Functions ============

export async function getPendingScheduledMessages(): Promise<ScheduledMessage[]> {
  const { data, error } = await supabase
    .from('scheduled_messages')
    .select('*, lead:leads(*), template:templates(*)')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for')

  if (error) {
    console.error('Error fetching scheduled messages:', error)
    return []
  }
  return data || []
}

export async function markMessageAsSent(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('scheduled_messages')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', messageId)

  if (error) {
    console.error('Error marking message as sent:', error)
  }
}

export async function markMessageAsFailed(
  messageId: string,
  errorMessage: string
): Promise<void> {
  const { error } = await supabase
    .from('scheduled_messages')
    .update({
      status: 'failed',
      error_message: errorMessage
    })
    .eq('id', messageId)

  if (error) {
    console.error('Error marking message as failed:', error)
  }
}

// ============ Dashboard Stats Functions ============

export async function getDashboardStats(): Promise<{
  totalLeads: number
  leadsByStage: Record<string, number>
  recentLeads: Lead[]
  upcomingFollowups: Lead[]
}> {
  // Get total leads count
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // Get leads grouped by stage
  const { data: stageData } = await supabase
    .from('leads')
    .select('pipeline_stage_id')

  const leadsByStage: Record<string, number> = {}
  if (stageData) {
    for (const lead of stageData) {
      const stageId = lead.pipeline_stage_id || 'unassigned'
      leadsByStage[stageId] = (leadsByStage[stageId] || 0) + 1
    }
  }

  // Get recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get upcoming followups
  const { data: upcomingFollowups } = await supabase
    .from('leads')
    .select('*')
    .not('next_followup_at', 'is', null)
    .gte('next_followup_at', new Date().toISOString())
    .order('next_followup_at')
    .limit(5)

  return {
    totalLeads: totalLeads || 0,
    leadsByStage,
    recentLeads: recentLeads || [],
    upcomingFollowups: upcomingFollowups || [],
  }
}

