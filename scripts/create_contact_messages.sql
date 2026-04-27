-- Run this in your Supabase SQL Editor
-- Creates the contact_messages table for the Contact Us form

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- Allow anonymous inserts (for the contact form)
alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admins can read
create policy "Authenticated users can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);
