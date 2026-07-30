"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CARDCOM_PROPERTY_URL =
  "https://secure.cardcom.solutions/EA/EA5/AqPfElijake85EBxl9wxw/PaymentSP";
export const SERIOUSNESS_FEE = 354;

type Property = {
  id: string;
  city: string;
  street: string;
  rooms: string | null;
  size_sqm: number | null;
};

function formatLine(p: Property) {
  const mid: string[] = [];
  if (p.rooms) mid.push(`דירת ${p.rooms} חד'`);
  if (p.size_sqm) mid.push(`${p.size_sqm} מ"ר`);
  const midStr = mid.join(" ");
  return midStr ? `ב${p.city}, ${midStr} ברחוב ${p.street}` : `ב${p.city} ברחוב ${p.street}`;
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[] | null>(null);

  useEffect(() => {
    if (!supabase) {
      setProperties([]);
      return;
    }
    supabase
      .from("properties")
      .select("id, city, street, rooms, size_sqm")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProperties((data as Property[]) ?? []));
  }, []);

  if (!properties || properties.length === 0) return null;

  const goToPayment = (p: Property) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        item_name: "דמי רצינות - נכס",
        value: SERIOUSNESS_FEE,
        currency: "ILS",
        property_id: p.id,
      });
    }
    const url = new URL(CARDCOM_PROPERTY_URL);
    url.searchParams.set(
      "SuccessRedirectUrl",
      `${window.location.origin}/properties/success/?id=${p.id}`
    );
    window.location.href = url.toString();
  };

  return (
    <div className="max-w-2xl mx-auto mb-6 text-right">
      <p className="text-sm font-medium text-gold-500 mb-2 text-center">
        נכסים בזירה כרגע
      </p>
      <div className="space-y-2">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => goToPayment(p)}
            className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl px-4 py-3 text-white text-sm sm:text-base transition-colors text-right"
          >
            <Home size={18} className="text-gold-500 shrink-0" />
            <span>{formatLine(p)}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-brand-100/80 text-center mt-2">
        לפרטים ותיאום ביקור: תשלום דמי רצינות בסך {SERIOUSNESS_FEE} ₪
      </p>
    </div>
  );
}
