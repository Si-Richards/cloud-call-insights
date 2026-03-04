import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getApiConfig } from '@/services/api';
import { useAbout } from '@/hooks/useCallStats';

const ConnectionStatus = () => {
  const config = getApiConfig();
  const { data, isLoading, isError, dataUpdatedAt } = useAbout();
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!dataUpdatedAt) return;
    const update = () => {
      const seconds = Math.round((Date.now() - dataUpdatedAt) / 1000);
      if (seconds < 5) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [dataUpdatedAt]);

  if (!config) {
    return (
      <Badge variant="outline" className="border-slate-600 text-slate-400 gap-1.5 py-1">
        <WifiOff className="h-3 w-3" />
        Not configured
      </Badge>
    );
  }

  if (isLoading) {
    return (
      <Badge variant="outline" className="border-slate-600 text-slate-400 gap-1.5 py-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting…
      </Badge>
    );
  }

  if (isError || !data?.cse_online) {
    return (
      <Badge variant="outline" className="border-red-500/50 text-red-400 gap-1.5 py-1">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 gap-1.5 py-1 cursor-default">
            <Wifi className="h-3 w-3" />
            <span className="hidden sm:inline">Live</span>
            {timeAgo && <span className="text-slate-400 text-[10px]">· {timeAgo}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
          <p>CSE v{data.api_version} — Last updated {timeAgo}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConnectionStatus;
