"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Building2, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "register" | "forgot" | "recovery";
type SaleType = "partial" | "whole_occupied";
type Status = "pending" | "active" | "sold" | "hidden" | "rejected";

type Listing = {
  id: string;
  city: string;
  street: string;
  rooms: string | null;
  size_sqm: number | null;
  sale_type: SaleType;
  status: Status;
  property_contacts: { contact_details: string } | { contact_details: string }[] | null;
};

const STATUS_LABEL: Record<Status, { label: string; cls: string }> = {
  pending: { label: "ממתין לאישור", cls: "bg-amber-100 text-amber-800" },
  active: { label: "מפורסם באתר", cls: "bg-emerald-100 text-emerald-800" },
  sold: { label: "נמכר", cls: "bg-gray-200 text-gray-700" },
  hidden: { label: "הוסר מהאתר", cls: "bg-gray-200 text-gray-700" },
  rejected: { label: "נדחה", cls: "bg-rose-100 text-rose-800" },
};

const SALE_LABEL: Record<SaleType, string> = {
  partial: "חלק מהדירה (עד שליש)",
  whole_occupied: "כל הדירה כתפוסה (מודל ויאז'ה)",
};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600";

function formatLine(p: Pick<Listing, "city" | "street" | "rooms" | "size_sqm">) {
  const mid: string[] = [];
  if (p.rooms) mid.push(`דירת ${p.rooms} חד'`);
  if (p.size_sqm) mid.push(`${p.size_sqm} מ"ר`);
  const midStr = mid.join(" ");
  return midStr ? `ב${p.city}, ${midStr} ברחוב ${p.street}` : `ב${p.city} ברחוב ${p.street}`;
}

function contactOf(l: Listing) {
  const c = Array.isArray(l.property_contacts) ? l.property_contacts[0] : l.property_contacts;
  return c?.contact_details || "";
}

function ViagerOnlyNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
      <div className="font-bold mb-1">פרסום נכסי ויאז'ה בלבד</div>
      הפלטפורמה מיועדת אך ורק לנכסים הנמכרים במודל ויאז'ה: מכירה של <b>חלק מהדירה</b> (עד שליש)
      או של <b>כל הדירה כדירה תפוסה</b>, כשהמוכר ממשיך להתגורר בה לכל חייו. <b>אין לפרסם כאן נכסים
      אחרים</b>, ופרסום כזה יידחה. הפרסום בחינם ומותנה באישור מקדים של מפעיל הזירה. באתר תוצג
      חשיפה חלקית בלבד (עיר, רחוב, חדרים ושטח), והפרטים המלאים יימסרו לגולש רק לאחר רכישה ותשלום.
    </div>
  );
}

/* ---------------- כניסה / הרשמה / איפוס ---------------- */

function AuthForms({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const [f, setF] = useState({ full_name: "", phone: "", license: "", email: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setInfo("");
  };

  const googleSignIn = async () => {
    if (!supabase) return;
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/brokers/` },
    });
    if (err) setError("הכניסה עם Google נכשלה: " + err.message);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError("");
    setInfo("");
    const email = f.email.trim().toLowerCase();
    setBusy(true);

    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password: f.password });
      if (err) {
        setError(
          /not confirmed/i.test(err.message)
            ? "כתובת המייל עוד לא אושרה. לחצו על הקישור שנשלח אליכם במייל ואז נסו שוב."
            : "אימייל או סיסמה שגויים."
        );
      }
    } else if (mode === "register") {
      if (!f.full_name.trim() || !f.phone.trim() || !f.license.trim() || !email) {
        setError("נא למלא את כל השדות.");
      } else if (f.password.length < 8) {
        setError("הסיסמה חייבת להכיל לפחות 8 תווים.");
      } else if (!agree) {
        setError("יש לאשר שהפרסום מיועד לנכסי ויאז'ה בלבד.");
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password: f.password,
          options: {
            emailRedirectTo: `${window.location.origin}/brokers/`,
            data: {
              viager_broker: true,
              full_name: f.full_name.trim(),
              phone: f.phone.trim(),
              license_number: f.license.trim(),
            },
          },
        });
        if (err) {
          setError("ההרשמה נכשלה: " + err.message);
        } else if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError("כתובת המייל כבר רשומה. נסו להתחבר, או לאפס סיסמה.");
        } else if (!data.session) {
          setInfo(
            "נשלח אליכם מייל אישור. לחצו על הקישור שבו, ואז חזרו לכאן והתחברו עם המייל והסיסמה."
          );
        }
      }
    } else if (mode === "forgot") {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/brokers/`,
      });
      if (err) setError("שליחת המייל נכשלה: " + err.message);
      else setInfo("אם הכתובת רשומה, נשלח אליה קישור לאיפוס הסיסמה.");
    } else if (mode === "recovery") {
      if (f.password.length < 8) {
        setError("הסיסמה חייבת להכיל לפחות 8 תווים.");
      } else {
        const { error: err } = await supabase.auth.updateUser({ password: f.password });
        if (err) setError("עדכון הסיסמה נכשל: " + err.message);
        else {
          setInfo("הסיסמה עודכנה. אפשר להתחבר.");
          setMode("login");
        }
      }
    }
    setBusy(false);
  };

  const title =
    mode === "login" ? "כניסת מתווכים" : mode === "register" ? "הרשמת מתווכים" : mode === "forgot" ? "איפוס סיסמה" : "בחירת סיסמה חדשה";

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-brand-800 mb-4 text-center">{title}</h2>
        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <>
              <input className={inputCls} placeholder="שם מלא" autoComplete="name" value={f.full_name} onChange={set("full_name")} />
              <input className={inputCls} dir="ltr" type="tel" placeholder="טלפון נייד" autoComplete="tel" value={f.phone} onChange={set("phone")} />
              <input className={inputCls} dir="ltr" placeholder="מספר רישיון תיווך" value={f.license} onChange={set("license")} />
            </>
          )}
          {mode !== "recovery" && (
            <input className={inputCls} dir="ltr" type="email" placeholder="אימייל" autoComplete="email" value={f.email} onChange={set("email")} />
          )}
          {mode !== "forgot" && (
            <input
              className={inputCls}
              dir="ltr"
              type="password"
              placeholder={mode === "login" ? "סיסמה" : "סיסמה (לפחות 8 תווים)"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={f.password}
              onChange={set("password")}
            />
          )}
          {mode === "register" && (
            <label className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-brand-600" />
              אני מאשר/ת שאפרסם בזירה נכסי ויאז'ה בלבד (חלק מהדירה עד שליש, או כל הדירה כתפוסה), ושכל פרסום כפוף לאישור מקדים.
            </label>
          )}
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}
          <button
            disabled={busy}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-xl py-2.5 transition-colors"
          >
            {busy ? "רגע..." : mode === "login" ? "כניסה" : mode === "register" ? "הרשמה" : mode === "forgot" ? "שליחת קישור איפוס" : "שמירת סיסמה"}
          </button>
        </form>

        {(mode === "login" || mode === "register") && (
          <div className="mt-4">
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span className="flex-1 h-px bg-gray-200" />
              או
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <button
              type="button"
              onClick={googleSignIn}
              className="w-full flex items-center justify-center gap-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl py-2.5 text-sm font-medium text-gray-700 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.9z" />
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              {mode === "login" ? "כניסה עם חשבון Google" : "הרשמה עם חשבון Google"}
            </button>
            {mode === "register" && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                אחרי ההתחברות תתבקשו להשלים טלפון ומספר רישיון תיווך.
              </p>
            )}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
          {mode === "login" && (
            <>
              <div>
                אין לכם חשבון?{" "}
                <button onClick={() => switchMode("register")} className="text-brand-600 underline">
                  הרשמה חינם
                </button>
              </div>
              <div>
                <button onClick={() => switchMode("forgot")} className="text-gray-400 hover:text-gray-600 underline">
                  שכחתי סיסמה
                </button>
              </div>
            </>
          )}
          {(mode === "register" || mode === "forgot") && (
            <div>
              כבר רשומים?{" "}
              <button onClick={() => switchMode("login")} className="text-brand-600 underline">
                כניסה
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- אזור אישי ---------------- */

function Dashboard({ session }: { session: Session }) {
  const user = session.user;
  const meta = (user.user_metadata || {}) as Record<string, string>;

  const [profileState, setProfileState] = useState<"loading" | "missing" | "ready">("loading");
  const [profile, setProfile] = useState<{ full_name: string; verified: boolean } | null>(null);
  const [pf, setPf] = useState({
    full_name: meta.full_name || meta.name || "",
    phone: meta.phone || "",
    license: meta.license_number || "",
  });
  const [pfAgree, setPfAgree] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [form, setForm] = useState({
    city: "",
    street: "",
    rooms: "",
    size_sqm: "",
    sale_type: "partial" as SaleType,
    contact_details: "",
  });
  const [confirmViager, setConfirmViager] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const loadListings = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("properties")
      .select("id, city, street, rooms, size_sqm, sale_type, status, property_contacts(contact_details)")
      .eq("broker_id", user.id)
      .order("created_at", { ascending: false });
    setListings((data as unknown as Listing[]) || []);
  }, [user.id]);

  const loadProfile = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("brokers")
      .select("full_name, verified")
      .eq("id", user.id)
      .maybeSingle();
    if (data) {
      setProfile(data);
      setProfileState("ready");
      loadListings();
    } else {
      setProfileState("missing");
    }
  }, [user.id, loadListings]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!pf.full_name.trim() || !pf.phone.trim() || !pf.license.trim()) {
      setError("נא למלא את כל השדות.");
      return;
    }
    if (!pfAgree) {
      setError("יש לאשר שהפרסום מיועד לנכסי ויאז'ה בלבד.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.from("brokers").insert({
      id: user.id,
      full_name: pf.full_name.trim(),
      phone: pf.phone.trim(),
      license_number: pf.license.trim(),
      email: user.email,
    });
    setBusy(false);
    if (err) setError("שמירת הפרופיל נכשלה: " + err.message);
    else loadProfile();
  };

  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError("");
    setOkMsg("");
    if (!form.city.trim() || !form.street.trim() || !form.contact_details.trim()) {
      setError("נא למלא עיר, רחוב ופרטי קשר.");
      return;
    }
    if (!confirmViager) {
      setError("יש לאשר שהנכס הוא נכס ויאז'ה.");
      return;
    }
    setBusy(true);
    const id = crypto.randomUUID();
    const { error: e1 } = await supabase.from("properties").insert({
      id,
      broker_id: user.id,
      status: "pending",
      city: form.city.trim(),
      street: form.street.trim(),
      rooms: form.rooms.trim() || null,
      size_sqm: form.size_sqm.trim() ? Number(form.size_sqm) : null,
      sale_type: form.sale_type,
    });
    if (e1) {
      setBusy(false);
      setError(
        "הגשת הנכס נכשלה. ייתכן שיש כבר 10 נכסים הממתינים לאישור. פרטים: " + e1.message
      );
      return;
    }
    const { error: e2 } = await supabase
      .from("property_contacts")
      .insert({ property_id: id, contact_details: form.contact_details.trim() });
    setBusy(false);
    if (e2) {
      setError("הנכס הוגש אך פרטי הקשר לא נשמרו. ערכו אותם ברשימה למטה. פרטים: " + e2.message);
    } else {
      setOkMsg("הנכס הוגש וממתין לאישור המקדים. הוא יופיע באתר רק לאחר אישור.");
    }
    setForm({ city: "", street: "", rooms: "", size_sqm: "", sale_type: "partial", contact_details: "" });
    setConfirmViager(false);
    loadListings();
  };

  const setStatus = async (id: string, status: "sold" | "hidden") => {
    if (!supabase) return;
    await supabase.from("properties").update({ status }).eq("id", id);
    loadListings();
  };

  const saveContact = async (id: string) => {
    if (!supabase) return;
    setBusy(true);
    const { error: err } = await supabase
      .from("property_contacts")
      .upsert({ property_id: id, contact_details: draft });
    setBusy(false);
    if (err) setError("השמירה נכשלה: " + err.message);
    else {
      setEditing(null);
      loadListings();
    }
  };

  const logout = () => supabase?.auth.signOut();

  const header = (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2 text-brand-800 font-bold">
        <Building2 size={20} />
        {profile ? `שלום ${profile.full_name}` : "אזור אישי למתווכים"}
        {profile?.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5">
            <ShieldCheck size={12} /> מאומת
          </span>
        )}
      </div>
      <button onClick={logout} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
        <LogOut size={14} /> יציאה
      </button>
    </div>
  );

  if (profileState === "loading") return <p className="text-center text-gray-400">טוען...</p>;

  if (profileState === "missing") {
    return (
      <div className="max-w-md mx-auto">
        {header}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-800 mb-3 text-center">השלמת פרטי מתווך</h2>
          <form onSubmit={saveProfile} className="space-y-3">
            <input className={inputCls} placeholder="שם מלא" value={pf.full_name} onChange={(e) => setPf({ ...pf, full_name: e.target.value })} />
            <input className={inputCls} dir="ltr" type="tel" placeholder="טלפון נייד" value={pf.phone} onChange={(e) => setPf({ ...pf, phone: e.target.value })} />
            <input className={inputCls} dir="ltr" placeholder="מספר רישיון תיווך" value={pf.license} onChange={(e) => setPf({ ...pf, license: e.target.value })} />
            <label className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
              <input type="checkbox" checked={pfAgree} onChange={(e) => setPfAgree(e.target.checked)} className="mt-0.5 accent-brand-600" />
              אני מאשר/ת שאפרסם בזירה נכסי ויאז'ה בלבד (חלק מהדירה עד שליש, או כל הדירה כתפוסה), ושכל פרסום כפוף לאישור מקדים.
            </label>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button disabled={busy} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-xl py-2.5">
              {busy ? "רגע..." : "שמירה והמשך"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {header}
      <ViagerOnlyNotice />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-brand-800 mb-4">פרסום נכס ויאז'ה חדש</h2>
        <form onSubmit={submitListing} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={inputCls} placeholder="עיר *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input className={inputCls} placeholder="רחוב *" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            <input className={inputCls} placeholder="מספר חדרים" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} />
            <input className={inputCls} type="number" min={0} placeholder='שטח במ"ר' value={form.size_sqm} onChange={(e) => setForm({ ...form, size_sqm: e.target.value })} />
          </div>
          <select className={inputCls} value={form.sale_type} onChange={(e) => setForm({ ...form, sale_type: e.target.value as SaleType })}>
            <option value="partial">{SALE_LABEL.partial}</option>
            <option value="whole_occupied">{SALE_LABEL.whole_occupied}</option>
          </select>
          <div>
            <textarea
              className={inputCls}
              rows={5}
              placeholder="פרטי קשר שיימסרו לרוכש רק אחרי תשלום: כתובת מלאה, שמות אנשי קשר, טלפונים, פרטי המתווך, הערות לתיאום ביקור *"
              value={form.contact_details}
              onChange={(e) => setForm({ ...form, contact_details: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">טקסט חופשי. לא יוצג באתר לפני תשלום.</p>
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={confirmViager} onChange={(e) => setConfirmViager(e.target.checked)} className="mt-0.5 accent-brand-600" />
            אני מאשר/ת שזה נכס ויאז'ה: המוכר ממשיך להתגורר בנכס, והמכירה היא של חלק ממנו (עד שליש) או של כולו כדירה תפוסה.
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {okMsg && <p className="text-sm text-emerald-700">{okMsg}</p>}
          <button disabled={busy} className="bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-bold rounded-xl px-6 py-2.5 transition-colors">
            {busy ? "מגיש..." : "הגשה לאישור מקדים"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-brand-800 mb-3">הנכסים שלי</h2>
        {listings.length === 0 ? (
          <p className="text-sm text-gray-400">עוד לא הגשתם נכסים.</p>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-gray-800">{formatLine(l)}</div>
                  <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${STATUS_LABEL[l.status].cls}`}>
                    {STATUS_LABEL[l.status].label}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{SALE_LABEL[l.sale_type]}</div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {l.status === "active" && (
                    <>
                      <button onClick={() => setStatus(l.id, "sold")} className="text-xs border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-1.5">
                        סימון כנמכר
                      </button>
                      <button onClick={() => setStatus(l.id, "hidden")} className="text-xs border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-1.5">
                        הסרה מהאתר
                      </button>
                    </>
                  )}
                  {l.status === "pending" && editing !== l.id && (
                    <button
                      onClick={() => {
                        setEditing(l.id);
                        setDraft(contactOf(l));
                      }}
                      className="text-xs border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-1.5"
                    >
                      עריכת פרטי קשר
                    </button>
                  )}
                </div>

                {editing === l.id && (
                  <div className="mt-3">
                    <textarea className={inputCls} rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => saveContact(l.id)} disabled={busy} className="text-xs bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-3 py-1.5">
                        שמירה
                      </button>
                      <button onClick={() => setEditing(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2">
                        ביטול
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- הדף ---------------- */

export default function BrokersPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setMode("recovery");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-brand-50 py-10 px-4">
      <div className="max-w-3xl mx-auto mb-6 text-center">
        <a href="/" className="text-xs text-gray-400 hover:text-gray-600">
          ← חזרה ל-viager.co.il
        </a>
        <h1 className="text-3xl font-extrabold text-brand-800 mt-2">
          מתווכים: פרסום נכסי ויאז'ה בחינם
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          הרשמה וכניסה לפרסום נכסי ויאז'ה (חלק מהדירה או כולה כתפוסה) בזירה, ללא עלות.
        </p>
      </div>

      {!ready ? null : !supabase ? (
        <p className="text-center text-gray-500">השירות אינו זמין כרגע.</p>
      ) : session && mode !== "recovery" ? (
        <Dashboard session={session} />
      ) : (
        <div className="space-y-5">
          <div className="max-w-md mx-auto">
            <ViagerOnlyNotice />
          </div>
          <AuthForms mode={mode} setMode={setMode} />
        </div>
      )}
    </main>
  );
}
