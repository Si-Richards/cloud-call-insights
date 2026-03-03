
import React from 'react';
import { Phone, PhoneCall, PhoneMissed, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Channel } from '@/services/api';

interface ActivityFeedWidgetProps {
  channels?: Channel[];
  isLoading?: boolean;
}

const stateIcon = (state: string, onHold: boolean) => {
  if (onHold) return { icon: Clock, color: 'text-yellow-400', label: 'On Hold' };
  switch (state) {
    case 'Up': return { icon: PhoneCall, color: 'text-green-400', label: 'Active' };
    case 'Ringing': return { icon: Phone, color: 'text-blue-400', label: 'Ringing' };
    default: return { icon: PhoneMissed, color: 'text-slate-400', label: state };
  }
};

const timeAgo = (timestamp: number) => {
  const diff = Math.floor(Date.now() / 1000 - timestamp);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const ActivityFeedWidget = ({ channels, isLoading }: ActivityFeedWidgetProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <Skeleton className="h-4 w-24 mb-3 bg-slate-700" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-6 h-6 rounded-full bg-slate-700" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32 bg-slate-700" />
                <Skeleton className="h-3 w-20 bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedChannels = [...(channels || [])].sort((a, b) => b.updated - a.updated).slice(0, 10);

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm font-medium text-slate-300 mb-3">Live Channels</div>
      {sortedChannels.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          {channels ? 'No active channels' : 'Configure API to see activity'}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {sortedChannels.map((channel) => {
            const { icon: IconComponent, color, label } = stateIcon(channel.state, channel.onHold);
            return (
              <div key={channel.id} className="flex items-start space-x-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-slate-700/50 ${color}`}>
                  <IconComponent className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">
                    {channel.peer || channel.name}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>{label}</span>
                    <span className="text-slate-500">{timeAgo(channel.updated)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeedWidget;
