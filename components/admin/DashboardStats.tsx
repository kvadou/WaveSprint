'use client';

import { Lead, PipelineStage } from '@/types/database';
import { Users, TrendingUp, Clock, CheckCircle2, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardStatsProps {
  totalLeads: number;
  leadsByStage: Record<string, number>;
  stages: PipelineStage[];
  recentLeadsCount?: number;
}

export function DashboardStats({ totalLeads, leadsByStage, stages, recentLeadsCount = 0 }: DashboardStatsProps) {
  // Calculate pipeline value (leads not in Won/Lost)
  const activeLeads = stages
    .filter(s => !s.is_final)
    .reduce((sum, stage) => sum + (leadsByStage[stage.id] || 0), 0);

  // Won leads
  const wonStage = stages.find(s => s.name === 'Won');
  const wonLeads = wonStage ? (leadsByStage[wonStage.id] || 0) : 0;

  // Conversion rate
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const stats = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: <Users className="w-5 h-5" />,
      color: 'from-cyan to-blue-500',
      change: recentLeadsCount > 0 ? `+${recentLeadsCount} this week` : null,
      changeType: 'positive' as const,
    },
    {
      label: 'Active Pipeline',
      value: activeLeads,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-purple to-pink',
      change: null,
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'from-emerald-400 to-green-500',
      change: null,
    },
    {
      label: 'Won Deals',
      value: wonLeads,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-amber-400 to-orange-500',
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-background/60 border border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
              {stat.icon}
            </div>
            {stat.change && (
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-text mb-1">{stat.value}</div>
          <div className="text-sm text-text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
