import { basename, relative } from "@std/path";
import { parseFrontmatter } from "./frontmatter.ts";
import { renderMarkdown } from "./markdown.ts";
import { postPage } from "./template.ts";
import type { Post } from "./types.ts";

export async function buildPost(filePath: string, inputDir: string): Promise<Post | null> {
  const raw = await Deno.readTextFile(filePath);
  const { frontmatter, content } = parseFrontmatter(raw, basename(filePath));

  if (frontmatter.draft) return null;

  const outputPath = relative(inputDir, filePath).replace(/\.(md|mdx)$/, ".html");
  const slug = outputPath.replace(/\.html$/, "");

  return {
    frontmatter,
    htmlContent: renderMarkdown(content),
    outputPath,
    slug,
  };
}

export function renderPostFile(post: Post): string {
  return postPage({
    title: post.frontmatter.title || "Untitled",
    date: post.frontmatter.date || "",
    description: post.frontmatter.description || "",
    htmlContent: post.htmlContent,
    outputPath: post.outputPath,
  });
}
