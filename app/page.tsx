import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import HomeClient from "@/components/home-client"

export default async function Home() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DocuMind AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "AI-powered document intelligence platform that allows users to upload PDFs and ask questions in natural language.",
    url: baseUrl,
    author: {
      "@type": "Organization",
      name: "DocuMind AI",
      url: baseUrl,
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@kncinnovations.com",
        telephone: "+1-704-858-7836",
        contactType: "Customer Service",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Little Ferry",
        addressRegion: "New Jersey",
        addressCountry: "US",
      },
    },
    featureList: [
      "AI-Powered Document Analysis",
      "Natural Language Question Answering",
      "PDF Document Processing",
      "Contract Intelligence",
      "Secure Document Storage",
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient user={user} />
    </>
  )
}
