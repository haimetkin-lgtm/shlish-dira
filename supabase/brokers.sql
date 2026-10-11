-- כלי מתווכים לפרסום נכסי ויאז'ה. להריץ ב-SQL Editor של פרויקט Supabase
-- giygjmacxquucwexmfdd (המשותף עם insure.co.il), אחרי properties.sql.
-- בטוח להרצה חוזרת.

-- 1. פרופיל מתווך (מקושר למשתמש של Supabase Auth)
create table if not exists brokers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  license_number text not null,
  email text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table brokers enable row level security;

drop policy if exists "broker reads own profile" on brokers;
create policy "broker reads own profile" on brokers
  for select to authenticated using (id = auth.uid());

-- המתווך יכול ליצור רק פרופיל של עצמו, ולא מאומת (האימות רק מהאדמין).
drop policy if exists "broker creates own profile" on brokers;
create policy "broker creates own profile" on brokers
  for insert to authenticated
  with check (
    id = auth.uid()
    and verified = false
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

grant select, insert on brokers to authenticated;

-- 2. עמודות חדשות בנכסים: מי פרסם, וסוג המכירה
alter table properties add column if not exists broker_id uuid references brokers(id) on delete set null;
alter table properties add column if not exists sale_type text not null default 'partial';

alter table properties drop constraint if exists properties_sale_type_check;
alter table properties add constraint properties_sale_type_check
  check (sale_type in ('partial', 'whole_occupied'));

-- סטטוסים חדשים: pending (ממתין לאישור מקדים), rejected (נדחה)
alter table properties drop constraint if exists properties_status_check;
alter table properties add constraint properties_status_check
  check (status in ('active', 'sold', 'hidden', 'pending', 'rejected'));

create index if not exists properties_broker_idx on properties (broker_id);

-- 3. הרשאות נכסים
-- הציבור רואה רק נכסים שאושרו (פעיל / נמכר). ממתינים ונדחים אינם נקראים מבחוץ.
drop policy if exists "public read" on properties;
drop policy if exists "public read visible" on properties;
create policy "public read visible" on properties
  for select using (status in ('active', 'sold'));

drop policy if exists "broker reads own listings" on properties;
create policy "broker reads own listings" on properties
  for select to authenticated using (broker_id = auth.uid());

-- מתווך מגיש נכס רק במצב "ממתין", על שמו, ועד 10 ממתינים בו זמנית (נגד הצפה).
drop policy if exists "broker submits pending listing" on properties;
create policy "broker submits pending listing" on properties
  for insert to authenticated
  with check (
    broker_id = auth.uid()
    and status = 'pending'
    and (select count(*) from properties p where p.broker_id = auth.uid() and p.status = 'pending') < 10
  );

-- מתווך יכול רק להוריד נכס פעיל שלו (נמכר / הסרה). לא להפעיל, לא לשנות תוכן.
drop policy if exists "broker takes down own active listing" on properties;
create policy "broker takes down own active listing" on properties
  for update to authenticated
  using (broker_id = auth.uid() and status = 'active')
  with check (broker_id = auth.uid() and status in ('sold', 'hidden'));

revoke update on properties from authenticated;
grant update (status) on properties to authenticated;
grant select, insert on properties to authenticated;

-- 4. פרטי הקשר: המתווך רואה ומוסיף רק לנכסים שלו, ועורך רק בזמן שממתין לאישור.
drop policy if exists "broker reads own contacts" on property_contacts;
create policy "broker reads own contacts" on property_contacts
  for select to authenticated
  using (exists (
    select 1 from properties p
    where p.id = property_contacts.property_id and p.broker_id = auth.uid()
  ));

drop policy if exists "broker adds contacts to pending listing" on property_contacts;
create policy "broker adds contacts to pending listing" on property_contacts
  for insert to authenticated
  with check (exists (
    select 1 from properties p
    where p.id = property_contacts.property_id and p.broker_id = auth.uid() and p.status = 'pending'
  ));

drop policy if exists "broker edits contacts of pending listing" on property_contacts;
create policy "broker edits contacts of pending listing" on property_contacts
  for update to authenticated
  using (exists (
    select 1 from properties p
    where p.id = property_contacts.property_id and p.broker_id = auth.uid() and p.status = 'pending'
  ))
  with check (exists (
    select 1 from properties p
    where p.id = property_contacts.property_id and p.broker_id = auth.uid() and p.status = 'pending'
  ));

grant select, insert, update on property_contacts to authenticated;
