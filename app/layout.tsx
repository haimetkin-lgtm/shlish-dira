import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "700", "800"] });

const SITE_URL = "https://viager.co.il";

const TITLE = "ויאז'ה ישראלית | מכירת עד שליש מהדירה, האלטרנטיבה למשכנתא הפוכה";
const DESCRIPTION =
  "בני 60 ומעלה מוכרים עד שליש מהדירה, מקבלים סכום כסף משמעותי, ממשיכים לגור בבית לכל החיים מכוח זכות מגורים רשומה בטאבו, ורוב הדירה נשארת במשפחה. בלי הלוואה, בלי ריבית ובלי חוב שתופח. כולל מחשבון השוואה מול משכנתא הפוכה ורישום למוכרים, משקיעים ועורכי דין.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | ויאז'ה ישראלית",
  },
  description: DESCRIPTION,
  applicationName: "ויאז'ה ישראלית",
  authors: [{ name: "חיים אטקין, שמאי מקרקעין" }],
  creator: "חיים אטקין",
  publisher: "חיים אטקין, שמאות מקרקעין",
  category: "נדל\"ן",
  keywords: [
    "ויאז'ה",
    "ויאז'ה ישראלית",
    "viager ישראל",
    "מכירת שליש דירה",
    "מכירת חלק מדירה",
    "שליש דירה",
    "אלטרנטיבה למשכנתא הפוכה",
    "משכנתא הפוכה",
    "חסרונות משכנתא הפוכה",
    "הכנסה מהדירה לגיל השלישי",
    "כסף מהדירה בלי למכור אותה",
    "הון כלוא בדירה",
    "פנסיה מהדירה",
    "זכות מגורים לכל החיים",
    "מכירת דירה עם זכות מגורים",
    "דיור לגיל השלישי",
    "אזרחים ותיקים דירה הכנסה",
    "מס רכישה שליש דירה",
    "שליש דירה מיסוי",
    "דירה יחידה שליש",
    "שומת דירה תפוסה",
    "השקעה בשליש דירה",
    "חיים אטקין",
    "בועת נדל\"ן",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "ויאז'ה ישראלית | מודל שליש דירה",
    description:
      "מוכרים עד שליש מהדירה, גרים בה לכל החיים, ורוב הדירה נשארת במשפחה. בלי הלוואה, בלי ריבית, בלי חוב שתופח.",
    url: SITE_URL,
    siteName: "ויאז'ה ישראלית",
    locale: "he_IL",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 849, alt: "ויאז'ה ישראלית, מודל שליש דירה" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ויאז'ה ישראלית | מודל שליש דירה",
    description: "מוכרים עד שליש מהדירה, גרים בה לכל החיים, ורוב הדירה נשארת במשפחה.",
    images: ["/og.jpg"],
  },
};

// שאלות ותשובות: הטקסט חייב להיות זהה למוצג ב-components/Faq.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ויאז'ה ישראלית",
      alternateName: "מודל שליש דירה",
      description: DESCRIPTION,
      inLanguage: "he-IL",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: "ויאז'ה ישראלית, מכירת עד שליש מהדירה",
      serviceType: "עסקת נדל\"ן למכירת חלק מדירה עם זכות מגורים לכל החיים",
      description:
        "זירה סגורה המפגישה בין בני 60 ומעלה המבקשים להפוך עד שליש מדירתם למזומן, לבין רוכשים ומשקיעים. כל עסקה מלווה בשומת מקרקעין, בתמחור אקטוארי ובייצוג משפטי נפרד לכל צד.",
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: { "@type": "Country", name: "ישראל" },
      audience: {
        "@type": "Audience",
        audienceType: "בני 60 ומעלה בעלי דירה, משקיעי נדל\"ן ועורכי דין",
      },
      url: SITE_URL,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "חיים אטקין",
      jobTitle: "שמאי מקרקעין",
      description: "שמאי מקרקעין ותיק, מחבר הספר \"בועת נדל\"ן\", יזם ומייסד ויאז'ה ישראלית.",
      email: "haimetkin@gmail.com",
      url: "https://www.etkin.co.il",
      knowsAbout: [
        "שמאות מקרקעין",
        "ויאז'ה",
        "משכנתא הפוכה",
        "מיסוי מקרקעין",
        "שומת דירה תפוסה",
        "היוון זכויות",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "מה מבטיח שאוכל לגור בדירה עד סוף חיי?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "לפני העברת השליש לרוכש נרשמת בטאבו זכות מגורים לכל החיים לטובתכם, יחד עם הסכם שיתוף. הרוכש קונה את השליש כשהוא כפוף לזכות הרשומה, כך שגם מכירה עתידית או הליך משפטי לא פוגעים בזכות המגורים.",
          },
        },
        {
          "@type": "Question",
          name: "מה יקבלו הילדים שלי?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "שני שליש מהדירה, לרבות כל עליית הערך העתידית על החלק הזה. זה ההבדל המרכזי ממשכנתא הפוכה, שבה חוב תופח בריבית דריבית עלול לבלוע את שווי הדירה כולה ולהשאיר ליורשים מעט או כלום.",
          },
        },
        {
          "@type": "Question",
          name: "למה השליש נמכר בהנחה משוויו, ואיך מחשבים אותה?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "העיקרון מוכר לכל שמאי: שומת דירה תפוסה. הרוכש יקבל חזקה רק בתום זכות המגורים, ולכן הוא קונה שווי עתידי, לא נוכחי. התמחור מהוון את שווי השליש כפנוי על פני אופק תוחלת החיים, ומוסיף הפחתה על אי-נזילות של חלק מיעוט ללא דמי שכירות. התוצאה בדרך כלל: 55 עד 70 אחוזים משווי השליש כפנוי, לפי גיל המוכר ונתוני הנכס.",
          },
        },
        {
          "@type": "Question",
          name: "מה קורה במס עבור המוכר?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "מכירת חלק מדירה ממוסה לפי שווי החלק הנמכר בלבד. אצל מי שרכשו את דירתם לפני שנים רבות, החישוב הליניארי המוטב מקטין את המס באופן ניכר ולעיתים לאפס בקירוב. כל עסקה מלווה בבדיקת מיסוי פרטנית לפני חתימה.",
          },
        },
        {
          "@type": "Question",
          name: "מה קורה אם ארצה לעבור לדיור מוגן או למכור את הכל?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "הסכם השיתוף כולל מנגנונים מוסכמים מראש למצבים כאלה: מכירת הדירה כולה בהסכמה וחלוקת התמורה לפי החלקים, או מכירת יתרת החלק שלכם. הזכויות שלכם על שני השליש נשארות שלכם לכל דבר.",
          },
        },
        {
          "@type": "Question",
          name: "מתי דווקא משכנתא הפוכה עדיפה?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "כשצפויה תקופת מגורים קצרה מאוד בנכס, למשל מצב בריאותי קשה או מעבר קרוב לדיור מוגן, היתרון של מכירת שליש נחלש, וייתכן שהלוואה לתקופה קצרה או מכירה רגילה יתאימו יותר. חשוב לדייק: גם בתרחיש כזה הכסף ששולם על השליש לא נעלם, הוא נכנס לעיזבון לצד שני השליש, וההפרש היחיד הוא ההנחה שבה נמכר השליש.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
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
