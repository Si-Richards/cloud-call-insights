

## Plan: Dashboard Header, Widget Scaling, and Threshold-Based Icon Colors

### 1. Custom Dashboard Title
- Remove the hardcoded Phone icon, "Call Statistics Portal" title, and subtitle from the header
- Add an editable title: clicking it (or an edit icon) lets the user type a custom name
- Persist the custom title in `localStorage`
- Default to "Dashboard" if unset

### 2. Seat Selector Already Exists — Improvements
The seat dropdown already exists in the header but only shows when seats are loaded. No changes needed to add it — it's already there. Will ensure it remains prominent and functional.

### 3. Widget Content Scaling
Currently widget content uses fixed sizes (`text-2xl`, `w-8 h-8`, etc.) that don't adapt when widgets are resized. Fix by:
- Making all widgets use `h-full` with flex layouts and `ResponsiveContainer` for charts (already done for chart widgets)
- For stat/number widgets (CallVolume, ASR, HoldTime, QueueStats, Presence, TalkTime, Unanswered, Abandoned): replace fixed text sizes with responsive sizing using CSS `clamp()` or container-relative units
- Use `overflow-hidden` and flex-based layouts so content adapts to any widget size

### 4. Green Icons with Threshold Breach Colors
- Default all widget icons to green (healthy state)
- Add a threshold configuration system: store thresholds per widget in `localStorage`
- When a metric breaches its threshold, the icon color changes to amber (warning) or red (critical)
- Initial thresholds (configurable later):
  - ASR: green if >= 90%, amber < 90%, red < 70%
  - Abandoned calls: green if 0, amber > 0, red > 5
  - Hold time: green < 30s, amber < 60s, red >= 60s
  - Unanswered: green if 0, amber > 0, red > 10

### Files to Modify

| File | Changes |
|---|---|
| `src/components/Dashboard.tsx` | Remove hardcoded title/icon, add editable title with localStorage persistence, pass threshold status to widget rendering |
| `src/components/widgets/CallVolumeWidget.tsx` | Responsive text sizing, green default icons |
| `src/components/widgets/ASRWidget.tsx` | Responsive sizing, green icon with threshold color |
| `src/components/widgets/CallDurationWidget.tsx` | Responsive sizing, green icon |
| `src/components/widgets/HoldTimeWidget.tsx` | Responsive sizing, green icon with threshold color |
| `src/components/widgets/QueueStatsWidget.tsx` | Responsive sizing, green icons with threshold colors |
| `src/components/widgets/RingTimeWidget.tsx` | Responsive sizing, green icon |
| `src/components/widgets/TalkTimeWidget.tsx` | Responsive sizing, green icon |
| `src/components/widgets/UnansweredCallsWidget.tsx` | Responsive sizing, green icon with threshold color |
| `src/components/widgets/AbandonedCallsWidget.tsx` | Responsive sizing, green icon with threshold color |
| `src/components/widgets/CallDistributionWidget.tsx` | Responsive sizing, green icon |
| `src/components/widgets/PresenceWidget.tsx` | Responsive sizing |
| `src/components/WidgetCatalog.tsx` | Update registry icons to green |

### Approach for Responsive Scaling
- Wrap widget content in flex containers that fill available space
- Use Tailwind's `text-[clamp(...)]` or relative sizing for key numbers
- Charts already use `ResponsiveContainer` so they scale automatically
- For stat widgets, use `min-w-0` and `truncate` to prevent overflow at small sizes

