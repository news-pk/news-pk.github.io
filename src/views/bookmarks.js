// Saved Articles View: Zero-Friction Local Reading List

function renderBookmarks() {
  return `
    <div class="container" style="max-width:820px;">
      <header style="margin-bottom: 36px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
        <h1 style="font-family:var(--font-serif); font-size:2.4rem; font-weight:800; margin-bottom:8px;">Saved Articles</h1>
        <p style="color:var(--text-secondary); font-size:1.05rem;">Your offline reading list. Stored instantly on this device with zero tracking.</p>
      </header>

      <div id="bookmarks-container">
        <div id="bookmarks-loading" style="padding:40px 0; text-align:center; color:var(--text-muted);">
          Loading your saved dispatches...
        </div>
      </div>

      <script>
        document.addEventListener("DOMContentLoaded", function() {
          const container = document.getElementById("bookmarks-container");
          const list = JSON.parse(localStorage.getItem("news_pk_bookmarks") || "[]");
          if (list.length === 0) {
            container.innerHTML = "<div style=\"text-align:center; padding:60px 20px; background:var(--bg-surface-elevated); border-radius:12px; border:1px dashed var(--border-color);\">" +
              "<div style=\"font-size:2rem; margin-bottom:12px;\">📑</div>" +
              "<h3 style=\"font-family:var(--font-serif); font-size:1.35rem; margin-bottom:8px;\">No saved articles yet</h3>" +
              "<p style=\"color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px;\">Click \"Save\" or press <kbd style=\"background:var(--bg-surface);border:1px solid var(--border-color);padding:2px 6px;border-radius:4px;\">B</kbd> while reading any article to bookmark it for later.</p>" +
              "<a href=\"/\" class=\"btn-subscribe\">Browse Front Page</a>" +
              "</div>";
            return;
          }

          let itemsHtml = "<div style=\"display:flex; flex-direction:column; gap:16px;\">";
          list.forEach(item => {
            itemsHtml += "<div style=\"background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:20px; display:flex; justify-content:space-between; align-items:center; gap:16px;\">" +
              "<div>" +
              "<span style=\"font-size:0.7rem; font-weight:700; color:var(--accent-gold); text-transform:uppercase;\">" + (item.niche || "Editorial") + " • By " + (item.author || "Correspondent") + "</span>" +
              "<h3 style=\"font-family:var(--font-serif); font-size:1.25rem; margin:4px 0 8px 0;\"><a href=\"/article/" + item.slug + "\">" + item.title + "</a></h3>" +
              "<div style=\"font-size:0.75rem; color:var(--text-muted);\">Saved on " + new Date(item.savedAt).toLocaleDateString() + "</div>" +
              "</div>" +
              "<a href=\"/article/" + item.slug + "\" class=\"btn-subscribe\" style=\"padding:6px 14px; font-size:0.8rem;\">Read</a>" +
              "</div>";
          });
          itemsHtml += "</div>";
          container.innerHTML = itemsHtml;
        });
      </script>
    </div>
  `;
}

module.exports = {
  renderBookmarks
};
