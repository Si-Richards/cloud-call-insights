/**
 * Smart time formatting utilities.
 * API values are in seconds – these helpers pick the most readable unit.
 */

/** Format seconds into a human-readable string with units.
 *  - < 60s  → "12s"
 *  - < 3600s → "3m 24s"  (or "3m" if exact)
 *  - ≥ 3600s → "1h 12m"  (or "2h" if exact)
 */
export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '0s';

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  if (mins > 0) {
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  return `${secs}s`;
};

/** Compact version for chart tick labels – e.g. "2m", "45s", "1h" */
export const formatDurationCompact = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '0s';
  if (totalSeconds >= 3600) return `${(totalSeconds / 3600).toFixed(1)}h`;
  if (totalSeconds >= 60) return `${Math.round(totalSeconds / 60)}m`;
  return `${Math.round(totalSeconds)}s`;
};

/** Format as mm:ss with a "min" suffix for display – e.g. "3:24 min" */
export const formatMinSec = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')} min`;
};
