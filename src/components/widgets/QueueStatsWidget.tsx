
import React from 'react';
import { Users, Clock, PhoneCall } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-lg mb-2 mx-auto">
            <Users className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics?.unanswered_total ?? 0}</div>
          <div className="text-xs text-slate-400">Unanswered</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg mb-2 mx-auto">
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics?.answered_total ?? 0}</div>
          <div className="text-xs text-slate-400">Answered</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg mb-2 mx-auto">
            <PhoneCall className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-white">{abandonedPct}%</div>
          <div className="text-xs text-slate-400">Abandoned</div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Inbound</div>
          <div className="text-lg font-bold text-white">{metrics?.calls_inbound ?? 0}</div>
          <div className="text-xs text-green-400">{metrics?.answered_inbound ?? 0} answered</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Outbound</div>
          <div className="text-lg font-bold text-white">{metrics?.calls_outbound ?? 0}</div>
          <div className="text-xs text-green-400">{metrics?.answered_outbound ?? 0} answered</div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatsWidget;
