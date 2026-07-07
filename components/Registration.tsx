"use client";

import { useState } from "react";
import { Home, TrendingUp, Scale } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Role = "seller" | "buyer" | "lawyer";

const TABS: { role: Role; label: string; icon: React.ReactNode; blurb: string }[] = [
  {
    role: "seller",
    label: "יש לי דירה",
    icon: <Home size={20} />,
    blurb: "בני 60 ומעלה עם דירה בבעלות, שרוצים נזילות מהדירה בלי לעזוב את הבית ובלי לקחת הלוואה.",
  },
  {
    role: "buyer",
    label: "אני רוצה להשקיע",
    icon: <TrendingUp size={20} />,
    blurb:
      "רכישת שליש דירה בהנחה עמוקה. אין לכם דירה? כמעט אפס מס רכישה, וההטבות לדירה הראשונה שלכם נשמרות. יש לכם דירה? מעמד הדירה היחידה שלה לא נפגע.",
  },
  {
    role: "lawyer",
    label: "עו״ד מייצג",
    icon: <Scale size={20} />,
    blurb: "עורכי דין המבקשים לייצג מוכרים או רוכשים בעסקאות שליש דירה.",
  },
];

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600";

export default function Registration() {
  const [role, setRole] = useState<Role>("seller");
  const [form, setForm] = useState<Record<string, string>>({});
  const [wantsAppraisal, setWantsAppraisal] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [refId, setRefId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const switchRole = (r: Role) => {
    setRole(r);
    setForm({});
    setStatus("idle");
    setRefId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setErrorMsg("נא למלא שם וטלפון");
      setStatus("error");
      return;
    }
    if (!supabase) {
      setErrorMsg("ההרשמה עדיין לא פעילה בגרסת הביתא. אפשר לפנות ישירות בטלפון או במייל.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    // המזהה נוצר כאן ולא נקרא בחזרה מהשרת: לציבור יש הרשאת הוספה בלבד, בלי קריאה.
    const id = crypto.randomUUID();
    const { error } = await supabase
      .from("leads")
      .insert({ id, role, details: { ...form, wantsAppraisal } });
    if (error) {
      setErrorMsg("שגיאה בשמירה, נסו שוב בעוד רגע.");
      setStatus("error");
      return;
    }
    setRefId(id);
    setStatus("done");
  };

  const active = TABS.find((t) => t.role === role)!;

  return (
    <section id="register" className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-brand-800 mb-2">הצטרפות לזירה</h2>
        <p className="text-center text-gray-600 mb-8">
          ההרשמה חינם ואינה מחייבת. הפרטים נשמרים בדיסקרטיות מלאה ואינם מוצגים לאיש.
          חשיפת צדדים לעסקה נעשית רק בהסכמה, לאחר בדיקה ותשלום.
        </p>

        {/* טאבים */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.role}
              onClick={() => switchRole(t.role)}
              className={`flex flex-col items-center gap-1 rounded-xl border py-3 px-2 text-sm font-medium transition-colors ${
                role === t.role
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600 mb-5">{active.blurb}</p>

          {status === "done" ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">✓</div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">נרשמתם בהצלחה</h3>
              <p className="text-sm text-gray-600 mb-3">
                שמרו את מספר האסמכתא שלכם. ניצור קשר בהקדם.
              </p>
              <code dir="ltr" className="text-xs bg-gray-100 rounded px-3 py-1.5 inline-block select-all">
                {refId}
              </code>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
                  <input className={inputCls} name="name" autoComplete="name" value={form.name || ""} onChange={set("name")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון *</label>
                  <input className={inputCls} dir="ltr" type="tel" name="phone" autoComplete="tel" value={form.phone || ""} onChange={set("phone")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input className={inputCls} dir="ltr" type="email" name="email" autoComplete="email" value={form.email || ""} onChange={set("email")} />
                </div>

                {role === "seller" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">עיר הנכס</label>
                      <input className={inputCls} name="city" autoComplete="address-level2" value={form.city || ""} onChange={set("city")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">גיל</label>
                      <input className={inputCls} type="number" min={55} max={105} value={form.age || ""} onChange={set("age")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">שווי דירה משוער (₪)</label>
                      <input className={inputCls} type="number" value={form.value || ""} onChange={set("value")} />
                    </div>
                  </>
                )}

                {role === "buyer" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">תקציב השקעה (₪)</label>
                      <input className={inputCls} type="number" value={form.budget || ""} onChange={set("budget")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">אזורים מועדפים</label>
                      <input className={inputCls} value={form.areas || ""} onChange={set("areas")} placeholder="למשל: מרכז, שרון" />
                    </div>
                  </>
                )}

                {role === "lawyer" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">משרד</label>
                      <input className={inputCls} value={form.firm || ""} onChange={set("firm")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">מספר רישיון</label>
                      <input className={inputCls} dir="ltr" value={form.license || ""} onChange={set("license")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">מבקש לייצג</label>
                      <select className={inputCls} value={form.represents || "both"} onChange={set("represents")}>
                        <option value="sellers">מוכרים</option>
                        <option value="buyers">רוכשים</option>
                        <option value="both">מוכרים ורוכשים</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">אזור פעילות</label>
                      <input className={inputCls} value={form.areas || ""} onChange={set("areas")} />
                    </div>
                  </>
                )}
              </div>

              {role !== "lawyer" && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={wantsAppraisal}
                    onChange={(e) => setWantsAppraisal(e.target.checked)}
                    className="w-4 h-4 accent-brand-600"
                  />
                  מעוניין/ת בשומת מקרקעין ותמחור אקטוארי (שירות בתשלום; ההרשמה עצמה אינה מחייבת)
                </label>
              )}

              {status === "error" && <p className="text-sm text-rose-600">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-xl py-3 transition-colors"
              >
                {status === "sending" ? "שולח..." : "הרשמה חינם"}
              </button>
              <p className="text-xs text-gray-400 text-center">
                בשליחה אתם מאשרים יצירת קשר. הפרטים לא יועברו לצד שלישי ללא הסכמתכם.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
