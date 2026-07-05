-- זירת שליש דירה: טבלת לידים אחת, insert-only מהדפדפן.
-- להריץ ב-SQL Editor של Supabase.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('seller', 'buyer', 'lawyer')),
  details jsonb not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- הדפדפן (anon key) רשאי רק להוסיף. אין SELECT/UPDATE/DELETE לציבור.
-- קריאת הלידים נעשית רק מהדשבורד של Supabase או עם service key.
create policy "public insert" on leads
  for insert with check (true);
