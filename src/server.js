// News PK Core Server: Fastify Ultra-High Speed Runtime with Zero-Copy Buffer Cache & Full SEO
require("dotenv").config();

const fastify = require("fastify")({
  logger: false
});
const path = require("path");
const fs = require("fs");
const { db, stmts } = require("./db");
const { pageCache } = require("./services/cache");
const { subscribe, unsubscribe, generateNewsletterDigest } = require("./services/newsletter");
const { orchestrator } = require("./agent/orchestrator");

const { renderLayout } = require("./views/layout");
const { renderHome } = require("./views/home");
const { renderArticle } = require("./views/article");
const { renderNiche } = require("./views/niche");
const { renderAuthor } = require("./views/author");
const { renderBookmarks } = require("./views/bookmarks");
const { renderAdmin } = require("./views/admin");

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || "newspk_admin_sec_49d7b0";
const AGENT_KEY = process.env.AGENT_API_KEY || "newspk_agent_sec_8f93e1b72a4";
const BASE_URL = process.env.SITE_URL || "http://localhost:3000";

// Register static assets
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public"),
  prefix: "/",
  maxAge: "1d",
  immutable: true
});

fastify.register(require("@fastify/formbody"));

// Shared Navigation Data Loader
function getSharedNavData() {
  const niches = stmts.getAllNiches.all();
  const authors = stmts.getAllAuthors.all();
  return { niches, authors };
}

// 1. FRONT PAGE (Cached Zero-Copy Buffer with WebSite JSON-LD)
fastify.get("/", async (req, reply) => {
  const served = pageCache.serveFromCache(req, reply, "/", () => {
    const { niches, authors } = getSharedNavData();
    const featured = stmts.getFeaturedPosts.all(1);
    const leadPost = featured[0] || stmts.getRecentPosts.all(1, 0)[0];
    const trendingPosts = stmts.getTrendingPosts.all(4);
    const recentPosts = stmts.getRecentPosts.all(9, 1);
    const subscriberCount = stmts.getSubscriberCount.get().total;

    const bodyHtml = renderHome({
      leadPost,
      trendingPosts,
      recentPosts,
      niches,
      authors,
      subscriberCount
    });

    const websiteJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "NewsMediaOrganization",
          "@id": `${BASE_URL}/#organization`,
          "name": "News PK",
          "url": BASE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/images/technology.jpg`
          },
          "publishingPrinciples": `${BASE_URL}/#standards`,
          "correctionsPolicy": `${BASE_URL}/#corrections`
        },
        {
          "@type": "WebSite",
          "@id": `${BASE_URL}/#website`,
          "url": BASE_URL,
          "name": "News PK",
          "description": "Independent Pakistani journalism, central banking analysis, and telecom intelligence.",
          "publisher": { "@id": `${BASE_URL}/#organization` },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${BASE_URL}/api/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }
      ]
    };

    return renderLayout({
      title: "Front Page",
      description: "Independent Pakistani publication covering technology, central banking, national statecraft, and consumer intelligence.",
      currentNiche: "",
      content: bodyHtml,
      niches,
      authors,
      canonicalUrl: BASE_URL,
      ogImage: `${BASE_URL}/images/${leadPost ? leadPost.niche_slug : "technology"}.jpg`,
      ogType: "website",
      jsonLd: websiteJsonLd
    });
  });

  return reply;
});

// 2. ARTICLE READER (Cached Zero-Copy Buffer with Google NewsArticle JSON-LD)
fastify.get("/article/:slug", async (req, reply) => {
  const { slug } = req.params;
  const cacheKey = `/article/${slug}`;

  const served = pageCache.serveFromCache(req, reply, cacheKey, () => {
    const post = stmts.getPostBySlug.get(slug);
    if (!post) return null;

    const { niches, authors } = getSharedNavData();
    const relatedPosts = stmts.getPostsByNiche.all(post.niche_slug, 3, 0).filter(p => p.id !== post.id);

    const bodyHtml = renderArticle({
      post,
      relatedPosts
    });

    const canonical = `${BASE_URL}/article/${post.slug}`;
    const imageUrl = post.image_url ? (post.image_url.startsWith("http") ? post.image_url : `${BASE_URL}${post.image_url}`) : `${BASE_URL}/images/${post.niche_slug}.jpg`;

    const newsArticleJsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      },
      "headline": post.title,
      "description": post.lead_paragraph,
      "image": [imageUrl],
      "datePublished": new Date(post.published_at).toISOString(),
      "dateModified": new Date(post.created_at || post.published_at).toISOString(),
      "dateline": post.dateline,
      "inLanguage": "en-US",
      "articleSection": post.niche_name,
      "author": [{
        "@type": "Person",
        "name": post.author_name,
        "jobTitle": post.author_title,
        "url": `${BASE_URL}/author/${post.author_slug}`
      }],
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "News PK",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/images/technology.jpg`
        }
      }
    };

    return renderLayout({
      title: post.title,
      description: post.lead_paragraph,
      currentNiche: post.niche_slug,
      content: bodyHtml,
      niches,
      authors,
      canonicalUrl: canonical,
      ogImage: imageUrl,
      ogType: "article",
      authorName: post.author_name,
      jsonLd: newsArticleJsonLd
    });
  });

  if (!served) {
    const post = stmts.getPostBySlug.get(slug);
    if (!post) {
      reply.code(404).type("text/html").send("<h1>404 Article Not Found</h1>");
      return reply;
    }
  }

  setImmediate(() => {
    const post = stmts.getPostBySlug.get(slug);
    if (post) stmts.incrementPostViews.run(post.id);
  });

  return reply;
});

// 3. NICHE HUB
fastify.get("/niche/:slug", async (req, reply) => {
  const { slug } = req.params;
  const cacheKey = `/niche/${slug}`;

  const served = pageCache.serveFromCache(req, reply, cacheKey, () => {
    const niche = stmts.getNicheBySlug.get(slug);
    if (!niche) return null;

    const { niches, authors } = getSharedNavData();
    const posts = stmts.getPostsByNiche.all(slug, 20, 0);

    const bodyHtml = renderNiche({
      niche,
      posts
    });

    const canonical = `${BASE_URL}/niche/${slug}`;
    const imageUrl = `${BASE_URL}/images/${slug}.jpg`;

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": niche.name, "item": canonical }
      ]
    };

    return renderLayout({
      title: niche.name,
      description: niche.description,
      currentNiche: slug,
      content: bodyHtml,
      niches,
      authors,
      canonicalUrl: canonical,
      ogImage: imageUrl,
      jsonLd: breadcrumbJsonLd
    });
  });

  if (!served) {
    reply.code(404).type("text/html").send("<h1>404 Desk Not Found</h1>");
  }
  return reply;
});

// 4. AUTHOR PROFILE
fastify.get("/author/:slug", async (req, reply) => {
  const { slug } = req.params;
  const cacheKey = `/author/${slug}`;

  const served = pageCache.serveFromCache(req, reply, cacheKey, () => {
    const author = stmts.getAuthorBySlug.get(slug);
    if (!author) return null;

    const { niches, authors } = getSharedNavData();
    const posts = stmts.getPostsByAuthor.all(slug, 20);

    const bodyHtml = renderAuthor({
      author,
      posts
    });

    const canonical = `${BASE_URL}/author/${slug}`;

    const personJsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.title,
      "description": author.bio,
      "url": canonical,
      "worksFor": {
        "@type": "NewsMediaOrganization",
        "name": "News PK",
        "url": BASE_URL
      }
    };

    return renderLayout({
      title: author.name,
      description: author.bio,
      currentNiche: "",
      content: bodyHtml,
      niches,
      authors,
      canonicalUrl: canonical,
      authorName: author.name,
      jsonLd: personJsonLd
    });
  });

  if (!served) {
    reply.code(404).type("text/html").send("<h1>404 Author Not Found</h1>");
  }
  return reply;
});

// 5. BOOKMARKS VIEW
fastify.get("/bookmarks", async (req, reply) => {
  const { niches, authors } = getSharedNavData();
  const bodyHtml = renderBookmarks();
  const html = renderLayout({
    title: "Saved Articles",
    description: "Your offline saved reading queue.",
    currentNiche: "bookmarks",
    content: bodyHtml,
    niches,
    authors,
    canonicalUrl: `${BASE_URL}/bookmarks`
  });
  reply.type("text/html; charset=utf-8").send(html);
  return reply;
});

// --- TECHNICAL SEO ENDPOINTS FOR GOOGLE SEARCH CONSOLE & GOOGLE NEWS ---

// 1. Standard XML Sitemap (/sitemap.xml)
fastify.get("/sitemap.xml", async (req, reply) => {
  const posts = db.prepare("SELECT slug, published_at, created_at FROM posts ORDER BY published_at DESC LIMIT 1000").all();
  const niches = stmts.getAllNiches.all();
  const authors = stmts.getAllAuthors.all();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  ${niches.map(n => `
  <url>
    <loc>${BASE_URL}/niche/${n.slug}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
  ${authors.map(a => `
  <url>
    <loc>${BASE_URL}/author/${a.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  ${posts.map(p => `
  <url>
    <loc>${BASE_URL}/article/${p.slug}</loc>
    <lastmod>${new Date(p.created_at || p.published_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join("")}
</urlset>`;

  reply.type("application/xml; charset=utf-8").send(xml);
  return reply;
});

// 2. Google News XML Sitemap (/sitemap-news.xml)
fastify.get("/sitemap-news.xml", async (req, reply) => {
  const recentNews = db.prepare("SELECT title, slug, published_at FROM posts ORDER BY published_at DESC LIMIT 50").all();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentNews.map(p => `
  <url>
    <loc>${BASE_URL}/article/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>News PK</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(p.published_at).toISOString()}</news:publication_date>
      <news:title>${p.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</news:title>
    </news:news>
  </url>`).join("")}
</urlset>`;

  reply.type("application/xml; charset=utf-8").send(xml);
  return reply;
});

// 3. Technical robots.txt (/robots.txt)
fastify.get("/robots.txt", async (req, reply) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/agent/

Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-news.xml
`;
  reply.type("text/plain; charset=utf-8").send(robots);
  return reply;
});

// 4. RSS 2.0 Syndication Feed (/rss.xml)
fastify.get("/rss.xml", async (req, reply) => {
  const posts = db.prepare(`
    SELECT p.*, a.name as author_name, n.name as niche_name
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    ORDER BY p.published_at DESC
    LIMIT 30
  `).all();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News PK — Independent Journalism, Markets &amp; Technology</title>
    <link>${BASE_URL}</link>
    <description>Independent Pakistani editorial publication covering technology, central banking, national statecraft, and consumer intelligence.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(p => `
    <item>
      <title>${p.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
      <link>${BASE_URL}/article/${p.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/article/${p.slug}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      <author>${p.author_name}</author>
      <category>${p.niche_name}</category>
      <description>${p.lead_paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</description>
    </item>`).join("")}
  </channel>
</rss>`;

  reply.type("application/rss+xml; charset=utf-8").send(xml);
  return reply;
});

// --- SECURITY HELPERS ---
function checkAdminAuth(req) {
  const queryToken = req.query ? req.query.token : null;
  const headerToken = req.headers["x-admin-token"];
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  return queryToken === ADMIN_TOKEN || headerToken === ADMIN_TOKEN || bearerToken === ADMIN_TOKEN;
}

function checkAgentAuth(req) {
  const headerKey = req.headers["x-agent-key"];
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  return headerKey === AGENT_KEY || bearerToken === AGENT_KEY;
}

// 6. PROTECTED ADMIN INTELLIGENCE ROOM
fastify.get("/admin", async (req, reply) => {
  if (!checkAdminAuth(req)) {
    reply.code(401).type("text/html; charset=utf-8").send(`
      <!DOCTYPE html>
      <html>
      <head><title>401 Unauthorized — News PK</title>
      <style>body{font-family:sans-serif;background:#090d16;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}
      .box{background:#0f172a;border:1px solid #1e293b;padding:40px;border-radius:12px;text-align:center;max-width:420px;}
      h1{font-size:1.6rem;margin-bottom:8px;color:#ef4444;}p{color:#94a3b8;font-size:0.95rem;line-height:1.5;}
      a{color:#38bdf8;text-decoration:none;}</style></head>
      <body>
        <div class="box">
          <h1>401 &bull; Access Restricted</h1>
          <p>This administrative intelligence console is restricted to verified newsroom personnel. Please provide valid authorization credentials.</p>
          <p style="margin-top:20px;"><a href="/">&larr; Return to Public Edition</a></p>
        </div>
      </body>
      </html>
    `);
    return reply;
  }

  const { niches, authors } = getSharedNavData();
  const status = orchestrator.getStatus();
  const cacheStats = pageCache.getStats();

  const totalArticles = db.prepare("SELECT COUNT(*) as count FROM posts").get().count;
  const bodyHtml = renderAdmin({
    sources: status.sources,
    logs: status.recentLogs,
    cacheStats,
    isRunning: status.isRunning,
    totalArticles
  });

  const html = renderLayout({
    title: "Editorial Operations Desk",
    description: "Private newsroom management desk for News PK editorial leadership.",
    currentNiche: "admin",
    content: bodyHtml,
    niches,
    authors,
    canonicalUrl: `${BASE_URL}/admin`
  });

  reply.type("text/html; charset=utf-8").send(html);
  return reply;
});

// --- API ENDPOINTS ---

// Instant Full-Text Search (SQLite FTS5 BM25)
fastify.get("/api/search", async (req, reply) => {
  const q = req.query.q ? String(req.query.q).trim() : "";
  if (!q || q.length < 2) {
    return { results: [] };
  }

  const cleanQuery = q.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  if (!cleanQuery) return { results: [] };

  const ftsQuery = cleanQuery.split(/\s+/).map(t => `"${t}"*`).join(" ");
  try {
    const results = stmts.searchPostsFTS.all(ftsQuery);
    return { results };
  } catch (err) {
    return { results: [], error: err.message };
  }
});

// Newsletter Subscription
fastify.post("/api/newsletter/subscribe", async (req, reply) => {
  const { email, niches } = req.body || {};
  const res = subscribe(email, niches || "all");
  return res;
});

// Newsletter Unsubscribe
fastify.get("/newsletter/unsubscribe", async (req, reply) => {
  const token = req.query.token;
  const res = unsubscribe(token);
  reply.type("text/html").send(`<h2>${res.message}</h2><p><a href="/">Return to Front Page</a></p>`);
  return reply;
});

// Newsletter Preview Digest
fastify.get("/api/newsletter/preview", async (req, reply) => {
  const digest = generateNewsletterDigest();
  reply.type("text/html").send(digest.html);
  return reply;
});

// --- PROTECTED INGESTION & AGENT ENDPOINTS ---

// Secure External Agent Ingestion Endpoint
fastify.post("/api/agent/publish", async (req, reply) => {
  if (!checkAgentAuth(req)) {
    reply.code(401).send({ error: "Unauthorized: Invalid or missing x-agent-key." });
    return reply;
  }

  const postData = req.body;
  if (!postData || !postData.title || !postData.contentHtml || !postData.nicheSlug || !postData.authorSlug) {
    reply.code(400).send({ error: "Missing required article fields." });
    return reply;
  }

  const niche = stmts.getNicheBySlug.get(postData.nicheSlug);
  const author = stmts.getAuthorBySlug.get(postData.authorSlug);

  if (!niche || !author) {
    reply.code(400).send({ error: "Unknown niche or author slug." });
    return reply;
  }

  // Deduplication check
  const existing = db.prepare("SELECT id FROM posts WHERE original_headline = ? OR source_url = ?").get(postData.originalHeadline || postData.title, postData.sourceUrl);
  if (existing) {
    return { success: true, status: "duplicate_skipped", postId: existing.id };
  }

  try {
    let finalImageUrl = postData.imageUrl || postData.image_url || "/images/" + niche.slug + ".jpg";

    if (postData.imageBase64) {
      try {
        const imgBuffer = Buffer.from(postData.imageBase64, "base64");
        const filename = `${postData.slug}.jpg`;
        const imgDir = path.join(__dirname, "../public/images/dispatches");
        if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
        const fullPath = path.join(imgDir, filename);
        fs.writeFileSync(fullPath, imgBuffer);
        finalImageUrl = `/images/dispatches/${filename}`;
      } catch (imgErr) {
        console.error("Failed saving agent-generated image:", imgErr.message);
      }
    }

    const info = stmts.insertPost.run({
      slug: postData.slug,
      title: postData.title,
      lead_paragraph: postData.leadParagraph,
      content_html: postData.contentHtml,
      dateline: postData.dateline,
      reading_time_minutes: postData.readingTimeMinutes || 3,
      niche_id: niche.id,
      author_id: author.id,
      source_publication: postData.sourcePublication || "External Dispatch",
      source_url: postData.sourceUrl || "",
      original_headline: postData.originalHeadline || postData.title,
      is_breaking: postData.isBreaking ? 1 : 0,
      is_featured: postData.isFeatured ? 1 : 0,
      is_trending: postData.isTrending ? 1 : 0,
      image_url: finalImageUrl
    });

    const newPostId = Number(info.lastInsertRowid);
    stmts.insertScraperLog.run(postData.sourcePublication.toLowerCase().replace(/[^a-z]/g, ""), postData.title, newPostId, "published_via_api");

    // Invalidate zero-copy caches for instant freshness
    pageCache.invalidate("/");
    pageCache.invalidate(`/niche/${niche.slug}`);
    pageCache.invalidate(`/author/${author.slug}`);

    return {
      success: true,
      postId: newPostId,
      slug: postData.slug,
      message: "Article ingested, indexed in FTS5, and zero-copy cache refreshed."
    };
  } catch (err) {
    reply.code(500).send({ error: err.message });
    return reply;
  }
});

// Protected Scraper Run Controls
fastify.post("/api/admin/scrape", async (req, reply) => {
  if (!checkAdminAuth(req)) {
    reply.code(401).send({ error: "Unauthorized access." });
    return reply;
  }

  setImmediate(async () => {
    await orchestrator.runAllSources();
  });
  return { status: "started", message: "Full ingestion of all 12 publication feeds initiated in background." };
});

fastify.post("/api/admin/scrape/:code", async (req, reply) => {
  if (!checkAdminAuth(req)) {
    reply.code(401).send({ error: "Unauthorized access." });
    return reply;
  }

  const { code } = req.params;
  try {
    const res = await orchestrator.runSingleSource(code);
    return res;
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
});


// Start Server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`News PK publication server running at http://localhost:${PORT}`);
    console.log(`Zero-Copy Buffer Cache & SQLite WAL Engine Active. Full SEO Endpoints Ready.`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
