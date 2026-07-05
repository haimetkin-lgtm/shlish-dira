// תוחלת חיים נותרת משוערת לפי גיל ומין, בקירוב לנתוני הלמ"ס (ישראל).
// ערכים בנקודות עיגון, אינטרפולציה ליניארית ביניהן.

const ANCHORS: Record<"m" | "f", [age: number, remaining: number][]> = {
  m: [
    [60, 23.3],
    [65, 19.1],
    [70, 15.2],
    [75, 11.6],
    [80, 8.6],
    [85, 6.1],
    [90, 4.2],
    [95, 3.0],
  ],
  f: [
    [60, 25.9],
    [65, 21.6],
    [70, 17.4],
    [75, 13.4],
    [80, 9.9],
    [85, 7.0],
    [90, 4.8],
    [95, 3.4],
  ],
};

export function remainingYears(age: number, sex: "m" | "f"): number {
  const table = ANCHORS[sex];
  if (age <= table[0][0]) return table[0][1];
  if (age >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [a1, r1] = table[i];
    const [a2, r2] = table[i + 1];
    if (age >= a1 && age <= a2) {
      const t = (age - a1) / (a2 - a1);
      return r1 + t * (r2 - r1);
    }
  }
  return 10;
}
