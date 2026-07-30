import type { Metadata } from "next";

// דף תודה שאליו מגיעים רק אחרי תשלום: לא לאינדוקס.
export const metadata: Metadata = {
  title: "תיאום ביקור בנכס",
  robots: { index: false, follow: false },
};

export default function PropertySuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
