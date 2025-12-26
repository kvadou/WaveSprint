-- WaveSprint.ai Database Schema V2 - CRM Enhancements
-- Run this in your Supabase SQL editor AFTER the initial schema.sql

-- Pipeline stages for CRM
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  order_index INT NOT NULL,
  color TEXT,
  is_final BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, order_index, color, is_final) VALUES
  ('New Lead', 1, '#22d3ee', FALSE),
  ('Qualifying', 2, '#a855f7', FALSE),
  ('Requirements Gathered', 3, '#ec4899', FALSE),
  ('Proposal Sent', 4, '#f97316', FALSE),
  ('Negotiating', 5, '#eab308', FALSE),
  ('Won', 6, '#22c55e', TRUE),
  ('Lost', 7, '#ef4444', TRUE)
ON CONFLICT DO NOTHING;

-- Enhance leads table with CRM fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pipeline_stage_id UUID REFERENCES pipeline_stages(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INT DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_followup_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Set default pipeline stage for existing leads
UPDATE leads
SET pipeline_stage_id = (SELECT id FROM pipeline_stages WHERE name = 'New Lead')
WHERE pipeline_stage_id IS NULL;

-- Activities/Timeline - tracks all interactions
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'email_sent',
    'email_received',
    'sms_sent',
    'sms_received',
    'call',
    'note',
    'stage_change',
    'ai_chat',
    'meeting_scheduled',
    'proposal_sent',
    'system'
  )),
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_by TEXT DEFAULT 'system', -- 'user', 'ai_agent', 'system'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication templates for email/SMS
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  subject TEXT, -- For emails
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- e.g. ['name', 'company', 'project_type']
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO templates (name, type, subject, body, variables) VALUES
  (
    'Welcome Email',
    'email',
    'Welcome to WaveSprint - Your MVP Journey Starts Now!',
    E'Hi {{name}},\n\nThank you for reaching out to WaveSprint! I''m excited to learn more about your project idea.\n\nI''ve received your initial submission and will be reviewing it shortly. You can expect to hear from me within the next 2 hours with some follow-up questions or a proposal.\n\nIn the meantime, feel free to reply to this email if you have any additional details you''d like to share.\n\nLet''s build something great together!\n\nBest,\nDoug\nWaveSprint.ai',
    ARRAY['name']
  ),
  (
    'Follow-up Reminder',
    'email',
    'Checking in on your MVP project',
    E'Hi {{name}},\n\nI wanted to follow up on the project you submitted. Are you still interested in moving forward?\n\nIf you have any questions or concerns, I''d be happy to jump on a quick call to discuss.\n\nBest,\nDoug\nWaveSprint.ai',
    ARRAY['name']
  ),
  (
    'Proposal Ready',
    'email',
    'Your WaveSprint MVP Proposal is Ready',
    E'Hi {{name}},\n\nGreat news! I''ve put together a detailed proposal for your {{project_type}} project.\n\n[Proposal details would go here]\n\nLet me know if you have any questions. I''m ready to start building as soon as you give the green light!\n\nBest,\nDoug\nWaveSprint.ai',
    ARRAY['name', 'project_type']
  ),
  (
    'SMS Welcome',
    'sms',
    NULL,
    'Hi {{name}}! Thanks for submitting your project to WaveSprint. I''ll review it and get back to you within 2 hours. - Doug',
    ARRAY['name']
  ),
  (
    'SMS Follow-up',
    'sms',
    NULL,
    'Hi {{name}}, just checking in on your MVP project. Still interested in moving forward? Let me know! - Doug',
    ARRAY['name']
  )
ON CONFLICT DO NOTHING;

-- Scheduled messages for automation
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  subject TEXT, -- Override template subject
  body TEXT, -- Override template body
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agent configurations
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'requirements',
    'followup',
    'content',
    'social',
    'email_composer',
    'lead_scorer'
  )),
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'claude-3-haiku-20240307',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INT DEFAULT 1000,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default AI agents
INSERT INTO ai_agents (name, type, system_prompt, model, config) VALUES
  (
    'Requirements Analyst',
    'requirements',
    'You are a friendly, expert requirements analyst for WaveSprint.ai - a rapid MVP development service that builds working apps in 24 hours. Your job is to have a natural conversation to gather project requirements.',
    'claude-3-haiku-20240307',
    '{"max_questions": 6}'::jsonb
  ),
  (
    'Follow-up Agent',
    'followup',
    'You help compose personalized follow-up messages for leads who haven''t responded. Be friendly but professional, and create urgency without being pushy.',
    'claude-3-haiku-20240307',
    '{}'::jsonb
  ),
  (
    'Lead Scorer',
    'lead_scorer',
    'You analyze lead information and conversation history to score leads from 0-100 based on their likelihood to convert. Consider factors like: budget clarity, timeline urgency, problem specificity, and engagement level.',
    'claude-3-haiku-20240307',
    '{"scoring_criteria": ["budget", "timeline", "engagement", "specificity"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Agent run history
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  input JSONB,
  output JSONB,
  tokens_used INT,
  duration_ms INT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON leads(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON leads(next_followup_at) WHERE next_followup_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_tags ON leads USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scheduled_messages_lead ON scheduled_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status ON scheduled_messages(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled_for ON scheduled_messages(scheduled_for) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_agent_runs_agent ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_lead ON agent_runs(lead_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);

-- Trigger to update updated_at on leads
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on templates
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on ai_agents
CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity when pipeline stage changes
CREATE OR REPLACE FUNCTION log_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.pipeline_stage_id IS DISTINCT FROM NEW.pipeline_stage_id THEN
    INSERT INTO activities (lead_id, type, title, content, metadata)
    VALUES (
      NEW.id,
      'stage_change',
      'Pipeline stage changed',
      'Lead moved to new stage',
      jsonb_build_object(
        'from_stage_id', OLD.pipeline_stage_id,
        'to_stage_id', NEW.pipeline_stage_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_lead_stage_change
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_stage_change();
