## Autonomous Multi-Agent Research RAG Framework

Atharav built a research assistant that doesn't just retrieve information — it reasons about what it retrieved. The framework combines FAISS and BM25 in a hybrid retrieval setup, adds cross-encoder reranking on top, and runs parallel ablation studies across 7 different configurations to empirically determine what actually improves results, rather than guessing at architecture choices. Through this process, retrieval accuracy improved from 0.65 to 0.78, faithfulness improved from 0.70 to 0.82, and evaluation time was cut by 70%. The repository is at github.com/Atharav001/RAG-Agentic-Deep-Research.

## Two-Step De-biased Multimodal Verification Pipeline

Built for automated damage claim verification using Gemini Flash Lite, at zero API cost, for the HackerRank Orchestrate hackathon. The core design decision was separating visual perception from adjudication into two distinct steps: the model first describes what it sees in an image (blind perception) before it's allowed to make any judgment call about the claim. This structural separation — rather than just better prompting — reduces the confirmation bias and anchoring that sinks most single-pass vision-language-model pipelines, and also helps guard against prompt injection. This restructuring took claim validation accuracy from 30% to 65% on the evaluation set. The repository is at github.com/Atharav001/Two-Step-Debiased-MultiModal-Pipeline.

## AI Support Triage Agent

A support ticket triage agent designed to know when *not* to answer. It uses confidence-gated retrieval over a knowledge base of 774 documents, with deterministic fallback logic — so instead of confidently hallucinating a wrong answer when it's unsure, it hands off gracefully. It runs entirely on local models, meaning zero data leaves the system and there's no latency dependency on external APIs. The repository is at github.com/Atharav001/AI-Support-Triage-Agent.

## Shortform Usage Sentinel

An Android tool that tracks Instagram and YouTube short-form video usage through structural UI detection combined with physics-based debouncing — deliberately built without relying on Android's Accessibility API as a shortcut, which meant solving the detection problem through careful, from-scratch signal processing instead. The repository is at github.com/Atharav001/shortform-usage-sentinel.

## Other projects

Atharav is also actively exploring internship opportunities in AI/ML and continues building multi-agent research and verification pipelines, with a particular focus on the internals of retrieval systems — hybrid search, reranking, and evaluation methodology at scale.

<!--
NOTE: A six-stage scam/fraud-detection pipeline (media.py -> signals.py ->
profiles.py -> evidence.py -> router_rules/router_llm -> safety_gate.py),
using GPT-5.4 mini, faster-whisper ASR, and Vision OCR, with reported
100% production action accuracy and 4,347 lines of code, appears in the
portfolio site's case studies but does not have a linked repository in
the GitHub profile README. Add its section here once you share the repo
link or more detail — do not let a placeholder for it go live as-is.
-->
