import React from 'react';
import { User, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { usePresence } from '@/hooks/useCallStats';

interface PresenceWidgetProps {
  seatId?: string;
  isLoading?: boolean;
}

const stateLabels: Record<number, { label: string; color: string }> = {
  0: { label: 'Unknown', color: 'bg-slate-500' },
  1: { label: 'Available', color: 'bg-green-500' },
  2: { label: 'Busy', color: 'bg-red-500' },
  4: { label: 'Ringing', color: 'bg-blue-500' },
  8: { label: 'On Hold', color: 'bg-yellow-500' },
  16: { label: 'Unavailable', color: 'bg-slate-500' },
};

const PresenceWidget = ({ seatId, isLoading: parentLoading }: PresenceWidgetProps) => {
  const { data: presence, isLoading: presenceLoading } = usePresence(seatId);
  const isLoading = parentLoading || presenceLoading;

  if (!seatId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <User className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Select a seat to view presence</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <Skeleton className="w-16 h-16 rounded-full bg-slate-700" />
        <Skeleton className="h-4 w-20 bg-slate-700" />
      </div>
    );
  }

  const stateInfo = stateLabels[presence?.state ?? 0] ?? stateLabels[0];

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center">
          <User className="h-8 w-8 text-slate-300" />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${stateInfo.color}`} />
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-white">Seat {seatId}</div>
        <div className="text-xs text-slate-400 mt-0.5">{stateInfo.label}</div>
      </div>
      {presence?.dnd && (
        <Badge variant="destructive" className="text-xs gap-1">
          <Shield className="h-3 w-3" />
          DND
        </Badge>
      )}
    </div>
  );
};

export default PresenceWidget;
