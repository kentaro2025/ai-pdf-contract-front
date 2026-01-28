import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getSubscriptionPlans } from "@/lib/supabase/subscriptions"
import PricingClient from "@/components/pricing-client"

export default async function PricingPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch subscription plans from database
  const plans = await getSubscriptionPlans(supabase)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"

  // Structured data for pricing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pricing - DocuMind AI",
    description: "View pricing plans for DocuMind AI document intelligence platform",
    url: `${baseUrl}/pricing`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: `${baseUrl}/pricing`,
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PricingClient user={user} plans={plans} />
    </>
  )
}

