// A listbox following the WAI-ARIA Authoring Practices pattern, driven either
// from the list itself (focus on the listbox, roving aria-activedescendant) or
// from a text input in a combobox arrangement (focus stays in the input, which
// carries aria-activedescendant). Used by the command palette and the search.

export type ListboxOptions = {
  list: HTMLElement;
  /** When given, keyboard handling binds to the input and the input carries aria-activedescendant. */
  input?: HTMLInputElement;
  onSelect?: (option: HTMLElement, index: number) => void;
  onActiveChange?: (option: HTMLElement | null, index: number) => void;
  /** Wrap from the last option to the first. Default true. */
  wrap?: boolean;
};

export type Listbox = {
  setActive(index: number): void;
  getActive(): number;
  options(): HTMLElement[];
  refresh(): void;
  destroy(): void;
};

export function createListbox(opts: ListboxOptions): Listbox {
  const { list, input, onSelect, onActiveChange, wrap = true } = opts;
  const controller = input ?? list;
  let active = -1;

  list.setAttribute("role", "listbox");
  if (!input) list.tabIndex = 0;
  if (input) {
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-controls", requireId(list));
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-autocomplete", "list");
  }

  const options = () =>
    Array.from(list.querySelectorAll<HTMLElement>('[role="option"]')).filter(
      (o) => !o.hidden && o.getAttribute("aria-disabled") !== "true",
    );

  function setActive(index: number) {
    const all = options();
    for (const o of all) {
      o.setAttribute("aria-selected", "false");
      o.classList.remove("is-active");
    }
    if (index < 0 || index >= all.length) {
      active = -1;
      controller.removeAttribute("aria-activedescendant");
      onActiveChange?.(null, -1);
      return;
    }
    active = index;
    const option = all[index]!;
    option.setAttribute("aria-selected", "true");
    option.classList.add("is-active");
    controller.setAttribute("aria-activedescendant", requireId(option));
    option.scrollIntoView({ block: "nearest" });
    onActiveChange?.(option, index);
  }

  function move(delta: number) {
    const all = options();
    if (!all.length) return;
    let next = active + delta;
    if (next < 0) next = wrap ? all.length - 1 : 0;
    if (next >= all.length) next = wrap ? 0 : all.length - 1;
    setActive(next);
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        if (input && input.selectionStart !== input.value.length) return;
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        if (input && input.selectionEnd !== input.value.length) return;
        event.preventDefault();
        setActive(options().length - 1);
        break;
      case "Enter": {
        const all = options();
        const option = all[active];
        if (option) {
          event.preventDefault();
          onSelect?.(option, active);
        }
        break;
      }
      default:
        return;
    }
  }

  function onClick(event: MouseEvent) {
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option) return;
    const index = options().indexOf(option);
    if (index === -1) return;
    setActive(index);
    onSelect?.(option, index);
  }

  function onPointerMove(event: PointerEvent) {
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option) return;
    const index = options().indexOf(option);
    if (index !== -1 && index !== active) setActive(index);
  }

  controller.addEventListener("keydown", onKeydown);
  list.addEventListener("click", onClick);
  list.addEventListener("pointermove", onPointerMove);

  return {
    setActive,
    getActive: () => active,
    options,
    refresh() {
      const all = options();
      if (!all.length) setActive(-1);
      else setActive(Math.min(Math.max(active, 0), all.length - 1));
    },
    destroy() {
      controller.removeEventListener("keydown", onKeydown);
      list.removeEventListener("click", onClick);
      list.removeEventListener("pointermove", onPointerMove);
    },
  };
}

let counter = 0;
function requireId(el: HTMLElement): string {
  if (!el.id) el.id = `mw-opt-${(counter += 1)}`;
  return el.id;
}
