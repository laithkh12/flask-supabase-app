-- Run this in the Supabase SQL Editor to create the items table.

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

-- Allow public read/write for demo purposes. Tighten these policies for production.
create policy "Allow public read" on public.items
  for select using (true);

create policy "Allow public insert" on public.items
  for insert with check (true);

create policy "Allow public delete" on public.items
  for delete using (true);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Allow public read" on public.categories
  for select using (true);

create policy "Allow public insert" on public.categories
  for insert with check (true);

create policy "Allow public delete" on public.categories
  for delete using (true);
