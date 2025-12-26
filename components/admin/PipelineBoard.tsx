'use client';

import { useState } from 'react';
import { Lead, PipelineStage } from '@/types/database';
import { LeadCard } from './LeadCard';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface PipelineBoardProps {
  stages: PipelineStage[];
  leads: (Lead & { pipeline_stage?: PipelineStage })[];
  onMoveStage?: (leadId: string, newStageId: string) => void;
}

export function PipelineBoard({ stages, leads, onMoveStage }: PipelineBoardProps) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const getLeadsForStage = (stageId: string) => {
    return leads.filter(lead => lead.pipeline_stage_id === stageId);
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (stageId: string) => {
    if (draggedLead && onMoveStage) {
      onMoveStage(draggedLead, stageId);
    }
    setDraggedLead(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {stages.map((stage) => {
        const stageLeads = getLeadsForStage(stage.id);
        const isDropTarget = dragOverStage === stage.id;

        return (
          <div
            key={stage.id}
            className={`flex-shrink-0 w-80 bg-background/40 rounded-xl border transition-all ${
              isDropTarget
                ? 'border-cyan/50 bg-cyan/5'
                : 'border-white/10'
            }`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(stage.id)}
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color || '#fff' }}
                  />
                  <h3 className="font-semibold text-text">{stage.name}</h3>
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-full text-xs text-text-muted">
                  <Users className="w-3 h-3" />
                  {stageLeads.length}
                </span>
              </div>
            </div>

            {/* Leads */}
            <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
              {stageLeads.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  No leads in this stage
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className={`transition-opacity ${
                      draggedLead === lead.id ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <LeadCard lead={lead} showStage={false} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
