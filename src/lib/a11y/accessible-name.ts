// A small accessible name computation and a walker that turns a page into
// the linear stream a screen reader produces (section 6.2). It follows the
// rules browsers use for names: aria-labelledby, then aria-label, then a
// native label, then alt or title, then text content. It is deliberately
// simpler than the full specification, and the result is a true picture of
// the DOM, not a simulation of any one screen reader.

export type StreamLine = { kind: string; text: string; depth: number };

const LANDMARKS: Record<string, string> = {
  banner: "banner",
  navigation: "navigation",
  main: "main",
  complementary: "complementary",
  contentinfo: "content information",
  region: "region",
  search: "search",
  form: "form",
};

function implicitRole(el: Element): string | null {
  const tag = el.tagName.toLowerCase();
  const explicit = el.getAttribute("role");
  if (explicit) return explicit;
  switch (tag) {
    case "header":
      return el.closest("article, aside, main, nav, section") ? null : "banner";
    case "footer":
      return el.closest("article, aside, main, nav, section") ? null : "contentinfo";
    case "nav":
      return "navigation";
    case "main":
      return "main";
    case "aside":
      return "complementary";
    case "section":
      return el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby") ? "region" : null;
    case "form":
      return el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby") ? "form" : null;
    case "a":
      return el.hasAttribute("href") ? "link" : null;
    case "button":
      return "button";
    case "img":
      return "img";
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return "heading";
    case "ul":
    case "ol":
      return "list";
    case "li":
      return "listitem";
    case "input": {
      const type = (el as HTMLInputElement).type;
      if (type === "checkbox") return "checkbox";
      if (type === "radio") return "radio";
      if (type === "submit" || type === "button") return "button";
      if (type === "range") return "slider";
      if (type === "search") return "searchbox";
      return "textbox";
    }
    case "select":
      return "combobox";
    case "textarea":
      return "textbox";
    case "table":
      return "table";
    case "dialog":
      return "dialog";
    case "details":
      return "group";
    case "summary":
      return "button";
    case "audio":
      return "audio";
    default:
      return null;
  }
}

export function isHidden(el: Element): boolean {
  if (el.getAttribute("aria-hidden") === "true") return true;
  if ((el as HTMLElement).hidden) return true;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return true;
  // Closed details hide their content, closed dialogs are not rendered.
  const details = el.closest("details");
  if (details && !details.open && !el.closest("summary") && el !== details) return true;
  return false;
}

function textOf(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  if (isHidden(el)) return "";
  if (el.tagName === "IMG") return el.getAttribute("alt") ?? "";
  if (el.tagName === "SVG" || el.tagName === "svg") return el.getAttribute("aria-label") ?? "";
  return Array.from(el.childNodes).map(textOf).join("");
}

export function accessibleName(el: Element): string {
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const parts = labelledby
      .split(/\s+/)
      .map((id) => el.ownerDocument.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n))
      .map((n) => textOf(n).trim());
    if (parts.join(" ").trim()) return parts.join(" ").replace(/\s+/g, " ").trim();
  }
  const label = el.getAttribute("aria-label");
  if (label?.trim()) return label.trim();
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  ) {
    const labels = (el as HTMLInputElement).labels;
    if (labels && labels.length)
      return Array.from(labels)
        .map((l) => textOf(l).trim())
        .join(" ");
    if (el instanceof HTMLInputElement && el.placeholder) return el.placeholder;
  }
  if (el.tagName === "IMG") return el.getAttribute("alt") ?? "";
  const title = el.getAttribute("title");
  const text = textOf(el).replace(/\s+/g, " ").trim();
  return text || title || "";
}

const SKIP = new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "LINK", "META"]);

/** Walk the document and produce the stream a screen reader reads in browse mode. */
export function readStream(root: Element = document.body): StreamLine[] {
  const lines: StreamLine[] = [];
  const push = (kind: string, text: string, depth: number) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean || kind.startsWith("end")) lines.push({ kind, text: clean, depth });
  };

  function walk(node: Node, depth: number) {
    if (node.nodeType === Node.TEXT_NODE) {
      push("text", node.textContent ?? "", depth);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    if (SKIP.has(el.tagName) || isHidden(el)) return;
    // The screen reader view itself must not read itself.
    if (el.id === "sr-view" || el.closest("#sr-view")) return;
    const role = implicitRole(el);
    const tag = el.tagName.toLowerCase();

    if (role && LANDMARKS[role]) {
      const name = accessibleName(el);
      const landmark = LANDMARKS[role];
      push(
        "landmark",
        name && name !== textOf(el).trim()
          ? `${name} ${landmark} landmark`
          : `${landmark} landmark`,
        depth,
      );
      for (const child of Array.from(el.childNodes)) walk(child, depth + 1);
      push("end", `end of ${landmark} landmark`, depth);
      return;
    }
    if (role === "heading") {
      const level = el.getAttribute("aria-level") ?? tag.slice(1);
      push("heading", `heading level ${level}, ${accessibleName(el)}`, depth);
      return;
    }
    if (role === "link") {
      const current = el.getAttribute("aria-current") ? ", current page" : "";
      push("link", `link, ${accessibleName(el)}${current}`, depth);
      return;
    }
    if (role === "button") {
      const pressed = el.getAttribute("aria-pressed");
      const expanded =
        el.getAttribute("aria-expanded") ??
        (tag === "summary" ? String((el.parentElement as HTMLDetailsElement).open) : null);
      const state = pressed
        ? pressed === "true"
          ? ", pressed"
          : ", not pressed"
        : expanded
          ? expanded === "true"
            ? ", expanded"
            : ", collapsed"
          : "";
      push("button", `button, ${accessibleName(el)}${state}`, depth);
      return;
    }
    if (role === "img") {
      const alt = el.getAttribute("alt");
      if (alt === "") return; // decorative
      push("image", `image, ${(alt ?? accessibleName(el)) || "unlabelled"}`, depth);
      return;
    }
    if (role === "list") {
      const items = el.querySelectorAll(":scope > li").length;
      push("list", `list with ${items} item${items === 1 ? "" : "s"}`, depth);
      for (const child of Array.from(el.childNodes)) walk(child, depth + 1);
      push("end", "end of list", depth);
      return;
    }
    if (["textbox", "searchbox", "combobox", "checkbox", "radio", "slider"].includes(role ?? "")) {
      const names: Record<string, string> = {
        textbox: "edit",
        searchbox: "search edit",
        combobox: "combo box",
        checkbox: "check box",
        radio: "radio button",
        slider: "slider",
      };
      const value = el instanceof HTMLInputElement && el.type !== "checkbox" ? el.value : "";
      push("field", `${names[role!]}, ${accessibleName(el)}${value ? `, ${value}` : ""}`, depth);
      return;
    }
    if (role === "table") {
      const rows = el.querySelectorAll("tr").length;
      const cols = el.querySelector("tr")?.children.length ?? 0;
      push(
        "table",
        `table with ${rows} rows and ${cols} columns${accessibleName(el) ? `, ${accessibleName(el)}` : ""}`,
        depth,
      );
      for (const child of Array.from(el.childNodes)) walk(child, depth + 1);
      push("end", "end of table", depth);
      return;
    }
    if (role === "audio") {
      push("audio", `audio player${accessibleName(el) ? `, ${accessibleName(el)}` : ""}`, depth);
      return;
    }
    if (
      tag === "p" ||
      tag === "li" ||
      tag === "blockquote" ||
      tag === "figcaption" ||
      tag === "dt" ||
      tag === "dd" ||
      tag === "th" ||
      tag === "td" ||
      tag === "caption" ||
      tag === "pre"
    ) {
      // Blocks read as one line unless they contain controls.
      if (
        !el.querySelector(
          "a[href], button, input, select, textarea, img, h1, h2, h3, h4, h5, h6, ul, ol",
        )
      ) {
        const prefix = tag === "blockquote" ? "quote, " : tag === "th" ? "column header, " : "";
        push(tag === "li" ? "listitem" : "block", prefix + textOf(el), depth);
        return;
      }
    }
    for (const child of Array.from(el.childNodes)) walk(child, depth);
  }

  walk(root, 0);
  // Merge consecutive text fragments into one line.
  const merged: StreamLine[] = [];
  for (const line of lines) {
    const last = merged[merged.length - 1];
    if (line.kind === "text" && last?.kind === "text" && last.depth === line.depth) {
      last.text = `${last.text} ${line.text}`;
    } else merged.push({ ...line });
  }
  return merged.filter((l) => l.text);
}
