'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, TrendingUp, MessageSquare, DollarSign, Eye, Lock, Award, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function VerificationStructure() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-6">
              <Shield className="text-[#465362]" size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#465362] mb-6 leading-tight">
              Verification Structure
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Building Africa's Gold Standard for business trust and verification
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features & Impact Table */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
              Features That Transform Businesses
            </h2>
            <p className="text-lg text-gray-600">
              Each feature solves critical business challenges in Africa's informal economy
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#465362] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">Pain Point Solved</th>
                    <th className="px-6 py-4 text-left font-semibold">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C2EABD] flex items-center justify-center">
                          <Award className="text-[#465362]" size={20} />
                        </div>
                        <span className="font-medium text-[#465362]">Verification Badge</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Lack of consumer trust</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Higher sales conversion for vendors
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C2EABD] flex items-center justify-center">
                          <Eye className="text-[#465362]" size={20} />
                        </div>
                        <span className="font-medium text-[#465362]">Directory Listing</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Low digital visibility</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        New customer discovery
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C2EABD] flex items-center justify-center">
                          <MessageSquare className="text-[#465362]" size={20} />
                        </div>
                        <span className="font-medium text-[#465362]">Communication Tool</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Disorganized operations</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Professionalized business workflow
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C2EABD] flex items-center justify-center">
                          <DollarSign className="text-[#465362]" size={20} />
                        </div>
                        <span className="font-medium text-[#465362]">Low Entry Cost</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Expensive tech barriers</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        High adoption in the informal sector
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Requirements */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
                Gold Standard Verification Requirements
              </h2>
              <p className="text-lg text-gray-600">
                Our verification system aligns with Africa's highest standards of identity management
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-[#465362] mb-6">Why Photo Verification is Game Changing</h3>
                <div className="space-y-4">
                  <Card hover>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                          <Eye className="text-[#465362]" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#465362] mb-2">Proof of Presence</h4>
                          <p className="text-gray-600">
                            A photo of the business owner or physical storefront acts as "visual proof" that the business isn't a ghost entity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card hover>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                          <Lock className="text-[#465362]" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#465362] mb-2">Fraud Deterrence</h4>
                          <p className="text-gray-600">
                            Fraudsters are significantly less likely to register if they have to provide a clear photo that can be cross-referenced with their ID.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#465362] mb-6">The Power of NIN (Nigeria)</h3>
                <div className="space-y-4">
                  <Card hover>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="text-[#465362]" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#465362] mb-2">Database Validation</h4>
                          <p className="text-gray-600">
                            Use third-party APIs (like Smile ID or Youverify) to instantly ping the NIMC database, ensuring the name matches the person registering.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card hover>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="text-[#465362]" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#465362] mb-2">Financial Readiness</h4>
                          <p className="text-gray-600">
                            NIN linked to SIM cards and bank accounts means verified users are "pre-vetted" for future financial services like micro-loans.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Workflow */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
              Verification Workflow & Trust Gap Solution
            </h2>
            <p className="text-lg text-gray-600">
              For just 1,200 Naira, we provide a high-value trust layer that transforms business credibility
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#465362] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Requirement</th>
                    <th className="px-6 py-4 text-left font-semibold">What it Proves</th>
                    <th className="px-6 py-4 text-left font-semibold">Why it Matters to Customers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#465362]">Passport/License</td>
                    <td className="px-6 py-4 text-gray-600">Legal identity</td>
                    <td className="px-6 py-4 text-gray-600">"I know who to hold accountable if things go wrong."</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#465362]">Mobile Number</td>
                    <td className="px-6 py-4 text-gray-600">Direct line of contact</td>
                    <td className="px-6 py-4 text-gray-600">"I can reach them instantly via the Jhustify tool."</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#465362]">Photo</td>
                    <td className="px-6 py-4 text-gray-600">Physical existence</td>
                    <td className="px-6 py-4 text-gray-600">"This is a real human, not just a digital bot."</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#465362]">NIN (Nigeria)</td>
                    <td className="px-6 py-4 text-gray-600">Government-backed ID</td>
                    <td className="px-6 py-4 text-gray-600">"This person is officially recognized by the state."</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Considerations */}
      <section className="bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
                Strategic Considerations for Launch
              </h2>
              <p className="text-lg text-gray-600">
                Tech-first approaches to maximize impact at our 1,200 Naira price point
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hover className="h-full">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                    <Eye className="text-[#465362]" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">Selfie-to-ID Matching</h3>
                  <p className="text-gray-600">
                    Implement a simple "Liveness Check" where users take a selfie to prevent someone from using a stolen ID card.
                  </p>
                </div>
              </Card>

              <Card hover className="h-full">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                    <Award className="text-[#465362]" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">Tiered Trust</h3>
                  <p className="text-gray-600">
                    Offer a "Basic" badge for phone/photo verification and a "Gold" badge for those who complete the full NIN/Government ID check.
                  </p>
                </div>
              </Card>

              <Card hover className="h-full">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                    <Lock className="text-[#465362]" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">Privacy Compliance</h3>
                  <p className="text-gray-600">
                    Ensure NDPR (Nigeria Data Protection Regulation) compliance to build trust with both buyers and business owners.
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
              Start Building Trust Today
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Join thousands of African businesses already benefiting from the Jhustify Trust Sign. Get verified for just 1,200 Naira.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="primary" 
                size="lg" 
                className="min-w-[260px] px-10 py-5 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl bg-[#465362] hover:bg-[#3a4550] text-white"
                asChild
              >
                <Link href="/verify" className="flex items-center justify-center gap-2">
                  Get Verified Now
                  <Shield size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
