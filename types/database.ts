// Database type definitions matching Supabase schema

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  industry: string | null;
  problem_description: string | null;
  created_at: string;
};

export type IntakeSession = {
  id: string;
  lead_id: string | null;
  status: 'in_progress' | 'complete';
  state_json: any; // JSONB field storing IntakeState
  created_at: string;
  updated_at: string;
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

// Insert types
export type LeadInsert = Omit<Lead, 'id' | 'created_at'>;
export type IntakeSessionInsert = Omit<IntakeSession, 'id' | 'created_at' | 'updated_at'> & {
  state_json?: any;
};
export type IntakeMessageInsert = Omit<IntakeMessage, 'id' | 'created_at'>;
export type MvpPromptInsert = Omit<MvpPrompt, 'id' | 'created_at'>;
export type ProjectInsert = Omit<Project, 'id' | 'created_at'>;

