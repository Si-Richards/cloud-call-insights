
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-white">{asr.toFixed(1)}%</div>
          <div className="text-sm text-slate-400">Answer Success Rate</div>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-400"
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
        <span className="text-slate-400 text-sm">Target: {target}%</span>
        {!metrics && <span className="text-slate-500 text-xs">No live data</span>}
      </div>
    </div>
  );
};

export default ASRWidget;
