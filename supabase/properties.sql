-- טבלת נכסים למכירה בזירת ויאז'ה. להריץ ב-SQL Editor של אותו פרויקט Supabase
-- שבו כבר יושבת טבלת leads (giygjmacxquucwexmfdd, המשותף עם insure.co.il).

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  street text not null,
  rooms text,
  size_sqm numeric,
  status text not null default 'active' check (status in ('active', 'sold', 'hidden')),
  created_at timestamptz not null default now()
);

alter table properties enable row level security;

-- כתובת העיר והרחוב כבר מוצגות פומבית בכרטיס הנכס, ולכן קריאה פתוחה לכולם.
-- הוספה ועדכון סטטוס נעשים רק מהאדמין, עם מפתח שירות שעוקף RLS.
create policy "public read" on properties
  for select using (true);
