// Claude AI Client for WaveSprint
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model selection - use Haiku for cost efficiency
const DEFAULT_MODEL = 'claude-3-haiku-20240307';
const SMART_MODEL = 'claude-3-5-sonnet-20241022';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface RequirementsContext {
  leadName: string;
  industry: string;
  initialIdea: string;
  timeline: string;
  budget: string;
  conversationHistory: ConversationMessage[];
  questionsAsked: number;
}

/**
 * System prompt for the requirements gathering agent
 */
const REQUIREMENTS_SYSTEM_PROMPT = `You are a friendly, expert requirements analyst for WaveSprint.ai - a rapid MVP development service that builds working apps in 24 hours.

Your job is to have a natural conversation to gather project requirements. You're speaking directly with a potential client who just submitted their initial project idea.

Guidelines:
1. Be conversational and friendly - use their first name
2. Ask ONE focused question at a time (never more than 2)
3. Build on what they've already told you - reference specifics from their answers
4. Focus on practical, actionable details that will help build the MVP
5. Don't repeat questions they've already answered
6. After 5-6 good exchanges, wrap up and confirm you have what you need

Key areas to cover (prioritize based on what's missing):
- Who uses this app and what problem does it solve for them?
- What are the 2-3 must-have features for the MVP?
- Any integrations needed? (payments, email, SMS, calendars, etc.)
- Does it need user accounts/login?
- Any specific data that needs to be stored/managed?

When you have enough info (after 5-6 exchanges), generate a summary and indicate you're ready to start the sprint.

Respond in a natural, conversational way. Don't use bullet points or formal structure in your questions - just talk like a helpful consultant.`;

/**
 * Generate the next question in the requirements conversation
 */
export async function generateRequirementsQuestion(
  context: RequirementsContext
): Promise<{ question: string; isComplete: boolean }> {
  // Build the conversation messages for Claude
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // Add initial context as first user message
  const initialContext = `Hi, I'm ${context.leadName}. I'm in the ${context.industry} space and here's my idea:

${context.initialIdea}

Timeline: ${context.timeline}
Budget: ${context.budget}`;

  messages.push({ role: 'user', content: initialContext });

  // Add conversation history
  for (const msg of context.conversationHistory) {
    messages.push(msg);
  }

  // Determine if we should wrap up
  const shouldWrapUp = context.questionsAsked >= 5;

  let systemPrompt = REQUIREMENTS_SYSTEM_PROMPT;
  if (shouldWrapUp) {
    systemPrompt += `\n\nIMPORTANT: You've asked ${context.questionsAsked} questions. It's time to wrap up.
Summarize what you've learned and confirm you're ready to start building.
End your message with: "I have everything I need to start your sprint!"`;
  }

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 500,
      system: systemPrompt,
      messages: messages,
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Check if the conversation is complete
    const isComplete = assistantMessage.toLowerCase().includes('everything i need') ||
                       assistantMessage.toLowerCase().includes('ready to start') ||
                       context.questionsAsked >= 6;

    return {
      question: assistantMessage,
      isComplete,
    };
  } catch (error) {
    console.error('Claude API error:', error);

    // Fallback to a generic question if API fails
    return {
      question: "Thanks for sharing! Could you tell me more about the main users of this app and what they'd use it for most?",
      isComplete: false,
    };
  }
}

/**
 * Generate an MVP specification from the conversation
 */
export async function generateMvpSpec(
  context: RequirementsContext
): Promise<string> {
  const conversationText = context.conversationHistory
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n');

  const prompt = `Based on this requirements conversation, generate a detailed MVP specification.

Client: ${context.leadName}
Industry: ${context.industry}
Initial Idea: ${context.initialIdea}
Timeline: ${context.timeline}
Budget: ${context.budget}

CONVERSATION:
${conversationText}

Generate a structured MVP specification including:
1. Project Overview (2-3 sentences)
2. Core Features (bullet points, prioritized)
3. User Types & Roles
4. Data Model (key entities and relationships)
5. Required Integrations
6. Tech Stack Recommendation
7. MVP Scope (what's in vs out)
8. Estimated Build Complexity (Low/Medium/High)

Format it as a clean, professional specification document.`;

  try {
    const response = await anthropic.messages.create({
      model: SMART_MODEL, // Use Sonnet for better spec generation
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : 'Error generating specification';
  } catch (error) {
    console.error('Claude API error generating spec:', error);
    return 'Error generating MVP specification. Please try again.';
  }
}

/**
 * Check if the API key is configured
 */
export function isClaudeConfigured(): boolean {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  return !!apiKey && apiKey !== 'your_anthropic_api_key' && apiKey.startsWith('sk-');
}
