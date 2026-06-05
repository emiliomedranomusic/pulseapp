-- Pulse: profiles and checkins with RLS for anonymous auth

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  pet_name text not null default 'Pulse',
  birthdate date,
  streak int not null default 0,
  longest_streak int not null default 0,
  last_checkin_date date,
  created_at timestamptz not null default now()
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  check_date date not null default (current_date),
  start_mood text,
  start_mood_score int,
  suggested_activity text,
  completed boolean not null default false,
  end_mood text,
  end_mood_score int,
  created_at timestamptz not null default now(),
  unique (profile_id, check_date)
);

alter table profiles enable row level security;
alter table checkins enable row level security;

create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

create policy "checkins_select_own"
  on checkins for select
  using (auth.uid() = profile_id);

create policy "checkins_insert_own"
  on checkins for insert
  with check (auth.uid() = profile_id);

create policy "checkins_update_own"
  on checkins for update
  using (auth.uid() = profile_id);
