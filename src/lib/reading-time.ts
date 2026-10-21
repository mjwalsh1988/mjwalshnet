// Reading time from the Markdown source. 225 words a minute is the figure
// most readers of long-form prose land on; the label is rounded up so a
// four-minute-ten post says five, never four.

export function wordCount(markdown: string): number {
  const text = markdown
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/^import .*$/gm, " ")
    .replace(/[#>*_`~[\]()]/g, " ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function readingTime(markdown: string): { words: number; minutes: number; label: string } {
  const words = wordCount(markdown);
  const minutes = Math.max(1, Math.ceil(words / 225));
  return { words, minutes, label: `${minutes} minute read` };
}
