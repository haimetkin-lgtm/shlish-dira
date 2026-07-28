import type { Metadata } from "next";

// דף תודה שאליו מגיעים רק אחרי תשלום: לא לאינדוקס.
export const metadata: Metadata = {
  title: "תיאום שיחת ייעוץ",
  robots: { index: false, follow: false },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
