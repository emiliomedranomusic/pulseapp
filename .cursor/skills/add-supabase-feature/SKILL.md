---
name: add-supabase-feature
description: Use when adding any data-backed feature. Walks through the migration, RLS policy, TypeScript types, a typed query helper, and wiring to the UI — in the correct order.
---

# Add a Supabase-backed feature

## When to use
- Any time you add/change a table, column, or query, or write Supabase reads/writes.

## Steps (in order)
1. **Migration**: SQL in `/supabase/migrations/<timestamp>_<name>.sql`. Always `id uuid primary key default gen_random_uuid()` and `created_at timestamptz default now()`.
2. **RLS**: Enable RLS. Policies scoped to the anonymous user: `auth.uid() = id` (profiles) or `auth.uid() = profile_id` (owned tables), with separate select/insert/update policies.
3. **Types**: Add/update the interface in `/lib/types.ts`, field names identical to columns.
4. **Query helper**: Typed function in `/lib/db.ts` (e.g. `getTodayCheckin()`, `upsertProfile()`). Components NEVER call the Supabase client directly — only via these helpers.
5. **Wire UI**: Call the helper, show a loading state, handle the error case. No dangling promises.
6. **Verify**: `next build` passes and the feature works against the live project.