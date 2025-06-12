
import React from 'react';
import { Phone, PhoneCall, PhoneMissed } from 'lucide-react';

const CallVolumeWidget = () => {
  const callData = {
    total: 1247,
    answered: 1098,
    missed: 149,
    growth: 12.5
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg mb-2 mx-auto">
            <Phone className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callData.total.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg mb-2 mx-auto">
            <PhoneCall className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callData.answered.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Answered</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg mb-2 mx-auto">
            <PhoneMissed className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callData.missed}</div>
          <div className="text-xs text-slate-400">Missed</div>
        </div>
      </div>
      <div className="text-center">
        <span className="text-green-400 text-sm font-medium">+{callData.growth}%</span>
        <span className="text-slate-400 text-sm ml-1">vs last week</span>
      </div>
    </div>
  );
};

export default CallVolumeWidget;
