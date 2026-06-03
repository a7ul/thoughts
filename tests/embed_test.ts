import { assertEquals, assertStringIncludes } from "@std/assert";
import { join } from "@std/path";
import { inlineEmbeds } from "../src/embed.ts";

async function withDiagram(svg: string, fn: (dir: string) => Promise<void>) {
  const dir = await Deno.makeTempDir();
  await Deno.mkdir(join(dir, "_diagrams"));
  await Deno.writeTextFile(join(dir, "_diagrams", "d.svg"), svg);
  try {
    await fn(dir);
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
}

Deno.test("inlines an svg referenced by @figure", async () => {
  await withDiagram(`<svg viewBox="0 0 10 10"><rect/></svg>`, async (dir) => {
    const out = await inlineEmbeds("before\n\n@figure(_diagrams/d.svg)\n\nafter", dir);
    assertStringIncludes(out, `<figure class="dwg">`);
    assertStringIncludes(out, "<svg");
    assertStringIncludes(out, "</figure>");
  });
});

Deno.test("adds a figcaption when given", async () => {
  await withDiagram(`<svg></svg>`, async (dir) => {
    const out = await inlineEmbeds(`@figure(_diagrams/d.svg, "Hello world")`, dir);
    assertStringIncludes(out, "<figcaption>Hello world</figcaption>");
  });
});

Deno.test("collapses blank lines inside the svg so it stays one html block", async () => {
  const svg = `<svg>\n  <rect/>\n\n  <circle/>\n</svg>`;
  await withDiagram(svg, async (dir) => {
    const out = await inlineEmbeds("@figure(_diagrams/d.svg)", dir);
    // No blank line should remain inside the inlined figure.
    const figure = out.slice(out.indexOf("<figure"), out.indexOf("</figure>"));
    assertEquals(/\n\s*\n/.test(figure), false);
  });
});

Deno.test("leaves content without directives untouched", async () => {
  const md = "# Title\n\nJust prose, no figures.";
  assertEquals(await inlineEmbeds(md, "/nonexistent"), md);
});
