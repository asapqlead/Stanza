-- supabase/migrations/0001_init.sql

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Urgency enum
create type urgency_level as enum ('Low', 'Medium', 'High', 'Blocked');

-- User profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 80),
  description text check (char_length(description) <= 500),
  urgency urgency_level not null default 'Medium',
  due_date date not null default current_date,
  due_time time,
  completed boolean not null default false,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Assignees (join table)
create table public.task_assignees (
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key (task_id, user_id)
);

-- Attachment metadata
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes integer not null,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_tasks_user_date on public.tasks (user_id, due_date);
create index idx_tasks_sort on public.tasks (due_date, sort_order);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignees enable row level security;
alter table public.attachments enable row level security;

-- Profiles: anyone can read; only owner can update
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Tasks: full CRUD for owner only
create policy "tasks_select" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update" on public.tasks for update using (auth.uid() = user_id);
create policy "tasks_delete" on public.tasks for delete using (auth.uid() = user_id);

-- Assignees: task owner or assigned user can see
create policy "assignees_select" on public.task_assignees for select
  using (auth.uid() = user_id or
    auth.uid() in (select user_id from public.tasks where id = task_id));

-- Attachments: only task owner
create policy "attachments_select" on public.attachments for select
  using (auth.uid() in (select user_id from public.tasks where id = task_id));
create policy "attachments_delete" on public.attachments for delete
  using (auth.uid() in (select user_id from public.tasks where id = task_id));

-- Auto-create profile on user sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
