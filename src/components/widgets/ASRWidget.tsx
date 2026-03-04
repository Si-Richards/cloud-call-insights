
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { statusColors, getASRStatus } from '@/lib/thresholds';
import type { MetricsResponse } from '@/services/api';

interface ASRWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const ASRWidget = ({ metrics, isLoading }: ASRWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-20 bg-slate-700" />
            <Skeleton className="h-4 w-28 bg-slate-700" />
          </div>
          <Skeleton className="w-16 h-16 rounded-full bg-slate-700" />
        </div>
        <Skeleton className="h-4 w-full bg-slate-700" />
      </div>
    );
  }

  const callsTotal = metrics?.calls_total ?? 0;
  const answeredTotal = metrics?.answered_total ?? 0;
  const asr = callsTotal > 0 ? (answeredTotal / callsTotal) * 100 : 0;
  const target = 90.0;
  const percentage = (asr / target) * 100;

  const status = getASRStatus(metrics);
  const colors = statusColors[status];
  const ringColor = status === 'healthy' ? 'text-green-400' : status === 'warning' ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[clamp(1.25rem,4vw,2rem)] font-bold text-white leading-tight">{asr.toFixed(1)}%</div>
          <div className="text-[clamp(0.65rem,1.5vw,0.875rem)] text-slate-400">Answer Success Rate</div>
        </div>
        <div className="w-[clamp(3rem,8vw,4.5rem)] h-[clamp(3rem,8vw,4.5rem)] relative shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={ringColor}
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${Math.min(percentage, 100)}, 100`}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-[clamp(0.65rem,1.5vw,0.875rem)]">Target: {target}%</span>
        {!metrics && <span className="text-slate-500 text-xs">No live data</span>}
      </div>
    </div>
  );
};

export default ASRWidget;
