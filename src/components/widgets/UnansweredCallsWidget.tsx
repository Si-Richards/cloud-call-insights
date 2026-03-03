import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { MetricsResponse } from '@/services/api';

interface UnansweredCallsWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const UnansweredCallsWidget = ({ metrics, isLoading }: UnansweredCallsWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Skeleton className="w-24 h-24 rounded-full bg-slate-700" />
      </div>
    );
  }

  const segments = [
    { label: 'Inbound', value: metrics?.unanswered_inbound ?? 0, color: '#ef4444' },
    { label: 'Outbound', value: metrics?.unanswered_outbound ?? 0, color: '#f97316' },
    { label: 'Internal', value: metrics?.unanswered_internal ?? 0, color: '#eab308' },
  ];

  const total = metrics?.unanswered_total ?? 0;
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;

  // SVG donut
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="h-full flex items-center gap-4">
      <div className="relative shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {segments.map((seg) => {
            const dash = (seg.value / sum) * circumference;
            const currentOffset = offset;
            offset += dash;
            return (
              <circle
                key={seg.label}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                transform="rotate(-90 50 50)"
                className="transition-all duration-500"
              />
            );
          })}
          {total === 0 && (
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#334155" strokeWidth="10" />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-slate-400">{seg.label}</span>
            <span className="text-xs font-semibold text-white ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
      {!metrics && (
        <div className="text-xs text-slate-500">No data</div>
      )}
    </div>
  );
};

export default UnansweredCallsWidget;
