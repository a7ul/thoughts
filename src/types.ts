export interface Frontmatter {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

export interface Post {
  frontmatter: Frontmatter;
  htmlContent: string;
  outputPath: string; // relative, e.g. "posts/hello.html"
  slug: string;       // e.g. "posts/hello"
}
