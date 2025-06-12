
import React from 'react';
import { Users, Clock, PhoneCall } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const QueueStatsWidget = () => {
  const queueData = [
    { time: '09:00', waiting: 5, answered: 23 },
    { time: '10:00', waiting: 8, answered: 31 },
    { time: '11:00', waiting: 12, answered: 28 },
    { time: '12:00', waiting: 15, answered: 25 },
    { time: '13:00', waiting: 9, answered: 35 },
    { time: '14:00', waiting: 6, answered: 32 },
  ];

  const currentStats = {
    waiting: 7,
    avgWaitTime: '2:15',
    abandoned: 3.2
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-lg mb-2 mx-auto">
            <Users className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-white">{currentStats.waiting}</div>
          <div className="text-xs text-slate-400">In Queue</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg mb-2 mx-auto">
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">{currentStats.avgWaitTime}</div>
          <div className="text-xs text-slate-400">Avg Wait</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg mb-2 mx-auto">
            <PhoneCall className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-white">{currentStats.abandoned}%</div>
          <div className="text-xs text-slate-400">Abandoned</div>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={queueData}>
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px' 
              }}
            />
            <Line 
              type="monotone" 
              dataKey="waiting" 
              stroke="#eab308" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="answered" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QueueStatsWidget;
