"use client";

import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "972523728828";
const WHATSAPP_TEXT =
  "שלום חיים, רכשתי שיחת ייעוץ באתר ויאז'ה ישראלית ואני ממתין/ה לתיאום השיחה. שמי: ";

export default function ConsultationSuccess() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  // מדידת רכישה ב-Analytics
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        item_name: "שיחת ייעוץ אישית",
        value: 780,
        currency: "ILS",
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 max-w-lg w-full text-center">
        <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-800 mb-3">
          התשלום התקבל, תודה!
        </h1>

        <p className="text-gray-600 leading-relaxed mb-7">
          נותר צעד אחד לתיאום השיחה: שלחו לחיים הודעת וואטסאפ, וההודעה כבר מוכנה עבורכם.
          רק הוסיפו את שמכם ושלחו, ונחזור אליכם לתיאום מועד.
        </p>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
              window.gtag("event", "whatsapp_click", { source: "consultation_success" });
            }
          }}
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1eb85a] text-white font-bold rounded-xl px-6 py-4 text-lg transition-colors shadow-sm"
        >
          <MessageCircle size={22} />
          שליחת הודעה בוואטסאפ
        </a>

        <p className="text-sm text-gray-500 mt-6">
          מעדיפים דרך אחרת?{" "}
          <a
            href="mailto:haimetkin@gmail.com?subject=רכשתי שיחת ייעוץ - ויאז'ה ישראלית"
            className="text-brand-600 underline hover:text-brand-700 inline-flex items-center gap-1"
          >
            <Mail size={14} />
            שליחת מייל
          </a>
        </p>

        <p className="text-xs text-gray-400 mt-8 border-t border-gray-100 pt-4 leading-relaxed">
          שמרו את אישור התשלום שנשלח אליכם במייל מחברת הסליקה. שיחת הייעוץ אינה מהווה ייעוץ
          להשקעה, ייעוץ משפטי או ייעוץ מס.
        </p>

        <a href="/" className="inline-block text-xs text-gray-400 hover:text-gray-600 mt-5">
          חזרה לאתר
        </a>
      </div>
    </main>
  );
}
