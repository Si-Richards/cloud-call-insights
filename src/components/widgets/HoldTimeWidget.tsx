import React from 'react';
import { Timer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/formatTime';
import { statusColors, getHoldTimeStatus } from '@/lib/thresholds';
import type { MetricsResponse } from '@/services/api';

interface HoldTimeWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const HoldTimeWidget = ({ metrics, isLoading }: HoldTimeWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="w-8 h-8 rounded-lg mx-auto bg-slate-700" />
              <Skeleton className="h-6 w-12 mx-auto bg-slate-700" />
              <Skeleton className="h-3 w-10 mx-auto bg-slate-700" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full bg-slate-700" />
      </div>
    );
  }

  const avgHold = formatDuration(metrics?.average_hold_total ?? 0);
  const avgTalk = formatDuration(metrics?.average_talk_total ?? 0);
  const abandoned = metrics?.abandoned_total ?? 0;

  const status = getHoldTimeStatus(metrics);
  const colors = statusColors[status];

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className={`flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] ${colors.bg} rounded-lg mb-2 mx-auto`}>
            <Timer className={`h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] ${colors.icon}`} />
          </div>
          <div className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-white leading-tight">{avgHold}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Avg Hold</div>
        </div>
        <div className="text-center">
          <div className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-white leading-tight">{avgTalk}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Avg Talk</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-orange-400 mb-1">{abandoned}</div>
        <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Abandoned calls</div>
        {!metrics && <div className="text-xs text-slate-500 mt-1">No live data</div>}
      </div>
    </div>
  );
};

export default HoldTimeWidget;
