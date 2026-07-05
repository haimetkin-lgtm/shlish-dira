"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Lead = {
  id: string;
  role: "seller" | "buyer" | "lawyer";
  details: Record<string, unknown>;
  status: string;
  created_at: string;
};

const ROLE_LABEL: Record<Lead["role"], string> = {
  seller: "מוכר",
  buyer: "משקיע",
  lawyer: "עו״ד",
};

const STATUSES = ["new", "contacted", "closed"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  closed: "טופל",
};

const FIELD_LABEL: Record<string, string> = {
  name: "שם",
  phone: "טלפון",
  email: "אימייל",
  city: "עיר",
  age: "גיל",
  value: "שווי דירה",
  budget: "תקציב",
  areas: "אזורים",
  firm: "משרד",
  license: "רישיון",
  represents: "מייצג",
  wantsAppraisal: "רוצה שמאות",
};

export default function AdminPage() {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
  const [key, setKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"all" | Lead["role"]>("all");
  const [error, setError] = useState("");

  const client: SupabaseClient | null = useMemo(
    () => (connected && url && key ? createClient(url, key) : null),
    [connected, url, key]
  );

  useEffect(() => {
    const savedUrl = localStorage.getItem("admin_supabase_url");
    const savedKey = localStorage.getItem("admin_supabase_key");
    if (savedUrl) setUrl(savedUrl);
    if (savedKey) {
      setKey(savedKey);
      setConnected(true);
    }
  }, []);

  useEffect(() => {
    if (!client) return;
    client
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError("שגיאה בטעינה: " + error.message);
          setConnected(false);
        } else {
          setError("");
          setLeads((data as Lead[]) || []);
        }
      });
  }, [client]);

  const connect = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_supabase_url", url);
    localStorage.setItem("admin_supabase_key", key);
    setConnected(true);
  };

  const disconnect = () => {
    localStorage.removeItem("admin_supabase_key");
    setKey("");
    setConnected(false);
    setLeads([]);
  };

  const setStatus = async (id: string, status: string) => {
    if (!client) return;
    const { error } = await client.from("leads").update({ status }).eq("id", id);
    if (!error) setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const visible = leads.filter((l) => filter === "all" || l.role === filter);
  const counts = {
    all: leads.length,
    seller: leads.filter((l) => l.role === "seller").length,
    buyer: leads.filter((l) => l.role === "buyer").length,
    lawyer: leads.filter((l) => l.role === "lawyer").length,
  };

  if (!connected) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={connect} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-md space-y-4">
          <h1 className="text-xl font-bold text-brand-800">ניהול פניות · ויאז&apos;ה ישראלית</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            הזינו את פרטי החיבור של Supabase (מתוך Settings &gt; API בפרויקט).
            המפתח נשמר בדפדפן זה בלבד ולא נשלח לשום מקום מלבד Supabase.
            השתמשו במפתח service_role, ושמרו עליו כעל סיסמה.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supabase URL</label>
            <input dir="ltr" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Key</label>
            <input dir="ltr" type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl py-2.5">
            התחברות
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-brand-800">ניהול פניות · ויאז&apos;ה ישראלית</h1>
          <button onClick={disconnect} className="text-xs text-gray-400 hover:text-gray-600">
            ניתוק
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", "seller", "buyer", "lawyer"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                filter === f ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "הכל" : ROLE_LABEL[f]} ({counts[f]})
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-gray-400 text-center py-16">אין פניות עדיין</p>
        ) : (
          <div className="space-y-3">
            {visible.map((l) => (
              <div key={l.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-brand-50 text-brand-700 rounded-full px-2.5 py-0.5">
                      {ROLE_LABEL[l.role]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(l.created_at).toLocaleString("he-IL")}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(l.id, s)}
                        className={`text-xs rounded-full px-2.5 py-0.5 border ${
                          l.status === s
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                  {Object.entries(l.details).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-gray-400 text-xs">{FIELD_LABEL[k] || k}: </span>
                      <span className="text-gray-800">{String(v)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-gray-300 mt-2 select-all" dir="ltr">{l.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
