import { NextRequest, NextResponse } from 'next/server';
import { generateRequirementsQuestion, isClaudeConfigured } from '@/lib/ai/claude';
import type { ConversationMessage, RequirementsContext } from '@/lib/ai/claude';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leadName,
      industry,
      initialIdea,
      timeline,
      budget,
      conversationHistory,
      userMessage,
    } = body;

    // Validate required fields
    if (!leadName || !initialIdea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Claude API is configured
    if (!isClaudeConfigured()) {
      // Return a fallback response if API key not configured
      console.warn('Claude API key not configured, using fallback response');
      return NextResponse.json({
        question: getFallbackQuestion(conversationHistory?.length || 0),
        isComplete: (conversationHistory?.length || 0) >= 6,
      });
    }

    // Build the updated conversation history
    const history: ConversationMessage[] = conversationHistory || [];

    // Add the user's new message if provided
    if (userMessage) {
      history.push({
        role: 'user',
        content: userMessage,
      });
    }

    // Build context for Claude
    const context: RequirementsContext = {
      leadName,
      industry: industry || 'general',
      initialIdea,
      timeline: timeline || 'ASAP',
      budget: budget || 'Flexible',
      conversationHistory: history,
      questionsAsked: Math.floor(history.filter(m => m.role === 'assistant').length),
    };

    // Generate the next question using Claude
    const response = await generateRequirementsQuestion(context);

    return NextResponse.json({
      question: response.question,
      isComplete: response.isComplete,
    });
  } catch (error) {
    console.error('Error in requirements chat API:', error);

    // Return a graceful fallback
    return NextResponse.json({
      question: "Thanks for sharing! I want to make sure I understand your needs correctly. Could you tell me more about the main problem this app will solve?",
      isComplete: false,
    });
  }
}

// Fallback questions when API is not available
function getFallbackQuestion(questionCount: number): string {
  const fallbackQuestions = [
    "Thanks for sharing! Who are the primary users of this app, and what problem does it solve for them?",
    "What are the 2-3 must-have features for the MVP?",
    "Will users need to log in? And do you need any integrations like payments, email, or calendars?",
    "What kind of data will the app need to store and manage?",
    "Any specific design preferences? Minimal and clean, or feature-rich?",
    "Great! I think I have a good picture. Is there anything else you'd like to add before we start building?",
  ];

  if (questionCount >= fallbackQuestions.length) {
    return "Perfect! I have everything I need to start your sprint. You'll receive a detailed scope document within 2 hours.";
  }

  return fallbackQuestions[questionCount];
}
