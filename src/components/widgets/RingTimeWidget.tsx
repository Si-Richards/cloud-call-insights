import React from 'react';
import { Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/formatTime';
import type { MetricsResponse } from '@/services/api';

interface RingTimeWidgetProps {
  metrics?: MetricsResponse | null;
  isLoading?: boolean;
}

const RingTimeWidget = ({ metrics, isLoading }: RingTimeWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <Skeleton className="h-12 w-24 mx-auto mb-3 bg-slate-700" />
        <Skeleton className="flex-1 bg-slate-700 rounded-full mx-auto w-32 h-32" />
      </div>
    );
  }

  const ringData = [
    { name: 'Inbound', value: metrics?.average_ring_inbound ?? 0, color: '#10b981' },
    { name: 'Outbound', value: metrics?.average_ring_outbound ?? 0, color: '#3b82f6' },
    { name: 'Internal', value: metrics?.average_ring_internal ?? 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  if (ringData.length === 0) {
    ringData.push({ name: 'No data', value: 1, color: '#334155' });
  }

  const avgRingTime = formatDuration(metrics?.average_ring_total ?? 0);

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-3">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Phone className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-slate-400">Average Ring Time</span>
        </div>
        <div className="text-2xl font-bold text-white">{avgRingTime}</div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ringData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {ringData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px' 
              }}
              formatter={(value: number) => [formatDuration(value), '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-1 text-xs">
        {[
          { name: 'Inbound', color: '#10b981', value: metrics?.average_ring_inbound ?? 0 },
          { name: 'Outbound', color: '#3b82f6', value: metrics?.average_ring_outbound ?? 0 },
          { name: 'Internal', color: '#f59e0b', value: metrics?.average_ring_internal ?? 0 },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400">{item.name}: {formatDuration(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RingTimeWidget;
