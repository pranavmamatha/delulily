--templates

create table public.templates(
  id uuid primary key default gen_random_uuid(),
  name text,
  prompt text,
  created_at timestamptz default now()
);
