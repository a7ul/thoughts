import { parseArgs } from "@std/cli/parse-args";
import { resolve, join, dirname } from "@std/path";
import { discoverFiles } from "./src/discover.ts";
import { buildPost, renderPostFile } from "./src/post.ts";
import { buildHomePage } from "./src/home.ts";
import { CSS } from "./src/template.ts";

const HELP = `mdblog — static blog generator

Usage:
  deno task build [options]
  deno run --allow-read --allow-write main.ts [options]

Options:
  -i, --input  <dir>  Source directory of .md/.mdx files  (default: ./content)
  -o, --output <dir>  Output directory                    (default: ./dist)
  -h, --help          Show this help`;

async function main() {
  const args = parseArgs(Deno.args, {
    string: ["input", "output"],
    boolean: ["help"],
    alias: { i: "input", o: "output", h: "help" },
    default: { input: "./content", output: "./dist" },
  });

  if (args.help) { console.log(HELP); return; }

  const inputDir  = resolve(args.input as string);
  const outputDir = resolve(args.output as string);

  try {
    if (!(await Deno.stat(inputDir)).isDirectory) throw new Error();
  } catch {
    console.error(`Error: input directory not found: ${inputDir}`);
    Deno.exit(1);
  }

  console.log(`${inputDir} → ${outputDir}`);

  const files = await discoverFiles(inputDir);
  if (files.length === 0) { console.log("No .md/.mdx files found."); return; }

  const posts = [];
  for (const file of files) {
    const post = await buildPost(file, inputDir);
    if (!post) continue; // draft — skip silently

    const outPath = join(outputDir, post.outputPath);
    await Deno.mkdir(dirname(outPath), { recursive: true });
    await Deno.writeTextFile(outPath, renderPostFile(post));
    posts.push(post);
    console.log(`  ✓ ${post.outputPath}`);
  }

  await Deno.mkdir(outputDir, { recursive: true });
  await Deno.writeTextFile(join(outputDir, "index.html"), buildHomePage(posts));
  await Deno.writeTextFile(join(outputDir, "style.css"), CSS);

  console.log(`\nBuilt ${posts.length} post(s) → ${outputDir}`);
}

main().catch((e) => { console.error(e.message); Deno.exit(1); });
