export interface BuildInfo {
  sprint: string;
  commit: string;
  zeit: string;
}

export const BUILD_INFO: BuildInfo = __BUILD_INFO__;

/** „27.11.2026, 18:04“ in deutscher Zeit. */
export function formatBuildZeit(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Berlin',
  }).format(new Date(iso));
}
