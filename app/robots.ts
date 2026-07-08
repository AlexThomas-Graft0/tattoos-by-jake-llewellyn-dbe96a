import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") || "";
  const isPreview = host === "duckbyte.co" || host.endsWith(".duckbyte.co");
  if (isPreview) {
    // Not published yet — keep the preview subdomain out of Google.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${host}/sitemap.xml`,
  };
}
