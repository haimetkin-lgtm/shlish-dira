import { ShieldCheck, Coins, Users, FileSignature, Handshake, Landmark, ScrollText } from "lucide-react";
import Calculator from "@/components/Calculator";
import Registration from "@/components/Registration";
import Faq from "@/components/Faq";

export default function Page() {
  return (
    <main>
      {/* Hero */}
      <header className="bg-gradient-to-b from-brand-800 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block text-xs font-medium bg-white/15 rounded-full px-3 py-1 mb-5">
            גרסת ביתא
          </span>
          <div className="text-gold-500 font-bold text-lg mb-2 tracking-wide">
            ויאז'ה ישראלית <span className="text-brand-100 font-normal">· מודל שליש דירה</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            מוכרים שליש.
            <br />
            שומרים את הבית, ואת הירושה.
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            הדרך של בני 60 ומעלה להפוך חלק מהדירה למזומן: מוכרים שליש בלבד,
            ממשיכים לגור בבית לכל החיים עם זכות רשומה בטאבו,
            והילדים יורשים שני שליש. בלי הלוואה, בלי ריבית, בלי חוב שתופח.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#calculator"
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl px-6 py-3 transition-colors"
            >
              בדקו במחשבון מה עדיף לכם
            </a>
            <a
              href="#register"
              className="bg-white/10 hover:bg-white/20 border border-white/30 font-bold rounded-xl px-6 py-3 transition-colors"
            >
              הרשמה לזירה, חינם
            </a>
          </div>
        </div>
      </header>

      {/* הבעיה */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-brand-800 mb-2">
            למה לא משכנתא הפוכה?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            כמיליון אזרחים ותיקים בישראל, רובם עם דירה אך בלי הכנסה מספקת.
            הפתרון המקובל היום הוא משכנתא הפוכה, וזה פתרון עם שלוש בעיות מובנות.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: <Coins size={32} className="mx-auto mb-3 text-rose-600" />,
                title: "חוב שמכפיל את עצמו",
                text: "ריבית דריבית ללא החזר שוטף. בריביות של היום החוב מוכפל בערך כל עשור, ואוכל את שווי הדירה מבפנים.",
              },
              {
                icon: <Users size={32} className="mx-auto mb-3 text-rose-600" />,
                title: "היורשים נשארים עם החוב",
                text: "לאחר הפטירה ליורשים כשנה בלבד לפרוע את החוב או למכור את הדירה, לעיתים בשוק חלש ובלחץ זמן.",
              },
              {
                icon: <ScrollText size={32} className="mx-auto mb-3 text-rose-600" />,
                title: "אף אחד לא יודע כמה זה יעלה",
                text: "העלות הסופית תלויה באורך החיים. ככל שחיים יותר, החוב גדל יותר. בנק ישראל אף הגביל את שיווק המוצר.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                {c.icon}
                <h3 className="font-bold text-gray-800 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* הפתרון */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-brand-800 mb-2">
            הפתרון: מוכרים שליש בדיוק
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            לא במקרה שליש. זהו הרף שקבע המחוקק: בעלות בעד שליש דירה אינה נחשבת דירה נוספת,
            ולכן העסקה משתלמת גם לרוכש. וכך זה עובד:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Landmark size={28} className="text-brand-600" />,
                step: "1",
                title: "שומה ותמחור",
                text: "שמאי מקרקעין קובע את שווי הדירה ותמחור אקטוארי שקוף של השליש.",
              },
              {
                icon: <ShieldCheck size={28} className="text-brand-600" />,
                step: "2",
                title: "מיגון משפטי",
                text: "זכות מגורים לכל החיים נרשמת בטאבו לטובתכם, לפני העברת השליש. כל צד מיוצג בנפרד.",
              },
              {
                icon: <Handshake size={28} className="text-brand-600" />,
                step: "3",
                title: "מכירה וקבלת מזומן",
                text: "הרוכש משלם, אתם מקבלים סכום חד פעמי משמעותי, פטורים מדאגות חוב וריבית.",
              },
              {
                icon: <FileSignature size={28} className="text-brand-600" />,
                step: "4",
                title: "החיים ממשיכים",
                text: "גרים בבית כרגיל. שני שליש נשארים בבעלותכם ועוברים לילדים בירושה.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  {s.icon}
                  <span className="text-xs font-bold text-gray-400">שלב {s.step}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          {/* יתרון המס של שליש בדיוק */}
          <div className="mt-8 bg-brand-800 text-white rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold mb-1 text-center">למה בדיוק שליש? כי כך קבע המחוקק</h3>
            <p className="text-brand-100 text-sm text-center mb-6 max-w-2xl mx-auto">
              בעלות בעד שליש דירה אינה נחשבת "דירה נוספת" בחוק מיסוי מקרקעין. מזה נגזרות
              שתי הטבות אמיתיות לרוכש:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-xl p-5">
                <div className="font-bold text-gold-500 mb-2">אין לכם דירה? כמעט אפס מס רכישה</div>
                <p className="text-brand-100 leading-relaxed">
                  מי שאין בבעלותו דירה נהנה ממדרגות "דירה יחידה" גם ברכישת שליש: על שליש
                  בדירה ששווה עד כשני מיליון ש"ח, מס הרכישה בפועל הוא אפס. דרך כניסה לנדל"ן
                  לצעירים ולהורים שקונים עבור ילד, בלי לשרוף את ההטבות לדירת החיים שלהם.
                  חשוב: "אין דירה" נבחן ברמת התא המשפחתי כולו, כולל דירת בן או בת הזוג.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5">
                <div className="font-bold text-gold-500 mb-2">יש לכם דירה? המעמד שלה נשמר</div>
                <p className="text-brand-100 leading-relaxed">
                  השליש לא נחשב דירה נוספת: דירתכם הפרטית נשארת "דירה יחידה", עם פטור ממס
                  שבח במכירתה ומדרגות מוזלות בקניית דירה חליפית. מי שקונה דירה שנייה שלמה
                  מאבד את שתי ההטבות האלה. (על השליש עצמו משולם מס רכישה של דירה נוספת.)
                </p>
              </div>
            </div>
            <p className="text-xs text-brand-100/70 text-center mt-5">
              האמור אינו מהווה ייעוץ להשקעה ו/או ייעוץ מס. על הרוכש ו/או המוכר חלה החובה
              והאחריות לקבל ייעוץ מס אישי פרטני המתאים למצבם.
            </p>
          </div>
        </div>
      </section>

      <Calculator />
      <Registration />
      <Faq />

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100 px-4 leading-relaxed">
        <p className="max-w-2xl mx-auto mb-2">
          האמור באתר אינו ייעוץ משפטי, מיסויי או פיננסי ואינו תחליף לייעוץ פרטני.
          כל עסקה מותנית בשומה, בבדיקה משפטית ובייצוג נפרד לכל צד.
        </p>
        <p>
          © {new Date().getFullYear()} ויאז'ה ישראלית · מודל שליש דירה · חיים אטקין, שמאות מקרקעין ·{" "}
          <span dir="ltr">viager.co.il</span> · כל הזכויות שמורות · גרסת ביתא
        </p>
      </footer>
    </main>
  );
}
