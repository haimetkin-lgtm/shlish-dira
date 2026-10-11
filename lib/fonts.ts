import { Rubik_Distressed } from "next/font/google";

// פונט מרוט עם קרעים בשוליים (תומך עברית), להדגשה גרפית של מילה בודדת בכותרת.
export const distressedFont = Rubik_Distressed({
  subsets: ["hebrew", "latin"],
  weight: "400",
  display: "swap",
});
