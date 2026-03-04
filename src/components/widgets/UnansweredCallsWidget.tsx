import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { statusColors, getUnansweredStatus } from '@/lib/thresholds';
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
    { label: 'Inbound', value: metrics?.unanswered_inbound ?? 0, color: '#22c55e' },
    { label: 'Outbound', value: metrics?.unanswered_outbound ?? 0, color: '#4ade80' },
    { label: 'Internal', value: metrics?.unanswered_internal ?? 0, color: '#86efac' },
  ];

  const total = metrics?.unanswered_total ?? 0;
  const status = getUnansweredStatus(metrics);
  const colors = statusColors[status];

  // Override donut colors when breached
  const donutSegments = total > 0 && status !== 'healthy'
    ? segments.map(s => ({ ...s, color: status === 'critical' ? '#ef4444' : '#f59e0b' }))
    : segments;

  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="h-full flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: 'clamp(60px, 30%, 100px)', aspectRatio: '1' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {donutSegments.map((seg) => {
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
          <span className="text-[clamp(0.875rem,2.5vw,1.25rem)] font-bold text-white">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[clamp(0.6rem,1.2vw,0.75rem)] text-slate-400">{seg.label}</span>
            <span className="text-[clamp(0.6rem,1.2vw,0.75rem)] font-semibold text-white ml-auto">{seg.value}</span>
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
