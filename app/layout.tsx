import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://viager.co.il"),
  title: "ויאז'ה ישראלית | מודל שליש דירה — האלטרנטיבה למשכנתא הפוכה",
  description:
    "מוכרים עד שליש מהדירה, ממשיכים לגור בה לכל החיים, ורוב הדירה נשארת במשפחה. ויאז'ה ישראלית, מודל שליש דירה. כולל מחשבון השוואה, רישום מוכרים, משקיעים ועורכי דין מייצגים.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ויאז'ה ישראלית | מודל שליש דירה",
    description:
      "מוכרים עד שליש מהדירה, גרים בה לכל החיים, ורוב הדירה נשארת במשפחה. בלי הלוואה, בלי ריבית, בלי חוב שתופח.",
    url: "https://viager.co.il",
    siteName: "ויאז'ה ישראלית",
    locale: "he_IL",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 849, alt: "ויאז'ה ישראלית, מודל שליש דירה" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>
        {children}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://accessibility.f-static.com/site/free-accessibility-plugin/accessibility.min.js?lan=he&place=bottom-left&distance=50"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
