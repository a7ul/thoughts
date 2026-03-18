import { homePage } from "./template.ts";
import type { Post } from "./types.ts";

function byDateDesc(a: Post, b: Post): number {
  const da = a.frontmatter.date, db = b.frontmatter.date;
  if (!da && !db) return a.slug.localeCompare(b.slug);
  if (!da) return 1;
  if (!db) return -1;
  return new Date(db).getTime() - new Date(da).getTime();
}

export function buildHomePage(posts: Post[], siteTitle = "Atul's Blog"): string {
  return homePage({
    siteTitle,
    posts: [...posts].sort(byDateDesc).map((p) => ({
      title: p.frontmatter.title || "Untitled",
      date: p.frontmatter.date || "",
      description: p.frontmatter.description || "",
      url: p.outputPath,
    })),
  });
}
