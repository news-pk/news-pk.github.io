// Editorial Newsletter Service
// Handles subscriber management and clean email dispatch generation

const crypto = require("crypto");
const { db, stmts } = require("../db");

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

function subscribe(email, niches = "all") {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: "Invalid email address." };
  }

  const token = generateToken();
  try {
    stmts.addSubscriber.run(cleanEmail, niches, token);
    return { success: true, email: cleanEmail, message: "Subscription confirmed. You will receive curated editorial briefings." };
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return { success: true, email: cleanEmail, message: "You are already subscribed to the briefing." };
    }
    return { success: false, error: "Failed to register subscription." };
  }
}

function unsubscribe(token) {
  if (!token) return { success: false, error: "Missing token." };
  const res = stmts.unsubscribeByToken.run(token);
  return { success: res.changes > 0, message: res.changes > 0 ? "You have been unsubscribed." : "Token not found." };
}

function generateNewsletterDigest() {
  const topArticles = db.prepare(`
    SELECT p.id, p.slug, p.title, p.lead_paragraph, p.dateline,
           a.name as author_name, a.title as author_title,
           n.name as niche_name, n.accent_color as niche_accent
    FROM posts p
    JOIN authors a ON p.author_id = a.id
    JOIN niches n ON p.niche_id = n.id
    ORDER BY p.published_at DESC
    LIMIT 6
  `).all();

  const subscriberCount = stmts.getSubscriberCount.get().total;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>news_pk Morning Editorial Dispatch</title>
  <style>
    body { font-family: "Georgia", serif; line-height: 1.6; color: #111827; background: #fdfbf7; margin: 0; padding: 40px 20px; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; }
    .header { border-bottom: 2px solid #111827; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
    .date { font-family: sans-serif; font-size: 13px; color: #6b7280; text-transform: uppercase; margin-top: 5px; }
    .article { margin-bottom: 35px; border-bottom: 1px solid #f3f4f6; padding-bottom: 25px; }
    .niche-tag { font-family: sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .title { font-size: 22px; font-weight: 700; line-height: 1.3; margin: 8px 0; }
    .title a { color: #111827; text-decoration: none; }
    .title a:hover { color: #2563eb; }
    .byline { font-family: sans-serif; font-size: 12px; color: #4b5563; margin-bottom: 10px; }
    .lead { font-size: 15px; color: #374151; margin: 0; }
    .footer { font-family: sans-serif; font-size: 12px; color: #9ca3af; text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NEWS_PK EDITORIAL</div>
      <div class="date">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
    ${topArticles.map(a => `
      <div class="article">
        <span class="niche-tag" style="color: ${a.niche_accent}">${a.niche_name}</span>
        <h2 class="title"><a href="/article/${a.slug}">${a.title}</a></h2>
        <div class="byline">By ${a.author_name}, ${a.author_title}</div>
        <p class="lead"><strong>${a.dateline}</strong> ${a.lead_paragraph}</p>
      </div>
    `).join("")}
    <div class="footer">
      Delivered directly from the news_pk editorial desks. No algorithms, no fluff.<br>
      To manage preferences or unsubscribe, use your secure account link.
    </div>
  </div>
</body>
</html>
`;

  return {
    subject: `news_pk Morning Briefing: ${topArticles[0] ? topArticles[0].title.slice(0, 60) : "Latest Intelligence"}`,
    html,
    articlesCount: topArticles.length,
    subscriberCount
  };
}

module.exports = {
  subscribe,
  unsubscribe,
  generateNewsletterDigest
};
