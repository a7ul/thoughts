import { marked } from "marked";

marked.use({ gfm: true });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
