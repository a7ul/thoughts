import { join, extname } from "@std/path";

const MARKDOWN_EXTS = new Set([".md", ".mdx"]);

async function walk(dir: string, files: string[]): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory) await walk(full, files);
    else if (entry.isFile && MARKDOWN_EXTS.has(extname(entry.name))) files.push(full);
  }
}

/** Find all .md/.mdx files recursively. When both foo.md and foo.mdx exist, .mdx wins. */
export async function discoverFiles(inputDir: string): Promise<string[]> {
  const all: string[] = [];
  await walk(inputDir, all);

  // Deduplicate: prefer .mdx over .md for same base path
  const byBase = new Map<string, string>();
  for (const f of all.sort()) {
    const base = f.replace(/\.(md|mdx)$/, "");
    const existing = byBase.get(base);
    if (!existing || f.endsWith(".mdx")) byBase.set(base, f);
  }

  return [...byBase.values()];
}
