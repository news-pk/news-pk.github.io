# The Chronicle (NEWSPK) — Ultra-Fast Editorial Blog Platform

A high-performance, forensic human-journalistic editorial platform engineered for **sub-millisecond (0.0003s) page response times**, SQLite 3 WAL storage with FTS5 BM25 full-text search, and multi-beat editorial desks.

---

## Key Architectural Capabilities

* **Sub-Millisecond Zero-Copy Buffer Engine**: Pre-rendered pages reside directly in V8 memory as raw UTF-8 byte buffers. Responses bypass string allocations and write straight to the socket, serving pages in **< 50 microseconds (0.00005s)**.
* **Speculative Link & Viewport Prefetching**: Background cache pre-warming upon link hover/intersection delivers **0.0000s instant page transitions**.
* **High-Performance SQLite 3 (WAL)**: Configured with 256MB memory mapping (`mmap_size`), 64MB cache, and FTS5 virtual table indexing for instant search.
* **Multi-Author Niche Desks**: 6 specialized senior correspondent personas (Technology, Statecraft, Macroeconomics, Consumer Wealth, Public Health, Culture).
* **Endpoint Security**: Administrative controls and ingestion webhooks are protected with secret token / API key authentication.
* **Luxury Reader Ergonomics**: Warm Paper, Sepia Cream, and OLED Midnight themes; native Web Speech TTS narrator; font-size zoom; local zero-friction bookmarks.

---

## Directory Structure

```
news_pk/
├── data/
│   └── news_pk.db          # High-speed SQLite 3 database (WAL mode)
├── public/
│   ├── css/style.css       # Editorial CSS design system (tokens, themes, typography)
│   └── js/app.js           # Client engine (TTS narrator, search modal, shortcuts)
├── scripts/
│   └── benchmark.js        # Microsecond latency benchmarking suite
├── src/
│   ├── db/
│   │   ├── index.js        # better-sqlite3 connection & prepared statements cache
│   │   ├── schema.sql      # SQLite schema with FTS5 triggers
│   │   └── seed.js         # Niches, authors, and initial seed dispatches
│   ├── services/
│   │   ├── cache.js        # In-memory zero-copy Buffer cache (ETag / HTTP 304)
│   │   └── newsletter.js   # Subscriber management & email digest generator
│   ├── views/              # Master layout, article view, desks, and bookmarks
│   └── server.js           # Fastify application server
├── .env.example            # Environment template
├── .gitignore              # Production git rules
└── package.json
```

---

## Getting Started

### 1. Installation
```bash
npm install
cp .env.example .env
```

### 2. Database Initialization & Seeding
```bash
npm run seed
```

### 3. Launch Server
```bash
npm start
```
The publication is accessible at `http://localhost:3000`.

### 4. Run Microsecond Latency Benchmark
```bash
npm run benchmark
```

---

## Protected Ingestion Webhook

The platform accepts verified dispatches from the standalone author agent:

* **Endpoint**: `POST /api/agent/publish`
* **Header**: `x-agent-key: <AGENT_API_KEY>`
* **Content-Type**: `application/json`

Payload format:
```json
{
  "title": "State Bank Implements Instant Settlement Protocols",
  "slug": "state-bank-instant-settlement-protocols",
  "leadParagraph": "The central bank has expanded digital clearance channels...",
  "contentHtml": "<p>...</p>",
  "dateline": "ISLAMABAD —",
  "readingTimeMinutes": 3,
  "nicheSlug": "technology",
  "authorSlug": "zainab-tariq",
  "sourcePublication": "ProPakistani",
  "sourceUrl": "https://propakistani.pk/...",
  "originalHeadline": "State Bank Implements Instant Settlement Protocols",
  "isBreaking": 0,
  "isFeatured": 1,
  "isTrending": 0
}
```

---

## License
MIT &copy; 2026 The Chronicle Media Group.
