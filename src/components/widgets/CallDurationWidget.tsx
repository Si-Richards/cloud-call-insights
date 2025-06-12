
import React from 'react';
import { Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const CallDurationWidget = () => {
  const durationData = [
    { range: '0-1m', calls: 45 },
    { range: '1-3m', calls: 120 },
    { range: '3-5m', calls: 85 },
    { range: '5-10m', calls: 67 },
    { range: '10m+', calls: 23 },
  ];

  const avgDuration = '4:32';

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
