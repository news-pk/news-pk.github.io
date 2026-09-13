
function selectContextualImage(title, nicheSlug) {
  const t = (title || "").toLowerCase();
  if (t.includes("headphone")) return "/images/headphones.jpg";
  if (t.includes("laptop")) return "/images/laptop.jpg";
  if (t.includes("earbud")) return "/images/earbuds.jpg";
  if (t.includes("credit card") || t.includes("reward") || t.includes("wealth")) return "/images/credit-cards.jpg";
  if (t.includes("bond") || t.includes("yield") || t.includes("stock") || t.includes("market")) return "/images/bond-markets.jpg";
  if (t.includes("bitcoin") || t.includes("crypto") || t.includes("gold") || t.includes("reserve")) return "/images/bitcoin-reserves.jpg";
  if (t.includes("diesel") || t.includes("petrol") || t.includes("oil") || t.includes("pipeline") || t.includes("fuel")) return "/images/oil-energy.jpg";
  if (t.includes("parliament") || t.includes("assembly") || t.includes("senate") || t.includes("ambassador")) return "/images/parliament.jpg";
  if (t.includes("police") || t.includes("cyber") || t.includes("password") || t.includes("claude") || t.includes("security")) return "/images/cybercrime.jpg";
  if (t.includes("bank") || t.includes("fintech") || t.includes("app")) return "/images/mobile-banking.jpg";
  if (t.includes("cardio") || t.includes("health") || t.includes("clinical") || t.includes("vaccin") || t.includes("doctor")) return "/images/clinical-lab.jpg";
  if (t.includes("haveli") || t.includes("lahore") || t.includes("heritage")) return "/images/lahore-haveli.jpg";
  if (t.includes("pottery") || t.includes("multan") || t.includes("craft") || t.includes("artisan")) return "/images/blue-pottery.jpg";
  
  const defaults = {
    "technology": "/images/technology.jpg",
    "economy-markets": "/images/economy-markets.jpg",
    "national-affairs": "/images/national-affairs.jpg",
    "consumer-guides": "/images/consumer-guides.jpg",
    "public-health": "/images/public-health.jpg",
    "culture-society": "/images/culture-society.jpg"
  };
  return defaults[nicheSlug] || "/images/technology.jpg";
}

// Journalistic Synthesis Engine
// Enforces human beat-reporter style, AP datelines, sentence burstiness,
// and strictly eliminates AI markers (NO emojis, NO "---", NO generic AI cliches).

const BANNED_AI_PHRASES = [
  /in today's fast-paced (world|digital landscape|society)/gi,
  /it is important to (remember|note|keep in mind)/gi,
  /delve(s|d)? into/gi,
  /testament to/gi,
  /rich tapestry/gi,
  /in conclusion/gi,
  /to wrap (things )?up/gi,
  /without further ado/gi,
  /as an ai/gi,
  /game-changer/gi,
  /unlock(ing)? the potential/gi,
  /navigating the complexities/gi,
  /a double-edged sword/gi,
  /stands as a testament/gi,
  /beacon of hope/gi,
  /in summary/gi,
  /key takeaways/gi
];

// Emojis regex
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F200}-\u{1F270}]/gu;

// Triple dashes and horizontal separators
const DASH_SEPARATOR_REGEX = /---+|==={3,}|___+/g;

function sanitizeText(text) {
  if (!text) return "";
  let clean = text
    .replace(/The post .*? appeared first on .*?(\.|$)/gi, "")
    .replace(/appeared first on [^\n\.\<\>]+/gi, "")
    .replace(/…\s*Read More/gi, "")
    .replace(/\bRead More\b/gi, "")
    .replace(/Published in [A-Za-z\s]+,?\s+[A-Za-z]+\s+\d+(?:st|nd|rd|th)?,?\s+\d{4}\.?\s*/gi, "")
    .replace(/Published in [A-Za-z\s]+,?\s+[A-Za-z]+\s+\d+(?:st|nd|rd|th)?\.?\s*/gi, "")
    .replace(/sources told [A-Za-z\s]+\./gi, "sources familiar with the matter confirmed to News PK.")
    .replace(/sources told [A-Za-z\s]+/gi, "sources familiar with the matter confirmed")
    .replace(/\bsources\b\s+(told|confirmed to|revealed to)\s+[A-Z][a-zA-Z]+/gi, "sources confirmed to News PK")
    .replace(/\b(ProPakistani|Dawn|Daily Pakistan|Tech Juice|TechJuice|Hamariweb|UrduPoint)\b/gi, "independent industry monitors")
    .replace(EMOJI_REGEX, "")
    .replace(DASH_SEPARATOR_REGEX, " ")
    .replace(/\s{2,}/g, " ");

  for (const pattern of BANNED_AI_PHRASES) {
    clean = clean.replace(pattern, "");
  }

  return clean.trim();
}

const AUTHOR_PERSONAS = {
  "zainab-tariq": {
    datelines: ["ISLAMABAD", "KARACHI", "LAHORE", "SINGAPORE"],
    tone: "analytical, investigative, focused on unit economics, telecom policies, and hardware architecture",
    framing: [
      "The engineering reality behind the announcement underscores a deeper structural shift across the domestic infrastructure ecosystem.",
      "Industry veterans familiar with the regulatory discussions point to lingering bottlenecks that public communiques tend to gloss over.",
      "Beyond the topline valuation numbers, the operational calculus tells a much more disciplined operational story."
    ],
    sectionHeaders: [
      "Infrastructure Realities on the Ground",
      "Regulatory Friction and Policy Timelines",
      "The Unit Economics Breakdown",
      "Strategic Horizon for Capital Deployment"
    ]
  },
  "tariq-mehmood": {
    datelines: ["ISLAMABAD", "RAWALPINDI", "BEIJING", "WASHINGTON"],
    tone: "authoritative, diplomatic, focused on governance, treaty obligations, and institutional balance",
    framing: [
      "The institutional negotiations leading to this consensus reflect months of back-channel deliberations between federal authorities and regional stakeholders.",
      "Within bureaucratic circles, the move is regarded as a pragmatic compromise rather than an absolute diplomatic victory.",
      "Historical precedents suggest that implementation will depend almost entirely on ministerial oversight during the initial ninety days."
    ],
    sectionHeaders: [
      "Institutional Deliberations Behind Closed Doors",
      "Treaty Provisions and Sovereign Commitments",
      "Administrative Hurdles and Compliance Benchmarks",
      "The Geopolitical Repercussions"
    ]
  },
  "dr-asim-farooqi": {
    datelines: ["KARACHI", "LONDON", "GENEVA", "FRANKFURT"],
    tone: "rigorous, macroeconomic, focused on monetary transmission, yield curves, and sovereign balance sheets",
    framing: [
      "When adjusted for real effective exchange rates and sovereign spread differentials, the underlying trends reveal a precarious equilibrium.",
      "Central banking archives offer clear warnings regarding premature monetary easing during stubborn supply-side cost pressures.",
      "Institutional bond market desks have already begun pricing in the probability of structural liquidity tightening."
    ],
    sectionHeaders: [
      "Monetary Transmission and Liquidity Dynamics",
      "The Math Behind Sovereign Yield Curves",
      "Balance Sheet Reconciliations",
      "Macroeconomic Implications for the Coming Quarter"
    ]
  },
  "marium-bilal": {
    datelines: ["NEW YORK", "SAN FRANCISCO", "LAHORE"],
    tone: "empirical, rigorous consumer testing, zero marketing tolerance, precise monetary calculations",
    framing: [
      "Our benchmark testing revealed substantial variance between promotional claims and empirical real-world stress loads.",
      "For typical household budgets, the headline reward incentives evaporate once redemption restrictions and account thresholds are calculated.",
      "Component-level teardowns demonstrate that manufacturing tolerances vary sharply between early production batches and retail stock."
    ],
    sectionHeaders: [
      "Laboratory Testing and Real-World Stress Curves",
      "Hidden Fees and Actual Cost Accounting",
      "The Trade-Offs Consumers Must Weigh",
      "The Verdict Based on Empirical Data"
    ]
  },
  "dr-sarah-jamil": {
    datelines: ["BOSTON", "ISLAMABAD", "GENEVA", "LONDON"],
    tone: "clinical, evidence-based, peer-reviewed focus, non-sensationalist medical reporting",
    framing: [
      "Epidemiological data indicates that clinical outcomes correlate closely with sustained lifestyle interventions rather than acute short-term therapies.",
      "Biochemical pathways involving cellular receptor density provide a physiological explanation for the observed cohort improvements.",
      "Clinicians urge caution regarding over-interpreting observational data without randomized double-blind trial replication."
    ],
    sectionHeaders: [
      "Cellular Mechanisms and Biomarker Signatures",
      "Clinical Trial Cohorts and Statistical Confidence",
      "Translating Laboratory Findings to Patient Care",
      "Unresolved Questions in Current Medical Literature"
    ]
  },
  "kamran-rasheed": {
    datelines: ["LAHORE", "MULTAN", "PESHAWAR", "KARACHI"],
    tone: "literary, observational, culturally rooted, attentive to oral history and architectural conservation",
    framing: [
      "Beneath the layered soot and commercial bustle of the inner city, these generational traditions preserve an intricate communal rhythm.",
      "Elder artisans recall a time when municipal patrons regarded craftsmanship as a civic duty rather than a tourist novelty.",
      "The challenge lies in transmitting these analog masteries to an urban generation acclimated to rapid digital obsolescence."
    ],
    sectionHeaders: [
      "Living Archives in the Medieval Quarters",
      "The Vanishing Lexicon of Master Artisans",
      "Social Fabric Across Multi-Generational Courtyards",
      "Preserving Intangible Cultural Heritage"
    ]
  }
};

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function synthesizeJournalisticArticle(rawArticle, author, niche, source) {
  const persona = AUTHOR_PERSONAS[author.slug] || AUTHOR_PERSONAS["zainab-tariq"];
  const datelineCity = persona.datelines[Math.floor(Math.random() * persona.datelines.length)];
  const dateline = `${datelineCity} —`;

  const cleanTitle = sanitizeText(rawArticle.title);
  const cleanLead = sanitizeText(rawArticle.lead || rawArticle.title);
  const cleanRawContent = sanitizeText(rawArticle.content);

  // Split raw content into manageable journalistic sentences
  const rawSentences = cleanRawContent
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.length > 20 && !s.includes("http"));

  // Select framing narrative
  const frame1 = persona.framing[Math.floor(Math.random() * persona.framing.length)];
  const frame2 = persona.framing[(Math.floor(Math.random() * persona.framing.length) + 1) % persona.framing.length];

  // Build clean semantic HTML paragraphs without any AI markers or markdown dividers
  const sections = [];

  // Lead Section
  sections.push(`<p class="editorial-lead"><strong>${dateline}</strong> ${cleanLead} ${frame1}</p>`);

  // Context Paragraphs
  const contextP = rawSentences.slice(0, 2).join(" ");
  if (contextP) {
    sections.push(`<p>${contextP}</p>`);
  }

  // Section 1
  sections.push(`<h2>${persona.sectionHeaders[0]}</h2>`);
  const sec1Text = rawSentences.slice(2, 4).join(" ") || 
    "Comprehensive documentation gathered from regulatory filings indicates that capital disbursements are scheduled across phased tranches. Key operational leads confirmed that preliminary testing commenced several weeks prior to formal announcements, enabling technical teams to isolate systemic edge cases before broader deployment.";
  sections.push(`<p>${sec1Text}</p>`);

  // Direct Attribution / Journalistic Quote
  const quoteParagraph = `<blockquote class="editorial-quote">
    <p>"The objective is not merely incremental progress, but establishing verifiable operational standards that hold up under institutional audit."</p>
    <cite>Senior Regulatory Official familiar with the matter</cite>
  </blockquote>`;
  sections.push(quoteParagraph);

  // Section 2
  sections.push(`<h2>${persona.sectionHeaders[1]}</h2>`);
  const sec2Text = rawSentences.slice(4, 7).join(" ") ||
    `${frame2} Stakeholders have emphasized that continuity remains the principal vulnerability. Past administrative initiatives faced friction once headline attention shifted, highlighting the necessity of sustained oversight.`;
  sections.push(`<p>${sec2Text}</p>`);

  // Section 3 (Analytical Outlook)
  sections.push(`<h2>${persona.sectionHeaders[3]}</h2>`);
  const concludingText = `As market participants and institutional monitors assess the trajectory over the coming quarters, attention will center on quarterly verification metrics. Whether the initiative fulfills its baseline targets will depend heavily on sustained technical compliance rather than rhetorical goodwill.`;
  sections.push(`<p>${concludingText}</p>`);

  const fullHtml = sections.join("\n\n");
  const readingTime = Math.max(2, Math.round(fullHtml.split(/\s+/).length / 220));

  return {
    title: cleanTitle,
    slug: generateSlug(cleanTitle) + "-" + Date.now().toString(36).slice(-4),
    leadParagraph: cleanLead,
    contentHtml: fullHtml,
    dateline: dateline,
    readingTimeMinutes: readingTime,
    authorId: author.id,
    nicheId: niche.id,
    sourcePublication: source.name,
    sourceUrl: rawArticle.sourceUrl || source.siteUrl,
    originalHeadline: rawArticle.title,
    isBreaking: Math.random() > 0.8 ? 1 : 0,
    isFeatured: Math.random() > 0.75 ? 1 : 0,
    isTrending: Math.random() > 0.7 ? 1 : 0,
    imageUrl: selectContextualImage(cleanTitle, niche.slug)
  };
}

module.exports = {
  synthesizeJournalisticArticle,
  sanitizeText,
  generateSlug
};
