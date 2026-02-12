-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Posts Table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text, -- Markdown or HTML
  thumbnail_url text, -- For showing in grid
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Applications Table (Survival Package)
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  contact text not null, -- Email or Phone
  reason text,
  status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;
alter table public.applications enable row level security;

-- Policies for Posts
create policy "Public posts are viewable by everyone."
  on public.posts for select
  using ( published = true );

create policy "Service role can insert posts."
  on public.posts for insert
  with check ( true ); -- Service role bypasses RLS, but good to have explicit policy if needed

-- Policies for Applications
create policy "Anyone can submit application."
  on public.applications for insert
  with check ( true );

create policy "Only service role can view applications."
  on public.applications for select
  using ( false ); -- Default deny for public
