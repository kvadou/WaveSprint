'use client';

import { Lead, PipelineStage } from '@/types/database';
import { Mail, Phone, Building2, Calendar, Star, Tag, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface LeadCardProps {
  lead: Lead & { pipeline_stage?: PipelineStage };
  showStage?: boolean;
  compact?: boolean;
}

export function LeadCard({ lead, showStage = true, compact = false }: LeadCardProps) {
  const firstName = lead.name.split(' ')[0];
  const scoreColor = lead.lead_score >= 70 ? 'text-emerald-400' :
                     lead.lead_score >= 40 ? 'text-amber-400' : 'text-text-muted';

  if (compact) {
    return (
      <Link href={`/admin/leads/${lead.id}`}>
        <div className="p-3 bg-background/50 rounded-lg border border-white/10 hover:border-cyan/30 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center text-sm font-semibold text-text">
                {firstName[0]}
              </div>
              <div>
                <div className="font-medium text-text text-sm">{lead.name}</div>
                <div className="text-xs text-text-muted">{lead.email}</div>
              </div>
            </div>
            {lead.lead_score > 0 && (
              <div className={`flex items-center gap-1 ${scoreColor}`}>
                <Star className="w-3 h-3" />
                <span className="text-xs font-medium">{lead.lead_score}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/admin/leads/${lead.id}`}>
      <div className="p-4 bg-background/60 rounded-xl border border-white/10 hover:border-cyan/30 transition-all hover:shadow-lg hover:shadow-cyan/5 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center text-lg font-semibold text-text">
              {firstName[0]}
            </div>
            <div>
              <div className="font-semibold text-text group-hover:text-cyan transition-colors">{lead.name}</div>
              {lead.company && (
                <div className="text-sm text-text-muted flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {lead.company}
                </div>
              )}
            </div>
          </div>
          <button className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-text-muted">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-text-muted">
              <Phone className="w-3.5 h-3.5" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {lead.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-purple/10 text-purple border border-purple/20">
                {tag}
              </span>
            ))}
            {lead.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-text-muted">
                +{lead.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            {showStage && lead.pipeline_stage && (
              <span
                className="px-2 py-0.5 text-xs rounded-full font-medium"
                style={{
                  backgroundColor: `${lead.pipeline_stage.color}20`,
                  color: lead.pipeline_stage.color || '#fff'
                }}
              >
                {lead.pipeline_stage.name}
              </span>
            )}
            {lead.lead_score > 0 && (
              <div className={`flex items-center gap-1 ${scoreColor}`}>
                <Star className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{lead.lead_score}</span>
              </div>
            )}
          </div>
          <div className="text-xs text-text-muted flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(lead.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
