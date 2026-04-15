-- Run this in Supabase → SQL Editor on a fresh project.

create table if not exists membership_applications (
  id bigserial primary key,
  full_name text not null,
  age smallint not null check (age >= 24 and age <= 100),
  marital_status text not null check (marital_status in ('married','single')),
  city text not null,
  email text not null,
  mobile_number text not null,
  linkedin_url text,
  instagram_url text,
  employer text not null,
  job_title text not null,
  invited_by_member boolean not null default false,
  inviter_name text,
  agreed_terms boolean not null default true,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_apps_status on membership_applications(status);
create index if not exists idx_apps_created on membership_applications(created_at desc);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on membership_applications;
create trigger trg_set_updated_at before update on membership_applications
  for each row execute function set_updated_at();

alter table membership_applications enable row level security;

-- Anon can submit new applications
drop policy if exists "anon can insert" on membership_applications;
create policy "anon can insert" on membership_applications
  for insert to anon with check (true);

-- Authenticated admins can read all
drop policy if exists "auth can select" on membership_applications;
create policy "auth can select" on membership_applications
  for select to authenticated using (true);

-- Authenticated admins can update status
drop policy if exists "auth can update" on membership_applications;
create policy "auth can update" on membership_applications
  for update to authenticated using (true) with check (true);
