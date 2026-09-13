// Niche Hub View: Topic Landing Page

function renderNiche({ niche, posts = [] }) {
  return `
    <div class="container">
      <header style="margin-bottom: 40px; border-bottom: 2px solid var(--border-color); padding-bottom: 32px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px; align-items:center;">
          <div>
            <span class="niche-pill" style="background:${niche.accent_color}; margin-bottom:12px; display:inline-block;">News PK Editorial Desk</span>
            <h1 style="font-family:var(--font-serif); font-size:2.8rem; font-weight:800; margin-bottom:12px;">${niche.name}</h1>
            <p style="font-size:1.2rem; color:var(--text-secondary); line-height:1.6;">${niche.description}</p>
          </div>
          <div class="article-img-wrap" style="aspect-ratio:16/9; margin-bottom:0; box-shadow:var(--card-shadow);">
            <img src="/images/${niche.slug}.jpg" alt="${niche.name}" class="article-img" fetchpriority="high" decoding="async">
          </div>
        </div>
      </header>

      <section>
        <div class="articles-grid">
          ${posts.map(post => `
            <article class="article-card">
              <div>
                <a href="/article/${post.slug}">
                  <div class="article-img-wrap">
                    <img src="${post.image_url || "/images/" + niche.slug + ".jpg"}" alt="${post.title.replace(/"/g, "&quot;")}" class="article-img" loading="lazy" decoding="async">
                  </div>
                </a>

                <div class="story-meta">
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
    </div>
  `;
}

module.exports = {
  renderNiche
};
