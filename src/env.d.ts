/// <reference types="astro/client" />

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  /** Site events (theme_dark, sr_view_on, reading_text_size). No-op when the tag is not loaded. */
  mwTrack?: (name: string, params?: Record<string, unknown>) => void;
}
