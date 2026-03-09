

## Plan: Per-Widget Data Source Selection

### Problem
Currently there's a single global seat selector in the header. All widgets share the same data source. Users want to:
1. Choose per-widget whether it shows account or a specific seat's data
2. Add the same widget type multiple times with different data sources (e.g., two Call Volume widgets — one for account, one for Seat 201)

### Key Architecture Change
Instead of storing active widgets as simple string IDs (`['call-volume', 'asr']`), switch to **widget instances** with unique instance IDs and a per-widget `seatId` config.

```text
Before: activeWidgets = ['call-volume', 'asr']
After:  activeWidgets = [
          { instanceId: 'call-volume-1', widgetType: 'call-volume', seatId: undefined },
          { instanceId: 'call-volume-2', widgetType: 'call-volume', seatId: '201' },
          { instanceId: 'asr-1', widgetType: 'asr', seatId: '205' },
        ]
```

### Changes

**1. Widget Instance Model**
- Define a `WidgetInstance` type: `{ instanceId: string, widgetType: string, seatId?: string }`
- Update `loadActiveWidgets` / `saveActiveWidgets` in `WidgetCatalog.tsx` to handle this format (with migration from old format)
- Widget catalog now allows adding the same widget type multiple times

**2. Per-Widget Seat Selector**
- Each widget's header bar gets a small seat/account dropdown (visible in edit mode, or always as a subtle label)
- In edit mode: full dropdown to change the data source
- In view mode: show a small label like "Account" or "Seat 201" in the widget header

**3. Per-Widget Data Fetching**
- Each widget that needs metrics will receive its own `seatId` prop
- Widgets internally call `useMetrics(seatId)` or the Dashboard passes the right metrics
- Since react-query deduplicates by key, multiple widgets for the same seat won't cause extra API calls

**4. Remove Global Seat Selector**
- The header seat dropdown is removed since each widget now controls its own data source

**5. Dashboard.tsx Changes**
- `activeWidgetIds: string[]` → `widgetInstances: WidgetInstance[]`
- `renderWidget(id)` → `renderWidget(instance)` — passes instance-specific `seatId`
- Layout keys use `instanceId` instead of widget type
- Add/remove logic generates unique instance IDs (e.g., `${widgetType}-${Date.now()}`)
- Each widget header shows a seat selector dropdown in edit mode

**6. Widget Catalog Changes**
- No longer filters out already-active widgets (same type can be added multiple times)
- On add, prompts or defaults to "Account" and lets user change later

**7. Activity Feed & Presence Widgets**
- Activity feed uses `useSeatChannels(seatId)` per instance
- Presence widget uses its instance's `seatId` (still requires a seat)

### Files to Modify

| File | Changes |
|---|---|
| `src/components/WidgetCatalog.tsx` | Add `WidgetInstance` type, update persistence with migration, allow duplicate widget types |
| `src/components/Dashboard.tsx` | Switch from `string[]` to `WidgetInstance[]`, per-widget seat selector in header, remove global seat dropdown, update render/add/remove logic |
| `src/hooks/useCallStats.ts` | No changes needed — hooks already accept optional `seatId` |

### Migration
When loading from localStorage, if the old format (string array) is detected, convert each ID to a `WidgetInstance` with `seatId: undefined` (account-level).

