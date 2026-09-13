-- Ultra-High Performance SQLite 3 Schema for news_pk
-- Optimized for sub-millisecond execution and FTS5 BM25 search

CREATE TABLE IF NOT EXISTS niches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    credentials TEXT NOT NULL,
    niche_id INTEGER NOT NULL REFERENCES niches(id),
    avatar_initials TEXT NOT NULL,
    beat TEXT NOT NULL,
    location TEXT NOT NULL,
    twitter_handle TEXT
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    lead_paragraph TEXT NOT NULL,
    content_html TEXT NOT NULL,
    dateline TEXT NOT NULL,
    reading_time_minutes INTEGER DEFAULT 3,
    niche_id INTEGER NOT NULL REFERENCES niches(id),
    author_id INTEGER NOT NULL REFERENCES authors(id),
    source_publication TEXT NOT NULL,
    source_url TEXT,
    original_headline TEXT,
    is_breaking INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_trending INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_niche ON posts(niche_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views_count DESC);

-- FTS5 Full Text Search Virtual Table
CREATE VIRTUAL TABLE IF NOT EXISTS post_fts USING fts5(
    title,
    lead_paragraph,
    content_html,
    content='posts',
    content_rowid='id'
);

-- Triggers to maintain FTS5 synchronization
CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
    INSERT INTO post_fts(rowid, title, lead_paragraph, content_html)
    VALUES (new.id, new.title, new.lead_paragraph, new.content_html);
END;

CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
    INSERT INTO post_fts(post_fts, rowid, title, lead_paragraph, content_html)
    VALUES ('delete', old.id, old.title, old.lead_paragraph, old.content_html);
END;

CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
    INSERT INTO post_fts(post_fts, rowid, title, lead_paragraph, content_html)
    VALUES ('delete', old.id, old.title, old.lead_paragraph, old.content_html);
    INSERT INTO post_fts(rowid, title, lead_paragraph, content_html)
    VALUES (new.id, new.title, new.lead_paragraph, new.content_html);
END;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    niches TEXT DEFAULT 'all',
    status TEXT DEFAULT 'active',
    unsubscribe_token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);

CREATE TABLE IF NOT EXISTS newsletter_dispatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    article_ids TEXT NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    dispatched_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scraper_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    niche_slug TEXT NOT NULL,
    feed_url TEXT NOT NULL,
    site_url TEXT NOT NULL,
    last_scraped_at DATETIME,
    total_ingested INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS scraper_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_code TEXT NOT NULL,
    headline_scraped TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id),
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
