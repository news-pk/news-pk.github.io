// High-Performance Zero-Overhead Master Layout
// Engineered for Google News, Discover, and Top-Ranking Technical SEO

function renderLayout({ 
  title, 
  description, 
  currentNiche = "", 
  content, 
  niches = [], 
  authors = [],
  canonicalUrl = "",
  ogImage = "/images/technology.jpg",
  ogType = "website",
  jsonLd = null,
  authorName = ""
}) {
  const pageTitle = title ? `${title} — News PK` : "News PK — Independent Journalism, Markets & Technology";
  const metaDesc = description || "High-speed independent editorial covering Pakistani technology, macroeconomics, national statecraft, and consumer intelligence.";
  const canonical = canonicalUrl || "http://localhost:3000";

  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${pageTitle}">
  <meta name="description" content="${metaDesc}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="${authorName || "News PK Editorial Board"}">
  <link rel="canonical" href="${canonical}">
  
  <!-- Google News & Syndication -->
  <link rel="alternate" type="application/rss+xml" title="News PK RSS Feed" href="/rss.xml">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">

  <!-- Open Graph / Facebook / LinkedIn -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="News PK">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@newspk">
  <meta name="twitter:creator" content="@newspk">
  <meta name="twitter:url" content="${canonical}">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Schema.org JSON-LD Structured Data for Google Rich Results & News -->
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/css/style.css?v=9">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📰</text></svg>">
</head>
<body>
  <div id="reading-progress-bar"></div>

  <!-- Live Financial & Intelligence Ticker -->
  <div class="ticker-wrap">
    <div class="ticker-label">News PK Markets</div>
    <div class="ticker-track">
      <div class="ticker-item"><span>USD/PKR</span> <strong>278.40</strong> <span class="ticker-down">-0.15%</span></div>
      <div class="ticker-item"><span>KSE-100</span> <strong>82,145</strong> <span class="ticker-up">+1.12%</span></div>
      <div class="ticker-item"><span>Gold (24K Tola)</span> <strong>Rs. 268,500</strong> <span class="ticker-up">+0.45%</span></div>
      <div class="ticker-item"><span>SBP Policy Rate</span> <strong>17.50%</strong> <span>Neutral</span></div>
      <div class="ticker-item"><span>IT Export Inflows</span> <strong>$3.2B Annualized</strong> <span class="ticker-up">+24%</span></div>
      <div class="ticker-item"><span>Crude Oil (Brent)</span> <strong>$74.20</strong> <span class="ticker-down">-0.8%</span></div>
      <!-- Duplicate track for infinite loop -->
      <div class="ticker-item"><span>USD/PKR</span> <strong>278.40</strong> <span class="ticker-down">-0.15%</span></div>
      <div class="ticker-item"><span>KSE-100</span> <strong>82,145</strong> <span class="ticker-up">+1.12%</span></div>
      <div class="ticker-item"><span>Gold (24K Tola)</span> <strong>Rs. 268,500</strong> <span class="ticker-up">+0.45%</span></div>
      <div class="ticker-item"><span>SBP Policy Rate</span> <strong>17.50%</strong> <span>Neutral</span></div>
      <div class="ticker-item"><span>IT Export Inflows</span> <strong>$3.2B Annualized</strong> <span class="ticker-up">+24%</span></div>
      <div class="ticker-item"><span>Crude Oil (Brent)</span> <strong>$74.20</strong> <span class="ticker-down">-0.8%</span></div>
    </div>
  </div>

  <!-- Editorial Masthead Header -->
  <header class="site-header">
    <div class="header-inner">
      <div class="header-brand">
        <a href="/" class="logo-masthead" style="white-space:nowrap;">
          <span class="brand-title">News&nbsp;Pk</span>
          <span class="edition-badge">EDITION</span>
        </a>
      </div>

      <!-- Professional Desk Navigation -->
      <nav class="nav-niches" aria-label="Main Editorial Desks">
        <a href="/" class="nav-niche-link ${currentNiche === "" ? "active" : ""}">Front Page</a>
        ${niches.map(n => `
          <a href="/niche/${n.slug}" class="nav-niche-link ${currentNiche === n.slug ? "active" : ""}">${n.name}</a>
        `).join("")}
        <a href="/bookmarks" class="nav-niche-link ${currentNiche === "bookmarks" ? "active" : ""}">Saved</a>
      </nav>

      <div class="header-actions">
        <button class="btn-icon btn-trigger-search" title="Search articles (Press /)" aria-label="Search">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
        <button class="btn-icon" id="btn-theme-toggle" title="Toggle theme (Paper / Sepia / Midnight)" aria-label="Toggle Theme">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        </button>
        <a href="#newsletter-section" class="btn-subscribe">Get Briefing</a>
      </div>
    </div>
  </header>

  <!-- Main Body Content -->
  <main id="main-content">
    ${content}
  </main>

  <!-- Instant Search Modal -->
  <div id="search-modal-overlay" class="modal-overlay" role="dialog" aria-modal="true" aria-label="Article Search">
    <div class="search-modal">
      <div class="search-header">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" id="search-modal-input" class="search-input" placeholder="Search reporting, beats, and authors..." autocomplete="off">
        <button id="btn-close-search" class="btn-icon" style="width:30px;height:30px;font-size:1.1rem;">&times;</button>
      </div>
      <div id="search-results-list" class="search-results">
        <p style="padding:16px;color:var(--text-muted);font-size:0.9rem;">Type at least 2 characters to search across our full archive...</p>
      </div>
    </div>
  </div>

  <!-- Institutional Newsroom Footer -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col" style="grid-column: span 1.2;">
        <div class="logo-masthead" style="font-size:1.6rem;margin-bottom:12px;white-space:nowrap;">
          <span class="brand-title">News&nbsp;Pk</span>
          <span class="edition-badge" style="font-size:0.6rem;">EDITION</span>
        </div>
        <p style="color:var(--text-secondary);font-size:0.92rem;line-height:1.65;margin-bottom:20px;">
          Independent Pakistani news publication dedicated to investigative reporting, macroeconomic analysis, telecom infrastructure, and consumer intelligence. Committed to independent investigative reporting, editorial clarity, and verified reporting across Pakistan and international affairs.
        </p>
        <div style="font-size:0.8rem;color:var(--text-muted);display:flex;gap:12px;flex-wrap:wrap;">
          <span>Member: Independent Press Trust</span> &bull; 
          <span>AP Stylebook Standards</span>
        </div>
      </div>

      <div class="footer-col">
        <h5>Editorial Desks</h5>
        <ul class="footer-links">
          ${niches.map(n => `<li><a href="/niche/${n.slug}">${n.name}</a></li>`).join("")}
        </ul>
      </div>

      <div class="footer-col">
        <h5>Senior Bylines</h5>
        <ul class="footer-links">
          ${authors.map(a => `<li><a href="/author/${a.slug}">${a.name}</a></li>`).join("")}
        </ul>
      </div>

      <div class="footer-col">
        <h5>Standards & Governance</h5>
        <ul class="footer-links">
          <li><a href="#standards">Editorial Standards</a></li>
          <li><a href="#fact-check">Fact-Checking Policy</a></li>
          <li><a href="#corrections">Corrections Log</a></li>
          <li><a href="#conflicts">Conflicts of Interest</a></li>
          <li><a href="#whistleblower">Secure Drop / Tips</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Reader Services</h5>
        <ul class="footer-links">
          <li><a href="#newsletter-section">Daily Dispatch</a></li>
          <li><a href="/bookmarks">Saved Articles</a></li>
          <li><a href="/rss.xml">RSS Feed</a></li>
          <li><a href="/sitemap.xml">XML Sitemap</a></li>
          <li><a href="#newsletter-section">Weekly Digest</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>&copy; ${new Date().getFullYear()} News PK Media Group. All rights reserved.</div>
      <div style="display:flex;gap:16px;">
        <a href="#terms">Terms of Service</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#cookies">Cookie Settings</a>
      </div>
      <div>Published continuously from newsrooms in Islamabad, Karachi, and Lahore.</div>
    </div>
  </footer>

  <script src="/js/app.js?v=9"></script>
</body>
</html>
`;
}

module.exports = {
  renderLayout
};
