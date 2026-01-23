import type { Metadata } from "next"
import { FileText, Scale } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "Terms of Service - DocuMind AI | Legal Terms & Conditions",
  description: "Read DocuMind AI's Terms of Service to understand the legal terms and conditions governing your use of our document intelligence platform.",
  keywords: "DocuMind AI terms of service, terms and conditions, legal terms, user agreement, service agreement",
  openGraph: {
    title: "Terms of Service - DocuMind AI",
    description: "Legal terms and conditions for using DocuMind AI services.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - DocuMind AI",
    description: "Legal terms and conditions for using DocuMind AI services.",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-xs text-gray-500">Document Intelligence</p>
              </div>
            </Link>
            <Navigation showAuthButtons={true} />
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                By accessing or using DocuMind AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p>
                These Terms apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, and contributors of content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                DocuMind AI provides an AI-powered document intelligence platform that allows users to upload documents, ask questions, and receive AI-generated answers. The Service includes various subscription plans with different features and limitations.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">3.1 Account Creation</h3>
                <p>To use certain features of the Service, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3.2 Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in any fraudulent, abusive, or illegal activity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Upload documents containing illegal, harmful, or offensive content</li>
                <li>Use the Service to violate any laws or regulations</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Upload documents that infringe on intellectual property rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Subscriptions and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">5.1 Subscription Plans</h3>
                <p>
                  The Service offers various subscription plans with different features, limits, and pricing. Subscription fees are billed in advance on a recurring basis according to your selected plan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">5.2 Payment Terms</h3>
                <p>
                  By subscribing, you agree to pay all fees associated with your subscription. All fees are non-refundable except as required by law or as explicitly stated in our refund policy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">5.3 Cancellation</h3>
                <p>
                  You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period. You will continue to have access to the Service until the end of your paid period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">5.4 Price Changes</h3>
                <p>
                  We reserve the right to modify subscription prices. Price changes will be communicated to you in advance and will apply to subsequent billing cycles.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">6.1 Our Rights</h3>
                <p>
                  The Service and its original content, features, and functionality are owned by DocuMind AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">6.2 Your Content</h3>
                <p>
                  You retain ownership of documents and content you upload to the Service. By uploading content, you grant us a license to use, process, and store your content solely for the purpose of providing the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Disclaimers and Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">7.1 Service Availability</h3>
                <p>
                  The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">7.2 AI Accuracy</h3>
                <p>
                  While we strive for accuracy, AI-generated answers may contain errors or inaccuracies. You should verify critical information independently and not rely solely on AI-generated responses for important decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">7.3 Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, DocuMind AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                You agree to indemnify and hold harmless DocuMind AI, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the Service, violation of these Terms, or infringement of any rights of another.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in New Jersey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <ul className="list-none ml-4 space-y-2">
                <li><strong>Email:</strong> info@kncinnovations.com</li>
                <li><strong>Phone:</strong> +1 (704) 858-7836</li>
                <li><strong>Address:</strong> Little Ferry, New Jersey, United States</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} DocuMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
