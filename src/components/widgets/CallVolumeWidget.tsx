
import React from 'react';
import { Phone, PhoneCall, PhoneMissed } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
        <Skeleton className="h-4 w-32 mx-auto bg-slate-700" />
      </div>
    );
  }

  const callData = {
    total: metrics?.calls_total ?? 0,
    answered: metrics?.answered_total ?? 0,
    missed: metrics?.unanswered_total ?? 0,
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg mb-2 mx-auto">
            <Phone className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callData.total.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg mb-2 mx-auto">
            <PhoneCall className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callData.answered.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Answered</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg mb-2 mx-auto">
            <PhoneMissed className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callData.missed}</div>
          <div className="text-xs text-slate-400">Missed</div>
        </div>
      </div>
      {!metrics && (
        <div className="text-center text-xs text-slate-500">Configure API to see live data</div>
      )}
    </div>
  );
};

export default CallVolumeWidget;
