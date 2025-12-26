// Database type definitions matching Supabase schema

// ============ Pipeline & CRM Types ============

export type PipelineStage = {
  id: string;
  name: string;
  order_index: number;
  color: string | null;
  is_final: boolean;
  created_at: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  industry: string | null;
  problem_description: string | null;
  phone: string | null;
  source: string | null;
  // CRM fields
  pipeline_stage_id: string | null;
  lead_score: number;
  last_contacted_at: string | null;
  next_followup_at: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data (optional)
  pipeline_stage?: PipelineStage;
};

export type LeadWithStage = Lead & {
  pipeline_stage: PipelineStage;
};

// ============ Activity Types ============

export type ActivityType =
  | 'email_sent'
  | 'email_received'
  | 'sms_sent'
  | 'sms_received'
  | 'call'
  | 'note'
  | 'stage_change'
  | 'ai_chat'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'system';

export type Activity = {
  id: string;
  lead_id: string;
  type: ActivityType;
  title: string | null;
  content: string | null;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
};

// ============ Template Types ============

export type TemplateType = 'email' | 'sms';

export type Template = {
  id: string;
  name: string;
  type: TemplateType;
  subject: string | null;
  body: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ============ Scheduled Message Types ============

export type ScheduledMessageStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

export type ScheduledMessage = {
  id: string;
  lead_id: string;
  template_id: string | null;
  channel: 'email' | 'sms';
  subject: string | null;
  body: string | null;
  scheduled_for: string;
  sent_at: string | null;
  status: ScheduledMessageStatus;
  error_message: string | null;
  created_at: string;
  // Joined data
  lead?: Lead;
  template?: Template;
};

// ============ AI Agent Types ============

export type AgentType =
  | 'requirements'
  | 'followup'
  | 'content'
  | 'social'
  | 'email_composer'
  | 'lead_scorer';

export type AIAgent = {
  id: string;
  name: string;
  type: AgentType;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type AgentRunStatus = 'success' | 'error' | 'timeout';

export type AgentRun = {
  id: string;
  agent_id: string;
  lead_id: string | null;
  input: Record<string, any>;
  output: Record<string, any>;
  tokens_used: number | null;
  duration_ms: number | null;
  status: AgentRunStatus;
  error_message: string | null;
  created_at: string;
  // Joined data
  agent?: AIAgent;
  lead?: Lead;
};

// ============ Intake Session Types ============

export type IntakeSession = {
  id: string;
  lead_id: string | null;
  status: 'in_progress' | 'complete';
  state_json: any; // JSONB field storing IntakeState
  created_at: string;
  updated_at: string;
  // Joined data
  lead?: Lead;
};

export type IntakeMessage = {
  id: string;
  intake_session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type MvpPrompt = {
  id: string;
  intake_session_id: string;
  prompt_text: string;
  created_at: string;
};

export type Project = {
  id: string;
  lead_id: string;
  title: string | null;
  status: string | null;
  created_at: string;
};

// ============ Insert Types ============

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'lead_score' | 'tags' | 'pipeline_stage'> & {
  lead_score?: number;
  tags?: string[];
};

export type PipelineStageInsert = Omit<PipelineStage, 'id' | 'created_at'>;

export type ActivityInsert = Omit<Activity, 'id' | 'created_at'>;

export type TemplateInsert = Omit<Template, 'id' | 'created_at' | 'updated_at'>;

export type ScheduledMessageInsert = Omit<ScheduledMessage, 'id' | 'created_at' | 'sent_at' | 'status' | 'error_message' | 'lead' | 'template'>;

export type AIAgentInsert = Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>;

export type AgentRunInsert = Omit<AgentRun, 'id' | 'created_at' | 'agent' | 'lead'>;

export type IntakeSessionInsert = Omit<IntakeSession, 'id' | 'created_at' | 'updated_at' | 'lead'> & {
  state_json?: any;
};

export type IntakeMessageInsert = Omit<IntakeMessage, 'id' | 'created_at'>;

export type MvpPromptInsert = Omit<MvpPrompt, 'id' | 'created_at'>;

export type ProjectInsert = Omit<Project, 'id' | 'created_at'>;

// ============ Update Types ============

export type LeadUpdate = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'pipeline_stage'>>;

export type TemplateUpdate = Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>;

export type AIAgentUpdate = Partial<Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>>;
