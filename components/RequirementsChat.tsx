'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

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

// AI follow-up questions based on context
const getFollowUpQuestions = (industry: string, idea: string) => {
  const baseQuestions = [
    "Who are the primary users of this app? Can you describe a typical user and what they're trying to accomplish?",
    "What's the single most important feature this MVP needs to have? If it could only do one thing well, what would that be?",
    "Are there any existing tools or competitors you've looked at? What do they get right, and what's missing?",
    "Do you need user authentication? If so, should users be able to sign up with email, Google, or other methods?",
    "Will this app need to integrate with any external services? (Payment processing, email, SMS, calendars, etc.)",
    "What does success look like for this MVP? How will you know it's working?",
  ];

  const industrySpecific: Record<string, string[]> = {
    healthcare: [
      "Does this need to be HIPAA compliant? Will it handle protected health information (PHI)?",
      "Will patients/clients need to book appointments? Should it sync with existing calendar systems?",
    ],
    ecommerce: [
      "How many products will you start with? Do you need inventory management?",
      "What payment methods do you need? (Stripe, PayPal, Apple Pay, etc.)",
    ],
    saas: [
      "What's your pricing model? Free trial, freemium, subscription tiers?",
      "Do you need team/organization features, or is this single-user focused?",
    ],
    marketplace: [
      "How will you handle trust between buyers and sellers? Reviews, verification, escrow?",
      "What's the transaction flow? Who pays whom, and when?",
    ],
    education: [
      "Will there be progress tracking or certifications?",
      "Do you need live video, or is this async content delivery?",
    ],
    fintech: [
      "What financial regulations apply? Do you need compliance features?",
      "How sensitive is the data? What level of security is required?",
    ],
    social: [
      "What's the core interaction? Posting, messaging, matching, following?",
      "How do you plan to handle content moderation?",
    ],
    internal: [
      "How many team members will use this? Do you need role-based permissions?",
      "Does this need to integrate with your existing tools? (Slack, Google Workspace, etc.)",
    ],
    other: [],
  };

  const specific = industrySpecific[industry] || [];
  return [...specific, ...baseQuestions];
};

export function RequirementsChat({ initialData, onComplete }: RequirementsChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const questions = getFollowUpQuestions(initialData.industry, initialData.idea);

  // Initialize conversation
  useEffect(() => {
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
      await new Promise(r => setTimeout(r, 1000));

      const greeting: Message = {
        id: 'greeting',
        role: 'assistant',
        content: `Thanks ${initialData.name.split(' ')[0]}! I've received your project idea. Let me ask a few questions to make sure we build exactly what you need.\n\nI see you're building something for the ${initialData.industry} space. Let's dig into the details.`,
        timestamp: new Date(),
      };

      setMessages([systemMsg, greeting]);
      setIsTyping(false);

      // First question after a delay
      await new Promise(r => setTimeout(r, 1500));
      askNextQuestion(0, [systemMsg, greeting]);
    };

    initConversation();
  }, []);

  const askNextQuestion = async (index: number, currentMessages: Message[]) => {
    if (index >= questions.length || index >= 6) {
      // Max 6 questions, then wrap up
      await wrapUp(currentMessages);
      return;
    }

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const questionMsg: Message = {
      id: `question-${index}`,
      role: 'assistant',
      content: questions[index],
      timestamp: new Date(),
    };

    setMessages([...currentMessages, questionMsg]);
    setQuestionIndex(index + 1);
    setIsTyping(false);
  };

  const wrapUp = async (currentMessages: Message[]) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));

    const wrapUpMsg: Message = {
      id: 'wrapup',
      role: 'assistant',
      content: `This is really helpful! I have a clear picture of what you're building.\n\n**Summary:**\n- ${initialData.industry.charAt(0).toUpperCase() + initialData.industry.slice(1)} app focused on ${initialData.idea.slice(0, 100)}...\n- Timeline: ${initialData.timeline}\n- Budget: ${initialData.budget}\n\nI'm ready to start the sprint. You'll receive a detailed scope document within 2 hours, and we'll begin building immediately after your approval.\n\nAnything else you want to add before we kick off?`,
      timestamp: new Date(),
    };

    setMessages([...currentMessages, wrapUpMsg]);
    setIsTyping(false);
    setIsComplete(true);
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
      // Final confirmation
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));

      const finalMsg: Message = {
        id: 'final',
        role: 'assistant',
        content: "Perfect! I've captured everything. You'll hear from us within 2 hours with your scope document. Get ready to see your idea come to life! 🚀",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, finalMsg];
      setMessages(finalMessages);
      setIsTyping(false);

      // Trigger completion callback
      setTimeout(() => onComplete(finalMessages), 2000);
    } else {
      // Continue with next question
      await askNextQuestion(questionIndex, newMessages);
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
            <p className="text-xs text-text-muted">Gathering project details</p>
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
          <span>{Math.min(questionIndex, 6)} of 6 questions</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan to-purple"
            initial={{ width: '0%' }}
            animate={{ width: `${(Math.min(questionIndex, 6) / 6) * 100}%` }}
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
            placeholder={isTyping ? "Waiting for response..." : "Type your answer..."}
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
