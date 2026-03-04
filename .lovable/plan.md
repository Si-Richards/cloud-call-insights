

## Plan: Add Widget Catalog with Additional Stat Widgets

### Current State
7 fixed widgets on the dashboard. The API provides additional metrics not yet surfaced (talk time breakdown, unanswered/abandoned breakdowns, inbound vs outbound distribution, presence/DND status). Users cannot add or remove widgets.

### What We'll Build

**1. Widget Catalog System**
- An "Add Widget" button visible in edit mode that opens a dialog/popover
- Shows available widgets that aren't already on the dashboard
- Clicking a widget adds it to the grid layout
- Remove button (X) on each widget in edit mode to remove it
- Active widget list persisted to `localStorage`

**2. New Widgets (5 additional)**

| Widget | Data Source | Display |
|---|---|---|
| **Talk Time** | `average_talk_total/inbound/outbound/internal` | Bar chart with avg talk time breakdown |
| **Unanswered Calls** | `unanswered_total/inbound/outbound/internal` | Donut chart with breakdown |
| **Abandoned Calls** | `abandoned_total/inbound/outbound/internal` | Donut chart with breakdown |
| **Call Distribution** | `calls_inbound/outbound/internal` | Pie chart showing inbound vs outbound vs internal ratio |
| **Presence Status** | `/presence/{seat_id}` endpoint | State indicator + DND badge (only available when a seat is selected) |

**3. Files to Create/Modify**

| File | Action |
|---|---|
| `src/components/widgets/TalkTimeWidget.tsx` | **Create** |
| `src/components/widgets/UnansweredCallsWidget.tsx` | **Create** |
| `src/components/widgets/AbandonedCallsWidget.tsx` | **Create** |
| `src/components/widgets/CallDistributionWidget.tsx` | **Create** |
| `src/components/widgets/PresenceWidget.tsx` | **Create** |
| `src/components/WidgetCatalog.tsx` | **Create** — Dialog listing all available widgets with add button |
| `src/components/Dashboard.tsx` | **Modify** — Dynamic widget list from registry, add/remove logic, localStorage persistence, "Add Widget" button in edit mode |
| `src/hooks/useCallStats.ts` | **Modify** — Add `usePresence` export if not already used |

**4. Widget Registry Pattern**
A central registry mapping widget IDs to their component, title, default size, and description. The dashboard reads active widget IDs from state, renders only those, and the catalog shows the remaining ones as available to add.

```text
WIDGET_REGISTRY = {
  'call-volume':       { component, title, defaultW: 3, defaultH: 2 },
  'asr':               { ... },
  'talk-time':         { ... },  // NEW
  'unanswered-calls':  { ... },  // NEW
  ...
}

activeWidgets (localStorage) = ['call-volume', 'asr', 'call-duration', ...]
catalog shows = REGISTRY keys - activeWidgets
```

