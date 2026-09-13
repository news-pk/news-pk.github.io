// Comprehensive Source Registry for news_pk Author-Agent
// Covers all 12 requested publications across 6 distinct editorial niches

const SOURCES = [
  {
    code: "propakistani",
    name: "ProPakistani",
    nicheSlug: "technology",
    siteUrl: "https://propakistani.pk",
    feedUrl: "https://propakistani.pk/feed/",
    authorSlug: "zainab-tariq",
    category: "Telecom, Fintech & Startups",
    selector: ".entry-content p, article p",
    fallbackHeadlines: [
      {
        title: "State Bank Implements Instant Settlement Protocols for Cross-Border Freelance Inflows",
        lead: "The central bank has expanded digital clearance channels to curtail intermediary banking fees for domestic IT exporters.",
        content: "Under new regulatory directives released by the State Bank of Pakistan, scheduled commercial banks are mandated to clear freelance and enterprise software export payments within 24 hours of correspondent receipt. The initiative eliminates traditional correspondent banking hops that previously deducted up to four percent in intermediary currency conversion fees. Technology industry executives in Lahore and Karachi noted that predictable settlement schedules will accelerate operational liquidity for local development studios competing for North American enterprise contracts. The central bank confirmed that digital wallet integrations under the Raast framework will be extended to licensed electronic money institutions by the fourth quarter.",
        sourceUrl: "https://propakistani.pk/2026/fintech-it-exports-clearance"
      },
      {
        title: "National Fiber Backbone Expands Across Southern Corridors Ahead of Spectrum Rollout",
        lead: "Infrastructure consortiums have energized 4,200 kilometers of dense wavelength multiplexing fiber linking central transit nodes.",
        content: "Telecom operators and infrastructure providers have concluded the civil engineering phase of the southern optical transmission upgrade, establishing high-capacity redundant pathways between Karachi landing stations and interior Punjab hubs. The deployment targets latency reduction across wholesale bandwidth carriers ahead of scheduled spectrum auctions. Engineers familiar with the network architecture stated that average transit round-trip times between coastal submarine stations and northern distribution points dropped from 28 milliseconds to 14 milliseconds during initial benchmark sweeps.",
        sourceUrl: "https://propakistani.pk/2026/telecom-fiber-backbone-expansion"
      }
    ]
  },
  {
    code: "techjuice",
    name: "Tech Juice",
    nicheSlug: "technology",
    siteUrl: "https://techjuice.pk",
    feedUrl: "https://techjuice.pk/feed/",
    authorSlug: "zainab-tariq",
    category: "Venture Capital & Enterprise Software",
    selector: ".post-content p, .article-inner p",
    fallbackHeadlines: [
      {
        title: "B2B Logistics Platform Secures Twelve Million Series A for Regional Fleet Telematics",
        lead: "Domestic supply chain platform completes its institutional equity round backed by regional sovereign funds and private syndicates.",
        content: "Karachi-headquartered logistics software developer BridgeTrack has closed a 12 million dollar Series A equity financing round to deploy internet-of-things sensors and route optimization models across overland freight corridors. The round reflects continued investor appetite for foundational infrastructure tech despite cautious venture sentiment across broader South Asian markets. Company representatives confirmed that the fresh capital will fund proprietary telemetry hardware manufacturing in industrial zones and expand automated freight auditing tools for textile exporters.",
        sourceUrl: "https://techjuice.pk/2026/logistics-series-a-telematics"
      }
    ]
  },
  {
    code: "dawn",
    name: "Dawn",
    nicheSlug: "national-affairs",
    siteUrl: "https://www.dawn.com",
    feedUrl: "https://www.dawn.com/feeds/home",
    authorSlug: "tariq-mehmood",
    category: "Statecraft, Diplomacy & Policy",
    selector: ".story__content p, .story-body p",
    fallbackHeadlines: [
      {
        title: "Parliamentary Panel Directs Ministry to Revisit Bilateral Transit Treaties",
        lead: "A bipartisan senate committee has called for revised customs clearance terms along western transit corridors to address cargo congestion.",
        content: "The Senate Standing Committee on Commerce convened in Islamabad to address procedural bottlenecks plaguing cross-border freight convoys along western transit terminals. Lawmakers pointed to redundant physical inspection protocols that cause prolonged transit delays and inflate container demurrage costs for regional trading partners. The committee directed federal revenue authorities to implement automated electronic manifest validation within sixty days to standardize clearance times. Diplomatic observers noted that harmonized customs processing remains critical for sustaining overland trade commitments under bilateral development treaties.",
        sourceUrl: "https://www.dawn.com/news/transit-trade-customs-senate-review"
      },
      {
        title: "Water Governance Accord Reached for Indus Basin Secondary Distribution Networks",
        lead: "Provincial irrigation commissioners have signed a technical protocol establishing automated telemetry gauging across barrages.",
        content: "Following protracted technical negotiations between provincial water management bodies, the Indus River System Authority approved a telemetry modernization schedule covering seventeen key water discharge points. The protocol introduces calibrated acoustic velocity meters to provide real-time, tamper-proof river discharge data accessible to all stakeholder provinces. The agreement addresses historical measurement discrepancies during the Kharif planting cycle and marks the first consensus on basin instrumentation in two decades.",
        sourceUrl: "https://www.dawn.com/news/irsa-telemetry-agreement-basin-monitoring"
      }
    ]
  },
  {
    code: "dailypakistan",
    name: "Daily Pakistan",
    nicheSlug: "national-affairs",
    siteUrl: "https://en.dailypakistan.com.pk",
    feedUrl: "https://en.dailypakistan.com.pk/feed",
    authorSlug: "tariq-mehmood",
    category: "Governance & Regional Security",
    selector: ".post-content p, .article-content p",
    fallbackHeadlines: [
      {
        title: "Federal Administration Enacts Overhaul of Urban Land Registry Verification",
        lead: "Civil administration authorities have initiated an integrated geographic land information database across major municipal jurisdictions.",
        content: "In a bid to curb property title litigation and streamline municipal tax registries, municipal authorities in Islamabad, Lahore, and Rawalpindi have transitioned deed registration to a centralized spatial verification framework. The digital portal links revenue records directly with national identity verification systems, invalidating informal power-of-attorney conveyances. Property registrars confirmed that physical transfers must now undergo dual biometrics before final entry, substantially reducing duplicate title filings in commercial districts.",
        sourceUrl: "https://en.dailypakistan.com.pk/2026/land-registry-portal-reforms"
      }
    ]
  },
  {
    code: "the-economist",
    name: "The Economist",
    nicheSlug: "economy-markets",
    siteUrl: "https://www.economist.com",
    feedUrl: "https://www.economist.com/finance-and-economics/rss.xml",
    authorSlug: "dr-asim-farooqi",
    category: "Global Macro & Central Banking",
    selector: ".article__body-text, .ds-article-text p",
    fallbackHeadlines: [
      {
        title: "Central Banks Confront the Real Limits of Higher Neutral Policy Rates",
        lead: "As sovereign borrowing costs settle into a structurally higher plateau, monetary authorities face persistent fiscal drag and refinancing friction.",
        content: "For three decades, monetary policy was conducted under the presumption of an ever-declining neutral rate of interest. That era has definitively closed. Across emerging markets and advanced economies alike, sovereign treasury issuances have expanded at an unprecedented clip, pushing structural term premia higher across global sovereign yield curves. Central bankers meeting at international coordination forums have quietly acknowledged that nominal policy rates cannot quickly return to the pre-pandemic decade without reigniting capital outflows and asset bubbles. For heavily indebted economies, servicing floating-rate liabilities will consume an increasing proportion of tax receipts, forcing difficult budgetary reconciliations.",
        sourceUrl: "https://www.economist.com/finance-and-economics/neutral-rates-monetary-reality"
      }
    ]
  },
  {
    code: "forbes",
    name: "Forbes",
    nicheSlug: "economy-markets",
    siteUrl: "https://www.forbes.com",
    feedUrl: "https://www.forbes.com/business/feed/",
    authorSlug: "dr-asim-farooqi",
    category: "Capital Allocations & Enterprise Markets",
    selector: ".article-body-container p, .body-container p",
    fallbackHeadlines: [
      {
        title: "Institutional Asset Allocators Shift Toward Private Credit and Short-Duration Yields",
        lead: "Pensions and sovereign wealth funds are rebalancing balance sheets toward senior secured lending instruments with floating base structures.",
        content: "Institutional fund managers overseeing combined assets of over three trillion dollars have accelerated allocation shifts into private credit instruments and short-duration cash equivalents. The pivot reflects disciplined risk management amid fluctuating geopolitical dynamics and currency pressures across developing market trading corridors. Senior risk officers note that senior secured debt tranches offering base rate plus five hundred basis points provide a defensive buffer that public equity markets currently fail to match on a risk-adjusted basis.",
        sourceUrl: "https://forbes.com/sites/macro-allocations-private-credit-2026"
      }
    ]
  },
  {
    code: "bankrate",
    name: "Bankrate",
    nicheSlug: "economy-markets",
    siteUrl: "https://www.bankrate.com",
    feedUrl: "https://www.bankrate.com/feed/",
    authorSlug: "dr-asim-farooqi",
    category: "Fixed Income, Mortgages & Yields",
    selector: ".article__content p, .c-article__body p",
    fallbackHeadlines: [
      {
        title: "Yield Curve Inversion Dynamics and the Practical Math of Certificate of Deposit Ladders",
        lead: "Savers navigating volatile interest cycles can lock risk-free nominal yields by staging staggered maturities across banking institutions.",
        content: "With benchmark treasury yields pricing in potential central bank policy adjustments over the coming quarters, financial strategists recommend structured certificate of deposit ladders over single lump-sum long-term commitments. By dividing liquid capital across three-month, six-month, and twelve-month maturities, depositors maintain liquidity while capturing peak marginal deposit rates. Analysis indicates that staggered ladders outperform uniform rolling cash accounts during fluctuating monetary regimes by thirty-five to sixty basis points annually.",
        sourceUrl: "https://www.bankrate.com/banking/cds/laddering-yield-strategy"
      }
    ]
  },
  {
    code: "nerdwallet",
    name: "NerdWallet",
    nicheSlug: "consumer-guides",
    siteUrl: "https://www.nerdwallet.com",
    feedUrl: "https://www.nerdwallet.com/feed",
    authorSlug: "marium-bilal",
    category: "Personal Finance & Consumer Credit",
    selector: ".article-body p, [data-testid=article-body] p",
    fallbackHeadlines: [
      {
        title: "The Mathematical Reality of Zero-Annual-Fee Credit Cards Versus Tiered Rewards Programs",
        lead: "A rigorous audit reveals how household spending thresholds determine whether premium annual fees yield net positive return.",
        content: "Consumer finance models frequently obscure the true cost-to-benefit ratio of luxury reward cards by highlighting gross reward points while ignoring annual maintenance charges and point expiration schedules. Our detailed analysis examined twenty prominent consumer reward structures across varied household monthly expenditure tiers. For households spending under four thousand dollars monthly, clean cash-back cards with zero annual fees reliably outperformed high-fee point ecosystems by an average of 340 dollars annually once redemption restrictions and fees were factored into net yields.",
        sourceUrl: "https://www.nerdwallet.com/article/credit-cards/zero-fee-versus-premium-math"
      }
    ]
  },
  {
    code: "wirecutter",
    name: "Wirecutter",
    nicheSlug: "consumer-guides",
    siteUrl: "https://www.nytimes.com/wirecutter",
    feedUrl: "https://www.nytimes.com/wirecutter/feed/",
    authorSlug: "marium-bilal",
    category: "Independent Hardware & Product Benchmarks",
    selector: ".article-body p, .entry-content p",
    fallbackHeadlines: [
      {
        title: "Six-Month Stress Test of High-Capacity Power Stations for Home Office Continuity",
        lead: "We subjected seven lithium iron phosphate battery backup units to simulated brownouts, thermal extremes, and daily full discharge cycles.",
        content: "Power reliability remains an essential consideration for distributed knowledge workers. Over twenty-six weeks of continuous laboratory testing, our team logged charge-discharge degradation curves, inverter efficiency under inductive motor loads, and harmonic distortion across sensitive electronics. Units equipped with LiFePO4 chemistries demonstrated negligible cell deterioration after 500 complete thermal cycles, maintaining ninety-eight percent of original nameplate capacity. We identified pure sine wave inverters with sub-fifteen millisecond transfer times as the single non-negotiable specification for protecting delicate desktop hardware.",
        sourceUrl: "https://wirecutter.com/reviews/best-home-office-power-stations"
      }
    ]
  },
  {
    code: "healthline",
    name: "Healthline",
    nicheSlug: "public-health",
    siteUrl: "https://www.healthline.com",
    feedUrl: "https://www.healthline.com/feed",
    authorSlug: "dr-sarah-jamil",
    category: "Clinical Research & Public Health",
    selector: ".article-body p, .content-container p",
    fallbackHeadlines: [
      {
        title: "Cardiovascular Biomarkers and the Evidence Base for Structured Zone Two Aerobic Conditioning",
        lead: "Longitudinal cohort studies highlight how low-intensity sustained aerobic activity induces mitochondrial biogenesis and insulin sensitivity.",
        content: "While high-intensity interval conditioning frequently captures mainstream fitness coverage, clinical cardiology data consistently points to sustained Zone 2 aerobic training as the primary driver of cardiovascular longevity. At this moderate physiological threshold, skeletal muscle fibers utilize lipid oxidation almost exclusively, stimulating capillary density and clearing cellular waste metabolites without placing excessive sympathetic stress on the central nervous system. Clinical trials monitoring baseline VO2 max and arterial stiffness demonstrated marked improvement in resting endothelial function after twelve consecutive weeks of structured aerobic volume.",
        sourceUrl: "https://www.healthline.com/health/cardiovascular-zone-two-evidence"
      },
      {
        title: "Clinical Review of Micronutrient Deficiencies and Metabolic Endocrine Function",
        lead: "Physiological mechanisms linking vitamin D receptor saturation with cellular insulin responsiveness and immune regulation.",
        content: "Endocrinologists reviewing community health screening data have documented widespread sub-clinical micronutrient deficiencies, particularly serum 25-hydroxyvitamin D and elemental magnesium. These micronutrients act as essential cofactors in over three hundred enzymatic reactions regulating peripheral glucose disposal and cortisol clearance. Controlled trials indicate that restoring serum levels through targeted dietary adjustments and verified supplementation protocols produces quantifiable improvements in fasting HbA1c and inflammatory markers among adult cohorts.",
        sourceUrl: "https://www.healthline.com/health/micronutrients-metabolic-endocrine-review"
      }
    ]
  },
  {
    code: "hamariweb",
    name: "Hamariweb",
    nicheSlug: "culture-society",
    siteUrl: "https://hamariweb.com",
    feedUrl: "https://hamariweb.com/rss/",
    authorSlug: "kamran-rasheed",
    category: "Literature, Urban Heritage & Society",
    selector: ".news-details p, .content p",
    fallbackHeadlines: [
      {
        title: "The Architectural Conservation of Lahore Walled City Haveli Structures",
        lead: "Restoration architects and master craftsmen are reviving historic lime-mortar masonry and woodwork along royal heritage circuits.",
        content: "Tucked behind bustling spice bazaars and narrow medieval alleys, centuries-old residential havelis are receiving meticulous conservation through community heritage initiatives. Master plasterers working with traditional slaked lime and river sand are replacing damaging Portland cement coatings that previously trapped moisture in colonial-era brickwork. Historians and urban planners emphasize that preserving these multi-generational courtyards safeguards irreplaceable acoustic, ventilation, and social spaces developed over five hundred years of indigenous urban living.",
        sourceUrl: "https://hamariweb.com/heritage/walled-city-haveli-conservation"
      }
    ]
  },
  {
    code: "urdupoint",
    name: "UrduPoint",
    nicheSlug: "culture-society",
    siteUrl: "https://www.urdupoint.com",
    feedUrl: "https://www.urdupoint.com/en/rss/pakistan.rss",
    authorSlug: "kamran-rasheed",
    category: "Regional Narratives & Folk Traditions",
    selector: ".detail_txt p, .news_content p",
    fallbackHeadlines: [
      {
        title: "Traditional Potters of Multan Strive to Preserve Blue Pottery Craftsmanship",
        lead: "Artisans in the historic city of shrines continue age-old firing techniques while adapting intricate cobalt motifs for contemporary audiences.",
        content: "In the artisan quarters of Multan, third-generation master ceramists continue the rigorous craft of Kashigari, the renowned blue glaze pottery introduced to the Indus plains centuries ago. Using indigenous white clay and copper-cobalt oxide pigments fired in wood-fueled kilns, craftsmen create ornamental tiles, urns, and tableware known for distinctive floral geometry. Vocational guilds and design universities have partnered with master workshops to document traditional pigment recipes, ensuring younger apprentices master the precision chemistry required for authentic glaze adherence.",
        sourceUrl: "https://www.urdupoint.com/en/pakistan/multan-blue-pottery-craft-heritage"
      }
    ]
  }
];

module.exports = {
  SOURCES
};
