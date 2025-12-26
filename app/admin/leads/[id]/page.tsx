'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActivityTimeline } from '@/components/admin/ActivityTimeline';
import type { Lead, PipelineStage, Activity } from '@/types/database';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Star,
  Tag,
  FileText,
  Send,
  MessageSquare,
  RefreshCw,
  Save,
  Edit2,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<(Lead & { pipeline_stage?: PipelineStage }) | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [editedNotes, setEditedNotes] = useState('');

  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('admin_key') : null;

  useEffect(() => {
    if (leadId && storedKey) {
      fetchLeadData();
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    if (!storedKey) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        headers: { 'x-admin-key': storedKey },
      });

      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setActivities(data.activities || []);
        setEditedNotes(data.lead?.notes || '');
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!storedKey || !noteContent.trim()) return;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': storedKey,
        },
        body: JSON.stringify({
          type: 'note',
          title: 'Note Added',
          content: noteContent,
        }),
      });

      if (res.ok) {
        setNoteContent('');
        fetchLeadData();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!storedKey) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': storedKey,
        },
        body: JSON.stringify({ notes: editedNotes }),
      });

      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan" />
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">Lead not found</p>
        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </main>
    );
  }

  const firstName = lead.name.split(' ')[0];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-text-muted hover:text-text"
              >
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="text-xl font-semibold text-text">{lead.name}</h1>
              {lead.pipeline_stage && (
                <span
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: `${lead.pipeline_stage.color}20`,
                    color: lead.pipeline_stage.color || '#fff',
                  }}
                >
                  {lead.pipeline_stage.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="border-white/10">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <Card className="bg-background/60 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center text-2xl font-bold text-text">
                    {firstName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-lg">{lead.name}</h3>
                    {lead.company && (
                      <p className="text-text-muted flex items-center gap-1.5 text-sm">
                        <Building2 className="w-3.5 h-3.5" />
                        {lead.company}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-text-muted" />
                    <a href={`mailto:${lead.email}`} className="text-cyan hover:underline">
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-text-muted" />
                      <a href={`tel:${lead.phone}`} className="text-text hover:text-cyan">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.industry && (
                    <div className="flex items-center gap-3 text-sm">
                      <Tag className="w-4 h-4 text-text-muted" />
                      <span className="text-text capitalize">{lead.industry}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <span className="text-text-muted">
                      Added {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Lead Score */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-muted">Lead Score</span>
                    <span className="flex items-center gap-1 font-semibold text-amber-400">
                      <Star className="w-4 h-4" />
                      {lead.lead_score}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${lead.lead_score}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-sm text-text-muted mb-2 block">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-purple/10 text-purple border border-purple/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="bg-background/60 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </CardTitle>
                  {!editMode ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode(true)}
                      className="text-text-muted hover:text-text"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditMode(false);
                          setEditedNotes(lead.notes || '');
                        }}
                        className="text-text-muted hover:text-text"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={saving}
                        className="text-cyan hover:text-cyan"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full h-32 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/30 resize-none"
                    placeholder="Add notes about this lead..."
                  />
                ) : (
                  <p className="text-sm text-text-muted whitespace-pre-wrap">
                    {lead.notes || 'No notes yet'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Project Idea */}
            {lead.problem_description && (
              <Card className="bg-background/60 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Project Idea</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text whitespace-pre-wrap">
                    {lead.problem_description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-background/60 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Quick Add Note */}
                <div className="flex gap-3 mb-6 pb-6 border-b border-white/5">
                  <Input
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a quick note..."
                    className="bg-white/5 border-white/10"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!noteContent.trim()}
                    className="bg-cyan hover:bg-cyan/90 text-background"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Timeline */}
                <ActivityTimeline activities={activities} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
