// Author Profile View: Senior Beat Correspondent Showcase

function renderAuthor({ author, posts = [] }) {
  return `
    <div class="container">
      <header style="max-width:820px; margin:0 auto 48px auto; background:var(--bg-surface-elevated); border:1px solid var(--border-color); border-radius:16px; padding:36px;">
        <div style="display:flex; gap:28px; align-items:flex-start; flex-wrap:wrap;">
          <div class="author-box-avatar" style="width:84px; height:84px; font-size:1.8rem;">${author.avatar_initials}</div>
          <div style="flex:1;">
            <span class="niche-pill" style="background:${author.niche_accent}; margin-bottom:8px; display:inline-block;">${author.niche_name}</span>
            <h1 style="font-family:var(--font-serif); font-size:2.4rem; font-weight:800; margin-bottom:4px;">${author.name}</h1>
            <div style="color:var(--accent-gold); font-size:0.95rem; font-weight:700; margin-bottom:14px;">${author.title}</div>
            <p style="font-size:1.05rem; color:var(--text-secondary); line-height:1.65; margin-bottom:16px;">${author.bio}</p>
            
            <div style="border-top:1px solid var(--border-color); padding-top:14px; font-size:0.85rem; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
              <div><strong>Primary Beat:</strong> ${author.beat}</div>
              <div><strong>Credentials:</strong> ${author.credentials}</div>
              <div><strong>Location:</strong> ${author.location || "Islamabad, Pakistan"}</div>
              ${author.twitter_handle ? `<div><strong>Twitter / X:</strong> <a href="#" style="color:var(--accent-blue);">${author.twitter_handle}</a></div>` : ""}
            </div>
          </div>
        </div>
      </header>

      <section>
        <div class="section-label" style="max-width:820px; margin:0 auto 24px auto;">Published Dispatches & Investigations (${posts.length})</div>
        <div class="articles-grid" style="max-width:820px; margin:0 auto;">
          ${posts.map(post => `
            <article class="article-card">
              <div>
                <div class="story-meta">
                  <span class="story-time">${post.reading_time_minutes} min read</span>
                  <span>&bull;</span>
                  <span style="color:var(--text-muted);">${new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <h2 class="card-title">
                  <a href="/article/${post.slug}">${post.title}</a>
                </h2>
                <p class="card-lead"><strong>${post.dateline}</strong> ${post.lead_paragraph.slice(0, 140)}...</p>
              </div>

              <div class="card-footer">
                <span style="font-size:0.75rem;color:var(--text-muted);">${new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <a href="/article/${post.slug}" style="font-size:0.8rem; font-weight:700; color:var(--accent-gold);">Read Dispatch &rarr;</a>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

module.exports = {
  renderAuthor
};
