'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <h1 className="text-4xl font-bold text-[#465362] mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-gray max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Business information (name, category, address, contact details)</li>
                  <li>Personal identification documents (National ID, registration certificates)</li>
                  <li>Verification materials (photos, videos, documents)</li>
                  <li>Account information (email, password, name)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide verification services and maintain your business profile</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">3. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal data, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Secure storage of identification documents</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security assessments</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">4. Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell your personal data. We may share information with:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Payment processors for transaction processing</li>
                  <li>Third-party verification services (KYC/KYB providers) for identity verification</li>
                  <li>Legal authorities when required by law</li>
                  <li>Service providers who assist in platform operations (under strict confidentiality agreements)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">5. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  To exercise these rights, please contact us at privacy@jhustify.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">6. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal data for as long as necessary to provide our services and comply with legal obligations. 
                  Verification documents are retained in accordance with applicable data protection laws and our verification 
                  requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">7. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and improve our services. 
                  You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">8. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Jhustify is not intended for users under 18 years of age. We do not knowingly collect personal information 
                  from children.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">9. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your data may be transferred to and processed in countries other than your country of residence. We ensure 
                  appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#465362] mb-3">10. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about this Privacy Policy or our data practices, please contact us at privacy@jhustify.com
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

