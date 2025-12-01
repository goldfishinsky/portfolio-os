-- Create feeds table
create table public.feeds (
  id uuid default gen_random_uuid() primary key,
  url text not null unique,
  title text not null,
  icon text,
  category text default 'General',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create read_items table to track read history
create table public.read_items (
  id uuid default gen_random_uuid() primary key,
  url text not null unique,
  feed_id uuid references public.feeds(id) on delete cascade,
  read_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.feeds enable row level security;
alter table public.read_items enable row level security;

-- Create policies (Allow all for now, or restrict to authenticated user if auth is enabled)
-- For this personal OS, we'll assume public access or simple auth. 
-- Adjust these policies if you have authentication set up.

create policy "Enable read access for all users" on public.feeds for select using (true);
create policy "Enable insert access for all users" on public.feeds for insert with check (true);
create policy "Enable update access for all users" on public.feeds for update using (true);
create policy "Enable delete access for all users" on public.feeds for delete using (true);

create policy "Enable read access for all users" on public.read_items for select using (true);
create policy "Enable insert access for all users" on public.read_items for insert with check (true);
create policy "Enable update access for all users" on public.read_items for update using (true);
create policy "Enable delete access for all users" on public.read_items for delete using (true);
