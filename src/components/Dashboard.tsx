
import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, BarChart3, Phone, Clock, Users, Timer, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CallVolumeWidget from './widgets/CallVolumeWidget';
import ASRWidget from './widgets/ASRWidget';
import CallDurationWidget from './widgets/CallDurationWidget';
import HoldTimeWidget from './widgets/HoldTimeWidget';
import QueueStatsWidget from './widgets/QueueStatsWidget';
import RingTimeWidget from './widgets/RingTimeWidget';
import ActivityFeedWidget from './widgets/ActivityFeedWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'call-volume', x: 0, y: 0, w: 3, h: 2 },
      { i: 'asr', x: 3, y: 0, w: 3, h: 2 },
      { i: 'call-duration', x: 6, y: 0, w: 3, h: 2 },
      { i: 'hold-time', x: 9, y: 0, w: 3, h: 2 },
      { i: 'queue-stats', x: 0, y: 2, w: 6, h: 3 },
      { i: 'ring-time', x: 6, y: 2, w: 3, h: 3 },
      { i: 'activity-feed', x: 9, y: 2, w: 3, h: 3 },
    ]
  });

  const widgets = [
    { id: 'call-volume', component: <CallVolumeWidget />, title: 'Call Volume' },
    { id: 'asr', component: <ASRWidget />, title: 'Answer Success Rate' },
    { id: 'call-duration', component: <CallDurationWidget />, title: 'Call Duration' },
    { id: 'hold-time', component: <HoldTimeWidget />, title: 'Hold Time' },
    { id: 'queue-stats', component: <QueueStatsWidget />, title: 'Queue Statistics' },
    { id: 'ring-time', component: <RingTimeWidget />, title: 'Ring Time Analysis' },
    { id: 'activity-feed', component: <ActivityFeedWidget />, title: 'Live Activity' },
  ];

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
  };

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
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={isEditMode ? "default" : "outline"}
              onClick={() => setIsEditMode(!isEditMode)}
              className="bg-blue-600 hover:bg-blue-700 border-blue-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditMode ? 'Save Layout' : 'Edit Layout'}
            </Button>
          </div>
        </div>
      </div>

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
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className={`bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-200 ${
                isEditMode ? 'ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10' : 'hover:shadow-lg hover:shadow-blue-500/5'
              }`}
            >
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">{widget.title}</h3>
                  {isEditMode && (
                    <div className="w-6 h-6 bg-blue-500/20 rounded cursor-move flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-0.5">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-blue-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  {widget.component}
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
