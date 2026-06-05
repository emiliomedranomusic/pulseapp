---
name: engineer-traits-as-rules-and-skills
overview: "Refactor the five engineer-trait write-ups into a hybrid set of Cursor artifacts: two file-glob-scoped rules (frontend, backend) plus three on-demand skills (fullstack, AI/ML, DevOps), all stored in this project's `.cursor/` folder."
todos:
  - id: rule-craft
    content: "Create .cursor/rules/engineering-craft.mdc (alwaysApply: true) with universal cross-role traits, ~15-20 lines"
    status: completed
  - id: rule-frontend
    content: Create .cursor/rules/frontend-engineering.mdc scoped to UI file globs, ~40 lines of imperative traits
    status: completed
  - id: rule-backend
    content: Create .cursor/rules/backend-engineering.mdc scoped to server/API/DB globs, ~40 lines of imperative traits
    status: completed
  - id: skill-fullstack
    content: Create .cursor/skills/fullstack-engineering/SKILL.md with end-to-end lens, checklist, and review output format
    status: completed
  - id: skill-aiml
    content: Create .cursor/skills/ai-ml-engineering/SKILL.md with eval-first lens, ML/LLM checklist, and anti-patterns
    status: completed
  - id: skill-devops
    content: Create .cursor/skills/devops-engineering/SKILL.md with platform/SRE lens, checklist, and incident-aware output format
    status: completed
  - id: verify
    content: Verify each rule is under 50 lines, each SKILL.md under 500 lines, frontmatter valid, no emojis, descriptions are third-person with WHAT+WHEN
    status: completed
isProject: false
---

## Prompt

#1 - What are great traits of a frontend engineer, backend engineer, fullstack engineer, AI/ML engineer and. DevOps engineer?

#2 - I want to refactor these into cursor rules, and cursor skills

## Goal

Convert the previously discussed engineer-trait guidance into reusable Cursor artifacts in this repo, split as a **hybrid**:

- **Rules** (auto-attached by file glob) for roles with clear file boundaries.
- **Skills** (on-demand, named workflows) for cross-cutting roles where there isn't a natural file glob.

All artifacts live under `.cursor/` in this project so they're committed and shared.

## Mapping

- Frontend engineering -> rule (`.cursor/rules/frontend-engineering.mdc`), glob-scoped to UI files.
- Backend engineering -> rule (`.cursor/rules/backend-engineering.mdc`), glob-scoped to server/API/DB files.
- Fullstack engineering -> skill (`.cursor/skills/fullstack-engineering/SKILL.md`), invoked on cross-stack work.
- AI/ML engineering -> skill (`.cursor/skills/ai-ml-engineering/SKILL.md`), invoked on ML/LLM/RAG work.
- DevOps / platform engineering -> skill (`.cursor/skills/devops-engineering/SKILL.md`), invoked on infra/CI/incident work.
- Universal traits (clear writing, debugging methodology, knowing when to stop, etc.) -> one small always-apply rule (`.cursor/rules/engineering-craft.mdc`).

## Files to create

```
.cursor/
├── rules/
│   ├── engineering-craft.mdc          # alwaysApply: true, universal traits
│   ├── frontend-engineering.mdc       # globs: UI files
│   └── backend-engineering.mdc        # globs: server/API/DB files
└── skills/
    ├── fullstack-engineering/SKILL.md
    ├── ai-ml-engineering/SKILL.md
    └── devops-engineering/SKILL.md
```

## Rule details

### `frontend-engineering.mdc`

- `globs: **/*.{tsx,jsx,vue,svelte,astro,css,scss,html}`
- `alwaysApply: false`
- Content: distilled frontend traits as actionable guidance (user empathy, visual taste, browser-as-runtime awareness, a11y baseline, perf at the edges, pragmatic state). Each trait rendered as a short imperative bullet with a concrete example where useful. Target ~40 lines (per the create-rule "under 50 lines" guidance).

### `backend-engineering.mdc`

- `globs: **/{api,server,backend,routes,services,handlers,controllers,models,db}/**/*.{ts,js,py,go,rs,java,rb},**/*.sql`
- `alwaysApply: false`
- Content: systems thinking, data modeling discipline, reliability (retries/idempotency/timeouts), API design contracts, security defaults, observability instincts, concurrency awareness. Same compact format as frontend rule.

### `engineering-craft.mdc`

- `alwaysApply: true`
- Content: the cross-role universal traits (clear written communication, hypothesis-driven debugging, ship the right-sized solution, code-review quality, durable curiosity). Kept very short (~15-20 lines) so it doesn't crowd the context window on every turn.

## Skill details

Each skill follows the create-skill conventions:

- `name`: lowercase, hyphenated.
- `description`: third-person, includes both WHAT (the trait set / lens) and WHEN (trigger scenarios), under 1024 chars.
- `disable-model-invocation` omitted so the agent can auto-invoke when the description matches.
- Body under 500 lines, organized as: Quick Start lens -> Checklist -> Anti-patterns to flag -> Output format when used as a reviewer.

### `fullstack-engineering/SKILL.md`

- Triggers: "review/design this end-to-end", "where should this logic live", "client vs server vs edge vs job".
- Lens: end-to-end ownership, seam-placement decisions, pragmatic generalism, shared contracts, cross-boundary debugging.

### `ai-ml-engineering/SKILL.md`

- Triggers: ML pipelines, model selection, evals, RAG, prompts, embeddings, inference cost/latency.
- Lens: evaluation rigor (build evals before tuning), data quality first, probabilistic thinking, skepticism of model output, smallest-thing-that-works model selection, production awareness (cost/latency/caching), prompt and pipeline discipline, safety/PII awareness.

### `devops-engineering/SKILL.md`

- Triggers: CI/CD, IaC, deployments, observability, incidents, on-call runbooks, secrets, cost, developer experience.
- Lens: automation-first, infra literacy, SLO/error-budget thinking, least-privilege defaults, cost as a product metric, reproducibility (everything-as-code), internal-DX as a product, calm-under-pressure incident method.

## Format conventions applied to all artifacts

- Imperative voice ("Treat the API contract as a product"), not narrative ("A great backend engineer treats...").
- Each trait rendered as a single short bullet, optionally followed by a one-line `Example:` or `Anti-pattern:` line.
- No emojis (matches user rules).
- No code comments that just narrate; example snippets only where they materially help.
- Descriptions in skill frontmatter written in third person with concrete trigger terms so auto-invocation works.

## Out of scope

- No edits to existing repo files.
- No changes to `~/.cursor/` (personal scope) per the storage choice.
- No new dependencies or runtime code.

## Open items to confirm before I implement

- The `engineering-craft.mdc` always-apply rule is my suggestion for the universal traits. If you'd rather drop it (to avoid any always-on context cost) or fold those traits into each artifact instead, say so and I'll adjust.
- The backend rule's glob list is broad but conventional. If your typical projects use different folder names (e.g. `app/`, `pkg/`, `lib/server/`), tell me and I'll tune the patterns.

