"use client";

import { useMemo, useState } from "react";
import { remainingYears } from "@/lib/lifeExpectancy";

const fmt = (n: number) =>
  new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(Math.round(n));

const fmtM = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} מיליון ₪`;
  return `${fmt(n)} ₪`;
};

type Sex = "m" | "f";

export default function Calculator() {
  const [age, setAge] = useState(75);
  const [sex, setSex] = useState<Sex>("m");
  const [value, setValue] = useState(2_500_000);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // הנחות ברירת מחדל, ניתנות לשינוי במצב מתקדם
  const [mortgageRate, setMortgageRate] = useState(6.5); // ריבית אפקטיבית שנתית, כולל הצמדה
  const [appreciation, setAppreciation] = useState(3.0); // עליית ערך שנתית של הדירה
  const [cashRatio, setCashRatio] = useState(65); // אחוז משווי השליש שמתקבל במזומן

  const calc = useMemo(() => {
    const horizon = remainingYears(age, sex);
    const cashNow = (value / 3) * (cashRatio / 100);
    const years = Math.max(25, Math.ceil(horizon) + 5);

    const rows = [];
    let breakEven: number | null = null;
    for (let t = 0; t <= years; t++) {
      const apt = value * Math.pow(1 + appreciation / 100, t);
      const debt = cashNow * Math.pow(1 + mortgageRate / 100, t);
      const heirsReverse = Math.max(0, apt - debt);
      const heirsShlish = (2 / 3) * apt;
      if (breakEven === null && t > 0 && heirsReverse < heirsShlish) breakEven = t;
      rows.push({ t, heirsReverse, heirsShlish, debt, apt });
    }

    const atHorizon = rows[Math.min(Math.round(horizon), years)];
    return { horizon, cashNow, rows, breakEven, atHorizon, years };
  }, [age, sex, value, mortgageRate, appreciation, cashRatio]);

  // ממדי הגרף
  const W = 640;
  const H = 300;
  const PAD = { top: 16, bottom: 34, left: 14, right: 74 };
  const maxY = Math.max(...calc.rows.map((r) => Math.max(r.heirsReverse, r.heirsShlish))) * 1.08;
  const x = (t: number) => PAD.left + (t / calc.years) * (W - PAD.left - PAD.right);
  const y = (v: number) => H - PAD.bottom - (v / maxY) * (H - PAD.top - PAD.bottom);
  const path = (key: "heirsReverse" | "heirsShlish") =>
    calc.rows.map((r, i) => `${i === 0 ? "M" : "L"}${x(r.t).toFixed(1)},${y(r[key]).toFixed(1)}`).join(" ");

  return (
    <section id="calculator" className="py-16 bg-brand-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-brand-800 mb-2">
          מחשבון: מכירת שליש מול משכנתא הפוכה
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          שני המסלולים נותנים אותו סכום מזומן היום. ההבדל הוא מה יישאר לילדים.
          במשכנתא הפוכה החוב תופח בריבית דריבית. במכירת שליש, שני שליש נשארים לירושה, לנצח.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* קלטים */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">גיל</label>
              <input
                type="number"
                min={60}
                max={95}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מין</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                {(["m", "f"] as Sex[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      sex === s ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {s === "m" ? "גבר" : "אישה"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שווי הדירה (₪)</label>
              <input
                type="number"
                min={500_000}
                step={100_000}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-brand-600 hover:text-brand-700 mb-4"
          >
            {showAdvanced ? "− הסתר הנחות חישוב" : "+ הנחות חישוב (ריבית, עליית ערך, שיעור מזומן)"}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 p-4 bg-gray-50 rounded-xl text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  ריבית משכנתא הפוכה אפקטיבית: {mortgageRate.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min={4}
                  max={9.5}
                  step={0.1}
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  עליית ערך שנתית: {appreciation.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={0.5}
                  value={appreciation}
                  onChange={(e) => setAppreciation(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  מזומן משווי השליש: {cashRatio}%
                </label>
                <input
                  type="range"
                  min={50}
                  max={85}
                  step={5}
                  value={cashRatio}
                  onChange={(e) => setCashRatio(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  השליש נמכר בהנחה כי הדירה תפוסה והזכות לא נזילה
                </p>
              </div>
            </div>
          )}

          {/* כרטיסי תוצאה */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-brand-50 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">מזומן היום, בשני המסלולים</div>
              <div className="text-xl font-bold text-brand-800">{fmtM(calc.cashNow)}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">
                ירושה במכירת שליש (בעוד {Math.round(calc.horizon)} שנים)
              </div>
              <div className="text-xl font-bold text-emerald-700">{fmtM(calc.atHorizon.heirsShlish)}</div>
            </div>
            <div className="rounded-xl bg-rose-50 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">
                ירושה במשכנתא הפוכה (בעוד {Math.round(calc.horizon)} שנים)
              </div>
              <div className="text-xl font-bold text-rose-700">{fmtM(calc.atHorizon.heirsReverse)}</div>
            </div>
          </div>

          {/* גרף */}
          <div className="overflow-x-auto" dir="ltr">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img"
              aria-label="גרף השוואת ירושה לאורך שנים">
              {/* קווי רשת */}
              {[0.25, 0.5, 0.75, 1].map((f) => (
                <g key={f}>
                  <line x1={PAD.left} x2={W - PAD.right} y1={y(maxY * f)} y2={y(maxY * f)}
                    stroke="#e5e7eb" strokeDasharray="3 4" />
                  <text x={W - PAD.right + 6} y={y(maxY * f) + 4} fontSize="10" fill="#9ca3af">
                    {(maxY * f / 1_000_000).toFixed(1)}M
                  </text>
                </g>
              ))}
              {/* ציר X */}
              {calc.rows.filter((r) => r.t % 5 === 0).map((r) => (
                <text key={r.t} x={x(r.t)} y={H - 14} fontSize="10" fill="#6b7280" textAnchor="middle">
                  {r.t === 0 ? "היום" : `+${r.t}`}
                </text>
              ))}
              {/* סימון תוחלת חיים */}
              <line x1={x(calc.horizon)} x2={x(calc.horizon)} y1={PAD.top} y2={H - PAD.bottom}
                stroke="#c9a227" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x={x(calc.horizon)} y={PAD.top - 2} fontSize="10" fill="#b08d1f" textAnchor="middle">
                תוחלת חיים
              </text>
              {/* קווים */}
              <path d={path("heirsShlish")} fill="none" stroke="#059669" strokeWidth="3" />
              <path d={path("heirsReverse")} fill="none" stroke="#e11d48" strokeWidth="3" />
            </svg>
          </div>
          <div className="flex justify-center gap-6 text-sm mt-2">
            <span className="flex items-center gap-2">
              <span className="w-4 h-1 rounded bg-emerald-600 inline-block" />
              ירושה לילדים: מכירת שליש
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-1 rounded bg-rose-600 inline-block" />
              ירושה לילדים: משכנתא הפוכה
            </span>
          </div>

          {calc.breakEven !== null && (
            <p className="text-center text-sm text-gray-600 mt-4 bg-gray-50 rounded-lg py-2 px-4">
              כבר משנה {calc.breakEven} הירושה במסלול מכירת השליש גבוהה יותר, והפער רק גדל עם השנים.
            </p>
          )}

          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            החישוב להמחשה בלבד ואינו ייעוץ פיננסי, משפטי או מיסויי. תוחלת חיים בקירוב לפי נתוני הלמ"ס.
            תנאי משכנתא הפוכה בפועל משתנים בין גופים ומסלולים. תמחור שליש בפועל נקבע בשומה פרטנית.
            ההשוואה אינה כוללת עלויות נלוות של משכנתא הפוכה (פתיחת תיק, ביטוחים ודמי שירות), כלומר
            התוצאה בפועל צפויה להיות טובה פחות עבורה מהמוצג.
          </p>
        </div>
      </div>
    </section>
  );
}
