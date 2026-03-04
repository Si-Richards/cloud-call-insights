

## Plan: Dashboard Polish and UX Improvements

After reviewing all widgets and the dashboard, here are the improvements worth making:

### 1. Connection Status Indicator
Add a small status badge in the header showing whether the API is connected and when data was last refreshed. Currently there's no visual feedback unless you open the settings modal.

### 2. Auto-refresh Countdown & Last Updated Timestamp
Show "Last updated: 12s ago" near the header so users know the data is live. Optionally show a subtle refresh indicator when polling fires.

### 3. "No Data" Empty State Improvement
When the API isn't configured, currently each widget shows its own variant of "no data." Instead, show a single prominent banner/overlay encouraging the user to configure the API, rather than 7+ individual messages.

### 4. Configurable Polling Interval
Add a dropdown in the Settings Modal to let users choose refresh rate (10s, 30s, 60s, 2min). Store in localStorage alongside the API config.

### 5. Widget Tooltip Improvements
Several chart widgets (Call Duration, Hold Time, Talk Time, Ring Time) use Recharts tooltips with inconsistent styling. Standardize tooltip format and ensure all show proper units.

### 6. Dark Mode Refinements
- The "Edit Layout" button always shows blue styling even when not in edit mode — make it properly outlined when inactive
- Improve contrast on some subtle text elements

### Files to Modify

| File | Changes |
|---|---|
| `src/components/Dashboard.tsx` | Add connection status indicator, last-updated timestamp, improve edit button styling, add unconfigured banner |
| `src/components/SettingsModal.tsx` | Add polling interval selector |
| `src/hooks/useCallStats.ts` | Read polling interval from config |
| `src/services/api.ts` | Add `pollInterval` to `ApiConfig` type |

