import type { Metadata } from "next";

// אזור אישי למתווכים: כלי עבודה, לא עמוד לחיפוש בגוגל.
export const metadata: Metadata = {
  title: "מתווכים: פרסום נכסי ויאז'ה בחינם",
  robots: { index: false, follow: false },
};

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
