import { assertEquals } from "@std/assert";
import { join, dirname, fromFileUrl } from "@std/path";
import { discoverFiles } from "../src/discover.ts";

const FIXTURES = join(dirname(fromFileUrl(import.meta.url)), "fixtures");

Deno.test("finds .mdx and .md files recursively", async () => {
  const files = await discoverFiles(FIXTURES);
  const names = files.map((f) => f.split("/").pop()!).sort();
  assertEquals(names.includes("with-frontmatter.mdx"), true);
  assertEquals(names.includes("no-frontmatter.mdx"), true);
  assertEquals(names.includes("deep.md"), true);
});

Deno.test("prefers .mdx over .md when both exist", async () => {
  const tmp = await Deno.makeTempDir();
  await Deno.writeTextFile(join(tmp, "foo.md"),  "md");
  await Deno.writeTextFile(join(tmp, "foo.mdx"), "mdx");
  const files = await discoverFiles(tmp);
  const names = files.map((f) => f.split("/").pop()!);
  assertEquals(names.includes("foo.mdx"), true);
  assertEquals(names.includes("foo.md"), false);
  await Deno.remove(tmp, { recursive: true });
});

Deno.test("skips dotfiles and underscore files", async () => {
  const tmp = await Deno.makeTempDir();
  await Deno.writeTextFile(join(tmp, ".hidden.md"), "hidden");
  await Deno.writeTextFile(join(tmp, "_draft.md"),  "draft");
  await Deno.writeTextFile(join(tmp, "real.md"),    "real");
  const files = await discoverFiles(tmp);
  const names = files.map((f) => f.split("/").pop()!);
  assertEquals(names, ["real.md"]);
  await Deno.remove(tmp, { recursive: true });
});
