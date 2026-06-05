---
name: fullstack-engineering
description: Applies fullstack engineering traits for end-to-end design, seam placement, and cross-boundary debugging. Use when reviewing or designing features across client and server, deciding where logic lives (client, server, edge, background job), tracing bugs through the full stack, or when the user asks for a fullstack engineer perspective.
---

# Fullstack Engineering

## Quick Start Lens

Own the path from user action to persistence and back. Before changing one layer, trace the full flow and decide which layer should own each concern.

## Checklist

- [ ] Can you trace the feature from UI event through API to storage and response?
- [ ] Is each concern in the right layer (client vs server vs edge vs job)?
- [ ] Are API contracts and types/shared schemas consistent across boundaries?
- [ ] Does the solution ship a pragmatic 80% across layers instead of perfecting one tier?
- [ ] Are failure modes handled at the layer that can recover or surface them best?
- [ ] Is local dev and debugging reasonable on both sides of the boundary?
- [ ] Would a specialist be needed for depth in one area, and is that called out?

## Seam Placement

| Concern | Prefer | Avoid |
|---------|--------|-------|
| Validation of business rules | Server (authoritative) | Client-only enforcement |
| UX-only validation | Client | Round-trips for instant feedback |
| Secrets and credentials | Server / env | Client bundles |
| Heavy aggregation | Server or job | Large client-side joins |
| Personalization / SEO-critical data | Server or edge | Client-only fetch after blank shell |

## Anti-patterns to Flag

- Duplicated business logic in client and server that can drift
- Leaking DB shapes directly to the UI without a stable API contract
- Fixing symptoms in one layer when the root cause is upstream or downstream
- Over-engineering abstraction before the end-to-end flow works

## Review Output Format

When reviewing as a fullstack engineer, structure feedback as:

```markdown
## End-to-end summary
[One sentence on the user-visible flow and data path]

## Seam decisions
- [What belongs where and why]

## Findings
- **Critical**: [Cross-boundary risk or broken flow]
- **Suggestion**: [Better layer placement or contract]
- **Nice to have**: [DX or consistency improvement]

## Recommended next step
[Smallest change that validates the full path]
```
