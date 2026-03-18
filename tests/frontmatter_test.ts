import { assertEquals } from "@std/assert";
import { parseFrontmatter } from "../src/frontmatter.ts";

Deno.test("full frontmatter parses correctly", () => {
  const { frontmatter, content } = parseFrontmatter(`---
title: Hello
date: 2026-01-15
description: A post
tags: [a, b]
---
Body here.`);
  assertEquals(frontmatter.title, "Hello");
  assertEquals(frontmatter.date, "2026-01-15");
  assertEquals(frontmatter.description, "A post");
  assertEquals(frontmatter.tags, ["a", "b"]);
  assertEquals(content.trim(), "Body here.");
});

Deno.test("missing frontmatter uses filename for title", () => {
  const { frontmatter } = parseFrontmatter("# Just content", "my-first-post.mdx");
  assertEquals(frontmatter.title, "My First Post");
  assertEquals(frontmatter.date, "");
  assertEquals(frontmatter.description, "");
});

Deno.test("no frontmatter no filename falls back to Untitled", () => {
  const { frontmatter } = parseFrontmatter("Just content");
  assertEquals(frontmatter.title, "Untitled");
});

Deno.test("partial frontmatter fills missing fields", () => {
  const { frontmatter } = parseFrontmatter("---\ntitle: Only Title\n---\nBody");
  assertEquals(frontmatter.title, "Only Title");
  assertEquals(frontmatter.date, "");
  assertEquals(frontmatter.description, "");
});

Deno.test("draft field is preserved", () => {
  const { frontmatter } = parseFrontmatter("---\ntitle: T\ndraft: true\n---\n");
  assertEquals(frontmatter.draft, true);
});

Deno.test("YAML date object is normalised to ISO string", () => {
  const { frontmatter } = parseFrontmatter("---\ntitle: T\ndate: 2026-01-15\n---\n");
  assertEquals(frontmatter.date, "2026-01-15");
});
