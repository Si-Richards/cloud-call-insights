
import React from 'react';
import { Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { MetricsResponse } from '@/services/api';

const formatSeconds = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

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
    { range: 'Inbound', calls: metrics?.average_duration_inbound ?? 0 },
    { range: 'Outbound', calls: metrics?.average_duration_outbound ?? 0 },
    { range: 'Internal', calls: metrics?.average_duration_internal ?? 0 },
  ];

  const avgDuration = formatSeconds(metrics?.average_duration_total ?? 0);

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
            <YAxis hide />
            <Bar 
              dataKey="calls" 
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
