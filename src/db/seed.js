// Seed Database with Niches, Authors, Scraper Sources, and Initial Journalistic Articles
const { db, stmts } = require("./index");
const { SOURCES } = require("../agent/sources");

console.log("Seeding database...");

// 1. Seed Niches
const niches = [
  {
    slug: "technology",
    name: "Technology & Telecom",
    tagline: "Infrastructure, Software Architectures & Capital Allocation",
    description: "Deep investigative coverage of regional telecom networks, enterprise software, venture dynamics, and hardware ecosystems.",
    accent_color: "#2563eb",
    display_order: 1
  },
  {
    slug: "national-affairs",
    name: "National Affairs & Statecraft",
    tagline: "Diplomacy, Governance & Constitutional Precedents",
    description: "Authoritative analysis of parliamentary debates, bilateral foreign relations, water governance accords, and sovereign policy.",
    accent_color: "#059669",
    display_order: 2
  },
  {
    slug: "economy-markets",
    name: "Economy & Financial Markets",
    tagline: "Monetary Transmission, Central Banking & Sovereign Debt",
    description: "Quantitative assessments of interest rate cycles, inflation metrics, treasury yield curves, and macroeconomic structural shifts.",
    accent_color: "#d97706",
    display_order: 3
  },
  {
    slug: "consumer-guides",
    name: "Consumer Intelligence & Wealth",
    tagline: "Rigorous Empirical Benchmarks & Personal Balance Sheets",
    description: "Independent stress-testing of consumer electronics, credit instruments, yield optimization strategies, and household economics.",
    accent_color: "#7c3aed",
    display_order: 4
  },
  {
    slug: "public-health",
    name: "Public Health & Clinical Science",
    tagline: "Evidence-Based Medicine, Cohorts & Physiological Research",
    description: "Critical reviews of clinical trials, metabolic endocrinology, epidemiology, and public health policy without sensationalism.",
    accent_color: "#dc2626",
    display_order: 5
  },
  {
    slug: "culture-society",
    name: "Culture, Heritage & Society",
    tagline: "Architectural Conservation, Living Traditions & Urban History",
    description: "Literary essays documenting historic urban centers, traditional artisan guilds, oral genealogies, and regional social dynamics.",
    accent_color: "#db2777",
    display_order: 6
  }
];

const insertNiche = db.prepare(`
  INSERT OR IGNORE INTO niches (slug, name, tagline, description, accent_color, display_order)
  VALUES (@slug, @name, @tagline, @description, @accent_color, @display_order)
`);

for (const n of niches) {
  insertNiche.run(n);
}

// Map slugs to IDs
const nicheMap = {};
for (const row of db.prepare("SELECT id, slug FROM niches").all()) {
  nicheMap[row.slug] = row.id;
}

// 2. Seed Authors
const authors = [
  {
    slug: "zainab-tariq",
    name: "Zainab Tariq",
    title: "Senior Technology Correspondent & Ecosystem Analyst",
    bio: "Zainab covers digital infrastructure, venture capital, and telecommunications policy. With over a decade tracking spectrum allocations and software engineering hubs across South Asia, her writing prioritizes unit economics and architectural resilience over promotional hype.",
    credentials: "B.S. Computer Engineering (LUMS), M.S. Science & Technology Journalism (Columbia)",
    niche_id: nicheMap["technology"],
    avatar_initials: "ZT",
    beat: "Telecom Policy, 5G Infrastructure & Venture Capital",
    location: "Islamabad, Pakistan",
    twitter_handle: "@zainabtariq_tech"
  },
  {
    slug: "tariq-mehmood",
    name: "Tariq Mehmood",
    title: "Chief Diplomatic & Statecraft Editor",
    bio: "Tariq brings twenty-five years of investigative journalism covering the federal parliamentary beat, Supreme Court constitutional jurisprudence, and bilateral regional diplomacy.",
    credentials: "M.A. Political Science & International Relations (Quaid-i-Azam University)",
    niche_id: nicheMap["national-affairs"],
    avatar_initials: "TM",
    beat: "Statecraft, Diplomacy & Parliamentary Governance",
    location: "Islamabad, Pakistan",
    twitter_handle: "@tariq_diplomacy"
  },
  {
    slug: "dr-asim-farooqi",
    name: "Dr. Asim Farooqi",
    title: "Senior Macroeconomic Strategist",
    bio: "Former central bank economic advisor and sovereign debt analyst. Dr. Farooqi writes on balance of payments, real effective exchange rates, and structural fiscal consolidation.",
    credentials: "Ph.D. Economics (London School of Economics), Former Research Fellow (PIDE)",
    niche_id: nicheMap["economy-markets"],
    avatar_initials: "AF",
    beat: "Central Banking, Sovereign Debt & Monetary Policy",
    location: "Karachi, Pakistan",
    twitter_handle: "@drasim_macro"
  },
  {
    slug: "marium-bilal",
    name: "Marium Bilal",
    title: "Senior Consumer Research Lead",
    bio: "Marium leads independent product evaluation and personal finance analytics. Her team conducts exhaustive laboratory teardowns and balance-sheet stress tests to protect reader capital.",
    credentials: "B.S. Applied Mathematics & Finance (IBA), CFA Charterholder",
    niche_id: nicheMap["consumer-guides"],
    avatar_initials: "MB",
    beat: "Empirical Hardware Benchmarks & Personal Wealth",
    location: "Lahore, Pakistan",
    twitter_handle: "@mariumb_wealth"
  },
  {
    slug: "dr-sarah-jamil",
    name: "Dr. Sarah Jamil",
    title: "Medical Science Fellow & Clinical Journalist",
    bio: "Consultant physician and public health epidemiologist examining community screening outcomes, clinical trials, and preventive endocrinology.",
    credentials: "MBBS (Aga Khan University), M.P.H. Epidemiology (Harvard T.H. Chan School of Public Health)",
    niche_id: nicheMap["public-health"],
    avatar_initials: "SJ",
    beat: "Preventive Medicine, Clinical Trials & Public Health",
    location: "Karachi, Pakistan",
    twitter_handle: "@drsarah_med"
  },
  {
    slug: "kamran-rasheed",
    name: "Kamran Rasheed",
    title: "Cultural Essayist & Regional Affairs Correspondent",
    bio: "Kamran documents historic urban conservation, regional folklore, and master craftsmanship across traditional craft guilds.",
    credentials: "M.A. South Asian History & Literature (Punjab University)",
    niche_id: nicheMap["culture-society"],
    avatar_initials: "KR",
    beat: "Walled Cities, Architectural Conservation & Oral History",
    location: "Lahore, Pakistan",
    twitter_handle: "@kamran_heritage"
  }
];

const insertAuthor = db.prepare(`
  INSERT OR IGNORE INTO authors (slug, name, title, bio, credentials, niche_id, avatar_initials, beat, location, twitter_handle)
  VALUES (@slug, @name, @title, @bio, @credentials, @niche_id, @avatar_initials, @beat, @location, @twitter_handle)
`);

for (const a of authors) {
  insertAuthor.run(a);
}

// Map author slugs to IDs
const authorMap = {};
for (const row of db.prepare("SELECT id, slug FROM authors").all()) {
  authorMap[row.slug] = row.id;
}

// 3. Seed Scraper Sources
const insertSource = db.prepare(`
  INSERT OR IGNORE INTO scraper_sources (code, name, niche_slug, feed_url, site_url, status)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const s of SOURCES) {
  insertSource.run(s.code, s.name, s.nicheSlug, s.feedUrl, s.siteUrl, "active");
}

console.log("Niches, Authors, and Sources seeded successfully.");
