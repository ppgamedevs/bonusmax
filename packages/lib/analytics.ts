export type AnalyticsEvent = string;
export type AnalyticsPayload = Record<string, unknown> | undefined;

export function track(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  // no-op stub – integrate later
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload ?? {});
  }
}
