// Static Site Generation (SSG) Build Script for GitHub Pages
// Compiles all SQLite articles, niches, authors, and SEO feeds into static HTML in dist/

const fs = require("fs");
const path = require("path");
const { db, stmts } = require("../src/db");
const { renderLayout } = require("../src/views/layout");
const { renderHome } = require("../src/views/home");
const { renderArticle } = require("../src/views/article");
const { renderNiche } = require("../src/views/niche");
const { renderAuthor } = require("../src/views/author");
const { renderBookmarks } = require("../src/views/bookmarks");

const DIST = path.join(__dirname, "../dist");
const BASE_URL = process.env.SITE_URL || "";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function build() {
  console.log("=== Building Static Site for GitHub Pages ===");
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  // 1. Copy Public Assets
  copyDir(path.join(__dirname, "../public"), DIST);
  fs.writeFileSync(path.join(DIST, ".nojekyll"), ""); // Prevent Jekyll processing

  // 2. Shared Nav Data
  const niches = stmts.getAllNiches.all();
  const authors = stmts.getAllAuthors.all();

  // 3. Render Homepage
  const leadPost = stmts.getFeaturedPosts.all(1)[0] || stmts.getRecentPosts.all(1, 0)[0];
  const trendingPosts = stmts.getTrendingPosts.all(5);
  const recentPosts = stmts.getRecentPosts.all(12, 0);
  const subscriberCount = stmts.getSubscriberCount.get().total;

  const homeHtml = renderLayout({
    title: "",
    description: "High-speed independent editorial covering Pakistani technology, macroeconomics, national statecraft, and consumer intelligence.",
    currentNiche: "",
    content: renderHome({ leadPost, trendingPosts, recentPosts, niches, authors, subscriberCount }),
    niches,
    authors,
    canonicalUrl: BASE_URL || "/"
  });
  fs.writeFileSync(path.join(DIST, "index.html"), homeHtml);
  console.log("✔ Generated: /index.html");

  // 4. Render All Articles
  const allPosts = db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug,
           a.bio as author_bio, a.credentials as author_credentials, a.beat as author_beat,
           a.location as author_location, a.avatar_initials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
  `).all();

  for (const post of allPosts) {
    const related = stmts.getPostsByNiche.all(post.niche_slug, 3, 0).filter(r => r.id !== post.id);
    const postDir = path.join(DIST, "article", post.slug);
    ensureDir(postDir);

    const postHtml = renderLayout({
      title: post.title,
      description: post.lead_paragraph,
      currentNiche: post.niche_slug,
      content: renderArticle({ post, relatedPosts: related }),
      niches,
      authors,
      canonicalUrl: `${BASE_URL}/article/${post.slug}`,
      ogImage: post.image_url || `/images/${post.niche_slug}.jpg`,
      ogType: "article",
      authorName: post.author_name
    });
    fs.writeFileSync(path.join(postDir, "index.html"), postHtml);
  }
  console.log(`✔ Generated: ${allPosts.length} article pages`);

  // 5. Render Niche Hubs
  for (const niche of niches) {
    const nichePosts = stmts.getPostsByNiche.all(niche.slug, 20, 0);
    const nicheDir = path.join(DIST, "niche", niche.slug);
    ensureDir(nicheDir);

    const nicheHtml = renderLayout({
      title: niche.name,
      description: niche.description,
      currentNiche: niche.slug,
      content: renderNiche({ niche, posts: nichePosts }),
      niches,
      authors,
      canonicalUrl: `${BASE_URL}/niche/${niche.slug}`,
      ogImage: `/images/${niche.slug}.jpg`
    });
    fs.writeFileSync(path.join(nicheDir, "index.html"), nicheHtml);
  }
  console.log(`✔ Generated: ${niches.length} niche desk hubs`);

  // 6. Render Author Profiles
  for (const author of authors) {
    const authorPosts = stmts.getPostsByAuthor.all(author.slug, 20);
    const authorDir = path.join(DIST, "author", author.slug);
    ensureDir(authorDir);

    const authorHtml = renderLayout({
      title: `${author.name} — ${author.title}`,
      description: author.bio,
      currentNiche: author.niche_slug,
      content: renderAuthor({ author, posts: authorPosts }),
      niches,
      authors,
      canonicalUrl: `${BASE_URL}/author/${author.slug}`
    });
    fs.writeFileSync(path.join(authorDir, "index.html"), authorHtml);
  }
  console.log(`✔ Generated: ${authors.length} author profiles`);

  // 7. Render Bookmarks
  const bookmarksDir = path.join(DIST, "bookmarks");
  ensureDir(bookmarksDir);
  const bookmarksHtml = renderLayout({
    title: "Saved Articles",
    description: "Your offline saved dispatches.",
    currentNiche: "bookmarks",
    content: renderBookmarks(),
    niches,
    authors,
    canonicalUrl: `${BASE_URL}/bookmarks`
  });
  fs.writeFileSync(path.join(bookmarksDir, "index.html"), bookmarksHtml);
  console.log("✔ Generated: /bookmarks/index.html");

  // 8. Generate XML Sitemaps, Robots, and RSS
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><priority>1.0</priority><changefreq>hourly</changefreq></url>
  ${niches.map(n => `<url><loc>${BASE_URL}/niche/${n.slug}</loc><priority>0.8</priority><changefreq>daily</changefreq></url>`).join("\n  ")}
  ${authors.map(a => `<url><loc>${BASE_URL}/author/${a.slug}</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>`).join("\n  ")}
  ${allPosts.map(p => `<url><loc>${BASE_URL}/article/${p.slug}</loc><lastmod>${new Date(p.published_at).toISOString().split("T")[0]}</lastmod><priority>0.9</priority><changefreq>monthly</changefreq></url>`).join("\n  ")}
</urlset>`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemapXml);

  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), robotsTxt);
  console.log("✔ Generated: /sitemap.xml & /robots.txt");

  console.log("\n Build Complete! Output written to /dist");
}

build();
