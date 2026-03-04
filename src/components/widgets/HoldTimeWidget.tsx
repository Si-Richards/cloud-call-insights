import React from 'react';
import { Timer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/formatTime';
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

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-lg mb-2 mx-auto">
            <Timer className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white">{avgHold}</div>
          <div className="text-xs text-slate-400">Avg Hold</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{avgTalk}</div>
          <div className="text-xs text-slate-400">Avg Talk</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400 mb-1">{abandoned}</div>
        <div className="text-xs text-slate-400">Abandoned calls</div>
        {!metrics && <div className="text-xs text-slate-500 mt-1">No live data</div>}
      </div>
    </div>
  );
};

export default HoldTimeWidget;
