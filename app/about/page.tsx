'use client';

import { motion } from 'framer-motion';
import { Shield, Target, Globe, Users, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#465362] mb-4">
                About Jhustify
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                The unified gateway to Africa's real economy. Building trust, one verification at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-[#465362]" size={32} />
              <h2 className="text-3xl font-bold text-[#465362]">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Jhustify exists to bridge the trust gap in African commerce. We believe that every business, 
              whether operating from a corporate office or a market stall, deserves the opportunity to build 
              credibility and grow.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By providing a centralized, reliable verification platform, we're creating the first comprehensive 
              digital map of Africa's diverse economy—from the formal sector to the vibrant informal markets 
              that power communities across the continent.
            </p>
          </Card>

          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-[#465362]" size={32} />
              <h2 className="text-3xl font-bold text-[#465362]">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              To become the trusted standard for business verification across Africa, enabling seamless, 
              confident transactions between businesses and customers.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a future where the Jhustify Trust Sign is recognized continent-wide as a symbol 
              of reliability, where customers can transact with confidence, and where businesses of all sizes 
              have equal opportunity to showcase their legitimacy.
            </p>
          </Card>

          {/* Values */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-[#465362]" size={32} />
              <h2 className="text-3xl font-bold text-[#465362]">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#C2EABD] mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#465362] mb-1">Trust First</h3>
                  <p className="text-gray-600">We prioritize transparency and reliability in everything we do.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#C2EABD] mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#465362] mb-1">Inclusivity</h3>
                  <p className="text-gray-600">We serve both formal and informal businesses equally.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#C2EABD] mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#465362] mb-1">African Focus</h3>
                  <p className="text-gray-600">Built specifically for the African market and its unique needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#C2EABD] mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-[#465362] mb-1">Innovation</h3>
                  <p className="text-gray-600">Continuously improving our platform to better serve our community.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
                Building Africa's Trust Economy
              </h2>
              <p className="text-lg text-gray-600">
                Join us in creating a more transparent, trustworthy marketplace for African businesses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card hover>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                    <Users className="text-[#465362]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">For Businesses</h3>
                  <p className="text-gray-600">
                    Get verified, build credibility, and unlock new customer opportunities with the Jhustify Trust Sign.
                  </p>
                </div>
              </Card>

              <Card hover>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-[#465362]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">For Customers</h3>
                  <p className="text-gray-600">
                    Search and discover verified businesses across Africa. Transact with confidence, knowing you're dealing with verified entities.
                  </p>
                </div>
              </Card>

              <Card hover>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                    <Globe className="text-[#465362]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">For Africa</h3>
                  <p className="text-gray-600">
                    Contributing to economic growth by making business transactions safer, more transparent, and more accessible.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Card>
            <h2 className="text-3xl font-bold text-[#465362] mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're a business owner looking to get verified or a customer searching for trusted businesses, 
              Jhustify is here to help you build and find trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/verify"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#465362] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get Verified
              </a>
              <a
                href="/search"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#C2EABD] text-[#465362] font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Search Businesses
              </a>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

