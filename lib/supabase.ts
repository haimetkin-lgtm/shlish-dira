import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ללא Auth: טבלת leads היא insert-only (ראו supabase/schema.sql).
// כשהמשתנים לא מוגדרים האתר עולה, והטפסים מציגים הודעה מסודרת.
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
