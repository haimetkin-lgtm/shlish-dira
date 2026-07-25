import type { MetadataRoute } from "next";

// נדרש ב-output: export
export const dynamic = "force-static";

const SITE_URL = "https://viager.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];
}
