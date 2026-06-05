# Systems Design PRD (Beginner-Friendly Edition)

> **New to this?** A PRD ("Product Requirements Document") is a written plan that explains *what* you're building, *why*, and *how* it will work — before you start coding. Fill in the blanks below. You don't have to use every section: if one doesn't apply to your project, just delete it.

**Project Name:**
**Author:** (your name)
**Date:**
**Status:** Draft | In Review | Approved  *(where this doc is in its life — still writing, being reviewed, or finalized)*
**Version:** 1.0

---

## 1. Problem Statement

What problem does this system fix? Who has this problem, and what happens if we never build it?

**Problem:** (what's broken or missing right now)

**Who is affected:** (which people feel this pain)

**Current workaround (if any):** (how people cope today without your system)

**Cost of inaction:** (what we lose — money, time, users — if we do nothing)

---

## 2. Goals and Non-Goals

### Goals
What does "done and working" look like? Try to make each goal something you can measure (a number, a yes/no).

1.
2.
3.

### Non-Goals
What are we deliberately NOT trying to do here? (Listing this keeps the project from growing out of control.)

1.
2.
3.

---

## 3. Users and Personas

Who will actually use this system? A "persona" is just a short description of a type of user — their job, how tech-savvy they are, and what they most need from you.

| Persona (type of user) | Role (their job) | Key Need (what they want most) | Frequency of Use (how often) |
|------------------------|------------------|--------------------------------|------------------------------|
|                        |                  |                                |                              |
|                        |                  |                                |                              |

---

## 4. Functional Requirements

What must the system actually *do*? List the features, most important first. The P0/P1/P2 labels just rank priority.

### P0 (Must Have — it's broken without these)

-
-

### P1 (Should Have — important, but the system still works without them)

-
-

### P2 (Nice to Have — bonus features for later)

-
-

---

## 5. System Architecture

"Architecture" just means the big-picture layout: the main pieces of your system and how they connect.

### High-Level Overview
List the major parts and how they talk to each other. A simple boxes-and-arrows diagram helps a lot here.

**Architecture style:** *(How is the system organized? Common choices:*
- *monolith — one single app that does everything;*
- *microservices — many small apps that each do one job and talk to each other;*
- *serverless — code that runs on demand without you managing the servers;*
- *event-driven — pieces react to "events" (things that happened) instead of calling each other directly.)*

**Key components (the main building blocks):**

| Component (a part of the system) | Responsibility (what it's in charge of) | Technology (tool used to build it) |
|----------------------------------|------------------------------------------|-------------------------------------|
|                                  |                                          |                                     |
|                                  |                                          |                                     |

### Data Flow
How does information move through the system? Describe the two main journeys: saving new data, and reading existing data.

**Write path (saving data):** (what happens, step by step, when something is saved)

**Read path (loading data):** (what happens, step by step, when something is fetched)

### External Dependencies
What outside services or tools does your system rely on to work? (Things you didn't build yourself.)

| Dependency (outside service) | Purpose (why you use it) | Fallback if Unavailable (your plan B if it goes down) |
|------------------------------|--------------------------|--------------------------------------------------------|
|                              |                          |                                                        |
|                              |                          |                                                        |

---

## 6. Data Model

This is about the *information* your system stores and how the pieces of it relate.

### Core Entities
What are the main "things" your system keeps track of (e.g. User, Order, Message)? An "entity" is one kind of thing. "Relationships" describe how they connect (e.g. one User has many Orders).

| Entity (a thing you store) | Key Fields (its important details) | Relationships (how it links to other things) |
|----------------------------|-------------------------------------|-----------------------------------------------|
|                            |                                     |                                               |
|                            |                                     |                                               |

### Storage
Where does the data physically live?

**Primary datastore (your main database):** *(examples of common databases: PostgreSQL, MongoDB, DynamoDB)*
**Why this choice:** (what made it a good fit)
**Caching layer (optional fast-access copy to avoid slow lookups):** *(examples: Redis, in-memory, CDN, or "none")*
**File/blob storage (where you keep files like images or PDFs — "blob" just means a big file):** *(examples: S3, Supabase Storage, or "none")*

### Data Lifecycle
How long do you keep the data? Do you ever need to archive (store away) or delete it?

---

## 7. API Design

An API is the "menu" of actions other apps (or your own front-end) can ask your system to perform.

### Key Endpoints / Interfaces
What are the main entry points others will use? (An "endpoint" is a single web address that does one specific thing.)

| Method (the action type, e.g. GET to read, POST to create) | Endpoint / Event (the address or trigger) | Purpose | Auth Required (must the user be logged in?) |
|-------------------------------------------------------------|-------------------------------------------|---------|----------------------------------------------|
|                                                             |                                           |         |                                              |
|                                                             |                                           |         |                                              |

### API Style
How do these requests work under the hood? *(Common styles:*
- *REST — simple, address-based requests, the most common;*
- *GraphQL — clients ask for exactly the data they want;*
- *gRPC — fast app-to-app messaging;*
- *WebSocket — a live, two-way connection that stays open;*
- *event bus — components broadcast messages that others listen for.)*

**Choice:**
**Rationale (why you picked it):**

---

## 8. Authentication and Authorization

Two related ideas: **authentication** = proving *who* you are (logging in). **authorization** = deciding *what you're allowed* to do once you're in.

**Auth provider (the service that handles logins):** *(examples: Supabase Auth, Auth0, Clerk, or your own custom system)*
**Auth method (how a login is proven):** *(examples: JWT cookies and bearer tokens — small signed "passes" the app checks on each request; API keys — secret codes for apps; OAuth — "log in with Google/GitHub")*
**Session management (how the system remembers you stay logged in):** *(examples: cookie-based, or tokens stored in the browser)*

### Authorization Model
How do you enforce who can do what? *(Common approaches:*
- *by job role (admins can do more than regular users);*
- *by specific attributes about the user or data;*
- *letting the database itself block rows a user shouldn't see;*
- *checking that a user owns the specific item they're touching.)*

| Role / Actor (type of user) | Can Do | Cannot Do |
|------------------------------|--------|-----------|
|                              |        |           |
|                              |        |           |

### Key Questions
- Do different customers/organizations share the same system but need their data kept separate? (This is called "multi-tenancy" — many tenants in one building.)
- Are there admin users with more power than regular users?
- Is it enough to let the database block unauthorized data, or do you also need extra checks in your app's code?

---

## 9. Scalability and Performance

"Scalability" = can it keep working as more people use it? "Performance" = is it fast?

### Expected Load
How much usage do you expect? (Fill in real numbers if you can guess them.)

| Metric | Current | 6-Month Target | Ceiling (the most you could ever handle) |
|--------|---------|----------------|-------------------------------------------|
| Daily active users (people using it per day) |  |  |  |
| Requests per second at the busiest moment |  |  |  |
| Data volume (how much data stored) |  |  |  |

### Performance Targets
How fast should things feel? ("Latency" = how long an action takes to respond, usually in milliseconds.)

| Operation (an action) | Target Latency (the speed you're aiming for) | Acceptable Ceiling (the slowest you'll tolerate) |
|------------------------|-----------------------------------------------|---------------------------------------------------|
|                        |                                               |                                                   |
|                        |                                               |                                                   |

### Scaling Strategy
How will the system cope as it grows? *(Common tactics:*
- *horizontal scaling — add more servers instead of one bigger one;*
- *read replicas — extra copies of the database just for reading, to spread the load;*
- *queue-based backpressure — when work piles up, line it up and process steadily instead of crashing;*
- *CDN — a network of servers worldwide that serves files from the location nearest the user.)*

---

## 10. Reliability and Error Handling

How dependable is the system, and what happens when something breaks?

**Uptime target (how often it should be working):** *(e.g. 99.9% of the time, or just "best-effort")*

### Failure Modes
What could go wrong, and what happens when it does?

| Failure Scenario (what breaks) | Impact (who/what it hurts) | Mitigation (how you reduce the damage) |
|--------------------------------|----------------------------|-----------------------------------------|
|                                |                            |                                         |
|                                |                            |                                         |

### Retry and Recovery
- Are your operations safe to run more than once? (The fancy word is "idempotent" — running it twice causes no duplicates or harm.)
- If a task or request fails, will the system automatically try again? How many times?
- Is there a "dead-letter queue" — a holding area for jobs that keep failing so a human can look at them later — or some manual way to recover?

---

## 11. Observability

"Observability" = your ability to see what the system is doing from the outside, so you can spot and fix problems.

**Logging (records of what happened):** (where do logs go, and what gets written down?)
**Monitoring (automatic health checks):** (uptime checks, dashboards, and alerts)
**Error tracking (catching crashes):** *(examples: Sentry, LogRocket, or a custom setup)*

### Key Metrics to Track
(The important numbers to keep an eye on, e.g. error rate, response time, signups.)

-
-
-

### Alerting Rules
When should someone get pinged, and how?

| Condition (what triggers the alert) | Severity (how urgent) | Notification Channel (where it's sent, e.g. Slack, email) |
|--------------------------------------|------------------------|------------------------------------------------------------|
|                                      |                        |                                                            |
|                                      |                        |                                                            |

---

## 12. Security Considerations

- How is sensitive data scrambled so others can't read it — both while stored ("at rest") and while traveling over the internet ("in transit")?
- Do you handle personal info ("PII" = Personally Identifiable Information, like names or emails)? Are there legal rules to follow? *(e.g. HIPAA for health data, GDPR for EU privacy, SOC2 for security standards)*
- What are the ways an attacker could get in (the "attack surface"), and how do you lock those down?
- Where do you keep secrets like passwords and API keys? *(examples: environment variables, or a dedicated secret "vault" — not hard-coded in your files!)*
- Is there "rate limiting" (capping how many requests one user can make) to prevent abuse?

---

## 13. Cost Estimate

Roughly what will this cost to run each month?

| Resource (what you're paying for) | Provider (who you pay) | Estimated Monthly Cost | Notes |
|------------------------------------|------------------------|------------------------|-------|
|                                    |                        |                        |       |
|                                    |                        |                        |       |

**Total estimated monthly cost:**
**Cost scaling trigger:** (at what amount of usage does the bill jump up a lot?)

---

## 14. Migration and Rollout Plan

If you're replacing an old system, how do you switch over without breaking things? And how do you release the new one safely?

### Migration Strategy
How will existing data and users move to the new system?

**Approach:** *(Common methods:*
- *big bang — switch everything over at once;*
- *gradual cutover — move people over a bit at a time;*
- *dual-write — save to both old and new systems for a while;*
- *feature flag — a switch in the code to turn the new system on/off without redeploying.)*

### Rollout Phases
Release in stages so problems stay small.

| Phase | Scope (who/what is included) | Success Criteria (how you know it worked) | Rollback Plan (how to undo it if it fails) |
|-------|-------------------------------|--------------------------------------------|---------------------------------------------|
|       |                               |                                            |                                             |
|       |                               |                                            |                                             |

---

## 15. Open Questions

Things you haven't figured out yet, or that need a decision from someone else.

| # | Question | Owner (who will answer it) | Status |
|---|----------|-----------------------------|--------|
| 1 |          |                             |        |
| 2 |          |                             |        |
| 3 |          |                             |        |

---

## 16. References

Links to anything useful: related documents, similar projects, diagrams, or research.

-
-
-

---

*Beginner edition, template version 1.0. Adjust the sections to match how big or small your project is. Not every section fits every project — delete the ones you don't need, and add more detail to the ones that matter most.*
