// AI Assistant abstraction layer
// TODO: Replace mock implementation with actual OpenAI integration

import type { IntakeState, AssistantResponse } from '@/types/intake';

/**
 * Generates the next turn in the intake conversation.
 * 
 * TODO: Replace this mock with actual OpenAI API call:
 * 
 * 1. Import OpenAI client:
 *    import OpenAI from 'openai';
 *    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * 
 * 2. Build conversation messages from sessionState.conversationHistory
 * 
 * 3. Add system prompt that instructs the AI to:
 *    - Ask clarifying questions to fill missing categories
 *    - Only ask 1-2 questions at a time
 *    - Once all categories are high confidence, generate the MVP BUILD PROMPT
 * 
 * 4. Call OpenAI:
 *    const completion = await openai.chat.completions.create({
 *      model: 'gpt-4-turbo-preview',
 *      messages: [...],
 *      temperature: 0.7,
 *    });
 * 
 * 5. Parse response and update category confidence based on what was learned
 * 
 * 6. Return AssistantResponse with questions and updated state
 */
/**
 * Analyzes user message to extract information and update categories
 */
function analyzeUserMessage(message: string, currentState: IntakeState): Partial<IntakeState> {
  const messageLower = message.toLowerCase();
  const updatedCategories = { ...currentState.categories };

  // Extract problem definition
  if (messageLower.includes('problem') || messageLower.includes('issue') || 
      messageLower.includes('challenge') || messageLower.includes('need')) {
    if (updatedCategories.problem_definition.confidence === 'low') {
      updatedCategories.problem_definition = {
        confidence: 'medium',
        data: message,
      };
    }
  }

  // Extract users
  const userKeywords = ['user', 'customer', 'client', 'employee', 'staff', 'admin', 'patient', 'student'];
  if (userKeywords.some(keyword => messageLower.includes(keyword))) {
    if (updatedCategories.primary_users.confidence === 'low') {
      updatedCategories.primary_users = {
        confidence: 'medium',
        data: message,
      };
    }
  }

  // Extract features
  const featureKeywords = ['feature', 'function', 'ability', 'can do', 'should', 'must have'];
  if (featureKeywords.some(keyword => messageLower.includes(keyword)) || 
      messageLower.includes('track') || messageLower.includes('manage') || 
      messageLower.includes('create') || messageLower.includes('view')) {
    if (updatedCategories.core_features.confidence === 'low') {
      updatedCategories.core_features = {
        confidence: 'medium',
        data: message,
      };
    }
  }

  // Extract data requirements
  if (messageLower.includes('data') || messageLower.includes('store') || 
      messageLower.includes('save') || messageLower.includes('record') ||
      messageLower.includes('database') || messageLower.includes('information')) {
    if (updatedCategories.data_requirements.confidence === 'low') {
      updatedCategories.data_requirements = {
        confidence: 'medium',
        data: message,
      };
    }
  }

  // Extract integrations
  if (messageLower.includes('integrate') || messageLower.includes('connect') || 
      messageLower.includes('api') || messageLower.includes('sync') ||
      messageLower.includes('stripe') || messageLower.includes('paypal') ||
      messageLower.includes('email') || messageLower.includes('sms')) {
    if (updatedCategories.integrations.confidence === 'low') {
      updatedCategories.integrations = {
        confidence: 'medium',
        data: message,
      };
    }
  }

  // Extract mobile needs
  if (messageLower.includes('mobile') || messageLower.includes('phone') || 
      messageLower.includes('app store') || messageLower.includes('ios') ||
      messageLower.includes('android')) {
    if (updatedCategories.mobile_needs.confidence === 'low') {
      updatedCategories.mobile_needs = {
        confidence: 'high',
        data: message,
      };
    }
  } else if (messageLower.includes('web') || messageLower.includes('browser') ||
             messageLower.includes('desktop')) {
    if (updatedCategories.mobile_needs.confidence === 'low') {
      updatedCategories.mobile_needs = {
        confidence: 'high',
        data: 'Web app only',
      };
    }
  }

  // If message is substantial (longer than 50 chars), increase confidence
  if (message.length > 50) {
    Object.keys(updatedCategories).forEach((key) => {
      const category = updatedCategories[key as keyof typeof updatedCategories];
      if (category.confidence === 'low' && !category.data) {
        // Don't auto-update, but mark that we're getting information
      }
    });
  }

  return { categories: updatedCategories };
}

/**
 * Determines which category to ask about next based on priority and current state
 */
function getNextCategoryToAsk(categories: IntakeState['categories']): string | null {
  // Priority order for questions
  const priorityOrder: Array<keyof typeof categories> = [
    'problem_definition',
    'primary_users',
    'core_features',
    'business_workflow',
    'data_requirements',
    'integrations',
    'mobile_needs',
    'ui_design_preferences',
    'admin_reporting_requirements',
    'automation_notifications',
    'output_needs',
    'security_compliance',
    'performance_requirements',
    'industry_context',
    'success_metrics',
    'nice_to_have_features',
    'technical_constraints',
    'timeline',
    'budget_notes',
    'scale_saas_potential',
  ];

  for (const category of priorityOrder) {
    if (categories[category].confidence === 'low') {
      return category;
    }
  }

  return null;
}

export async function generateNextIntakeTurn(
  sessionState: IntakeState
): Promise<AssistantResponse> {
  // TODO: Replace with actual OpenAI API call
  // For now, use intelligent mock that analyzes responses

  const conversationHistory = sessionState.conversationHistory;
  const lastUserMessage = conversationHistory
    .filter(msg => msg.role === 'user')
    .slice(-1)[0]?.content || '';

  // Analyze the latest user message to extract information
  let updatedState = { ...sessionState };
  if (lastUserMessage) {
    const analysis = analyzeUserMessage(lastUserMessage, sessionState);
    updatedState = {
      ...updatedState,
      categories: {
        ...updatedState.categories,
        ...analysis.categories,
      },
    };
  }

  const categories = updatedState.categories;
  const nextCategory = getNextCategoryToAsk(categories);

  // If we have categories to ask about
  if (nextCategory) {
    const questions = getQuestionsForCategory(nextCategory, conversationHistory);
    
    // Update confidence to medium after asking (will be high after user responds)
    const updatedCategories = {
      ...categories,
      [nextCategory]: {
        confidence: 'medium' as const,
        data: categories[nextCategory].data,
      },
    };

    return {
      questions,
      updatedState: {
        categories: updatedCategories,
      },
      isComplete: false,
    };
  }

  // Check if we have enough information (at least 8 categories with medium+ confidence)
  const filledCategories = Object.values(categories).filter(
    (info) => info.confidence === 'high' || info.confidence === 'medium'
  ).length;

  if (filledCategories >= 8) {
    // Generate MVP prompt
    const mvpPrompt = generateMockMvpPrompt(updatedState);
    return {
      questions: [],
      mvpPrompt,
      isComplete: true,
    };
  }

  // Ask for more general information
  return {
    questions: [
      "Great! Can you tell me more about what success looks like for this app? What would make it valuable to your users?",
    ],
    isComplete: false,
  };
}

function getQuestionsForCategory(
  category: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): string[] {
  const context = conversationHistory
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join(' ')
    .toLowerCase();

  const questionMap: Record<string, (context: string) => string[]> = {
    problem_definition: () => [
      "What specific problem or challenge does your business face that this app would solve?",
    ],
    primary_users: () => [
      "Who are the primary users of this app? (e.g., your employees, customers, patients, students, etc.)",
    ],
    core_features: () => {
      if (context.includes('track') || context.includes('manage')) {
        return [
          "What are the 3-5 most important features that must be in the MVP? What should users be able to do?",
        ];
      }
      return [
        "What are the core features this app must have? What should users be able to do with it?",
      ];
    },
    business_workflow: () => [
      "Can you describe the typical workflow or process? How do people currently handle this, and how should the app change that?",
    ],
    data_requirements: () => [
      "What types of data or information will the app need to store and manage? (e.g., user profiles, transactions, documents, etc.)",
    ],
    integrations: () => [
      "Does this app need to integrate with any existing tools or services? (e.g., payment processors, email services, calendars, etc.)",
    ],
    mobile_needs: () => [
      "Do you need a mobile app (iOS/Android), or is a web app sufficient for your users?",
    ],
    ui_design_preferences: () => [
      "Any specific design preferences? Should it be simple and minimal, or feature-rich? Any colors or styles you have in mind?",
    ],
    admin_reporting_requirements: () => [
      "What kind of admin features or reporting do you need? Should there be dashboards, analytics, or management tools?",
    ],
    automation_notifications: () => [
      "Should the app send automated notifications, emails, or alerts? What events should trigger them?",
    ],
    output_needs: () => [
      "Does the app need to generate reports, exports, invoices, or other documents? What format?",
    ],
    security_compliance: () => [
      "Are there any security or compliance requirements? (e.g., HIPAA, GDPR, PCI-DSS, or industry-specific regulations)",
    ],
    performance_requirements: () => [
      "How many users do you expect? Any performance requirements or scalability concerns?",
    ],
    industry_context: () => [
      "What industry or business type is this for? This helps me understand the context better.",
    ],
    success_metrics: () => [
      "What would make this app successful? How will you measure its impact?",
    ],
    nice_to_have_features: () => [
      "Are there any nice-to-have features that could come later, after the MVP?",
    ],
    technical_constraints: () => [
      "Any technical constraints or requirements? (e.g., must work offline, specific browsers, etc.)",
    ],
    timeline: () => [
      "What's your timeline? When do you need the MVP ready?",
    ],
    budget_notes: () => [
      "Any budget considerations or constraints I should be aware of?",
    ],
    scale_saas_potential: () => [
      "Is there potential to turn this into a SaaS product for other businesses, or is it strictly internal?",
    ],
  };

  const questionFn = questionMap[category];
  if (questionFn) {
    return questionFn(context);
  }

  return [`Tell me more about ${category.replace(/_/g, ' ')}.`];
}

function generateMockMvpPrompt(state: IntakeState): string {
  // TODO: Replace with AI-generated prompt based on all collected information
  // For now, return a template

  return `# MVP BUILD PROMPT

## Project Overview
Based on the intake conversation, here is the MVP specification.

## Core Features
[To be populated from intake data]

## Data Model
[To be populated from intake data]

## Tech Stack Recommendation
- Framework: Next.js (App Router)
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Styling: TailwindCSS
- Hosting: Vercel

## API Integrations
[To be populated from intake data]

## UI Layout
[To be populated from intake data]

## Auth & Security
[To be populated from intake data]

## Deployment Considerations
[To be populated from intake data]

---
Generated by WaveSprint.ai on ${new Date().toISOString()}
`;
}

