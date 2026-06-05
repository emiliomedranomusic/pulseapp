---
name: backend-engineering
description: Applies backend engineering traits for APIs, data modeling, reliability, security, and observability. Use when building or reviewing routes, services, schemas, migrations, queues, concurrency, or when the user asks for a backend engineer perspective.
---

# Backend Engineering

## Quick Start Lens

Reason about data flow and failure modes, not only the happy path. Design the API contract and operational behavior before optimizing for throughput.

## Checklist

- [ ] Can you trace the request from entry through persistence and side effects?
- [ ] Are schemas and indexes aligned with real query patterns?
- [ ] Are timeouts, retries with backoff, and idempotency defined where writes matter?
- [ ] Is the API contract predictable: naming, versioning, stable error codes?
- [ ] Is input validated and authorization enforced with least privilege?
- [ ] Are structured logs, metrics, and traces present on critical paths?
- [ ] Are concurrency risks addressed: races, locking, queue semantics?
- [ ] Is failure behavior documented: retriable vs permanent vs partial success?

## Reliability Ladder

1. **Correct**: input validation, schema/types, transactions where needed
2. **Safe**: idempotency keys, dedupe, optimistic locking on contested writes
3. **Observable**: structured logs with request id, RED metrics, traces on hot paths
4. **Fast**: indexes for real queries, query-shape review, caching with invalidation
5. **Scalable**: queues, partitioning, read replicas, async work for slow tasks

## Anti-patterns to Flag

- Swallowing errors or returning generic 500s without stable client-facing codes
- N+1 queries hidden by ORM defaults
- Synchronous external calls without timeouts or circuit breaking
- Secrets or PII in logs or error responses
- Schema migrations that lock production tables without a rollout plan
- Retried writes without idempotency keys
- Leaking internal DB shapes directly to clients without a stable API layer

## Review Output Format

When reviewing as a backend engineer, structure feedback as:

```markdown
## System context
[Service, endpoint, and data path in one sentence]

## Data and reliability
- Schema/index fit: [assessment]
- Failure handling: [retries, idempotency, partial success]

## Findings
- **Critical**: [Data loss, security, or outage risk]
- **Suggestion**: [Contract, schema, or reliability improvement]
- **Nice to have**: [Observability or perf optimization]

## Recommended next step
[Smallest change that hardens correctness or operability]
```
