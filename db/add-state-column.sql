-- Add state_json column to intake_sessions table
-- Run this in your Supabase SQL Editor

ALTER TABLE intake_sessions 
ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT '{}'::jsonb;

