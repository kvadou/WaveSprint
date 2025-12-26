'use client';

import { Activity } from '@/types/database';
import {
  Mail,
  MessageSquare,
  Phone,
  FileText,
  ArrowRight,
  Bot,
  Calendar,
  Send,
  AlertCircle
} from 'lucide-react';

interface ActivityTimelineProps {
  activities: Activity[];
  showDate?: boolean;
}

const activityIcons: Record<string, React.ReactNode> = {
  email_sent: <Mail className="w-4 h-4" />,
  email_received: <Mail className="w-4 h-4" />,
  sms_sent: <MessageSquare className="w-4 h-4" />,
  sms_received: <MessageSquare className="w-4 h-4" />,
  call: <Phone className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
  stage_change: <ArrowRight className="w-4 h-4" />,
  ai_chat: <Bot className="w-4 h-4" />,
  meeting_scheduled: <Calendar className="w-4 h-4" />,
  proposal_sent: <Send className="w-4 h-4" />,
  system: <AlertCircle className="w-4 h-4" />,
};

const activityColors: Record<string, string> = {
  email_sent: 'bg-cyan/20 text-cyan border-cyan/30',
  email_received: 'bg-emerald/20 text-emerald-400 border-emerald/30',
  sms_sent: 'bg-purple/20 text-purple border-purple/30',
  sms_received: 'bg-pink/20 text-pink border-pink/30',
  call: 'bg-amber/20 text-amber-400 border-amber/30',
  note: 'bg-white/10 text-text border-white/20',
  stage_change: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ai_chat: 'bg-gradient-to-br from-cyan/20 to-purple/20 text-cyan border-cyan/30',
  meeting_scheduled: 'bg-emerald/20 text-emerald-400 border-emerald/30',
  proposal_sent: 'bg-pink/20 text-pink border-pink/30',
  system: 'bg-white/5 text-text-muted border-white/10',
};

export function ActivityTimeline({ activities, showDate = true }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No activities recorded yet
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <div key={date}>
          {showDate && (
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm py-2 mb-3 z-10">
              <span className="text-xs font-medium text-text-muted px-2 py-1 bg-white/5 rounded-full">
                {date === new Date().toLocaleDateString() ? 'Today' : date}
              </span>
            </div>
          )}
          <div className="space-y-3">
            {dayActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 group"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${activityColors[activity.type] || activityColors.system}`}>
                  {activityIcons[activity.type] || activityIcons.system}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium text-text text-sm">
                        {activity.title || formatActivityType(activity.type)}
                      </span>
                      {activity.created_by !== 'user' && (
                        <span className="ml-2 text-xs text-text-muted">
                          by {activity.created_by === 'ai_agent' ? 'AI' : 'System'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted flex-shrink-0">
                      {new Date(activity.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {activity.content && (
                    <p className="text-sm text-text-muted mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {activity.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatActivityType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
