// Homepage View: Editorial Masthead, Lead Story with Hero Image, Trending Ticker, and Niche Desks

function renderHome({ leadPost, trendingPosts, recentPosts, niches, authors, subscriberCount }) {
  return `
    <div class="container">
      <!-- Top Hero Section -->
      ${leadPost ? `
        <section class="hero-grid">
          <article class="lead-story">
            <a href="/article/${leadPost.slug}">
              <div class="article-img-wrap">
                <img src="${leadPost.image_url || "/images/" + leadPost.niche_slug + ".jpg"}" 
                     alt="${leadPost.title.replace(/"/g, "&quot;")}" 
                     class="article-img" 
                     fetchpriority="high" 
                     decoding="async">
              </div>
            </a>

            <div class="story-meta">
              <span class="niche-pill" style="background:${leadPost.niche_accent}">${leadPost.niche_name}</span>
              <span class="story-time">${leadPost.reading_time_minutes} min read</span>
              ${leadPost.is_breaking ? `<span style="color:#ef4444;font-weight:800;">&bull; BREAKING</span>` : ""}
            </div>

            <h1 class="lead-title">
              <a href="/article/${leadPost.slug}">${leadPost.title}</a>
            </h1>

            <p class="lead-excerpt">
              <strong>${leadPost.dateline}</strong> ${leadPost.lead_paragraph}
            </p>

            <div class="byline-row">
              <div class="author-avatar-sm">${leadPost.avatar_initials}</div>
              <div class="byline-text">
                <a href="/author/${leadPost.author_slug}" class="byline-name">${leadPost.author_name}</a>
                <div class="byline-title">${leadPost.author_title || "Senior Correspondent"}</div>
              </div>
            </div>
          </article>

          <!-- Sidebar: Trending & Most Read -->
          <aside class="trending-column">
            <div class="section-label">Most Read & Trending</div>
            ${trendingPosts.map((post, idx) => `
              <article class="trending-item">
                <div class="trending-rank">${String(idx + 1).padStart(2, "0")}</div>
                <div class="trending-content">
                  <div class="story-meta" style="margin-bottom:4px;">
                    <span style="color:${post.niche_accent};font-size:0.7rem;font-weight:700;text-transform:uppercase;">${post.niche_name}</span>
                  </div>
                  <h3><a href="/article/${post.slug}">${post.title}</a></h3>
                  <div class="byline-author">By ${post.author_name}</div>
                </div>
              </article>
            `).join("")}
          </aside>
        </section>
      ` : ""}

      <!-- Desk Section: Latest Dispatches with Optimized Lazy-Loaded Images -->
      <section style="margin-bottom: 56px;">
        <div class="section-label" style="font-size: 0.95rem; margin-bottom: 24px;">Latest Editorial Intelligence</div>
        <div class="articles-grid">
          ${recentPosts.map(post => `
            <article class="article-card">
              <div>
                <a href="/article/${post.slug}">
                  <div class="article-img-wrap">
                    <img src="${post.image_url || "/images/" + post.niche_slug + ".jpg"}" 
                         alt="${post.title.replace(/"/g, "&quot;")}" 
                         class="article-img" 
                         loading="lazy" 
                         decoding="async">
                  </div>
                </a>

                <div class="story-meta">
                  <span class="niche-pill" style="background:${post.niche_accent}">${post.niche_name}</span>
                  <span class="story-time">${post.reading_time_minutes} min read</span>
                </div>
                <h2 class="card-title">
                  <a href="/article/${post.slug}">${post.title}</a>
                </h2>
                <p class="card-lead"><strong>${post.dateline}</strong> ${post.lead_paragraph.slice(0, 130)}...</p>
              </div>

              <div class="card-footer">
                <div class="byline-row" style="gap:8px;">
                  <div class="author-avatar-sm" style="width:28px;height:28px;font-size:0.7rem;">${post.avatar_initials}</div>
                  <a href="/author/${post.author_slug}" style="font-size:0.8rem;font-weight:700;">${post.author_name}</a>
                </div>
                <span style="font-size:0.75rem;color:var(--text-muted);">${new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <!-- Meet Our Beat Reporters / Authors -->
      <section style="margin-bottom: 56px; background:var(--bg-surface-elevated); border:1px solid var(--border-color); border-radius:14px; padding:36px;">
        <div class="section-label" style="margin-bottom: 24px;">Senior Editorial Fellows & Beat Leads</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:24px;">
          ${authors.map(a => `
            <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:10px;padding:20px;display:flex;gap:16px;align-items:flex-start;">
              <div class="author-avatar-sm" style="width:48px;height:48px;font-size:1.1rem;flex-shrink:0;">${a.avatar_initials}</div>
              <div>
                <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:2px;"><a href="/author/${a.slug}">${a.name}</a></h3>
                <div style="font-size:0.75rem;color:var(--accent-gold);font-weight:700;text-transform:uppercase;margin-bottom:6px;">${a.niche_name}</div>
                <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">${a.beat}</p>
                <div style="margin-top:10px;font-size:0.75rem;color:var(--text-muted);">${a.post_count} published dispatches</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Embedded Newsletter Callout -->
      <section id="newsletter-section" class="newsletter-banner">
        <span style="font-size:0.75rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--accent-gold);">Private Briefing</span>
        <h3>The News PK Morning Editorial Dispatch</h3>
        <p>Direct from our beat correspondents covering central banking, telecom infrastructure, sovereign diplomacy, and empirical testing. Strictly zero spam, zero AI boilerplate.</p>
        <form class="newsletter-form">
          <input type="email" class="newsletter-input" placeholder="Enter your work email..." required>
          <button type="submit" class="btn-subscribe" style="padding: 12px 24px; font-size: 0.95rem;">Join Briefing</button>
        </form>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:14px;">
          Joined by ${subscriberCount || 1420}+ institutional decision-makers. One-click unsubscribe.
        </div>
      </section>
    </div>
  `;
}

module.exports = {
  renderHome
};
