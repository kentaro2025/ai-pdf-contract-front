import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/account-status/",
          "/ask/",
          "/upload/",
          "/payment/",
          "/login/",
          "/signup/",
          "/forgot-password/",
          "/setup/",
          "/subscribe/",
          "/cart/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/account-status/",
          "/ask/",
          "/upload/",
          "/payment/",
          "/login/",
          "/signup/",
          "/forgot-password/",
          "/setup/",
          "/subscribe/",
          "/cart/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
