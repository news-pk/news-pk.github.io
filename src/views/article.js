// Single Article Reading View: Luxury Editorial Aesthetics & Reader Ergonomics

function renderArticle({ post, relatedPosts = [] }) {
  const publishedDate = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return `
    <div class="container">
      <article>
        <!-- Article Header -->
        <header class="article-header">
          <div class="story-meta" style="margin-bottom: 16px;">
            <a href="/niche/${post.niche_slug}" class="niche-pill" style="background:${post.niche_accent}">${post.niche_name}</a>
            <span class="story-time">${post.reading_time_minutes} min read</span>
            <span style="color:var(--text-muted);">&bull;</span>
            <span style="color:var(--text-muted);">${publishedDate}</span>
            
          </div>

          <h1 class="article-headline">${post.title}</h1>
          <p class="article-subtitle">${post.lead_paragraph}</p>

          <div class="byline-row" style="justify-content: space-between; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 14px 0; margin-bottom: 24px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="author-avatar-sm">${post.avatar_initials}</div>
              <div class="byline-text">
                <a href="/author/${post.author_slug}" class="byline-name">${post.author_name}</a>
                <div class="byline-title">${post.author_title}</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px;">
              <button id="btn-bookmark-toggle" class="btn-icon" 
                      style="width:auto; padding:0 12px; font-size:0.82rem; font-weight:700; height:34px;"
                      data-slug="${post.slug}"
                      data-title="${post.title.replace(/"/g, "&quot;")}"
                      data-author="${post.author_name}"
                      data-niche="${post.niche_name}">
                ☆ Save
              </button>
            </div>
          </div>
        </header>

        <!-- Feature Editorial Hero Image -->
        <div class="article-feature-hero">
          <div class="article-img-wrap">
            <img src="${post.image_url || "/images/" + post.niche_slug + ".jpg"}" 
                 alt="${post.title.replace(/"/g, "&quot;")}" 
                 class="article-img" 
                 fetchpriority="high" 
                 decoding="async">
          </div>
          <div class="img-caption">
            <span>Special Report: ${post.niche_name} &bull; Beat Coverage by ${post.author_name}</span>
            <span>Photography: News PK Wire / Verified Archives</span>
          </div>
        </div>

        <!-- Interactive Reader Toolbar & Audio Narrator -->
        <div class="reader-toolbar">
          <div class="audio-player-widget">
            <button id="btn-tts-play" class="btn-tts-play" title="Listen with native high-speed audio narrator">
              ▶ Listen (${post.reading_time_minutes} min)
            </button>
            <span id="tts-status" class="tts-status">Native voice reader</span>
          </div>

          <div class="reader-settings">
            <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);">Typography:</span>
            <button id="btn-toggle-font" class="btn-font-control" title="Toggle Serif / Sans font">Aa Font</button>
            <button id="btn-font-minus" class="btn-font-control" title="Smaller font">A-</button>
            <button id="btn-font-plus" class="btn-font-control" title="Larger font">A+</button>
          </div>
        </div>

        <!-- Semantic Article Body -->
        <div class="article-content">
          ${post.content_html}
        </div>

        <!-- Editorial Author Verification Box -->
        <section class="author-box">
          <div class="author-box-avatar">${post.avatar_initials}</div>
          <div class="author-box-info">
            <h4>${post.author_name}</h4>
            <div class="author-box-title">${post.author_title}</div>
            <p class="author-box-bio">${post.author_bio}</p>
            <div class="author-box-meta">
              <strong>Beat:</strong> ${post.author_beat} &bull; 
              <strong>Location:</strong> ${post.author_location || "Islamabad, Pakistan"} &bull; 
              <strong>Verified Credentials:</strong> ${post.author_credentials}
            </div>
          </div>
        </section>

        <!-- Newsletter Subscription Box -->
        <section id="newsletter-section" class="newsletter-banner">
          <span style="font-size:0.75rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--accent-gold);">Stay Informed</span>
          <h3>Never miss critical intelligence from ${post.author_name}</h3>
          <p>Get our daily briefings on ${post.niche_name} delivered directly to your inbox before market open.</p>
          <form class="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Enter your work email..." required>
            <button type="submit" class="btn-subscribe" style="padding: 12px 24px;">Subscribe Free</button>
          </form>
        </section>

        <!-- Related Stories in Same Niche -->
        ${relatedPosts && relatedPosts.length > 0 ? `
          <section style="max-width: 820px; margin: 56px auto 0 auto;">
            <div class="section-label">More on ${post.niche_name}</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:20px;">
              ${relatedPosts.map(r => `
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:16px;">
                  <a href="/article/${r.slug}">
                    <div class="article-img-wrap" style="aspect-ratio:16/9; margin-bottom:10px;">
                      <img src="${r.image_url || "/images/" + (r.niche_slug || post.niche_slug) + ".jpg"}" alt="${r.title.replace(/"/g, "&quot;")}" class="article-img" loading="lazy" decoding="async">
                    </div>
                  </a>
                  <span style="font-size:0.7rem; color:${post.niche_accent}; font-weight:700;">${post.niche_name}</span>
                  <h4 style="font-family:var(--font-serif); font-size:1.05rem; margin:6px 0;"><a href="/article/${r.slug}">${r.title}</a></h4>
                  <div style="font-size:0.75rem; color:var(--text-muted);">By ${r.author_name}</div>
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}
      </article>
    </div>
  `;
}

module.exports = {
  renderArticle
};
