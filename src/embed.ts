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

export async function inlineEmbeds(content: string, inputDir: string): Promise<string> {
  const matches = [...content.matchAll(FIGURE_RE)];
  if (matches.length === 0) return content;

  // Read each referenced file once.
  const cache = new Map<string, string>();
  for (const m of matches) {
    const rel = m[1];
    if (cache.has(rel)) continue;
    const svg = await Deno.readTextFile(join(inputDir, rel));
    cache.set(rel, svg.replace(/\n\s*\n+/g, "\n").trim());
  }

  return content.replace(FIGURE_RE, (_full, rel: string, caption?: string) => {
    const svg = cache.get(rel)!;
    const figcaption = caption ? `\n<figcaption>${caption}</figcaption>` : "";
    return `<figure class="dwg">\n${svg}${figcaption}\n</figure>`;
  });
}
