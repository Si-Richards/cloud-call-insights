
import React from 'react';
import { Phone, PhoneCall, PhoneMissed } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { statusColors, getCallVolumeStatus } from '@/lib/thresholds';
import type { MetricsResponse } from '@/services/api';

interface CallVolumeWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const CallVolumeWidget = ({ metrics, isLoading }: CallVolumeWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="w-8 h-8 rounded-lg mx-auto bg-slate-700" />
              <Skeleton className="h-6 w-12 mx-auto bg-slate-700" />
              <Skeleton className="h-3 w-10 mx-auto bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const callData = {
    total: metrics?.calls_total ?? 0,
    answered: metrics?.answered_total ?? 0,
    missed: metrics?.unanswered_total ?? 0,
  };

  const status = getCallVolumeStatus(metrics);
  const colors = statusColors[status];

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className={`flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] ${colors.bg} rounded-lg mb-2 mx-auto`}>
            <Phone className={`h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] ${colors.icon}`} />
          </div>
          <div className="text-[clamp(1rem,3vw,1.75rem)] font-bold text-white leading-tight">{callData.total.toLocaleString()}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Total</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] bg-green-500/20 rounded-lg mb-2 mx-auto">
            <PhoneCall className="h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] text-green-400" />
          </div>
          <div className="text-[clamp(1rem,3vw,1.75rem)] font-bold text-white leading-tight">{callData.answered.toLocaleString()}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Answered</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-[clamp(1.5rem,4vw,2.5rem)] h-[clamp(1.5rem,4vw,2.5rem)] bg-green-500/20 rounded-lg mb-2 mx-auto">
            <PhoneMissed className="h-[clamp(0.75rem,2vw,1.25rem)] w-[clamp(0.75rem,2vw,1.25rem)] text-green-400" />
          </div>
          <div className="text-[clamp(1rem,3vw,1.75rem)] font-bold text-white leading-tight">{callData.missed}</div>
          <div className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400">Missed</div>
        </div>
      </div>
      {!metrics && (
        <div className="text-center text-xs text-slate-500 mt-2">Configure API to see live data</div>
      )}
    </div>
  );
};

export default CallVolumeWidget;
