import { marked } from "marked";

marked.use({
  gfm: true,
  renderer: {
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
