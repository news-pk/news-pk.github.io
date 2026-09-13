const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "../../data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "news_pk.db");
const db = new Database(DB_PATH);

// High-performance database PRAGMAs
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("cache_size = -64000"); // 64 MB
db.pragma("mmap_size = 268435456"); // 256 MB memory-mapped I/O
db.pragma("temp_store = MEMORY");
db.pragma("foreign_keys = ON");

// Initialize Schema
const schemaPath = path.join(__dirname, "schema.sql");
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  db.exec(schemaSql);
}

// Prepared Statements Cache for sub-millisecond execution
const stmts = {
  // Posts
  getPostBySlug: db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug, 
           a.avatar_initials, a.beat as author_beat, a.bio as author_bio, a.credentials as author_credentials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    WHERE p.slug = ?
  `),

  getRecentPosts: db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug, a.avatar_initials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?
  `),

  getFeaturedPosts: db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug, a.avatar_initials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    WHERE p.is_featured = 1
    ORDER BY p.published_at DESC
    LIMIT ?
  `),

  getTrendingPosts: db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug, a.avatar_initials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    WHERE p.is_trending = 1 OR p.views_count > 100
    ORDER BY p.views_count DESC, p.published_at DESC
    LIMIT ?
  `),

  getPostsByNiche: db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug, a.avatar_initials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    WHERE n.slug = ?
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?
  `),

  getPostsByAuthor: db.prepare(`
    SELECT p.*, a.name as author_name, a.title as author_title, a.slug as author_slug, a.avatar_initials,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    WHERE a.slug = ?
    ORDER BY p.published_at DESC
    LIMIT ?
  `),

  incrementPostViews: db.prepare(`
    UPDATE posts SET views_count = views_count + 1 WHERE id = ?
  `),

  searchPostsFTS: db.prepare(`
    SELECT p.id, p.slug, p.title, p.lead_paragraph, p.published_at, p.reading_time_minutes,
           a.name as author_name, a.slug as author_slug,
           n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent,
           snippet(post_fts, 0, '<mark>', '</mark>', '...', 15) as snippet_title,
           snippet(post_fts, 1, '<mark>', '</mark>', '...', 25) as snippet_lead
    FROM post_fts
    JOIN posts p ON post_fts.rowid = p.id
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    WHERE post_fts MATCH ?
    ORDER BY rank
    LIMIT 20
  `),

  insertPost: db.prepare(`
    INSERT INTO posts (
      slug, title, lead_paragraph, content_html, dateline, reading_time_minutes,
      niche_id, author_id, source_publication, source_url, original_headline,
      is_breaking, is_featured, is_trending, image_url
    ) VALUES (
      @slug, @title, @lead_paragraph, @content_html, @dateline, @reading_time_minutes,
      @niche_id, @author_id, @source_publication, @source_url, @original_headline,
      @is_breaking, @is_featured, @is_trending, @image_url
    )
  `),

  // Authors & Niches
  getAllNiches: db.prepare(`
    SELECT n.*, (SELECT COUNT(*) FROM posts WHERE niche_id = n.id) as post_count
    FROM niches n
    ORDER BY display_order ASC
  `),

  getNicheBySlug: db.prepare(`SELECT * FROM niches WHERE slug = ?`),

  getAllAuthors: db.prepare(`
    SELECT a.*, n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent,
           (SELECT COUNT(*) FROM posts WHERE author_id = a.id) as post_count
    FROM authors a
    JOIN niches n ON a.niche_id = n.id
    ORDER BY a.name ASC
  `),

  getAuthorBySlug: db.prepare(`
    SELECT a.*, n.name as niche_name, n.slug as niche_slug, n.accent_color as niche_accent
    FROM authors a
    JOIN niches n ON a.niche_id = n.id
    WHERE a.slug = ?
  `),

  // Newsletter
  addSubscriber: db.prepare(`
    INSERT OR IGNORE INTO newsletter_subscribers (email, niches, unsubscribe_token)
    VALUES (?, ?, ?)
  `),

  getSubscriberByEmail: db.prepare(`
    SELECT * FROM newsletter_subscribers WHERE email = ?
  `),

  getSubscriberCount: db.prepare(`
    SELECT COUNT(*) as total FROM newsletter_subscribers WHERE status = 'active'
  `),

  unsubscribeByToken: db.prepare(`
    UPDATE newsletter_subscribers SET status = 'unsubscribed' WHERE unsubscribe_token = ?
  `),

  // Scraper
  getAllScraperSources: db.prepare(`SELECT * FROM scraper_sources ORDER BY id ASC`),
  getScraperSourceByCode: db.prepare(`SELECT * FROM scraper_sources WHERE code = ?`),
  updateScraperSourceTime: db.prepare(`
    UPDATE scraper_sources 
    SET last_scraped_at = CURRENT_TIMESTAMP, total_ingested = total_ingested + ? 
    WHERE code = ?
  `),
  insertScraperLog: db.prepare(`
    INSERT INTO scraper_logs (source_code, headline_scraped, post_id, status)
    VALUES (?, ?, ?, ?)
  `),
  getRecentScraperLogs: db.prepare(`
    SELECT l.*, p.title as post_title, p.slug as post_slug
    FROM scraper_logs l
    LEFT JOIN posts p ON l.post_id = p.id
    ORDER BY l.created_at DESC
    LIMIT 30
  `)
};

module.exports = {
  db,
  stmts
};
