import React from 'react';
import { Plus, BarChart3, PhoneMissed, PhoneOff, PieChart, UserCheck, Phone, Activity, Clock, Timer, Users2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface WidgetRegistryEntry {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultW: number;
  defaultH: number;
  requiresSeat?: boolean;
}

export const WIDGET_REGISTRY: WidgetRegistryEntry[] = [
  { id: 'call-volume', title: 'Call Volume', description: 'Total, answered, and missed calls', icon: <Phone className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'asr', title: 'Answer Success Rate', description: 'Percentage of answered calls', icon: <Activity className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'call-duration', title: 'Call Duration', description: 'Average call duration breakdown', icon: <Clock className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'hold-time', title: 'Hold Time', description: 'Average hold time metrics', icon: <Timer className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'queue-stats', title: 'Queue Statistics', description: 'Queue performance overview', icon: <Users2 className="h-4 w-4" />, defaultW: 6, defaultH: 3 },
  { id: 'ring-time', title: 'Ring Time Analysis', description: 'Average ring time breakdown', icon: <BarChart3 className="h-4 w-4" />, defaultW: 3, defaultH: 3 },
  { id: 'activity-feed', title: 'Live Activity', description: 'Real-time channel activity feed', icon: <List className="h-4 w-4" />, defaultW: 3, defaultH: 3 },
  { id: 'talk-time', title: 'Talk Time', description: 'Average talk time by direction', icon: <BarChart3 className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'unanswered-calls', title: 'Unanswered Calls', description: 'Unanswered call breakdown', icon: <PhoneMissed className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'abandoned-calls', title: 'Abandoned Calls', description: 'Abandoned call breakdown', icon: <PhoneOff className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'call-distribution', title: 'Call Distribution', description: 'Inbound vs outbound vs internal ratio', icon: <PieChart className="h-4 w-4" />, defaultW: 3, defaultH: 2 },
  { id: 'presence', title: 'Presence Status', description: 'Seat presence state and DND', icon: <UserCheck className="h-4 w-4" />, defaultW: 2, defaultH: 2, requiresSeat: true },
];

export const DEFAULT_WIDGET_IDS = [
  'call-volume', 'asr', 'call-duration', 'hold-time', 'queue-stats', 'ring-time', 'activity-feed',
];

const STORAGE_KEY = 'dashboard-active-widgets';

export const loadActiveWidgets = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_WIDGET_IDS;
};

export const saveActiveWidgets = (ids: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

interface WidgetCatalogProps {
  activeWidgetIds: string[];
  onAddWidget: (id: string) => void;
  selectedSeat?: string;
}

const WidgetCatalog = ({ activeWidgetIds, onAddWidget, selectedSeat }: WidgetCatalogProps) => {
  const available = WIDGET_REGISTRY.filter(
    (w) => !activeWidgetIds.includes(w.id) && (!w.requiresSeat || !!selectedSeat)
  );

  if (available.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-800 border-slate-700 p-2" align="end">
        <div className="text-sm font-semibold text-white mb-2 px-2">Available Widgets</div>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {available.map((widget) => (
            <button
              key={widget.id}
              onClick={() => onAddWidget(widget.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                {widget.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">{widget.title}</div>
                <div className="text-xs text-slate-400 truncate">{widget.description}</div>
              </div>
              <Plus className="h-4 w-4 text-slate-500 ml-auto shrink-0" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WidgetCatalog;
