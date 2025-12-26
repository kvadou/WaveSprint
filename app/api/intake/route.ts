import { NextRequest, NextResponse } from 'next/server';
import {
  createLead,
  createIntakeSession,
  appendIntakeMessage,
  saveMvpPrompt,
  getIntakeSession,
  getIntakeMessages,
  updateIntakeSessionStatus,
  updateIntakeSessionState,
} from '@/lib/db';
import { generateNextIntakeTurn } from '@/lib/ai/assistant';
import type { IntakeState } from '@/types/intake';

// Initialize default intake state
function getDefaultIntakeState(): IntakeState {
  const categories: IntakeState['categories'] = {
    problem_definition: { confidence: 'low', data: null },
    primary_users: { confidence: 'low', data: null },
    business_workflow: { confidence: 'low', data: null },
    success_metrics: { confidence: 'low', data: null },
    core_features: { confidence: 'low', data: null },
    nice_to_have_features: { confidence: 'low', data: null },
    data_requirements: { confidence: 'low', data: null },
    security_compliance: { confidence: 'low', data: null },
    integrations: { confidence: 'low', data: null },
    ui_design_preferences: { confidence: 'low', data: null },
    industry_context: { confidence: 'low', data: null },
    performance_requirements: { confidence: 'low', data: null },
    mobile_needs: { confidence: 'low', data: null },
    admin_reporting_requirements: { confidence: 'low', data: null },
    automation_notifications: { confidence: 'low', data: null },
    output_needs: { confidence: 'low', data: null },
    technical_constraints: { confidence: 'low', data: null },
    timeline: { confidence: 'low', data: null },
    budget_notes: { confidence: 'low', data: null },
    scale_saas_potential: { confidence: 'low', data: null },
  };

  return {
    categories,
    conversationHistory: [],
    isComplete: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let currentSessionId = sessionId;
    let intakeState: IntakeState;

    // If no sessionId, create new session and lead
    if (!currentSessionId) {
      // Extract email from message if possible (simple heuristic)
      // In production, you might want to ask for email first
      const lead = await createLead({
        name: 'Anonymous',
        email: `temp-${Date.now()}@wavesprint.ai`,
        company: null,
        industry: null,
        problem_description: message,
      });

      const defaultState = getDefaultIntakeState();
      const session = await createIntakeSession({
        lead_id: lead.id,
        status: 'in_progress',
        state_json: defaultState,
      });

      currentSessionId = session.id;
      intakeState = defaultState;
    } else {
      // Load existing session
      const session = await getIntakeSession(currentSessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      // Load conversation history
      const messages = await getIntakeMessages(currentSessionId);
      
      // Load persisted state or create default
      if (session.state_json && typeof session.state_json === 'object') {
        intakeState = session.state_json as IntakeState;
        // Ensure conversation history is up to date
        intakeState.conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      } else {
        // Fallback to default state
        intakeState = getDefaultIntakeState();
        intakeState.conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      }
    }

    // Save user message
    await appendIntakeMessage({
      intake_session_id: currentSessionId,
      role: 'user',
      content: message,
    });

    // Update conversation history
    intakeState.conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Generate AI response
    const aiResponse = await generateNextIntakeTurn(intakeState);

    // Merge updated state from AI response
    if (aiResponse.updatedState) {
      intakeState = {
        ...intakeState,
        categories: {
          ...intakeState.categories,
          ...aiResponse.updatedState.categories,
        },
        isComplete: aiResponse.isComplete,
      };
    }

    // Save updated state to database
    await updateIntakeSessionState(currentSessionId, intakeState);

    // Save assistant messages
    const assistantMessages = aiResponse.questions.map((question) => ({
      role: 'assistant' as const,
      content: question,
    }));

    for (const msg of assistantMessages) {
      await appendIntakeMessage({
        intake_session_id: currentSessionId,
        role: msg.role,
        content: msg.content,
      });
    }

    // If complete, save MVP prompt
    if (aiResponse.isComplete && aiResponse.mvpPrompt) {
      await saveMvpPrompt({
        intake_session_id: currentSessionId,
        prompt_text: aiResponse.mvpPrompt,
      });

      await updateIntakeSessionStatus(currentSessionId, 'complete');
    }

    return NextResponse.json({
      sessionId: currentSessionId,
      messages: assistantMessages,
      mvpPrompt: aiResponse.mvpPrompt || null,
      isComplete: aiResponse.isComplete,
    });
  } catch (error) {
    console.error('Error in intake API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

