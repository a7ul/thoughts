import { join } from "@std/path";

/**
 * Inline SVG figures referenced with the `@figure(path, "caption")` directive.
 *
 * The path is resolved relative to the content root (inputDir), so an
 * Excalidraw export saved at `content/_diagrams/foo.svg` is embedded with:
 *
 *   @figure(_diagrams/foo.svg, "A caption")
 *
 * The SVG is inlined directly into the document (so filters and fonts work)
 * wrapped in a <figure class="dwg">. Blank lines inside the SVG are collapsed
 * because a blank line would otherwise terminate the surrounding HTML block in
 * the markdown parser and leak the rest of the SVG as escaped text.
 */
const FIGURE_RE = /^@figure\(\s*([^,)\s]+)\s*(?:,\s*"([^"]*)")?\s*\)\s*$/gm;

/**
 * Embed a live Excalidraw diagram via the `@excalidraw(url, "caption")` directive.
 *
 *   @excalidraw(https://excalidraw.com/#json=..., "A caption")
 *
 * Renders as an iframe pointing at the Excalidraw viewer URL.
 */
const EXCALIDRAW_RE = /^@excalidraw\(\s*(https?:\/\/.*?)(?=\s*,\s*"|\s*\))\s*(?:,\s*"([^"]*)")?\s*\)\s*$/gm;

export async function inlineEmbeds(content: string, inputDir: string): Promise<string> {
  // Handle @excalidraw() directives (sync — no file reads needed).
  content = content.replace(EXCALIDRAW_RE, (_full, url: string, caption?: string) => {
    const figcaption = caption ? `\n<figcaption>${caption}</figcaption>` : "";
    return `<figure class="dwg excalidraw-embed">\n<iframe src="${url}" width="100%" height="500" style="border:none;border-radius:8px;" allowfullscreen></iframe>${figcaption}\n</figure>`;
  });

  const matches = [...content.matchAll(FIGURE_RE)];
  if (matches.length === 0) return content;

  // Read each referenced file once.
  const cache = new Map<string, string>();
  for (const m of matches) {
    const rel = m[1];
    if (cache.has(rel)) continue;
    if (rel.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
      const bytes = await Deno.readFile(join(inputDir, rel));
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      cache.set(rel, btoa(binary));
    } else {
      const svg = await Deno.readTextFile(join(inputDir, rel));
      cache.set(rel, svg.replace(/\n\s*\n+/g, "\n").trim());
    }
  }

  return content.replace(FIGURE_RE, (_full, rel: string, caption?: string) => {
    const figcaption = caption ? `\n<figcaption>${caption}</figcaption>` : "";
    if (rel.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
      const data = cache.get(rel)!;
      const ext = rel.split(".").pop()!.toLowerCase();
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
      return `<figure class="dwg">\n<img src="data:${mime};base64,${data}" alt="${caption ?? ""}" style="max-width:100%">${figcaption}\n</figure>\n\n`;
    }
    const svg = cache.get(rel)!;
    return `<figure class="dwg">\n${svg}${figcaption}\n</figure>\n\n`;
  });
}
