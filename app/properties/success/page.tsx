"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SERIOUSNESS_FEE } from "@/components/Properties";

const WHATSAPP_NUMBER = "972523728828";
const CONTACT_API_URL = "https://insure.co.il/api/viager/property-contact";

type Property = { city: string; street: string };

export default function PropertySuccess() {
  const [property, setProperty] = useState<Property | null>(null);
  const [contactDetails, setContactDetails] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setLoaded(true);
      return;
    }

    const loadProperty = supabase
      ? supabase.from("properties").select("city, street").eq("id", id).single()
      : Promise.resolve({ data: null });

    // פרטי הקשר (כתובת מלאה, שמות, טלפונים) לא נשמרים בטבלה הפומבית,
    // ומגיעים אך ורק דרך שרת אינשור, לנכס הספציפי הזה בלבד.
    const loadContact = fetch(`${CONTACT_API_URL}?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : { contact_details: "" }))
      .catch(() => ({ contact_details: "" }));

    Promise.all([loadProperty, loadContact]).then(([propResult, contactResult]) => {
      setProperty((propResult.data as Property) ?? null);
      setContactDetails(contactResult.contact_details || "");
      setLoaded(true);
      if (typeof window.gtag === "function") {
        window.gtag("event", "purchase", {
          item_name: "דמי רצינות - נכס",
          value: SERIOUSNESS_FEE,
          currency: "ILS",
          property_id: id,
        });
      }
    });
  }, []);

  const message = property
    ? `שלום חיים, שילמתי דמי רצינות עבור הנכס ב${property.city} ברחוב ${property.street}. אשמח לתיאום ביקור. שמי: `
    : "שלום חיים, שילמתי דמי רצינות עבור נכס בזירה ואשמח לתיאום ביקור. שמי: ";

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 max-w-lg w-full text-center">
        <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-800 mb-3">
          התשלום התקבל, תודה!
        </h1>

        {contactDetails ? (
          <>
            <p className="text-gray-600 leading-relaxed mb-4">
              הנה פרטי הנכס ופרטי הקשר לתיאום ביקור:
            </p>
            <div
              dir="auto"
              className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-right text-gray-800 whitespace-pre-line mb-6"
            >
              {contactDetails}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              שאלות נוספות או רוצים שנעזור בתיאום? אנחנו כאן:
            </p>
          </>
        ) : (
          <p className="text-gray-600 leading-relaxed mb-7">
            {property ? (
              <>
                נותר צעד אחד לתיאום ביקור בנכס{" "}
                <span className="font-bold">
                  ב{property.city}, {property.street}
                </span>
                : שלחו לחיים הודעת וואטסאפ, וההודעה כבר מוכנה עבורכם.
              </>
            ) : (
              "נותר צעד אחד לתיאום הביקור: שלחו לחיים הודעת וואטסאפ, וההודעה כבר מוכנה עבורכם."
            )}
          </p>
        )}

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
              window.gtag("event", "whatsapp_click", { source: "property_success" });
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
            href="mailto:haimetkin@gmail.com?subject=שילמתי דמי רצינות עבור נכס - ויאז'ה ישראלית"
            className="text-brand-600 underline hover:text-brand-700 inline-flex items-center gap-1"
          >
            <Mail size={14} />
            שליחת מייל
          </a>
        </p>

        <a href="/" className="inline-block text-xs text-gray-400 hover:text-gray-600 mt-8">
          חזרה לאתר
        </a>
      </div>
    </main>
  );
}
