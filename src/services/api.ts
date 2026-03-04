// VoiceHost CSE API Client

const CONFIG_KEY = 'cse-api-config';

export interface ApiConfig {
  baseUrl: string;
  accountNo: string;
  seatId?: string;
}

export const getApiConfig = (): ApiConfig | null => {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveApiConfig = (config: ApiConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// --- Response Types ---

export interface AboutResponse {
  api_name: string;
  api_version: number;
  documentation_url: string;
  cse_online: boolean;
  cse_members: { id: string; address: string; port: number };
  cse_gateways: { id: string; name: string; enabled: boolean; ws_connected: boolean };
}

export interface Seat {
  id: string;
}

export interface ChannelsListResponse {
  seats: Seat[];
}

export interface Channel {
  id: string;
  name: string;
  peer: string;
  state: string;
  onHold: boolean;
  created: number;
  updated: number;
}

export interface SeatChannelsResponse {
  seat: string;
  channels: Channel[];
}

export interface PresenceResponse {
  seat: string;
  state: number;
  dnd: boolean;
}

export interface MetricsResponse {
  account: number;
  seat_id?: string;
  date: number;
  calls_total: number;
  calls_inbound: number;
  calls_outbound: number;
  calls_internal: number;
  answered_total: number;
  answered_inbound: number;
  answered_outbound: number;
  answered_internal: number;
  unanswered_total: number;
  unanswered_inbound: number;
  unanswered_outbound: number;
  unanswered_internal: number;
  abandoned_total: number;
  abandoned_inbound: number;
  abandoned_outbound: number;
  abandoned_internal: number;
  average_duration_total: number;
  average_duration_inbound: number;
  average_duration_outbound: number;
  average_duration_internal: number;
  average_ring_total: number;
  average_ring_inbound: number;
  average_ring_outbound: number;
  average_ring_internal: number;
  average_talk_total: number;
  average_talk_inbound: number;
  average_talk_outbound: number;
  average_talk_internal: number;
  average_hold_total: number;
  average_hold_inbound: number;
  average_hold_outbound: number;
  average_hold_internal: number;
}

// --- API Functions ---

const CORS_PROXY = 'https://corsproxy.io/?';

const apiFetch = async <T>(path: string, config?: ApiConfig): Promise<T> => {
  const cfg = config || getApiConfig();
  if (!cfg) throw new Error('API not configured');
  const targetUrl = `${cfg.baseUrl.replace(/\/$/, '')}${path}`;
  const url = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
};

export const getAbout = (config?: ApiConfig) =>
  apiFetch<AboutResponse>('/about', config);

export const getChannels = (config?: ApiConfig) =>
  apiFetch<ChannelsListResponse>('/channels', config);

export const getChannelsBySeat = (seatId: string, config?: ApiConfig) =>
  apiFetch<SeatChannelsResponse>(`/channels/${seatId}`, config);

export const getPresence = (seatId: string, config?: ApiConfig) =>
  apiFetch<PresenceResponse>(`/presence/${seatId}`, config);

export const getAccountMetrics = (accountNo: string, config?: ApiConfig) =>
  apiFetch<MetricsResponse>(`/metrics/${accountNo}`, config);

export const getSeatMetrics = (accountNo: string, seatId: string, config?: ApiConfig) =>
  apiFetch<MetricsResponse>(`/metrics/${accountNo}/${seatId}`, config);
