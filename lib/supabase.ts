import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// טבלת leads יושבת בפרויקט ה-Supabase של insure (החלטה מ-5.7.2026).
// המפתח הוא publishable — מיועד לחשיפה בדפדפן, ולכן בטוח כברירת מחדל בקוד.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://giygjmacxquucwexmfdd.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_zODCN3ZL4_4C5WYGYQfn8A_07UF23n_";

// טבלת leads היא insert-only מהדפדפן (ראו supabase/schema.sql).
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
