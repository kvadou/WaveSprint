'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { IntakeSession, IntakeMessage, MvpPrompt } from '@/types/database';
import { ArrowLeft, Copy, Check } from 'lucide-react';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<IntakeSession | null>(null);
  const [messages, setMessages] = useState<IntakeMessage[]>([]);
  const [mvpPrompt, setMvpPrompt] = useState<MvpPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const adminKey = localStorage.getItem('admin_key');
      if (!adminKey) {
        window.location.href = '/admin';
        return;
      }

      try {
        const response = await fetch(`/api/admin/sessions/${sessionId}`, {
          headers: { 'x-admin-key': adminKey },
        });

        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
          setMessages(data.messages || []);
          setMvpPrompt(data.mvpPrompt);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const handleCopyPrompt = () => {
    if (mvpPrompt) {
      navigator.clipboard.writeText(mvpPrompt.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto text-center text-text/70">
          Loading session details...
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto text-center text-text/70">
          Session not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <Button
          asChild
          variant="outline"
          className="mb-6 border-cyan/50 text-cyan"
        >
          <a href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </a>
        </Button>

        <Card className="bg-background/80 border-cyan/20 mb-6">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-text/70">Status:</span>{' '}
                <span
                  className={
                    session.status === 'complete'
                      ? 'text-cyan'
                      : 'text-pink'
                  }
                >
                  {session.status}
                </span>
              </div>
              <div>
                <span className="text-text/70">Created:</span>{' '}
                {new Date(session.created_at).toLocaleString()}
              </div>
              <div>
                <span className="text-text/70">Updated:</span>{' '}
                {new Date(session.updated_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        <Card className="bg-background/80 border-purple/20 mb-6">
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-text/70">No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-cyan/10 border border-cyan/20'
                        : 'bg-purple/10 border border-purple/20'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-2">
                      {message.role === 'user' ? 'User' : 'WaveSprint'}
                    </div>
                    <div className="whitespace-pre-wrap text-text/90">
                      {message.content}
                    </div>
                    <div className="text-xs text-text/50 mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* MVP Prompt */}
        {mvpPrompt && (
          <Card className="bg-background/80 border-pink/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>MVP Build Prompt</CardTitle>
                <Button
                  onClick={handleCopyPrompt}
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
              <pre className="whitespace-pre-wrap text-sm text-text/90 bg-background/50 p-4 rounded border border-pink/10 max-h-[600px] overflow-y-auto">
                {mvpPrompt.prompt_text}
              </pre>
              <div className="text-xs text-text/50 mt-2">
                Generated: {new Date(mvpPrompt.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

