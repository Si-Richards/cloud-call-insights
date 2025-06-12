
import React from 'react';
import { TrendingUp } from 'lucide-react';

const ASRWidget = () => {
  const asrData = {
    current: 88.1,
    target: 90.0,
    trend: 2.3
  };

  const percentage = (asrData.current / asrData.target) * 100;

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-white">{asrData.current}%</div>
          <div className="text-sm text-slate-400">Answer Success Rate</div>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-400"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">Target: {asrData.target}%</span>
        <div className="flex items-center text-green-400 text-sm">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{asrData.trend}%
        </div>
      </div>
    </div>
  );
};

export default ASRWidget;
