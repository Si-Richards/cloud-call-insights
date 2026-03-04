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
    { name: 'Outbound', value: metrics?.average_ring_outbound ?? 0, color: '#22c55e' },
    { name: 'Internal', value: metrics?.average_ring_internal ?? 0, color: '#4ade80' },
  ].filter(d => d.value > 0);

  if (ringData.length === 0) {
    ringData.push({ name: 'No data', value: 1, color: '#334155' });
  }

  const avgRingTime = formatDuration(metrics?.average_ring_total ?? 0);

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-2 shrink-0">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <Phone className="h-4 w-4 text-green-400" />
          <span className="text-[clamp(0.65rem,1.5vw,0.875rem)] text-slate-400">Average Ring Time</span>
        </div>
        <div className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-white leading-tight">{avgRingTime}</div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ringData}
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="70%"
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
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [formatDuration(value), 'Ring Time']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-1 text-[clamp(0.55rem,1.2vw,0.75rem)] shrink-0">
        {[
          { name: 'In', color: '#10b981', value: metrics?.average_ring_inbound ?? 0 },
          { name: 'Out', color: '#22c55e', value: metrics?.average_ring_outbound ?? 0 },
          { name: 'Int', color: '#4ade80', value: metrics?.average_ring_internal ?? 0 },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400 truncate">{item.name}: {formatDuration(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RingTimeWidget;
