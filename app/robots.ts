import type { MetadataRoute } from "next";

// נדרש ב-output: export
export const dynamic = "force-static";

const SITE_URL = "https://viager.co.il";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
