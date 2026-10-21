// Announce a message through the page's live regions (LiveRegion.astro).
// Clearing first and writing on the next frame makes repeated identical
// messages announce again.

export function announce(message: string, options: { assertive?: boolean } = {}): void {
  const selector = options.assertive ? "[data-live-assertive]" : "[data-live-polite]";
  const region = document.querySelector<HTMLElement>(selector);
  if (!region) return;
  region.textContent = "";
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}
