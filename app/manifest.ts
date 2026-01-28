import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"

  return {
    name: "DocuMind AI - Your Intelligent Document Assistant",
    short_name: "DocuMind AI",
    description: "Upload PDFs and ask questions powered by AI. Transform your documents into intelligence.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
