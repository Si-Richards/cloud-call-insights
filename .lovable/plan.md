

## Plan: Integrate VoiceHost CSE API with Settings Modal

### API Overview

The VoiceHost CSE API (Swagger 2.0, base path `/rest/v1`) exposes these endpoints:

| Endpoint | Purpose | Key Data |
|---|---|---|
| `GET /about` | API health/version check | `cse_online`, version info |
| `GET /channels` | List all seats | Array of seat IDs |
| `GET /channels/{seat_id}` | Channels for a seat | Channel state, hold status, timestamps |
| `GET /presence/{seat_id}` | Device presence | State, DND status |
| `GET /metrics/{account_no}` | Account-level metrics | Calls, answered, unanswered, abandoned, avg duration/ring/talk/hold — all split by inbound/outbound/internal |
| `GET /metrics/{account_no}/{seat_id}` | Seat-level metrics | Same fields as account metrics, per seat |

### What We'll Build

**1. API Configuration Settings Modal**
- Gear icon in the dashboard header opens a dialog
- Fields: API Base URL (defaulting to `https://callstats.voicehost.io/rest/v1`), Account Number, optional Seat ID
- "Test Connection" button that hits `/about` to verify connectivity
- Settings persisted to `localStorage`

**2. API Client Service (`src/services/api.ts`)**
- Typed API client with functions: `getAbout()`, `getChannels()`, `getChannelsBySeat(seatId)`, `getPresence(seatId)`, `getAccountMetrics(accountNo)`, `getSeatMetrics(accountNo, seatId)`
- Full TypeScript interfaces for all response types
- Reads base URL and account number from localStorage config

**3. React Query Hooks (`src/hooks/useCallStats.ts`)**
- Custom hooks wrapping each API call with `@tanstack/react-query` for caching and auto-refresh
- Configurable polling interval (e.g. 30s) for live data
- Hooks: `useAccountMetrics()`, `useSeatMetrics(seatId)`, `useChannels()`, `usePresence(seatId)`

**4. Update All Widgets to Use Live Data**
- **CallVolumeWidget**: `calls_total`, `answered_total`, `unanswered_total` from account metrics
- **ASRWidget**: Compute ASR as `answered_total / calls_total * 100`
- **CallDurationWidget**: `average_duration_total` (with inbound/outbound/internal breakdown)
- **HoldTimeWidget**: `average_hold_total` (with breakdown)
- **QueueStatsWidget**: `abandoned_total`, `unanswered_total`, channel data from `/channels`
- **RingTimeWidget**: `average_ring_total` (with breakdown)
- **ActivityFeedWidget**: Use `/channels` data for live channel activity

Each widget will show a loading skeleton while fetching, and gracefully fall back to "No data — configure API" state when not configured.

### Files to Create/Modify

| File | Action |
|---|---|
| `src/services/api.ts` | **Create** — API client + TypeScript types |
| `src/hooks/useCallStats.ts` | **Create** — React Query hooks |
| `src/components/SettingsModal.tsx` | **Create** — Settings dialog with URL, account no, test connection |
| `src/components/Dashboard.tsx` | **Modify** — Add settings button, pass data to widgets |
| `src/components/widgets/*.tsx` (all 7) | **Modify** — Replace hardcoded data with hook data, add loading/empty states |

