import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiConfig, saveApiConfig, getAbout, type ApiConfig, getPollInterval } from '@/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

const SettingsModal = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://callstats.voicehost.io/rest/v1');
  const [accountNo, setAccountNo] = useState('');
  const [seatId, setSeatId] = useState('');
  const [pollInterval, setPollInterval] = useState(30000);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (open) {
      const cfg = getApiConfig();
      if (cfg) {
        setBaseUrl(cfg.baseUrl);
        setAccountNo(cfg.accountNo);
        setSeatId(cfg.seatId || '');
        setPollInterval(cfg.pollInterval ?? 30000);
      }
    }
  }, [open]);

  const handleTest = async () => {
    setTestStatus('loading');
    try {
      const result = await getAbout({ baseUrl, accountNo, seatId: seatId || undefined });
      if (result.cse_online) {
        setTestStatus('success');
        setTestMessage(`Connected — CSE v${result.api_version}`);
      } else {
        setTestStatus('error');
        setTestMessage('CSE is offline');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed');
    }
  };

  const handleSave = () => {
    const config: ApiConfig = {
      baseUrl: baseUrl.replace(/\/$/, ''),
      accountNo,
      seatId: seatId || undefined,
      pollInterval,
    };
    saveApiConfig(config);
    queryClient.invalidateQueries({ queryKey: ['cse'] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200">
          <Settings className="h-4 w-4 mr-2" />
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">API Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-slate-300">API Base URL</Label>
            <Input
              value={baseUrl}
              onChange={(e) => { setBaseUrl(e.target.value); setTestStatus('idle'); }}
              placeholder="https://callstats.voicehost.io/rest/v1"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Account Number</Label>
            <Input
              value={accountNo}
              onChange={(e) => { setAccountNo(e.target.value); setTestStatus('idle'); }}
              placeholder="e.g. 12345"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Seat ID <span className="text-slate-500">(optional)</span></Label>
            <Input
              value={seatId}
              onChange={(e) => { setSeatId(e.target.value); setTestStatus('idle'); }}
              placeholder="e.g. 101"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500">Leave empty for account-wide metrics</p>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Refresh Interval</Label>
            <Select value={String(pollInterval)} onValueChange={(v) => setPollInterval(Number(v))}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="10000" className="text-slate-200 focus:bg-slate-700 focus:text-white">10 seconds</SelectItem>
                <SelectItem value="30000" className="text-slate-200 focus:bg-slate-700 focus:text-white">30 seconds</SelectItem>
                <SelectItem value="60000" className="text-slate-200 focus:bg-slate-700 focus:text-white">1 minute</SelectItem>
                <SelectItem value="120000" className="text-slate-200 focus:bg-slate-700 focus:text-white">2 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {testStatus !== 'idle' && (
            <div className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
              testStatus === 'success' ? 'bg-green-900/30 text-green-400' :
              testStatus === 'error' ? 'bg-red-900/30 text-red-400' :
              'bg-slate-700/50 text-slate-300'
            }`}>
              {testStatus === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {testStatus === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {testStatus === 'error' && <XCircle className="h-4 w-4" />}
              <span>{testStatus === 'loading' ? 'Testing connection...' : testMessage}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!baseUrl || testStatus === 'loading'}
              className="flex-1 border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200"
            >
              Test Connection
            </Button>
            <Button
              onClick={handleSave}
              disabled={!baseUrl || !accountNo}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save & Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
