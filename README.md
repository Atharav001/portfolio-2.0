<div align="center">

# ⚡ Atharav Narang — Portfolio 2.0 & Scope-Locked RAG AI

**Next-Gen Developer Portfolio featuring "Ask About Atharav AI" — an embedded, scope-locked Retrieval-Augmented Generation (RAG) assistant built with React 19, Supabase pgvector, and Google Gemini 3.6.**

[✨ Live Portfolio Demo](https://atharav001n.vercel.app) • [💼 LinkedIn](https://linkedin.com/in/atharav-narang-132b74273) • [🐙 GitHub](https://github.com/Atharav001)

---

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Supabase pgvector](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis_Rate_Limiter-00E599?style=for-the-badge&logo=redis&logoColor=black)](https://upstash.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

<br />

---

## 🌟 Overview

**Portfolio 2.0** is a custom-built, ultra-responsive developer portfolio for **Atharav Narang** — a Computer Science undergrad at Manipal Institute of Technology (MAHE), Bengaluru, specializing in AI/ML pipeline engineering, RAG architectures, local multi-agent systems, and system design.

Rather than being a static showcase site, Portfolio 2.0 features an embedded, real-time AI assistant called **"Ask About Atharav AI"**. Visitors can query the chatbot in natural language to learn about Atharav's projects, technical background, architecture decisions, and availability.

---

## 🧠 "Ask About Atharav AI" — System Architecture

The chatbot is built as a **Scope-Locked RAG System**, ensuring it accurately answers questions grounded strictly in Atharav's personal knowledge base while gracefully handling general inquiries, technical stack questions, and blocking off-topic prompt injections.

```
┌─────────────────┐       ┌────────────────────────┐       ┌───────────────────────┐
│                 │  POST │                        │ RPC   │                       │
│  User Query     ├──────►│ Vercel Serverless API  ├──────►│ Supabase pgvector     │
│  (Chat Widget)  │       │ (/api/chat.js)         │       │ (match_knowledge)     │
└─────────────────┘       └──────────┬─────────────┘       └──────────┬────────────┘
                                     │                                │
                                     ▼                                ▼
                          ┌────────────────────┐          ┌───────────────────────┐
                          │  Upstash Redis     │          │ Gemini embedding-001  │
                          │  Sliding-Window    │          │ (768-dim Vectors)     │
                          │  Rate-Limiter      │          └───────────────────────┘
                          └──────────┬─────────┘
                                     │
                                     ▼
                          ┌────────────────────┐
                          │  Google Gemini     │
                          │  3.6 Flash LLM     │──────► Synthesized Answer
                          │  (Reasoning Engine)│
                          └────────────────────┘
```

### Key RAG Pipeline Innovations:
- **Two-Pass Topic Classification**: Pass 1 evaluates topic intent (allowing portfolio site tech stack, projects, education, skills, and greetings while blocking unrelated general trivia or DAN prompt injection attempts). Pass 2 synthesizes grounded answers using LLM reasoning.
- **768-dim Vector Similarity Search**: Powered by Google Gemini `embedding-001` and Supabase `pgvector` stored procedures (`match_knowledge_chunks`).
- **Dual Sliding-Window Rate Limiting**: Upstash Redis enforcing 8 requests/5 mins per IP, 20 requests/24 hrs per session, and a global daily API token safety cap.
- **Dynamic UI Telemetry**: Powered by `thinking-orbs` for canvas-based animated state feedback during LLM response generation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19, Vite 8, Vanilla CSS (HSL design tokens, glassmorphic layout, backdrop filters), Lucide Icons |
| **Animations & FX** | Framer Motion, Lenis Smooth Scroll, `thinking-orbs` animated canvas component |
| **AI / RAG Backend** | Vercel Serverless Functions, `@google/genai` (Gemini 3.6 Flash & embedding-001) |
| **Vector DB** | Supabase (`pgvector`, cosine distance RPC `match_knowledge_chunks`) |
| **Rate Limiting** | Upstash Redis (`@upstash/ratelimit` & `@upstash/redis`) |
| **Analytics & Deployment** | `@vercel/analytics`, Vercel Edge Serverless Deployment |

---

## 🚀 Featured Engineering Projects

| Project | Key Architecture & Innovations | Concrete Metrics / Outcome | Link |
| :--- | :--- | :--- | :--- |
| **RAG-Agentic-Deep-Research** | Local Ollama multi-agent research agent; hybrid BM25 + FAISS search, RRF fusion, cross-encoder reranking, NLI verifier. | 374 arXiv papers (13k windows); 7 parallel matrix ablations cutting eval latency by **>70%**. | [Repo ↗](https://github.com/Atharav001/RAG-Agentic-Deep-Research) |
| **WhatsApp Message Router** | Multimodal router (text, Vision OCR, faster-whisper ASR); 6-stage pipeline with post-model safety gate against prompt injection. | **100% action accuracy** (30/30); 49 safety overrides across 110 messages with 0 violations. | [Repo ↗](https://github.com/Atharav001/whatsapp-message-notification-router) |
| **Two-Step De-Biased Pipeline** | Automated claim verification separating visual perception from adjudication to eliminate anchoring bias & prompt injection. | Claim validation accuracy boosted from **30% → 65%** at zero API cost with Gemini Flash Lite. | [Repo ↗](https://github.com/Atharav001/Two-Step-Debiased-MultiModal-Pipeline) |
| **Aura macOS App** | Native Mac Dynamic Island & menu bar command center app with live media controls, Pomodoro timer, and glass widgets. | Pure Swift Package Manager build script (**0 Xcode project file dependency**); AppKit & SwiftUI. | [Repo ↗](https://github.com/Atharav001/Aura-mac-app) |
| **Shortform Usage Sentinel** | Native Android digital wellness app tracking physical scroll swipes on Reels/Shorts with AccessibilityService engine. | 100% local persistence in Room DB with local biometric security unlock & live scroll overlay. | [Repo ↗](https://github.com/Atharav001/shortform-usage-sentinel) |
| **Flownote Extension** | React 19 Chromium sidepanel extension with sticky notes, rich text editor, and Google Tasks OAuth sync. | Built on Manifest V3, React 19, Vite 6, `chrome.storage.local`. | [Repo ↗](https://github.com/Atharav001/Flownote-Productivity-Sidepanel) |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ and `npm` installed.

### Installation & Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Atharav001/portfolio-2.0.git
   cd portfolio-2.0
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (`.env.local`):
   ```env
   GOOGLE_AI_API_KEY=your_gemini_api_key
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   UPSTASH_REDIS_REST_URL=https://your-upstash-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ALLOWED_ORIGIN=http://localhost:5173
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Re-embed & Ingest Knowledge Base** (Optional):
   ```bash
   node scripts/ingest.mjs
   ```

---

## 📬 Contact & Connect

- **Portfolio**: [atharav001n.vercel.app](https://atharav001n.vercel.app)
- **Email**: [atharavnarang05@gmail.com](mailto:atharavnarang05@gmail.com)
- **LinkedIn**: [linkedin.com/in/atharav-narang-132b74273](https://linkedin.com/in/atharav-narang-132b74273)
- **GitHub**: [github.com/Atharav001](https://github.com/Atharav001)

<br />

<div align="center">

*Designed & Architected with discipline by Atharav Narang © 2026*

</div>
