'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface RequirementsChatProps {
  initialData: {
    idea: string;
    industry: string;
    timeline: string;
    budget: string;
    name: string;
    email: string;
    company?: string;
  };
  onComplete: (messages: Message[]) => void;
}

export function RequirementsChat({ initialData, onComplete }: RequirementsChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasInitialized = useRef(false);

  // Get conversation history in format for API
  const getConversationHistory = useCallback((msgs: Message[]) => {
    return msgs
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
  }, []);

  // Fetch next question from Claude API
  const fetchNextQuestion = useCallback(async (
    currentMessages: Message[],
    userMessage?: string
  ): Promise<{ question: string; isComplete: boolean }> => {
    try {
      const response = await fetch('/api/chat/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: initialData.name,
          industry: initialData.industry,
          initialIdea: initialData.idea,
          timeline: initialData.timeline,
          budget: initialData.budget,
          conversationHistory: getConversationHistory(currentMessages),
          userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching next question:', error);
      // Fallback response
      return {
        question: "Thanks for sharing! Could you tell me more about the key features you need for this MVP?",
        isComplete: false,
      };
    }
  }, [initialData, getConversationHistory]);

  // Initialize conversation
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initConversation = async () => {
      // System message (not shown to user)
      const systemMsg: Message = {
        id: 'system-1',
        role: 'system',
        content: `Project: ${initialData.idea}\nIndustry: ${initialData.industry}\nTimeline: ${initialData.timeline}\nBudget: ${initialData.budget}`,
        timestamp: new Date(),
      };

      // Initial greeting
      setIsTyping(true);

      // Simulate AI thinking time
      await new Promise(r => setTimeout(r, 800));

      const greeting: Message = {
        id: 'greeting',
        role: 'assistant',
        content: `Thanks ${initialData.name.split(' ')[0]}! I've received your project idea. Let me ask a few questions to make sure we build exactly what you need.\n\nI see you're building something for the ${initialData.industry} space. Let's dig into the details.`,
        timestamp: new Date(),
      };

      const initialMessages = [systemMsg, greeting];
      setMessages(initialMessages);
      setIsTyping(false);

      // First question after a delay
      await new Promise(r => setTimeout(r, 1000));
      await askNextQuestion(initialMessages);
    };

    initConversation();
  }, [initialData]);

  const askNextQuestion = async (currentMessages: Message[]) => {
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    const result = await fetchNextQuestion(currentMessages);

    const questionMsg: Message = {
      id: `question-${Date.now()}`,
      role: 'assistant',
      content: result.question,
      timestamp: new Date(),
    };

    const newMessages = [...currentMessages, questionMsg];
    setMessages(newMessages);
    setQuestionCount(prev => prev + 1);
    setIsTyping(false);

    if (result.isComplete) {
      setIsComplete(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    if (isComplete) {
      // Final confirmation - user added something after wrap-up
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 800));

      const finalMsg: Message = {
        id: 'final',
        role: 'assistant',
        content: "Perfect! I've captured everything. You'll hear from us within 2 hours with your scope document. Get ready to see your idea come to life!",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, finalMsg];
      setMessages(finalMessages);
      setIsTyping(false);

      // Trigger completion callback
      setTimeout(() => onComplete(finalMessages), 2000);
    } else {
      // Fetch next question from Claude
      await askNextQuestion(newMessages);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input after typing stops
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  return (
    <div className="flex flex-col h-[600px] rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
            <Bot className="w-5 h-5 text-background" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Requirements Assistant</h3>
            <p className="text-xs text-text-muted">AI-powered project discovery</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.filter(m => m.role !== 'system').map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-cyan/20 text-cyan'
                  : 'bg-purple/20 text-purple'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {/* Message bubble */}
              <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-cyan/10 border border-cyan/20 text-text'
                    : 'bg-white/5 border border-white/10 text-text'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-text-muted mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-purple/20 text-purple flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-2 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>Requirements gathering</span>
          <span>{Math.min(questionCount, 6)} of ~6 questions</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan to-purple"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min((questionCount / 6) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-background/80">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "AI is thinking..." : "Type your answer..."}
            disabled={isTyping}
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/30 focus:ring-1 focus:ring-cyan/20 resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 rounded-xl bg-cyan text-background font-semibold hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
