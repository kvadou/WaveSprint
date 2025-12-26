'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Lead, IntakeSession } from '@/types/database';
import { Lock, ExternalLink } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sessions, setSessions] = useState<IntakeSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if admin key is stored in localStorage
    const key = localStorage.getItem('admin_key');
    if (key) {
      setStoredKey(key);
      setIsAuthenticated(true);
      fetchData(key);
    }
  }, []);

  const handleLogin = () => {
    if (adminKey.trim()) {
      localStorage.setItem('admin_key', adminKey);
      setStoredKey(adminKey);
      setIsAuthenticated(true);
      fetchData(adminKey);
    }
  };

  const fetchData = async (key: string) => {
    setLoading(true);
    try {
      const [leadsRes, sessionsRes] = await Promise.all([
        fetch('/api/admin/leads', {
          headers: { 'x-admin-key': key },
        }),
        fetch('/api/admin/sessions', {
          headers: { 'x-admin-key': key },
        }),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setStoredKey(null);
    setIsAuthenticated(false);
    setLeads([]);
    setSessions([]);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background">
        <Card className="w-full max-w-md bg-background/80 border-cyan/20">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-cyan" />
              <CardTitle>Admin Access</CardTitle>
            </div>
            <p className="text-sm text-text/70">
              Enter your admin key to access the dashboard.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-background/50"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-cyan hover:bg-cyan/90 text-background"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-cyan/50 text-cyan"
          >
            Logout
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-text/70">Loading...</div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Leads Section */}
            <Card className="bg-background/80 border-cyan/20">
              <CardHeader>
                <CardTitle>Recent Leads ({leads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {leads.length === 0 ? (
                    <p className="text-text/70">No leads yet.</p>
                  ) : (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 bg-background/50 rounded-lg border border-cyan/10"
                      >
                        <div className="font-semibold text-cyan mb-1">
                          {lead.name}
                        </div>
                        <div className="text-sm text-text/70">
                          {lead.email}
                        </div>
                        {lead.company && (
                          <div className="text-sm text-text/70">
                            {lead.company}
                          </div>
                        )}
                        {lead.industry && (
                          <div className="text-sm text-text/70">
                            Industry: {lead.industry}
                          </div>
                        )}
                        <div className="text-xs text-text/50 mt-2">
                          {new Date(lead.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sessions Section */}
            <Card className="bg-background/80 border-purple/20">
              <CardHeader>
                <CardTitle>Intake Sessions ({sessions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {sessions.length === 0 ? (
                    <p className="text-text/70">No sessions yet.</p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 bg-background/50 rounded-lg border border-purple/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-purple">
                            Session {session.id.slice(0, 8)}...
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              session.status === 'complete'
                                ? 'bg-cyan/20 text-cyan'
                                : 'bg-pink/20 text-pink'
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <div className="text-xs text-text/50 mb-2">
                          {new Date(session.created_at).toLocaleString()}
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mt-2 border-purple/30 text-purple"
                        >
                          <a
                            href={`/admin/sessions/${session.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

