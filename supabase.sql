-- Jalankan di Supabase SQL Editor
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  whatsapp text not null,
  email text,
  created_at timestamptz default now()
);
create table if not exists public.answers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
alter table public.answers enable row level security;
create policy "users read own profile" on public.profiles for select using (auth.uid()=id);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid()=id);
create policy "users update own profile" on public.profiles for update using (auth.uid()=id);
create policy "users read own answers" on public.answers for select using (auth.uid()=user_id);
create policy "users insert own answers" on public.answers for insert with check (auth.uid()=user_id);
create policy "users update own answers" on public.answers for update using (auth.uid()=user_id);

-- ADMIN CRM: tambahkan email admin secara manual setelah akun dibuat.
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public
stable as $$
  select exists (select 1 from public.admin_users a where lower(a.email)=lower(coalesce(auth.jwt()->>'email','')));
$$;

create policy "admins read all profiles" on public.profiles for select using (public.is_admin() or auth.uid()=id);
create policy "admins read all answers" on public.answers for select using (public.is_admin() or auth.uid()=user_id);

-- Setelah membuat akun admin di Supabase Auth, jalankan:
-- insert into public.admin_users(email) values ('email-admin-anda@example.com');
