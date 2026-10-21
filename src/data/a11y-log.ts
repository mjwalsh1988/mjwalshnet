// The accessibility fix log (section 6.10): real bugs found and fixed on this
// site, with the date and how each was found. Newest first. Every manual pass
// is logged here too (section 9.4).

export type LogEntry = {
  date: string;
  found:
    | "axe"
    | "Lighthouse"
    | "html-validate"
    | "keyboard pass"
    | "NVDA"
    | "VoiceOver"
    | "a reader"
    | "a screenshot review"
    | "the build";
  summary: string;
  fix: string;
};

export const fixLog: LogEntry[] = [
  {
    date: "2026-10-21",
    found: "a screenshot review",
    summary:
      "On the home page in the light theme the main navigation links were drawn in ink on the ink header: invisible to sighted visitors, though still in the tab order and read by a screen reader.",
    fix: "The home page header pins its own color tokens so no scoped rule inside it can pick the light-theme text color.",
  },
  {
    date: "2026-10-21",
    found: "html-validate",
    summary:
      "The search dialog used a header element inside it, which made a second banner landmark on every page.",
    fix: "The dialog's top bar is a plain div; the site header is the only banner.",
  },
  {
    date: "2026-10-21",
    found: "html-validate",
    summary:
      "The long description under an image sat inside the figure after the caption, and a caption must be the first or last child of its figure.",
    fix: "The disclosure now follows the figure, and the image points at it with aria-details.",
  },
  {
    date: "2026-10-21",
    found: "the build",
    summary:
      "The first version of the heading links added hidden link text inside each heading, which leaked into the table of contents as part of the heading text.",
    fix: "The heading text itself is now the link, the same pattern MDN uses, so nothing is added to the heading.",
  },
  {
    date: "2026-10-21",
    found: "Lighthouse",
    summary:
      "The theme and reduce motion buttons were hidden until their scripts ran, then appeared and pushed the header onto a second row: a layout shift of 0.275.",
    fix: "The buttons keep their space before the script runs. The shift is now 0.",
  },
];

export type ManualPass = {
  date: string;
  tool: string;
  pages: string;
  result: string;
};

export const manualPasses: ManualPass[] = [
  {
    date: "[MICHAEL: date of your first NVDA pass]",
    tool: "NVDA with Firefox and Chrome",
    pages: "Every page",
    result: "[MICHAEL: what you found, in a line]",
  },
];

export const knownIssues: string[] = [
  "The NVDA pass of the interface primitives (dialog, listbox, disclosure) is still to be done by me; the automated checks stand in until then.",
  "No chapter or post has a recording yet, so listen mode offers the synthetic browser voice only, labelled as such.",
];
