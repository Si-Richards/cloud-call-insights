
import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, Phone, Users, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CallVolumeWidget from './widgets/CallVolumeWidget';
import ASRWidget from './widgets/ASRWidget';
import CallDurationWidget from './widgets/CallDurationWidget';
import HoldTimeWidget from './widgets/HoldTimeWidget';
import QueueStatsWidget from './widgets/QueueStatsWidget';
import RingTimeWidget from './widgets/RingTimeWidget';
import ActivityFeedWidget from './widgets/ActivityFeedWidget';
import TalkTimeWidget from './widgets/TalkTimeWidget';
import UnansweredCallsWidget from './widgets/UnansweredCallsWidget';
import AbandonedCallsWidget from './widgets/AbandonedCallsWidget';
import CallDistributionWidget from './widgets/CallDistributionWidget';
import PresenceWidget from './widgets/PresenceWidget';
import SettingsModal from './SettingsModal';
import ConnectionStatus from './ConnectionStatus';
import WidgetCatalog, { WIDGET_REGISTRY, loadActiveWidgets, saveActiveWidgets } from './WidgetCatalog';
import { useMetrics, useChannels, useSeatChannels } from '@/hooks/useCallStats';
import { getApiConfig } from '@/services/api';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const LAYOUTS_STORAGE_KEY = 'dashboard-layouts';

const loadLayouts = (activeIds: string[]): Record<string, any[]> => {
  try {
    const raw = localStorage.getItem(LAYOUTS_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Filter out layout items for widgets that are no longer active
      const filtered: Record<string, any[]> = {};
      for (const [bp, items] of Object.entries(saved)) {
        filtered[bp] = (items as any[]).filter((item: any) => activeIds.includes(item.i));
      }
      return filtered;
    }
  } catch {}
  return {};
};

const Dashboard = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | undefined>(undefined);
  const [activeWidgetIds, setActiveWidgetIds] = useState<string[]>(loadActiveWidgets);

  const apiConfigured = !!getApiConfig();
  const { data: metrics, isLoading } = useMetrics(selectedSeat);
  const { data: seatsList } = useChannels();
  const { data: channelsData } = useSeatChannels(selectedSeat);

  const buildDefaultLayout = useCallback((ids: string[]) => {
    let x = 0, y = 0;
    return ids.map((id) => {
      const reg = WIDGET_REGISTRY.find((w) => w.id === id);
      const w = reg?.defaultW ?? 3;
      const h = reg?.defaultH ?? 2;
      if (x + w > 12) { x = 0; y += h; }
      const item = { i: id, x, y, w, h };
      x += w;
      return item;
    });
  }, []);

  const [layouts, setLayouts] = useState<Record<string, any[]>>(() => {
    const saved = loadLayouts(activeWidgetIds);
    if (saved.lg && saved.lg.length > 0) return saved;
    return { lg: buildDefaultLayout(activeWidgetIds) };
  });

  const handleLayoutChange = (_layout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(allLayouts));
  };

  const handleSeatChange = (value: string) => {
    setSelectedSeat(value === 'all' ? undefined : value);
  };

  const handleAddWidget = (id: string) => {
    const newIds = [...activeWidgetIds, id];
    setActiveWidgetIds(newIds);
    saveActiveWidgets(newIds);

    const reg = WIDGET_REGISTRY.find((w) => w.id === id)!;
    const currentLg = layouts.lg || [];
    const maxY = currentLg.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const newLayout = { i: id, x: 0, y: maxY, w: reg.defaultW, h: reg.defaultH };
    const newLayouts = { ...layouts, lg: [...currentLg, newLayout] };
    setLayouts(newLayouts);
    localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(newLayouts));
  };

  const handleRemoveWidget = (id: string) => {
    const newIds = activeWidgetIds.filter((wid) => wid !== id);
    setActiveWidgetIds(newIds);
    saveActiveWidgets(newIds);

    const newLayouts: Record<string, any[]> = {};
    for (const [bp, items] of Object.entries(layouts)) {
      newLayouts[bp] = (items as any[]).filter((item: any) => item.i !== id);
    }
    setLayouts(newLayouts);
    localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(newLayouts));
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'call-volume': return <CallVolumeWidget metrics={metrics} isLoading={isLoading} />;
      case 'asr': return <ASRWidget metrics={metrics} isLoading={isLoading} />;
      case 'call-duration': return <CallDurationWidget metrics={metrics} isLoading={isLoading} />;
      case 'hold-time': return <HoldTimeWidget metrics={metrics} isLoading={isLoading} />;
      case 'queue-stats': return <QueueStatsWidget metrics={metrics} isLoading={isLoading} />;
      case 'ring-time': return <RingTimeWidget metrics={metrics} isLoading={isLoading} />;
      case 'activity-feed': return <ActivityFeedWidget channels={channelsData?.channels} isLoading={isLoading} />;
      case 'talk-time': return <TalkTimeWidget metrics={metrics} isLoading={isLoading} />;
      case 'unanswered-calls': return <UnansweredCallsWidget metrics={metrics} isLoading={isLoading} />;
      case 'abandoned-calls': return <AbandonedCallsWidget metrics={metrics} isLoading={isLoading} />;
      case 'call-distribution': return <CallDistributionWidget metrics={metrics} isLoading={isLoading} />;
      case 'presence': return <PresenceWidget seatId={selectedSeat} isLoading={isLoading} />;
      default: return null;
    }
  };

  const getWidgetTitle = (id: string) => WIDGET_REGISTRY.find((w) => w.id === id)?.title ?? id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Phone className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Call Statistics Portal</h1>
              <p className="text-slate-400">Cloud PBX Analytics Dashboard</p>
            </div>
            <ConnectionStatus />
          </div>
          <div className="flex items-center space-x-3">
            {seatsList?.seats && seatsList.seats.length > 0 && (
              <Select value={selectedSeat ?? 'all'} onValueChange={handleSeatChange}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-slate-200">
                  <Users className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Seats" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    All Seats (Account)
                  </SelectItem>
                  {seatsList.seats.map((seat) => (
                    <SelectItem
                      key={seat.id}
                      value={seat.id}
                      className="text-slate-200 focus:bg-slate-700 focus:text-white"
                    >
                      Seat {seat.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {isEditMode && (
              <WidgetCatalog
                activeWidgetIds={activeWidgetIds}
                onAddWidget={handleAddWidget}
                selectedSeat={selectedSeat}
              />
            )}
            <SettingsModal />
            <Button
              variant={isEditMode ? "default" : "outline"}
              onClick={() => setIsEditMode(!isEditMode)}
              className={isEditMode
                ? "bg-blue-600 hover:bg-blue-700 border-blue-500"
                : "border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200"
              }
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditMode ? 'Save Layout' : 'Edit Layout'}
            </Button>
          </div>
        </div>
      </div>

      {/* Unconfigured Banner */}
      {!apiConfigured && (
        <div className="mx-6 mt-6 p-6 rounded-xl bg-slate-800/80 border border-slate-700/50 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Connect to your PBX</h2>
          <p className="text-slate-400 text-sm max-w-md">
            Click <strong>API Settings</strong> to enter your CSE API URL and account number. Once connected, your widgets will display live call statistics.
          </p>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="p-6">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          rowHeight={120}
        >
          {activeWidgetIds.map((id) => (
            <div
              key={id}
              className={`bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-200 ${
                isEditMode ? 'ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10' : 'hover:shadow-lg hover:shadow-blue-500/5'
              }`}
            >
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">{getWidgetTitle(id)}</h3>
                  <div className="flex items-center gap-1">
                    {isEditMode && (
                      <>
                        <button
                          onClick={() => handleRemoveWidget(id)}
                          className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                        >
                          <X className="w-3 h-3 text-red-400" />
                        </button>
                        <div className="w-6 h-6 bg-blue-500/20 rounded cursor-move flex items-center justify-center">
                          <div className="grid grid-cols-2 gap-0.5">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="w-1 h-1 bg-blue-400 rounded-full" />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  {renderWidget(id)}
                </div>
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dashboard;
