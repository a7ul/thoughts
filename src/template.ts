function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

/** Relative path from outputPath depth back to root, e.g. "posts/a.html" → "../" */
function rootRelative(outputPath: string): string {
  const depth = outputPath.split("/").length - 1;
  return depth === 0 ? "./" : "../".repeat(depth);
}

export function postPage(params: {
  title: string;
  date: string;
  description: string;
  htmlContent: string;
  outputPath: string;
}): string {
  const { title, date, description, htmlContent, outputPath } = params;
  const root = rootRelative(outputPath);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ""}
<link rel="stylesheet" href="${root}style.css">
</head>
<body>
<div class="container">
<nav><a href="${root}index.html">← Home</a></nav>
<article>
<header>
<h1>${escapeHtml(title)}</h1>
${date ? `<time datetime="${escapeHtml(date)}">${formatDate(date)}</time>` : ""}
</header>
${htmlContent}
</article>
</div>
</body>
</html>`;
}

export function homePage(params: {
  siteTitle: string;
  posts: Array<{ title: string; date: string; description: string; url: string }>;
}): string {
  const { siteTitle, posts } = params;
  const items = posts.length === 0
    ? "<p>No posts yet.</p>"
    : `<ul class="post-list">${
      posts.map((p) => `
<li>
<h2><a href="${p.url}">${escapeHtml(p.title)}</a></h2>
${p.date ? `<time class="post-date" datetime="${escapeHtml(p.date)}">${formatDate(p.date)}</time>` : ""}
${p.description ? `<p class="post-desc">${escapeHtml(p.description)}</p>` : ""}
</li>`).join("")
    }</ul>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(siteTitle)}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<header class="site-header">
<h1>${escapeHtml(siteTitle)}</h1>
</header>
${items}
</div>
</body>
</html>`;
}

export const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #111; background: #fff; }
.container { max-width: 65ch; margin: 0 auto; padding: 3rem 1.5rem; }
a { color: #111; }
nav { margin-bottom: 2.5rem; }
nav a { color: #6b7280; text-decoration: none; font-size: 0.9rem; }
nav a:hover { color: #111; }
article header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; }
article header h1 { font-size: 2rem; font-weight: 700; line-height: 1.25; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
article header time { font-size: 0.875rem; color: #6b7280; }
article h2 { font-size: 1.35rem; font-weight: 600; margin: 2rem 0 0.75rem; }
article h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
article p { margin-bottom: 1rem; }
article ul, article ol { padding-left: 1.5rem; margin-bottom: 1rem; }
article li { margin-bottom: 0.25rem; }
article code { background: #f3f4f6; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.875em; font-family: ui-monospace, monospace; }
article pre { background: #f3f4f6; padding: 1rem; border-radius: 6px; overflow-x: auto; margin: 1.5rem 0; }
article pre code { background: none; padding: 0; }
article blockquote { border-left: 3px solid #d1d5db; padding-left: 1rem; color: #6b7280; margin: 1.5rem 0; }
article hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
article img { max-width: 100%; height: auto; border-radius: 4px; margin: 1rem 0; }
.site-header { margin-bottom: 3rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
.site-header h1 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; }
.post-list { list-style: none; }
.post-list li { padding: 1.5rem 0; border-bottom: 1px solid #e5e7eb; }
.post-list li:last-child { border-bottom: none; }
.post-list h2 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.3rem; }
.post-list h2 a { text-decoration: none; }
.post-list h2 a:hover { text-decoration: underline; }
.post-date { font-size: 0.875rem; color: #6b7280; display: block; margin-bottom: 0.4rem; }
.post-desc { color: #4b5563; font-size: 0.95rem; margin: 0; }
@media (max-width: 640px) { .container { padding: 1.5rem 1rem; } }
`.trim();
