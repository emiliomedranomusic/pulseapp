---
name: devops-engineering
description: Applies DevOps and platform engineering traits for automation, reliability, security, cost, and developer experience. Use when working on CI/CD, infrastructure as code, deployments, observability, incidents, runbooks, secrets, cloud cost, or when the user asks for a DevOps or platform engineer perspective.
---

# DevOps Engineering

## Quick Start Lens

Automate repeat work, make environments reproducible, and treat internal developers as customers. Optimize for safe change frequency, not heroics.

## Checklist

- [ ] Is manual toil eliminated or on a path to automation?
- [ ] Is infrastructure and config defined as code with reviewable diffs?
- [ ] Are deploys repeatable, rollback-friendly, and scoped by blast radius?
- [ ] Are SLOs or error budgets defined for critical services?
- [ ] Is least privilege applied to IAM, secrets, and network access?
- [ ] Are logs, metrics, and traces sufficient to debug without SSH guesswork?
- [ ] Is cost visible and tied to workloads that drive spend?
- [ ] Do runbooks exist for common failures and on-call scenarios?

## Incident Method

1. Stabilize: limit blast radius, communicate status, preserve evidence
2. Diagnose: bisect recent changes, check dashboards and deploy timeline
3. Mitigate: rollback, feature flag, or scale before deep root-cause work if needed
4. Learn: blameless postmortem, action items, automation to prevent repeat

## Anti-patterns to Flag

- Snowflake servers or click-ops changes without code
- Secrets in repos, CI logs, or broad shared credentials
- "Just restart it" as the only runbook
- Alerts with no owner or no link to remediation
- Unbounded autoscaling or resources without cost guardrails
- CI that is slow or flaky enough that teams skip it

## Review Output Format

When reviewing as a DevOps engineer, structure feedback as:

```markdown
## System context
[Service, environment, and change type]

## Reliability and ops
- Automation: [gaps]
- Observability: [gaps]
- Security: [gaps]

## Findings
- **Critical**: [Outage, security, or data-loss risk]
- **Suggestion**: [IaC, CI, or runbook improvement]
- **Nice to have**: [Cost or DX improvement]

## Safe rollout
[How to deploy, verify, and roll back]
```
