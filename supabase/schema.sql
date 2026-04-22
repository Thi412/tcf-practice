-- ============================================================
-- TCF Practice — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TOPICS
-- ============================================================
create table topics (
  id uuid primary key default gen_random_uuid(),
  task_type text not null check (task_type in ('tache2', 'tache3')),
  question text not null,
  theme text not null,
  difficulty text not null default 'B1' check (difficulty in ('B1', 'B2')),
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create index idx_topics_task_type on topics(task_type);
create index idx_topics_active on topics(is_active);

-- ============================================================
-- IDEAS BANK
-- ============================================================
create table ideas_bank (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  idea text not null,
  ready_sentence text not null,
  position text not null check (position in ('pour', 'contre', 'neutral')),
  sample_opinion text,
  created_at timestamptz default now()
);

create index idx_ideas_topic on ideas_bank(topic_id);
create index idx_ideas_position on ideas_bank(position);

-- ============================================================
-- TEMPLATES
-- ============================================================
create table templates (
  id uuid primary key default gen_random_uuid(),
  task_type text not null check (task_type in ('tache2', 'tache3')),
  title text not null,
  content text not null,
  order_index int not null default 0,
  created_at timestamptz default now()
);

create index idx_templates_task_type on templates(task_type);

-- ============================================================
-- AI CACHE
-- ============================================================
create table cache_ai (
  id uuid primary key default gen_random_uuid(),
  input_hash text not null unique,
  input_text text,
  output text not null,
  hit_count int default 0,
  created_at timestamptz default now(),
  last_used_at timestamptz default now()
);

create index idx_cache_hash on cache_ai(input_hash);

-- ============================================================
-- USAGE TRACKING
-- ============================================================
create table usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  action text not null check (action in ('feedback', 'upgrade')),
  date date not null,
  count int not null default 0,
  created_at timestamptz default now(),
  unique(user_id, action, date)
);

create index idx_usage_user_date on usage_tracking(user_id, date);

-- ============================================================
-- ROW LEVEL SECURITY
-- (Service role key bypasses RLS for API routes)
-- ============================================================

alter table topics enable row level security;
alter table ideas_bank enable row level security;
alter table templates enable row level security;
alter table cache_ai enable row level security;
alter table usage_tracking enable row level security;

-- Public read on topics, ideas, templates
create policy "Public read topics" on topics for select using (true);
create policy "Public read ideas" on ideas_bank for select using (true);
create policy "Public read templates" on templates for select using (true);

-- Cache: service role only (via API)
create policy "Service role cache" on cache_ai
  for all using (auth.role() = 'service_role');

-- Usage: service role only (via API)
create policy "Service role usage" on usage_tracking
  for all using (auth.role() = 'service_role');
