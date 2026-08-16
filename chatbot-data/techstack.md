## Portfolio Website Architecture & Tech Stack (portfolio-2.0)

Atharav's personal portfolio website (portfolio-2.0) is a custom-built, modern web application designed for high performance, dynamic interactivity, and real-time AI assistance.

### Key Technologies & Stack Components:
- **Frontend Framework**: React 19 with Vite 8 for fast build tooling, hot module replacement, and optimal bundle size.
- **Styling System**: Vanilla CSS built on modular CSS design tokens (`tokens.css`, `index.css`) utilizing HSL color variables, modern glassmorphism, dynamic backdrop filters, and responsive layouts. No utility CSS frameworks like Tailwind were used here, ensuring complete bespoke control over design aesthetics.
- **Icons & Visual Components**: Lucide React (`lucide-react`) for clean SVG icons, Framer Motion for smooth micro-animations, and Lenis (`lenis`) for smooth scrolling transitions across sections.
- **Interactive Thinking Indicator**: `thinking-orbs` library powering the dynamic animated canvas orb while the AI assistant composes responses.
- **Web Analytics**: `@vercel/analytics` for privacy-friendly user interaction tracking.

## "Ask About Atharav AI" — Scope-Locked RAG Chatbot System Architecture

The hero section features an embedded RAG (Retrieval-Augmented Generation) assistant called **"Ask About Atharav AI"**.

### RAG Architecture & Infrastructure:
1. **Serverless API Endpoint**: Built as a Vercel Serverless Function (`/api/chat.js`), handling user requests securely with CORS validation, input sanitization (max 500 characters), and session tracking.
2. **Vector Database & Search**: Supabase with `pgvector` extension (`knowledge_chunks` table). Custom stored procedure `match_knowledge_chunks` executes cosine vector similarity search to retrieve relevant context passages.
3. **Embeddings Model**: Google Gemini Embedding API (`gemini-embedding-001`) generating 768-dimensional dense vector embeddings for both knowledge chunks during ingestion and incoming user queries at runtime.
4. **LLM Generation Engine**: Powered by Google Gemini API (`@google/genai`), primarily utilizing `gemini-3.6-flash` (with automatic fallback to `gemini-3.5-flash-lite` and `gemini-2.5-flash` for high reliability and sub-second latency).
5. **Rate-Limiting & Cost Protection**: Upstash Redis (`@upstash/redis` and `@upstash/ratelimit`) implementing dual sliding-window rate limiters (8 requests per 5 minutes per IP, 20 requests per 24 hours per session) and a global daily API token budget check.
6. **Scope-Locking & Prompt Engineering**: Two-pass AI pipeline. Pass 1 evaluates topic relevance (allowing questions about Atharav, his work, skills, and portfolio site architecture while blocking unrelated general knowledge trivia or DAN prompt injection attempts). Pass 2 grounds the LLM response strictly in retrieved knowledge while allowing natural LLM reasoning.
