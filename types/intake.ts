// Types for the intake system

export type IntakeCategory = 
  | 'problem_definition'
  | 'primary_users'
  | 'business_workflow'
  | 'success_metrics'
  | 'core_features'
  | 'nice_to_have_features'
  | 'data_requirements'
  | 'security_compliance'
  | 'integrations'
  | 'ui_design_preferences'
  | 'industry_context'
  | 'performance_requirements'
  | 'mobile_needs'
  | 'admin_reporting_requirements'
  | 'automation_notifications'
  | 'output_needs'
  | 'technical_constraints'
  | 'timeline'
  | 'budget_notes'
  | 'scale_saas_potential';

export type CategoryConfidence = 'low' | 'medium' | 'high';

export type IntakeState = {
  categories: Record<IntakeCategory, {
    confidence: CategoryConfidence;
    data: string | null;
  }>;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  isComplete: boolean;
};

export type AssistantResponse = {
  questions: string[];
  updatedState?: Partial<IntakeState>;
  mvpPrompt?: string;
  isComplete: boolean;
};

