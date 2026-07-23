import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteMeta";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The panel and the lead API are already noindex/non-HTML; keeping them
      // out of the crawl budget as well.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
