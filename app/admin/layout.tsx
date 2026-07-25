import type { Metadata } from "next";

// עמוד ניהול הפניות: לא לאינדוקס ולא למעקב קישורים.
export const metadata: Metadata = {
  title: "ניהול פניות",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
