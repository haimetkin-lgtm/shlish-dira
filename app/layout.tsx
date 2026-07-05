import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://viager.co.il"),
  title: "שליש דירה | הכנסה מהבית בלי למכור את הירושה",
  description:
    "מוכרים שליש מהדירה, ממשיכים לגור בה לכל החיים, והילדים יורשים שני שליש. האלטרנטיבה למשכנתא הפוכה. כולל מחשבון השוואה, רישום מוכרים, משקיעים ועורכי דין מייצגים.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "שליש דירה | האלטרנטיבה למשכנתא הפוכה",
    description:
      "מוכרים שליש מהדירה, גרים בה לכל החיים, והילדים יורשים שני שליש. בלי הלוואה, בלי ריבית, בלי חוב שתופח.",
    url: "https://viager.co.il",
    siteName: "שליש דירה",
    locale: "he_IL",
    type: "website",
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
