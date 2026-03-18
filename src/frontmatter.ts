import matter from "gray-matter";
import { basename, extname } from "@std/path";
import type { Frontmatter } from "./types.ts";

function titleFromFilename(filename: string): string {
  return basename(filename, extname(filename))
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeDate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  if (typeof raw === "string") return raw;
  return "";
}

export function parseFrontmatter(
  raw: string,
  filename?: string,
): { frontmatter: Frontmatter; content: string } {
  const parsed = matter(raw);
  const d = parsed.data as Record<string, unknown>;

  return {
    frontmatter: {
      title: (d.title as string) || (filename ? titleFromFilename(filename) : "Untitled"),
      date: normalizeDate(d.date),
      description: (d.description as string) || "",
      tags: Array.isArray(d.tags) ? (d.tags as string[]) : undefined,
      draft: d.draft === true,
    },
    content: parsed.content,
  };
}
