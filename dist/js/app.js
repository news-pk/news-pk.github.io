// news_pk Client Engine: Zero-Bloat, Ultra-Responsive UX
// Handles Theme, Speculative Prefetch, Web Speech TTS, Search, Bookmarks, and Shortcuts

(function() {
  "use strict";

  // --- 1. THEME CONTROLLER ---
  const THEMES = ["paper", "sepia", "midnight"];
  function initTheme() {
    const saved = localStorage.getItem("news_pk_theme") || "paper";
    setTheme(saved, false);
  }

  function setTheme(theme, save = true) {
    if (!THEMES.includes(theme)) theme = "paper";
    if (theme === "paper") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (save) localStorage.setItem("news_pk_theme", theme);
  }

  function cycleTheme() {
    const current = localStorage.getItem("news_pk_theme") || "paper";
    const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
    setTheme(THEMES[nextIdx]);
  }

  // --- 2. FONT & READING SIZE CONTROLS ---
  function initTypography() {
    const savedFont = localStorage.getItem("news_pk_font") || "serif";
    const savedScale = localStorage.getItem("news_pk_font_scale") || "100";
    applyTypography(savedFont, savedScale, false);
  }

  function applyTypography(font, scale, save = true) {
    if (font === "sans") {
      document.documentElement.setAttribute("data-reading-font", "sans");
    } else {
      document.documentElement.removeAttribute("data-reading-font");
    }
    document.documentElement.style.setProperty("--reading-font-size", (1.15 * (scale / 100)) + "rem");
    if (save) {
      localStorage.setItem("news_pk_font", font);
      localStorage.setItem("news_pk_font_scale", scale);
    }
  }

  function toggleFontFamily() {
    const current = localStorage.getItem("news_pk_font") || "serif";
    const next = current === "serif" ? "sans" : "serif";
    applyTypography(next, localStorage.getItem("news_pk_font_scale") || "100");
  }

  function adjustFontSize(delta) {
    let currentScale = parseInt(localStorage.getItem("news_pk_font_scale") || "100", 10);
    currentScale = Math.min(130, Math.max(85, currentScale + delta));
    applyTypography(localStorage.getItem("news_pk_font") || "serif", currentScale);
  }

  // --- 3. READING PROGRESS BAR ---
  function initReadingProgress() {
    const bar = document.getElementById("reading-progress-bar");
    if (!bar) return;

    window.addEventListener("scroll", function() {
      const h = document.documentElement;
      const b = document.body;
      const st = "scrollTop" in h ? h.scrollTop : b.scrollTop;
      const sh = "scrollHeight" in h ? h.scrollHeight : b.scrollHeight;
      const ch = h.clientHeight;
      const scrollTotal = sh - ch;
      const percent = scrollTotal > 0 ? (st / scrollTotal) * 100 : 0;
      bar.style.width = percent + "%";
    }, { passive: true });
  }

  // --- 4. SPECULATIVE PREFETCHING (0.0000s INSTANT LOADS) ---
  const prefetchedUrls = new Set();
  function prefetchUrl(url) {
    if (!url || prefetchedUrls.has(url) || !url.startsWith("/article/")) return;
    prefetchedUrls.add(url);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
  }

  function initSpeculativePrefetch() {
    let hoverTimer = null;
    document.addEventListener("mouseover", function(e) {
      const a = e.target.closest("a[href^='/article/']");
      if (a) {
        hoverTimer = setTimeout(() => prefetchUrl(a.getAttribute("href")), 40);
      }
    });

    document.addEventListener("mouseout", function(e) {
      if (hoverTimer) clearTimeout(hoverTimer);
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target.querySelector("a[href^='/article/']");
            if (link) prefetchUrl(link.getAttribute("href"));
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "150px" });

      document.querySelectorAll(".article-card, .lead-story").forEach(el => observer.observe(el));
    }
  }

  // --- 5. NATIVE AUDIO READER (TTS) ---
  let speechUtterance = null;
  let isSpeaking = false;

  function initAudioReader() {
    const playBtn = document.getElementById("btn-tts-play");
    const statusText = document.getElementById("tts-status");
    if (!playBtn || !("speechSynthesis" in window)) {
      if (playBtn) playBtn.style.display = "none";
      return;
    }

    playBtn.addEventListener("click", function() {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        playBtn.innerHTML = "▶ Listen (TTS)";
        statusText.textContent = "Audio paused";
        return;
      }

      const contentEl = document.querySelector(".article-content");
      if (!contentEl) return;

      const rawText = contentEl.innerText.replace(/\n+/g, ". ");
      speechUtterance = new SpeechSynthesisUtterance(rawText);
      speechUtterance.rate = 1.05;
      speechUtterance.pitch = 1.0;

      speechUtterance.onstart = function() {
        isSpeaking = true;
        playBtn.innerHTML = "⏸ Pause Audio";
        statusText.textContent = "Playing narration...";
      };

      speechUtterance.onend = function() {
        isSpeaking = false;
        playBtn.innerHTML = "▶ Listen (TTS)";
        statusText.textContent = "Narration finished";
      };

      speechUtterance.onerror = function() {
        isSpeaking = false;
        playBtn.innerHTML = "▶ Listen (TTS)";
        statusText.textContent = "Audio unavailable";
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speechUtterance);
    });
  }

  // --- 6. INSTANT SEARCH MODAL (FTS5) ---
  function initSearchModal() {
    const modal = document.getElementById("search-modal-overlay");
    const searchInput = document.getElementById("search-modal-input");
    const resultsContainer = document.getElementById("search-results-list");
    const openBtns = document.querySelectorAll(".btn-trigger-search");
    const closeBtn = document.getElementById("btn-close-search");

    if (!modal || !searchInput) return;

    function openModal() {
      modal.classList.add("active");
      searchInput.focus();
    }

    function closeModal() {
      modal.classList.remove("active");
      searchInput.value = "";
      if (resultsContainer) resultsContainer.innerHTML = "";
    }

    openBtns.forEach(btn => btn.addEventListener("click", openModal));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function(e) {
      if (e.target === modal) closeModal();
    });

    let searchTimer = null;
    searchInput.addEventListener("input", function() {
      const q = searchInput.value.trim();
      if (searchTimer) clearTimeout(searchTimer);

      if (q.length < 2) {
        if (resultsContainer) resultsContainer.innerHTML = "<p style='padding:16px;color:var(--text-muted);font-size:0.9rem;'>Type at least 2 characters to search...</p>";
        return;
      }

      searchTimer = setTimeout(async () => {
        try {
          const res = await fetch("/api/search?q=" + encodeURIComponent(q));
          const data = await res.json();
          if (!data.results || data.results.length === 0) {
            resultsContainer.innerHTML = "<p style='padding:16px;color:var(--text-muted);font-size:0.9rem;'>No matching editorial articles found.</p>";
            return;
          }

          resultsContainer.innerHTML = data.results.map(r => `
            <a href="/article/${r.slug}" class="search-result-item">
              <div style="font-size:0.75rem;font-weight:700;color:${r.niche_accent};text-transform:uppercase;">${r.niche_name} • By ${r.author_name}</div>
              <h4>${r.snippet_title || r.title}</h4>
              <p>${r.snippet_lead || r.lead_paragraph}</p>
            </a>
          `).join("");
        } catch (err) {
          resultsContainer.innerHTML = "<p style='padding:16px;color:red;'>Search unavailable.</p>";
        }
      }, 120);
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        openModal();
      } else if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // --- 7. LOCAL BOOKMARKING ---
  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem("news_pk_bookmarks") || "[]");
    } catch {
      return [];
    }
  }

  function toggleBookmark(article) {
    const list = getBookmarks();
    const idx = list.findIndex(item => item.slug === article.slug);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift(article);
    }
    localStorage.setItem("news_pk_bookmarks", JSON.stringify(list));
    updateBookmarkButtonState(article.slug);
  }

  function updateBookmarkButtonState(currentSlug) {
    const btn = document.getElementById("btn-bookmark-toggle");
    if (!btn) return;
    const list = getBookmarks();
    const isBookmarked = list.some(item => item.slug === currentSlug);
    btn.innerHTML = isBookmarked ? "★ Saved" : "☆ Save";
    btn.title = isBookmarked ? "Remove from bookmarks (Press B)" : "Save article (Press B)";
  }

  function initBookmarkArticle() {
    const btn = document.getElementById("btn-bookmark-toggle");
    if (!btn) return;
    const slug = btn.getAttribute("data-slug");
    const title = btn.getAttribute("data-title");
    const author = btn.getAttribute("data-author");
    const niche = btn.getAttribute("data-niche");

    updateBookmarkButtonState(slug);

    btn.addEventListener("click", () => {
      toggleBookmark({ slug, title, author, niche, savedAt: new Date().toISOString() });
    });

    document.addEventListener("keydown", (e) => {
      if ((e.key === "b" || e.key === "B") && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        toggleBookmark({ slug, title, author, niche, savedAt: new Date().toISOString() });
      }
    });
  }

  // --- 8. NEWSLETTER AJAX SUBMISSION ---
  function initNewsletterForm() {
    document.querySelectorAll(".newsletter-form").forEach(form => {
      form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const input = form.querySelector("input[type=email]");
        const btn = form.querySelector("button[type=submit]");
        if (!input || !input.value) return;

        const originalText = btn.textContent;
        btn.textContent = "Registering...";
        btn.disabled = true;

        try {
          const res = await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: input.value })
          });
          const json = await res.json();
          if (json.success) {
            form.innerHTML = `<div style="color:var(--accent-gold);font-weight:700;padding:12px 0;">${json.message}</div>`;
          } else {
            alert(json.error || "Subscription failed.");
            btn.textContent = originalText;
            btn.disabled = false;
          }
        } catch {
          alert("Network error. Please try again.");
          btn.textContent = originalText;
          btn.disabled = false;
        }
      });
    });
  }

  // --- 9. KEYBOARD NAVIGATION SHORTCUTS ---
  function initKeyboardNav() {
    document.addEventListener("keydown", function(e) {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      if (e.key === "t" || e.key === "T") {
        cycleTheme();
      }
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener("DOMContentLoaded", function() {
    initTheme();
    initTypography();
    initReadingProgress();
    initSpeculativePrefetch();
    initAudioReader();
    initSearchModal();
    initBookmarkArticle();
    initNewsletterForm();
    initKeyboardNav();

    const themeBtn = document.getElementById("btn-theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

    const fontToggle = document.getElementById("btn-toggle-font");
    if (fontToggle) fontToggle.addEventListener("click", toggleFontFamily);

    const fontPlus = document.getElementById("btn-font-plus");
    if (fontPlus) fontPlus.addEventListener("click", () => adjustFontSize(5));

    const fontMinus = document.getElementById("btn-font-minus");
    if (fontMinus) fontMinus.addEventListener("click", () => adjustFontSize(-5));
  });

})();
