'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { PipelineBoard } from '@/components/admin/PipelineBoard';
import { LeadCard } from '@/components/admin/LeadCard';
import type { Lead, PipelineStage } from '@/types/database';
import { Lock, LayoutDashboard, Kanban, Users, Clock, RefreshCw, LogOut } from 'lucide-react';

type ViewMode = 'dashboard' | 'pipeline' | 'leads';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  // Data
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [leads, setLeads] = useState<(Lead & { pipeline_stage?: PipelineStage })[]>([]);
  const [stats, setStats] = useState<{
    totalLeads: number;
    leadsByStage: Record<string, number>;
    recentLeads: Lead[];
    upcomingFollowups: Lead[];
  }>({
    totalLeads: 0,
    leadsByStage: {},
    recentLeads: [],
    upcomingFollowups: [],
  });

  useEffect(() => {
    const key = localStorage.getItem('admin_key');
    if (key) {
      setStoredKey(key);
      setIsAuthenticated(true);
      fetchAllData(key);
    }
  }, []);

  const handleLogin = () => {
    if (adminKey.trim()) {
      localStorage.setItem('admin_key', adminKey);
      setStoredKey(adminKey);
      setIsAuthenticated(true);
      fetchAllData(adminKey);
    }
  };

  const fetchAllData = async (key: string) => {
    setLoading(true);
    try {
      const [pipelineRes, statsRes] = await Promise.all([
        fetch('/api/admin/pipeline', {
          headers: { 'x-admin-key': key },
        }),
        fetch('/api/admin/stats', {
          headers: { 'x-admin-key': key },
        }),
      ]);

      if (pipelineRes.ok) {
        const data = await pipelineRes.json();
        setStages(data.stages || []);
        setLeads(data.leads || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          totalLeads: data.totalLeads || 0,
          leadsByStage: data.leadsByStage || {},
          recentLeads: data.recentLeads || [],
          upcomingFollowups: data.upcomingFollowups || [],
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStage = async (leadId: string, newStageId: string) => {
    if (!storedKey) return;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': storedKey,
        },
        body: JSON.stringify({ pipeline_stage_id: newStageId }),
      });

      if (res.ok) {
        // Update local state
        setLeads(leads.map(lead => {
          if (lead.id === leadId) {
            const newStage = stages.find(s => s.id === newStageId);
            return {
              ...lead,
              pipeline_stage_id: newStageId,
              pipeline_stage: newStage,
            };
          }
          return lead;
        }));
      }
    } catch (error) {
      console.error('Error moving lead:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setStoredKey(null);
    setIsAuthenticated(false);
    setLeads([]);
    setStages([]);
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
              Enter your admin key to access the CRM dashboard.
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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                WaveSprint CRM
              </h1>

              {/* View Tabs */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'dashboard'
                      ? 'bg-cyan text-background'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setViewMode('pipeline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'pipeline'
                      ? 'bg-cyan text-background'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                  Pipeline
                </button>
                <button
                  onClick={() => setViewMode('leads')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'leads'
                      ? 'bg-cyan text-background'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  All Leads
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => storedKey && fetchAllData(storedKey)}
                variant="outline"
                size="sm"
                className="border-white/10 text-text-muted hover:text-text"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/10 text-text-muted hover:text-text"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan" />
          </div>
        ) : (
          <>
            {viewMode === 'dashboard' && (
              <div className="space-y-8">
                <DashboardStats
                  totalLeads={stats.totalLeads}
                  leadsByStage={stats.leadsByStage}
                  stages={stages}
                />

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Leads */}
                  <Card className="bg-background/60 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="w-5 h-5 text-cyan" />
                        Recent Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.recentLeads.length === 0 ? (
                          <p className="text-text-muted text-sm py-4 text-center">
                            No leads yet
                          </p>
                        ) : (
                          stats.recentLeads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} compact />
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Followups */}
                  <Card className="bg-background/60 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5 text-purple" />
                        Upcoming Followups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.upcomingFollowups.length === 0 ? (
                          <p className="text-text-muted text-sm py-4 text-center">
                            No scheduled followups
                          </p>
                        ) : (
                          stats.upcomingFollowups.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} compact />
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {viewMode === 'pipeline' && (
              <PipelineBoard
                stages={stages}
                leads={leads}
                onMoveStage={handleMoveStage}
              />
            )}

            {viewMode === 'leads' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.length === 0 ? (
                  <p className="text-text-muted col-span-full text-center py-12">
                    No leads yet
                  </p>
                ) : (
                  leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
