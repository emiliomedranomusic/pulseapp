# Systems Design PRD

**Project Name:**
**Author:**
**Date:**
**Status:** Draft | In Review | Approved
**Version:** 1.0

---

## 1. Problem Statement

What problem does this system solve? Who experiences it, and what happens if we don't build this?

**Problem:**

**Who is affected:**

**Current workaround (if any):**

**Cost of inaction:**

---

## 2. Goals and Non-Goals

### Goals
What does success look like? Be specific and measurable.

1.
2.
3.

### Non-Goals
What are we explicitly NOT trying to solve with this system?

1.
2.
3.

---

## 3. Users and Personas

Who interacts with this system? What are their roles, technical skill levels, and primary needs?

| Persona | Role | Key Need | Frequency of Use |
|---------|------|----------|------------------|
|         |      |          |                  |
|         |      |          |                  |

---

## 4. Functional Requirements

What must the system do? List capabilities in priority order.

### P0 (Must Have)

-
-

### P1 (Should Have)

-
-

### P2 (Nice to Have)

-
-

---

## 5. System Architecture

### High-Level Overview
Describe the major components and how they interact. Include a diagram if possible.

**Architecture style:** (monolith, microservices, serverless, event-driven, etc.)

**Key components:**

| Component | Responsibility | Technology |
|-----------|---------------|------------|
|           |               |            |
|           |               |            |

### Data Flow
How does data move through the system? Describe the primary read and write paths.

**Write path:**

**Read path:**

### External Dependencies
What third-party services, APIs, or systems does this depend on?

| Dependency | Purpose | Fallback if Unavailable |
|------------|---------|------------------------|
|            |         |                        |
|            |         |                        |

---

## 6. Data Model

### Core Entities
What are the primary data objects? What are their relationships?

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
|        |           |               |
|        |           |               |

### Storage
Where does data live?

**Primary datastore:** (PostgreSQL, MongoDB, DynamoDB, etc.)
**Why this choice:**
**Caching layer:** (Redis, in-memory, CDN, none)
**File/blob storage:** (S3, Supabase Storage, none)

### Data Lifecycle
How long is data retained? Are there archival or deletion requirements?

---

## 7. API Design

### Key Endpoints / Interfaces
What are the primary interfaces other systems or users interact with?

| Method | Endpoint / Event | Purpose | Auth Required |
|--------|-----------------|---------|---------------|
|        |                 |         |               |
|        |                 |         |               |

### API Style
REST, GraphQL, gRPC, WebSocket, event bus, or a mix?

**Choice:**
**Rationale:**

---

## 8. Authentication and Authorization

**Auth provider:** (Supabase Auth, Auth0, Clerk, custom, etc.)
**Auth method:** (JWT cookies, bearer tokens, API keys, OAuth, etc.)
**Session management:** (cookie-based SSR, client tokens, etc.)

### Authorization Model
How are permissions enforced? (RBAC, ABAC, RLS, per-resource ownership, etc.)

| Role / Actor | Can Do | Cannot Do |
|-------------|--------|-----------|
|             |        |           |
|             |        |           |

### Key Questions
- Does the system need multi-tenancy?
- Are there admin vs. end-user permission boundaries?
- Is row-level security sufficient or do we need application-level checks?

---

## 9. Scalability and Performance

### Expected Load

| Metric | Current | 6-Month Target | Ceiling |
|--------|---------|----------------|---------|
| DAU    |         |                |         |
| Requests/sec (peak) | | |         |
| Data volume |     |                |         |

### Performance Targets

| Operation | Target Latency | Acceptable Ceiling |
|-----------|---------------|--------------------|
|           |               |                    |
|           |               |                    |

### Scaling Strategy
How does the system handle growth? (horizontal scaling, read replicas, queue-based backpressure, CDN, etc.)

---

## 10. Reliability and Error Handling

**Uptime target:** (99.9%, best-effort, etc.)

### Failure Modes
What can go wrong, and what happens when it does?

| Failure Scenario | Impact | Mitigation |
|-----------------|--------|------------|
|                 |        |            |
|                 |        |            |

### Retry and Recovery
- Are operations idempotent?
- What is the retry strategy for failed jobs/requests?
- Is there a dead-letter queue or manual recovery path?

---

## 11. Observability

**Logging:** (where do logs go, what gets logged)
**Monitoring:** (uptime checks, dashboards, alerting)
**Error tracking:** (Sentry, LogRocket, custom)

### Key Metrics to Track

-
-
-

### Alerting Rules

| Condition | Severity | Notification Channel |
|-----------|----------|---------------------|
|           |          |                     |
|           |          |                     |

---

## 12. Security Considerations

- How is sensitive data encrypted (at rest, in transit)?
- Are there PII or compliance requirements (HIPAA, SOC2, GDPR)?
- What is the attack surface and how is it hardened?
- How are secrets managed? (env vars, vault, etc.)
- Is there rate limiting or abuse prevention?

---

## 13. Cost Estimate

| Resource | Provider | Estimated Monthly Cost | Notes |
|----------|----------|----------------------|-------|
|          |          |                      |       |
|          |          |                      |       |

**Total estimated monthly cost:**
**Cost scaling trigger:** (at what usage does cost jump significantly?)

---

## 14. Migration and Rollout Plan

### Migration Strategy
If replacing an existing system, how does data and traffic migrate?

**Approach:** (big bang, gradual cutover, dual-write, feature flag, etc.)

### Rollout Phases

| Phase | Scope | Success Criteria | Rollback Plan |
|-------|-------|-----------------|---------------|
|       |       |                 |               |
|       |       |                 |               |

---

## 15. Open Questions

Unresolved decisions, unknowns, or items needing input from other stakeholders.

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 |          |       |        |
| 2 |          |       |        |
| 3 |          |       |        |

---

## 16. References

- Link to related docs, prior art, architecture diagrams, or research.
-
-

---

*Template version 1.0. Adapt sections to fit the complexity of the system being designed. Not every section applies to every project -- delete what's irrelevant, expand what matters.*
