"use client";

import { Phone, ShieldCheck, Clock } from "lucide-react";

export const CARDCOM_URL =
  "https://secure.cardcom.solutions/EA/EA5/ZBWegQSTzUa1lPXV82627w/PaymentSP";
export const CONSULTATION_PRICE = 780;

export default function Consultation() {
  const goToPayment = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        item_name: "שיחת ייעוץ אישית",
        value: CONSULTATION_PRICE,
        currency: "ILS",
      });
    }
    window.location.href = CARDCOM_URL;
  };

  return (
    <section id="consultation" className="py-16 bg-brand-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 sm:p-9 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-brand-50 text-brand-700 rounded-full px-3 py-1 mb-4">
            <Phone size={14} />
            שיחת ייעוץ אישית
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-brand-800 mb-3">
            רוצים לבדוק אם המודל מתאים לכם?
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-6">
            שיחת ייעוץ אישית עם חיים אטקין, שמאי מקרקעין ומחבר הספר "בועת נדל"ן". בשיחה נעבור
            על הנתונים שלכם, על שווי הדירה ועל החלופות, ותקבלו תשובה ישרה: האם מכירת חלק
            מהדירה מתאימה למצבכם, ומה כדאי לבדוק לפני כל החלטה.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 mb-7">
            <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3 px-2">
              <Clock size={16} className="text-brand-600 shrink-0" />
              שיחה אישית בתיאום מראש
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3 px-2">
              <ShieldCheck size={16} className="text-brand-600 shrink-0" />
              דיסקרטיות מלאה
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3 px-2">
              <Phone size={16} className="text-brand-600 shrink-0" />
              תיאום מיידי בוואטסאפ
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={goToPayment}
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl px-8 py-3.5 text-lg transition-colors shadow-sm"
            >
              לשיחת התייעצות עם חיים אטקין
            </button>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">{CONSULTATION_PRICE} ₪</span> · תשלום
              מאובטח בכרטיס אשראי · מיד לאחר התשלום עוברים לתיאום השיחה בוואטסאפ
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-6 leading-relaxed border-t border-gray-100 pt-4">
            שיחת הייעוץ אינה מהווה ייעוץ להשקעה, ייעוץ משפטי או ייעוץ מס, ואינה תחליף לשומת
            מקרקעין פרטנית או לייעוץ אישי מותאם. האחריות לקבלת ייעוץ אישי פרטני חלה על
            הפונה. ביטול עסקה בהתאם להוראות הדין.
          </p>
        </div>
      </div>
    </section>
  );
}
