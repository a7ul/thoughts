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

const THEME_SCRIPT = `<script>
(function(){
  var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',t);
  var link=document.getElementById('hljs-theme');
  if(link&&t==='dark')link.href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
})();
</script>`;

const PAGE_SCRIPT = `<script>
(function(){
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    localStorage.setItem('theme',t);
    var link=document.getElementById('hljs-theme');
    if(link)link.href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/'+(t==='dark'?'github-dark':'github')+'.min.css';
    var btn=document.getElementById('theme-toggle');
    if(btn)btn.textContent=t==='dark'?'☀':'☾';
    var gf=document.querySelector('iframe.giscus-frame');
    if(gf)gf.contentWindow.postMessage({giscus:{setConfig:{theme:t==='dark'?'dark_dimmed':'light'}}}, 'https://giscus.app');
  }
  function buildToc(){
    var toc=document.getElementById('toc');
    if(!toc)return;
    var headings=Array.from(document.querySelectorAll('article h2,article h3'));
    if(headings.length<2)return;
    var title=document.createElement('div');
    title.className='toc-title';
    title.textContent='On this page';
    toc.appendChild(title);
    var ul=document.createElement('ul');
    headings.forEach(function(h,i){
      if(!h.id)h.id=(h.textContent||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'h'+i;
      var li=document.createElement('li');
      var a=document.createElement('a');
      a.href='#'+h.id;
      a.textContent=h.textContent;
      a.className=h.tagName==='H3'?'toc-h3':'toc-h2';
      li.appendChild(a);
      ul.appendChild(li);
    });
    toc.appendChild(ul);
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var link=toc.querySelector('a[href="#'+e.target.id+'"]');
        if(link){
          if(e.isIntersecting){
            toc.querySelectorAll('a').forEach(function(a){a.classList.remove('active');});
            link.classList.add('active');
          }
        }
      });
    },{rootMargin:'-10% 0px -80% 0px'});
    headings.forEach(function(h){obs.observe(h);});
  }
  document.addEventListener('DOMContentLoaded',function(){
    var cur=document.documentElement.getAttribute('data-theme')||'light';
    var btn=document.getElementById('theme-toggle');
    if(btn){
      btn.textContent=cur==='dark'?'☀':'☾';
      btn.addEventListener('click',function(){
        applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
      });
    }
    buildToc();
    initLightbox();
  });
  function initLightbox(){
    var overlay=document.getElementById('img-overlay');
    var overlayImg=document.getElementById('img-overlay-img');
    if(!overlay||!overlayImg)return;
    document.querySelectorAll('article img').forEach(function(img){
      img.style.cursor='zoom-in';
      img.addEventListener('click',function(){
        overlayImg.setAttribute('src',img.getAttribute('src')||'');
        overlayImg.setAttribute('alt',img.getAttribute('alt')||'');
        overlay.classList.add('open');
        document.body.style.overflow='hidden';
      });
    });
    function close(){overlay.classList.remove('open');document.body.style.overflow='';}
    overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  }
})();
</script>`;

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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Caveat:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${root}style.css">
<link id="hljs-theme" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
${THEME_SCRIPT}
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>document.addEventListener('DOMContentLoaded',function(){hljs.highlightAll();});</script>
</head>
<body>
<div id="img-overlay" class="img-overlay"><img id="img-overlay-img" src="" alt=""></div>
<aside class="toc-sidebar" id="toc"></aside>
<div class="container">
<nav><a href="${root}index.html">← Home</a><button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme"></button></nav>
<article>
<header>
<h1>${escapeHtml(title)}</h1>
<div class="post-meta">
<span class="post-author">Atul</span>${date ? ` · <time datetime="${escapeHtml(date)}">${formatDate(date)}</time>` : ""}
</div>
</header>
${htmlContent}
</article>
<div class="giscus-wrap">
<script src="https://giscus.app/client.js"
  data-repo="a7ul/thoughts"
  data-repo-id="R_kgDORp7Weg"
  data-category="General"
  data-category-id="DIC_kwDORp7Wes4C4pUS"
  data-mapping="title"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="light"
  data-lang="en"
  crossorigin="anonymous"
  async>
</script>
</div>
</div>
${PAGE_SCRIPT}
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
${p.date ? `<time class="post-date" datetime="${escapeHtml(p.date)}">${formatDate(p.date)}</time>` : ""}
<h2><a href="${p.url}">${escapeHtml(p.title)}</a></h2>
${p.description ? `<p class="post-desc">${escapeHtml(p.description)}</p>` : ""}
</li>`).join("")
    }</ul>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(siteTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap">
<link id="hljs-theme" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
<link rel="stylesheet" href="style.css">
${THEME_SCRIPT}
</head>
<body>
<div class="container">
<header class="site-header">
<div class="site-header-top">
<h1>${escapeHtml(siteTitle)}</h1>
<button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme"></button>
</div>
<p class="site-bio">Cofounder &amp; CTO at <a href="https://filed.com" target="_blank" rel="noopener">Filed</a>. He has been building software for about 11+ years. This is where he stores all of his secret thoughts.</p>
</header>
${items}
<footer class="site-footer">Link to the old blog site: <a href="https://blog.atulr.com" target="_blank" rel="noopener">https://blog.atulr.com</a></footer>
</div>
${PAGE_SCRIPT}
</body>
</html>`;
}

export const CSS = `
/* ── Theme variables ─────────────────────────────────── */
:root {
  --bg: #fff;
  --text: #111;
  --text-secondary: #444;
  --text-muted: #777;
  --border: #e0e0e0;
  --border-light: #eee;
  --code-bg: #f6f8fa;
  --code-border: #e8e8e8;
  --inline-code-bg: #f7f7f7;
  --nav-color: #555;
  --footer-color: #666;
  --blockquote-border: #ccc;
  --blockquote-color: #444;
  --link-underline: #ccc;
}
[data-theme="dark"] {
  --bg: #111;
  --text: #e8e8e8;
  --text-secondary: #aaa;
  --text-muted: #888;
  --border: #2a2a2a;
  --border-light: #222;
  --code-bg: #161b22;
  --code-border: #30363d;
  --inline-code-bg: #1e1e1e;
  --nav-color: #999;
  --footer-color: #777;
  --blockquote-border: #444;
  --blockquote-color: #aaa;
  --link-underline: #555;
}

/* ── Reset ───────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Base ────────────────────────────────────────────── */
body {
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.container { max-width: 860px; margin: 0 auto; padding: 4rem 1.5rem; }
a { color: inherit; text-underline-offset: 3px; }

/* ── Theme toggle ────────────────────────────────────── */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-muted);
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.15s;
}
.theme-toggle:hover { color: var(--text); }

/* ── Nav ─────────────────────────────────────────────── */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5rem;
}
nav a {
  font-size: 0.875rem;
  color: var(--nav-color);
  text-decoration: none;
  transition: color 0.15s;
}
nav a:hover { color: var(--text); }

/* ── Site header (home) ─────────────────────────────── */
.site-header {
  margin-bottom: 3.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}
.site-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.6rem;
}
.site-header h1 {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.site-bio {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 52ch;
}
.site-bio a { text-decoration: underline; text-underline-offset: 2px; }

/* ── Post list (home) ───────────────────────────────── */
.post-list { list-style: none; }
.post-list li {
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--border);
}
.post-list li:first-child { padding-top: 0; }
.post-list li:last-child { border-bottom: none; }

.post-date {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.post-list h2 {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
}
.post-list h2 a {
  text-decoration: none;
  transition: opacity 0.15s;
}
.post-list h2 a:hover { opacity: 0.6; }
.post-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* ── Article header ─────────────────────────────────── */
article header {
  margin-bottom: 2.75rem;
}
article header h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
  margin-bottom: 0.75rem;
}
article header .post-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ── Article body ───────────────────────────────────── */
article { font-size: 1.0625rem; line-height: 1.8; }

article h2 {
  font-size: 1.3rem;
  font-weight: 650;
  letter-spacing: -0.025em;
  margin: 2.5rem 0 0.75rem;
}
article h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 2rem 0 0.5rem;
}
article p { margin-bottom: 1.25rem; }
article ul, article ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
article li { margin-bottom: 0.4rem; }
article strong { font-weight: 600; }

article a {
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--link-underline);
  transition: text-decoration-color 0.15s;
}
article a:hover { text-decoration-color: var(--text); }

article code {
  font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
  font-size: 0.875em;
  background: var(--inline-code-bg);
  border: 1px solid var(--code-border);
  padding: 0.1em 0.4em;
  border-radius: 4px;
}
article pre {
  background: var(--code-bg) !important;
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem !important;
  overflow-x: auto;
  margin: 1.75rem 0;
  line-height: 1.6;
}
article pre code { background: none !important; border: none; padding: 0; font-size: 0.875rem; }

article blockquote {
  border-left: 2px solid var(--blockquote-border);
  padding: 0.1rem 0 0.1rem 1.25rem;
  margin: 1.75rem 0;
  color: var(--blockquote-color);
  font-style: italic;
}
article blockquote p { margin-bottom: 0; }
article hr { border: none; border-top: 1px solid var(--border-light); margin: 3rem 0; }
article img {
  max-width: 100%;
  max-height: 60vh;
  height: auto;
  width: auto;
  border-radius: 8px;
  margin: 1.75rem 0;
  padding: 0.5rem;
  display: block;
  cursor: zoom-in;
}
[data-theme="dark"] article img {
  background: #fff;
}

/* ── Image lightbox ──────────────────────────────────── */
.img-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.img-overlay.open { display: flex; }
.img-overlay img {
  max-width: 92vw;
  max-height: 92vh;
  width: auto;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  cursor: default;
  margin: 0;
}
article table { width: 100%; border-collapse: collapse; font-size: 0.9375rem; margin: 1.75rem 0; }
article th { text-align: left; font-weight: 600; padding: 0.5rem 0.75rem; border-bottom: 2px solid var(--border); }
article td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border-light); }

/* ── Hand-drawn figures (Excalidraw-style SVG embeds) ── */
figure.dwg { margin: 2.25rem 0; }
figure.dwg svg, figure.dwg .exdraw {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
figure.dwg figcaption {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-style: italic;
}
.hw { font-family: 'Caveat', 'Comic Sans MS', cursive; }

/* ── TOC sidebar ─────────────────────────────────────── */
.toc-sidebar { display: none; }

@media (min-width: 1100px) {
  .toc-sidebar {
    display: block;
    position: fixed;
    left: calc(50vw - 430px - 210px - 1.5rem);
    top: 4rem;
    width: 190px;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
  }
  .toc-sidebar ul { list-style: none; }
  .toc-sidebar li { margin-bottom: 0; }
  .toc-title {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }
  .toc-sidebar a {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted);
    text-decoration: none;
    padding: 0.2rem 0 0.2rem 0.75rem;
    line-height: 1.4;
    transition: color 0.15s, border-color 0.15s;
    border-left: 2px solid transparent;
  }
  .toc-sidebar a:hover,
  .toc-sidebar a.active {
    color: var(--text);
    border-left-color: var(--text);
  }
  .toc-sidebar a.toc-h3 { padding-left: 1.5rem; font-size: 0.75rem; }
}

/* ── Comments ───────────────────────────────────────── */
.giscus-wrap { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-light); }

/* ── Footer ─────────────────────────────────────────── */
.site-footer {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
  color: var(--footer-color);
}
.site-footer a { color: var(--footer-color); text-decoration: none; }
.site-footer a:hover { color: var(--text); }

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 640px) {
  .container { padding: 2.5rem 1.25rem; }
  article header h1 { font-size: 1.625rem; }
  article { font-size: 1rem; }
}
`.trim();
