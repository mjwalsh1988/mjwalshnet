// Behaviour for Dialog.astro. Idempotent: calling wireDialogs twice does not
// double-bind, so several dialogs on one page can each import it.

let wired = false;
const openers = new WeakMap<HTMLDialogElement, HTMLElement | null>();

export function openDialog(dialog: HTMLDialogElement, opener: HTMLElement | null = null): void {
  if (dialog.open) return;
  openers.set(dialog, opener ?? (document.activeElement as HTMLElement | null));
  dialog.showModal();
  // Focus the first element the author marked, else the first focusable control after the close button.
  const preferred = dialog.querySelector<HTMLElement>("[data-dialog-focus]");
  const first =
    preferred ??
    dialog.querySelector<HTMLElement>(
      ".dialog__body a[href], .dialog__body button, .dialog__body input, .dialog__body select, .dialog__body textarea, .dialog__body [tabindex]:not([tabindex='-1'])",
    ) ??
    dialog.querySelector<HTMLElement>("[data-dialog-close]");
  first?.focus();
  dialog.dispatchEvent(new CustomEvent("mw:dialog-open"));
}

export function closeDialog(dialog: HTMLDialogElement): void {
  if (!dialog.open) return;
  dialog.close();
}

export function wireDialogs(root: ParentNode = document): void {
  if (wired) return;
  wired = true;

  root.addEventListener("click", (e) => {
    const event = e as MouseEvent;
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const openTrigger = target.closest<HTMLElement>("[data-dialog-open]");
    if (openTrigger) {
      const id = openTrigger.dataset.dialogOpen;
      const dialog = id ? (document.getElementById(id) as HTMLDialogElement | null) : null;
      if (dialog) {
        event.preventDefault();
        openDialog(dialog, openTrigger);
      }
      return;
    }
    const closeTrigger = target.closest<HTMLElement>("[data-dialog-close]");
    if (closeTrigger) {
      const dialog = closeTrigger.closest("dialog");
      if (dialog) closeDialog(dialog);
      return;
    }
    // A click on the backdrop lands on the dialog element itself.
    if (target instanceof HTMLDialogElement && target.open) {
      const rect = target.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) closeDialog(target);
    }
  });

  // Return focus to the opener whenever a dialog closes, however it closed.
  for (const dialog of root.querySelectorAll<HTMLDialogElement>("dialog")) {
    dialog.addEventListener("close", () => {
      const opener = openers.get(dialog);
      openers.delete(dialog);
      if (opener && document.contains(opener)) opener.focus();
      dialog.dispatchEvent(new CustomEvent("mw:dialog-close"));
    });
  }
}
