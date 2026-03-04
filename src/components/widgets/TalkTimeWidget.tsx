import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/formatTime';
import type { MetricsResponse } from '@/services/api';

interface TalkTimeWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const TalkTimeWidget = ({ metrics, isLoading }: TalkTimeWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-16 bg-slate-700" />
              <Skeleton className="h-3 w-12 bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const data = [
    { label: 'Total', value: metrics?.average_talk_total ?? 0, color: 'bg-green-500/20 text-green-400' },
    { label: 'Inbound', value: metrics?.average_talk_inbound ?? 0, color: 'bg-green-500/20 text-green-400' },
    { label: 'Outbound', value: metrics?.average_talk_outbound ?? 0, color: 'bg-green-500/20 text-green-400' },
    { label: 'Internal', value: metrics?.average_talk_internal ?? 0, color: 'bg-green-500/20 text-green-400' },
  ];

  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="h-full flex flex-col justify-between gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-[clamp(2.5rem,6vw,4rem)] text-[clamp(0.6rem,1.5vw,0.75rem)] text-slate-400 shrink-0">{item.label}</div>
          <div className="flex-1 h-[clamp(1rem,3vw,1.5rem)] bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${item.color.split(' ')[0]} transition-all duration-500`}
              style={{ width: `${Math.max((item.value / maxVal) * 100, 2)}%` }}
            />
          </div>
          <div className="text-[clamp(0.65rem,1.5vw,0.875rem)] font-semibold text-white w-[clamp(2.5rem,6vw,4rem)] text-right">{formatDuration(item.value)}</div>
        </div>
      ))}
      {!metrics && (
        <div className="text-center text-xs text-slate-500">Configure API to see live data</div>
      )}
    </div>
  );
};

export default TalkTimeWidget;
