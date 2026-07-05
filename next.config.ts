import type { NextConfig } from "next";

// האתר מוגש בדומיין ייעודי (viager.co.il) דרך GitHub Pages,
// ולכן אין צורך ב-basePath. קובץ public/CNAME מגדיר את הדומיין.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
