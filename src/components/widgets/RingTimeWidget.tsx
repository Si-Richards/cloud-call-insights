
import React from 'react';
import { Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const RingTimeWidget = () => {
  const ringData = [
    { name: '0-10s', value: 45, color: '#10b981' },
    { name: '10-20s', value: 35, color: '#3b82f6' },
    { name: '20-30s', value: 15, color: '#f59e0b' },
    { name: '30s+', value: 5, color: '#ef4444' },
  ];

  const avgRingTime = '12.3s';

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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {ringData.map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-400">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RingTimeWidget;
