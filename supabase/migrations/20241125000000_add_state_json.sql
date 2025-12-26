-- Add state_json column to intake_sessions table
ALTER TABLE intake_sessions 
ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT '{}'::jsonb;

