---jobs
create type job_status as enum(
  'created',
  'uploading',
  'processing',
  'completed',
  'failed'
);

create table public.jobs(
  id uuid primary key default  gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id),
  status job_status default 'created',
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "User can manage own jobs"
on public.jobs
for all
using(auth.uid() = user_id)
with check (auth.uid() = user_id);

