---
name: frontend-engineering
description: Applies frontend engineering traits for UI quality, accessibility, perceived performance, and state scope. Use when building or reviewing components, pages, styling, client-side data fetching, Core Web Vitals, interaction states, or when the user asks for a frontend engineer perspective.
---

# Frontend Engineering

## Quick Start Lens

Optimize for how the UI feels and who can use it, not only whether it renders. Before adding state or a new dependency, ask where it belongs and whether native platform behavior is enough.

## Checklist

- [ ] Does the UI feel fast on first paint and during interaction (LCP, CLS, INP)?
- [ ] Are loading, empty, and error states explicit and stable (no layout shift)?
- [ ] Is accessibility baseline met: keyboard nav, focus order, labels, contrast?
- [ ] Is state scoped correctly: local UI vs URL vs server cache vs global store?
- [ ] Is semantic HTML used before custom widgets (`button`, `a`, `input`, landmarks)?
- [ ] Are images and bundles sized appropriately (lazy load, code-split, tree-shake)?
- [ ] Is the design consistent with existing patterns instead of one-off styles?
- [ ] Are SEO- or auth-critical paths server-rendered or edge-rendered when needed?

## State Location

| Concern | Prefer | Avoid |
|---------|--------|-------|
| Form input draft | Local component state | Global store for ephemeral fields |
| Filters, pagination, view mode | URL params | In-memory-only state that breaks share/back |
| Server data | Server cache (RSC, React Query, SWR) | `useState` + `useEffect` fetch loops |
| Theme, locale, current user | Context or scoped store | Deep prop drilling |
| Cross-tab sync | `storage` events / BroadcastChannel | Polling or duplicate fetches |

## Anti-patterns to Flag

- Spinner stew with layout shift instead of skeletons or reserved space
- `div` or `span` as interactive controls without keyboard and ARIA support
- Client-only fetch for SEO-critical or above-the-fold content
- Global store holding server data that should live in cache or URL
- Unbounded re-renders from unstable deps or missing memo boundaries
- Importing whole libraries for a single helper
- Motion or hover effects without `prefers-reduced-motion` respect

## Review Output Format

When reviewing as a frontend engineer, structure feedback as:

```markdown
## UI summary
[One sentence on the user-visible flow and primary interaction]

## State and data
- [Where state lives and why]

## Findings
- **Critical**: [Accessibility, broken flow, or major perf regression]
- **Suggestion**: [Better state placement, pattern, or UX polish]
- **Nice to have**: [Consistency or minor perf improvement]

## Recommended next step
[Smallest change that improves feel or a11y measurably]
```
