'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <h1 className="text-4xl font-bold text-[#465362] mb-4">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-gray max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Jhustify, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to these Terms of Service, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  Jhustify is a business verification and trust platform focused on African businesses. We provide:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Business verification services for both formal and informal businesses</li>
                  <li>A searchable directory of verified businesses across Africa</li>
                  <li>Trust badges and verification credentials</li>
                  <li>Communication tools between businesses and customers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">3. Jhustify Trust Sign</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The Jhustify Trust Sign is a verification badge that indicates:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Verified contact information (phone, email, address)</li>
                  <li>Verified business location</li>
                  <li>Vetted business documents (for formal businesses) or proof of presence (for informal businesses)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>Important:</strong> The Jhustify Trust Sign does NOT guarantee:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Product or service quality</li>
                  <li>Financial stability or creditworthiness</li>
                  <li>Legal compliance beyond basic verification</li>
                  <li>Transaction reliability or completion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">4. Business Responsibilities</h2>
                <p className="text-gray-700 leading-relaxed">
                  Businesses using Jhustify agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Maintain current contact information</li>
                  <li>Cooperate with verification processes</li>
                  <li>Comply with all applicable local laws and regulations</li>
                  <li>Respond to customer inquiries in a timely manner</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">5. Subscription and Payments</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our pricing structure is simple and transparent:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Basic Listing:</strong> Free forever - Basic business listing with core features</li>
                  <li><strong>Premium Features:</strong> ₦1,200 per month (or equivalent in your local African currency) - Includes Trust Badge, verification, analytics dashboard, unlimited messages, priority support, and advanced lead tracking</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Premium feature subscriptions are billed monthly. You may cancel at any time, but subscription fees are non-refundable. 
                  Basic listings remain free regardless of subscription status.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  We accept payments in various African currencies including Nigerian Naira (₦), South African Rand (R), 
                  Kenyan Shilling (KSh), Ghanaian Cedi (GHS), and other major African currencies. Payment methods include 
                  credit/debit cards, mobile money (M-Pesa, MTN MoMo), and bank transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">6. Dispute Resolution</h2>
                <p className="text-gray-700 leading-relaxed">
                  Jhustify provides a platform for verification, not transaction mediation. However, we take trust violations seriously. 
                  If you have concerns about a verified business, please contact our support team. Verified businesses agree to 
                  cooperate with our investigation process. Non-cooperation or confirmed fraud may result in badge revocation and 
                  platform suspension.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">7. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  Jhustify is not liable for any direct, indirect, incidental, or consequential damages arising from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Business transactions between users</li>
                  <li>Inaccurate business information provided by businesses</li>
                  <li>Service interruptions or technical issues</li>
                  <li>Decisions made based on verification status</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">8. Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect and process personal data in accordance with applicable data protection laws. By using Jhustify, 
                  you consent to our data collection and processing practices as described in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">9. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of the platform after changes 
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">10. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms of Service, please contact us at support@jhustify.com
                </p>
              </section>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

