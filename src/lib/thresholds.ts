// Threshold-based status colors for widget icons
import type { MetricsResponse } from '@/services/api';

export type ThresholdStatus = 'healthy' | 'warning' | 'critical';

export const statusColors = {
  healthy: { icon: 'text-green-400', bg: 'bg-green-500/20' },
  warning: { icon: 'text-amber-400', bg: 'bg-amber-500/20' },
  critical: { icon: 'text-red-400', bg: 'bg-red-500/20' },
};

export const getASRStatus = (metrics?: MetricsResponse | null): ThresholdStatus => {
  if (!metrics || metrics.calls_total === 0) return 'healthy';
  const asr = (metrics.answered_total / metrics.calls_total) * 100;
  if (asr < 70) return 'critical';
  if (asr < 90) return 'warning';
  return 'healthy';
};

export const getAbandonedStatus = (metrics?: MetricsResponse | null): ThresholdStatus => {
  if (!metrics) return 'healthy';
  const val = metrics.abandoned_total;
  if (val > 5) return 'critical';
  if (val > 0) return 'warning';
  return 'healthy';
};

export const getUnansweredStatus = (metrics?: MetricsResponse | null): ThresholdStatus => {
  if (!metrics) return 'healthy';
  const val = metrics.unanswered_total;
  if (val > 10) return 'critical';
  if (val > 0) return 'warning';
  return 'healthy';
};

export const getHoldTimeStatus = (metrics?: MetricsResponse | null): ThresholdStatus => {
  if (!metrics) return 'healthy';
  const val = metrics.average_hold_total;
  if (val >= 60) return 'critical';
  if (val >= 30) return 'warning';
  return 'healthy';
};

export const getCallVolumeStatus = (metrics?: MetricsResponse | null): ThresholdStatus => {
  if (!metrics) return 'healthy';
  const missed = metrics.unanswered_total;
  const total = metrics.calls_total;
  if (total === 0) return 'healthy';
  const missedPct = (missed / total) * 100;
  if (missedPct > 30) return 'critical';
  if (missedPct > 10) return 'warning';
  return 'healthy';
};
