import { useQuery } from '@tanstack/react-query';
import {
  getAbout,
  getAccountMetrics,
  getSeatMetrics,
  getChannels,
  getChannelsBySeat,
  getPresence,
  getApiConfig,
  getPollInterval,
} from '@/services/api';

const isConfigured = () => !!getApiConfig();
const getConfig = () => getApiConfig()!;

export const useAbout = () =>
  useQuery({
    queryKey: ['cse', 'about'],
    queryFn: () => getAbout(),
    enabled: isConfigured(),
    refetchInterval: getPollInterval(),
  });

export const useAccountMetrics = () =>
  useQuery({
    queryKey: ['cse', 'metrics', 'account'],
    queryFn: () => {
      const cfg = getConfig();
      return getAccountMetrics(cfg.accountNo);
    },
    enabled: isConfigured() && !!getApiConfig()?.accountNo,
    refetchInterval: getPollInterval(),
  });

export const useSeatMetrics = (seatId?: string) =>
  useQuery({
    queryKey: ['cse', 'metrics', 'seat', seatId],
    queryFn: () => {
      const cfg = getConfig();
      return getSeatMetrics(cfg.accountNo, seatId!);
    },
    enabled: isConfigured() && !!seatId && !!getApiConfig()?.accountNo,
    refetchInterval: getPollInterval(),
  });

export const useChannels = () =>
  useQuery({
    queryKey: ['cse', 'channels'],
    queryFn: () => getChannels(),
    enabled: isConfigured(),
    refetchInterval: getPollInterval(),
  });

export const useSeatChannels = (seatId?: string) =>
  useQuery({
    queryKey: ['cse', 'channels', seatId],
    queryFn: () => getChannelsBySeat(seatId!),
    enabled: isConfigured() && !!seatId,
    refetchInterval: getPollInterval(),
  });

export const usePresence = (seatId?: string) =>
  useQuery({
    queryKey: ['cse', 'presence', seatId],
    queryFn: () => getPresence(seatId!),
    enabled: isConfigured() && !!seatId,
    refetchInterval: getPollInterval(),
  });

export const useMetrics = (seatId?: string) => {
  const accountMetrics = useAccountMetrics();
  const seatMetrics = useSeatMetrics(seatId);

  // If a seat ID is provided, prefer seat metrics; otherwise use account metrics
  const metrics = seatId ? seatMetrics : accountMetrics;

  return metrics;
};
