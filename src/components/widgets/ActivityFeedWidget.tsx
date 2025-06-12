
import React from 'react';
import { Phone, PhoneCall, PhoneMissed, Clock } from 'lucide-react';

const ActivityFeedWidget = () => {
  const activities = [
    {
      id: 1,
      type: 'answered',
      caller: '+1 (555) 123-4567',
      time: '2 min ago',
      duration: '4:32',
      icon: PhoneCall,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'missed',
      caller: '+1 (555) 987-6543',
      time: '5 min ago',
      duration: null,
      icon: PhoneMissed,
      color: 'text-red-400'
    },
    {
      id: 3,
      type: 'answered',
      caller: '+1 (555) 456-7890',
      time: '8 min ago',
      duration: '2:15',
      icon: PhoneCall,
      color: 'text-green-400'
    },
    {
      id: 4,
      type: 'hold',
      caller: '+1 (555) 234-5678',
      time: '12 min ago',
      duration: 'On hold',
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      id: 5,
      type: 'answered',
      caller: '+1 (555) 345-6789',
      time: '15 min ago',
      duration: '7:43',
      icon: PhoneCall,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm font-medium text-slate-300 mb-3">Recent Activity</div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-slate-700/50 ${activity.color}`}>
                <IconComponent className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">
                  {activity.caller}
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>{activity.time}</span>
                  {activity.duration && (
                    <span className="text-slate-500">{activity.duration}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeedWidget;
