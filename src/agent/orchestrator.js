// Author-Agent Orchestrator
// Coordinates scraping, human journalistic synthesis, database persistence,
// and cache invalidation.

const { scraperEngine } = require("./scraper");
const { synthesizeJournalisticArticle, sanitizeText } = require("./synthesizer");
const { db, stmts } = require("../db");
const { pageCache } = require("../services/cache");

class AgentOrchestrator {
  constructor() {
    this.isRunning = false;
    this.lastRunStats = null;
  }

  async runSingleSource(sourceCode) {
    const sourceConfig = scraperEngine.sources.find(s => s.code === sourceCode);
    if (!sourceConfig) {
      throw new Error(`Source not found: ${sourceCode}`);
    }

    const niche = db.prepare("SELECT * FROM niches WHERE slug = ?").get(sourceConfig.nicheSlug);
    const author = db.prepare("SELECT * FROM authors WHERE slug = ?").get(sourceConfig.authorSlug);

    if (!niche || !author) {
      throw new Error(`Niche or Author missing for source: ${sourceCode}`);
    }

    const rawItems = await scraperEngine.scrapeSource(sourceCode);
    let ingestedCount = 0;

    for (const raw of rawItems) {
      // Check deduplication against existing original headlines
      const existing = db.prepare("SELECT id FROM posts WHERE original_headline = ? OR source_url = ?").get(raw.title, raw.sourceUrl);
      if (existing) {
        continue;
      }

      // Synthesize into human beat-reporter style
      const synthesized = synthesizeJournalisticArticle(raw, author, niche, sourceConfig);

      try {
        const info = stmts.insertPost.run({
          slug: synthesized.slug,
          title: synthesized.title,
          lead_paragraph: synthesized.leadParagraph,
          content_html: synthesized.contentHtml,
          dateline: synthesized.dateline,
          reading_time_minutes: synthesized.readingTimeMinutes,
          niche_id: synthesized.nicheId,
          author_id: synthesized.authorId,
          source_publication: synthesized.sourcePublication,
          source_url: synthesized.sourceUrl,
          original_headline: synthesized.originalHeadline,
          is_breaking: synthesized.isBreaking,
          is_featured: synthesized.isFeatured,
          is_trending: synthesized.isTrending
        });

        stmts.insertScraperLog.run(sourceCode, raw.title, Number(info.lastInsertRowid), "published");
        ingestedCount++;
      } catch (err) {
        stmts.insertScraperLog.run(sourceCode, raw.title, null, `error: ${err.message}`);
      }
    }

    stmts.updateScraperSourceTime.run(ingestedCount, sourceCode);

    // Invalidate homepage and niche cache so fresh stories appear instantly
    pageCache.invalidate("/");
    pageCache.invalidate(`/niche/${niche.slug}`);
    pageCache.invalidate(`/author/${author.slug}`);

    return {
      source: sourceCode,
      itemsScraped: rawItems.length,
      newlyIngested: ingestedCount
    };
  }

  async runAllSources() {
    if (this.isRunning) {
      return { status: "already_running" };
    }

    this.isRunning = true;
    const startTime = Date.now();
    const summary = [];

    try {
      for (const source of scraperEngine.sources) {
        try {
          const res = await this.runSingleSource(source.code);
          summary.push(res);
        } catch (err) {
          summary.push({ source: source.code, error: err.message });
        }
      }

      this.lastRunStats = {
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        sourcesProcessed: summary.length,
        totalNewArticles: summary.reduce((acc, curr) => acc + (curr.newlyIngested || 0), 0),
        details: summary
      };

      return this.lastRunStats;
    } finally {
      this.isRunning = false;
    }
  }

  getStatus() {
    const sources = stmts.getAllScraperSources.all();
    const recentLogs = stmts.getRecentScraperLogs.all();
    return {
      isRunning: this.isRunning,
      lastRunStats: this.lastRunStats,
      sources,
      recentLogs
    };
  }
}

const orchestrator = new AgentOrchestrator();

module.exports = {
  orchestrator,
  runSingleSource: (code) => orchestrator.runSingleSource(code),
  runAllSources: () => orchestrator.runAllSources()
};
