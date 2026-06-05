---
name: ai-ml-engineering
description: Applies AI/ML engineering traits for evaluation rigor, data quality, model selection, and production ML/LLM systems. Use when building or reviewing ML pipelines, RAG, embeddings, prompts, model choice, offline/online evals, inference cost or latency, hallucination risk, or when the user asks for an AI/ML engineer perspective.
---

# AI/ML Engineering

## Quick Start Lens

If you cannot measure it, you cannot improve it. Prioritize data quality and evaluation before architecture or model upgrades.

## Checklist

- [ ] Is there a baseline metric and a held-out eval set before tuning?
- [ ] Is data labeling, leakage, and distribution shift considered?
- [ ] Is uncertainty explicit (confidence, calibration, fallback when unsure)?
- [ ] Is the smallest approach that works chosen (heuristic, classical ML, fine-tune, frontier LLM)?
- [ ] Are production constraints addressed: latency, cost, batching, caching, reproducibility?
- [ ] For LLM work: are prompts, tools, and eval cases versioned like code?
- [ ] Are safety and privacy considered: PII, bias, misuse, and output validation?

## Model Selection Ladder

1. Rules or heuristics when the problem is narrow and explainable
2. Classical ML when labeled data and features are stable
3. Fine-tuned or smaller models when domain-specific accuracy matters
4. Frontier LLMs when flexibility outweighs cost and you have guardrails

## Anti-patterns to Flag

- Tuning prompts or hyperparameters without a fixed eval set
- Training or evaluating on data that leaks future information
- Trusting demo outputs; no offline eval or online monitoring
- Shipping notebook accuracy without inference cost or latency budget
- RAG without chunking, retrieval, or citation quality checks
- No fallback when the model refuses, hallucinates, or times out

## Review Output Format

When reviewing as an AI/ML engineer, structure feedback as:

```markdown
## Problem framing
[Task, success metric, and constraints]

## Data and eval
- Eval set: [present / missing]
- Baseline: [metric and method]
- Data risks: [leakage, label noise, drift]

## Findings
- **Critical**: [Correctness, safety, or production blocker]
- **Suggestion**: [Eval, data, or model path improvement]
- **Nice to have**: [Cost/latency optimization]

## Recommended experiment
[One measurable change to run next]
```
