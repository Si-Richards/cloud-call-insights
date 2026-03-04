
import React from 'react';
import { Users, Clock, PhoneCall } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { statusColors, getUnansweredStatus, getAbandonedStatus } from '@/lib/thresholds';
import type { MetricsResponse } from '@/services/api';

interface QueueStatsWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const QueueStatsWidget = ({ metrics, isLoading }: QueueStatsWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="w-8 h-8 rounded-lg mx-auto bg-slate-700" />
              <Skeleton className="h-6 w-12 mx-auto bg-slate-700" />
              <Skeleton className="h-3 w-16 mx-auto bg-slate-700" />
            </div>
          ))}
        </div>
        <Skeleton className="flex-1 bg-slate-700" />
      </div>
    );
  }

  const callsTotal = metrics?.calls_total ?? 0;
  const abandonedPct = callsTotal > 0 ? ((metrics?.abandoned_total ?? 0) / callsTotal * 100).toFixed(1) : '0.0';

  const unansweredStatus = statusColors[getUnansweredStatus(metrics)];
  const abandonedStatus = statusColors[getAbandonedStatus(metrics)];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] ${unansweredStatus.bg} rounded-lg mb-2 mx-auto`}>
            <Users className={`h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] ${unansweredStatus.icon}`} />
          </div>
          <div className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-white leading-tight">{metrics?.unanswered_total ?? 0}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Unanswered</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] bg-green-500/20 rounded-lg mb-2 mx-auto">
            <Clock className="h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] text-green-400" />
          </div>
          <div className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-white leading-tight">{metrics?.answered_total ?? 0}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Answered</div>
        </div>
        <div className="text-center">
          <div className={`flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] ${abandonedStatus.bg} rounded-lg mb-2 mx-auto`}>
            <PhoneCall className={`h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] ${abandonedStatus.icon}`} />
          </div>
          <div className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-white leading-tight">{abandonedPct}%</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Abandoned</div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400 mb-1">Inbound</div>
          <div className="text-[clamp(0.875rem,2.5vw,1.25rem)] font-bold text-white">{metrics?.calls_inbound ?? 0}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-green-400">{metrics?.answered_inbound ?? 0} answered</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400 mb-1">Outbound</div>
          <div className="text-[clamp(0.875rem,2.5vw,1.25rem)] font-bold text-white">{metrics?.calls_outbound ?? 0}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-green-400">{metrics?.answered_outbound ?? 0} answered</div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatsWidget;
