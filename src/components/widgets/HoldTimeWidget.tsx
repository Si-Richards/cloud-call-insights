
import React from 'react';
import { Timer } from 'lucide-react';

const HoldTimeWidget = () => {
  const holdData = {
    avgHoldTime: '1:45',
    maxHoldTime: '8:23',
    callsOnHold: 12,
    improvement: -15.2
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-lg mb-2 mx-auto">
            <Timer className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white">{holdData.avgHoldTime}</div>
          <div className="text-xs text-slate-400">Avg Hold</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{holdData.maxHoldTime}</div>
          <div className="text-xs text-slate-400">Max Hold</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400 mb-1">{holdData.callsOnHold}</div>
        <div className="text-xs text-slate-400 mb-2">Currently on hold</div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-green-400 text-sm font-medium">{holdData.improvement}%</span>
          <span className="text-slate-400 text-sm">vs last week</span>
        </div>
      </div>
    </div>
  );
};

export default HoldTimeWidget;
