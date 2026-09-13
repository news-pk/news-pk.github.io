// News PK Editorial Operations Desk View

function renderAdmin({ sources, logs, cacheStats, isRunning, totalArticles = 42 }) {
  return `
    <div class="container" style="max-width: 1100px; padding: 40px 24px;">
      <!-- Header -->
      <header style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid var(--border-color); padding-bottom:24px; margin-bottom:36px; flex-wrap:wrap; gap:16px;">
        <div>
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:var(--accent-gold); margin-bottom:6px;">
            News PK Institutional Portal
          </div>
          <h1 style="font-family:var(--font-serif); font-size:2.2rem; font-weight:800; margin-bottom:8px;">Editorial Operations Desk</h1>
          <p style="color:var(--text-secondary); font-size:0.95rem;">Private newsroom console for beat coordination, wire intake monitoring, and editorial standards compliance.</p>
        </div>

        <button id="btn-trigger-all-sources" class="btn-subscribe" style="padding:10px 20px; background:var(--accent-gold); color:#000; font-weight:800;">
          ${isRunning ? "Intake in Progress..." : "⚡ Sync All News Wires"}
        </button>
      </header>

      <!-- Institutional Metrics -->
      <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:36px;">
        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Publication Status</div>
          <div style="font-size:1.8rem; font-weight:800; color:#10b981; margin:8px 0;">Live</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">Continuous dispatches online</div>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Editorial Library</div>
          <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary); margin:8px 0;">${totalArticles} Dispatches</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">Published across all niches</div>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Assigned Beat Desks</div>
          <div style="font-size:1.8rem; font-weight:800; color:var(--accent-gold); margin:8px 0;">6 Hubs</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">Dedicated senior correspondents</div>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Editorial Standards</div>
          <div style="font-size:1.8rem; font-weight:800; color:var(--accent-blue); margin:8px 0;">100% Human</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">AP Stylebook • Zero AI Boilerplate</div>
        </div>
      </section>

      <!-- Monitored Wires Grid -->
      <section style="margin-bottom: 48px;">
        <div class="section-label">Monitored News Wires & Editorial Beats</div>
        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; overflow:hidden;">
          <table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:left;">
            <thead>
              <tr style="background:var(--bg-surface-elevated); border-bottom:1px solid var(--border-color); font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">
                <th style="padding:14px 18px;">Wire Outlet</th>
                <th style="padding:14px 18px;">Assigned Beat Desk</th>
                <th style="padding:14px 18px;">Last Ingested</th>
                <th style="padding:14px 18px;">Published Dispatches</th>
                <th style="padding:14px 18px; text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${sources.map(s => `
                <tr style="border-bottom:1px solid var(--border-subtle);">
                  <td style="padding:14px 18px; font-weight:700;">
                    <a href="${s.site_url}" target="_blank" style="color:var(--text-primary); text-decoration:none;">${s.name} &nearr;</a>
                  </td>
                  <td style="padding:14px 18px;">
                    <span style="font-size:0.78rem; text-transform:uppercase; font-weight:700; color:var(--accent-gold);">${s.niche_slug}</span>
                  </td>
                  <td style="padding:14px 18px; color:var(--text-muted); font-size:0.82rem;">
                    ${s.last_scraped_at ? new Date(s.last_scraped_at).toLocaleTimeString() : "Ready"}
                  </td>
                  <td style="padding:14px 18px; font-weight:700;">
                    ${s.total_ingested || 0}
                  </td>
                  <td style="padding:14px 18px; text-align:right;">
                    <button class="btn-scrape-single" data-code="${s.code}" style="background:var(--bg-surface-elevated); border:1px solid var(--border-color); border-radius:6px; padding:4px 12px; font-size:0.75rem; font-weight:700; cursor:pointer; color:var(--text-primary);">
                      Sync & Update
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Ingestion Activity Logs -->
      <section>
        <div class="section-label">Real-Time Intake & Publication Stream</div>
        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:16px; max-height:360px; overflow-y:auto; font-family:monospace; font-size:0.82rem;">
          ${logs.map(l => `
            <div style="padding:8px 12px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; gap:16px;">
              <div>
                <span style="color:var(--accent-gold); font-weight:bold;">[${l.source_code.toUpperCase()}]</span>
                <span>${l.headline_scraped}</span>
                ${l.post_slug ? `<a href="/article/${l.post_slug}" style="color:var(--accent-blue); margin-left:8px;" target="_blank">View Article &rarr;</a>` : ""}
              </div>
              <div style="color:var(--text-muted); white-space:nowrap;">${new Date(l.created_at).toLocaleTimeString()}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <script>
        document.addEventListener("DOMContentLoaded", function() {
          const triggerAllBtn = document.getElementById("btn-trigger-all-sources");
          if (triggerAllBtn) {
            triggerAllBtn.addEventListener("click", async function() {
              triggerAllBtn.disabled = true;
              triggerAllBtn.textContent = "Syncing Wires...";
              try {
                const res = await fetch("/api/admin/scrape", { method: "POST" });
                const json = await res.json();
                alert("News wire intake completed: " + JSON.stringify(json));
                window.location.reload();
              } catch (err) {
                alert("Wire sync encountered an issue.");
                triggerAllBtn.disabled = false;
                triggerAllBtn.textContent = "⚡ Sync All News Wires";
              }
            });
          }

          document.querySelectorAll(".btn-scrape-single").forEach(btn => {
            btn.addEventListener("click", async function() {
              const code = btn.getAttribute("data-code");
              btn.disabled = true;
              btn.textContent = "Syncing...";
              try {
                const res = await fetch("/api/admin/scrape/" + code, { method: "POST" });
                const json = await res.json();
                alert("Synced wire outlet " + code + ": " + (json.newlyIngested || 0) + " new articles published.");
                window.location.reload();
              } catch (err) {
                alert("Error syncing wire: " + err.message);
                btn.disabled = false;
                btn.textContent = "Sync & Update";
              }
            });
          });
        });
      </script>
    </div>
  `;
}

module.exports = {
  renderAdmin
};
