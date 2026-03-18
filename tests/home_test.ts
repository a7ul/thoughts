import { assertEquals, assertStringIncludes } from "@std/assert";
import { buildHomePage } from "../src/home.ts";
import type { Post } from "../src/types.ts";

function makePost(slug: string, date: string, title = "Test Post"): Post {
  return {
    frontmatter: { title, date, description: `About ${slug}` },
    htmlContent: "<p>body</p>",
    outputPath: `${slug}.html`,
    slug,
  };
}

Deno.test("renders site title", () => {
  const html = buildHomePage([], "My Blog");
  assertStringIncludes(html, "My Blog");
});

Deno.test("renders no-posts message when empty", () => {
  assertStringIncludes(buildHomePage([]), "No posts yet");
});

Deno.test("renders post titles and links", () => {
  const html = buildHomePage([makePost("posts/hello", "2026-01-15", "Hello World")]);
  assertStringIncludes(html, "Hello World");
  assertStringIncludes(html, "posts/hello.html");
});

Deno.test("sorts posts newest first", () => {
  const posts = [
    makePost("old", "2026-01-01", "Old"),
    makePost("new", "2026-03-01", "New"),
  ];
  const html = buildHomePage(posts);
  assertEquals(html.indexOf("New") < html.indexOf("Old"), true);
});

Deno.test("posts without date sort after dated posts", () => {
  const posts = [
    makePost("noddate", "", "No Date"),
    makePost("dated",   "2026-01-01", "Dated"),
  ];
  const html = buildHomePage(posts);
  assertEquals(html.indexOf("Dated") < html.indexOf("No Date"), true);
});
