'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type WaveSprintConsoleProps = {
  onComplete?: (mvpPrompt: string) => void;
};

export function WaveSprintConsole({ onComplete }: WaveSprintConsoleProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mvpPrompt, setMvpPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      if (data.messages) {
        setMessages((prev) => [
          ...prev,
          ...data.messages.map((msg: { role: string; content: string }) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(),
          })),
        ]);
      }

      if (data.mvpPrompt) {
        setMvpPrompt(data.mvpPrompt);
        if (onComplete) {
          onComplete(data.mvpPrompt);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your message. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Console Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 via-purple/20 to-pink/20 rounded-lg blur-xl opacity-50 animate-glow" />
          <div className="relative border-2 border-cyan/30 rounded-lg bg-background/80 backdrop-blur-sm p-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the app you wish existed for your business. Who uses it, and what does it do?"
                className="min-h-[200px] bg-transparent border-none focus-visible:ring-2 focus-visible:ring-cyan/50 text-text placeholder:text-text/50 resize-none text-lg"
                disabled={isLoading}
              />
              <div className="flex justify-end px-2 pb-2">
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-cyan hover:bg-cyan/90 text-background"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Transmit Signal
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Status Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-cyan/70 text-sm mb-4"
        >
          Interpreting your signal...
        </motion.div>
      )}

      {/* Messages Thread */}
      {messages.length > 0 && (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-cyan/20 text-text border border-cyan/30'
                    : 'bg-purple/10 text-text border border-purple/30'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'WaveSprint'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* MVP Prompt Display */}
      {mvpPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-background/90 border-pink/30 border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent">
                  MVP BUILD PROMPT
                </CardTitle>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(mvpPrompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-pink/30 text-pink"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-text/90 bg-background/50 p-4 rounded border border-pink/10 max-h-[500px] overflow-y-auto">
                {mvpPrompt}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

