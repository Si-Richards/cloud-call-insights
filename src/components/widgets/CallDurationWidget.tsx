import React from 'react';
import { Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration, formatDurationCompact } from '@/lib/formatTime';
import type { MetricsResponse } from '@/services/api';

interface CallDurationWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const CallDurationWidget = ({ metrics, isLoading }: CallDurationWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <Skeleton className="h-6 w-24 mb-3 bg-slate-700" />
        <Skeleton className="flex-1 bg-slate-700" />
      </div>
    );
  }

  const durationData = [
    { range: 'Inbound', seconds: metrics?.average_duration_inbound ?? 0 },
    { range: 'Outbound', seconds: metrics?.average_duration_outbound ?? 0 },
    { range: 'Internal', seconds: metrics?.average_duration_internal ?? 0 },
  ];

  const avgDuration = formatDuration(metrics?.average_duration_total ?? 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-400" />
          <span className="text-lg font-semibold text-white">Avg: {avgDuration}</span>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={durationData}>
            <XAxis 
              dataKey="range" 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={32}
              tickFormatter={(v: number) => formatDurationCompact(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatDuration(value), 'Avg Duration']}
            />
            <Bar 
              dataKey="seconds" 
              fill="#3b82f6" 
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallDurationWidget;
