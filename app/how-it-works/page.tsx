'use client';

import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Building2, TrendingUp, CheckCircle2, Search, Camera, FileText, Phone, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Create Your Account',
      description: 'Sign up as a Business Owner or a Consumer. It only takes 2 minutes to get started.',
      icon: UserPlus,
      color: 'bg-blue-50 text-blue-600',
      details: ['Quick registration', 'Email verification', 'Profile setup']
    },
    {
      title: 'Verification Process',
      description: 'Our multi-tiered verification system ensures trust for every type of business.',
      icon: ShieldCheck,
      color: 'bg-green-50 text-green-600',
      details: ['Phone validation', 'Proof of presence', 'Identity document audit']
    },
    {
      title: 'Earn Your Trust Badge',
      description: 'Once verified, your business receives a trust badge that signals credibility to customers.',
      icon: Building2,
      color: 'bg-purple-50 text-purple-600',
      details: ['Visible on search', 'Verified status', 'Public trust score']
    },
    {
      title: 'Grow Your Exposure',
      description: 'Reach a wider audience and manage your reputation through the Jhustify dashboard.',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
      details: ['Analytics insights', 'Customer messages', 'Review management']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#6d6e6b] mb-6">
              How Jhustify Works
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We&apos;re bridging the trust gap between businesses and customers across Africa. 
              Our platform provides a secure environment for growth, verification, and visibility.
            </p>
          </motion.div>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center text-center group">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#6d6e6b] mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{step.description}</p>
                <ul className="space-y-2 text-left w-full mt-auto">
                  {step.details.map((detail, dIndex) => (
                    <li key={dIndex} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <CheckCircle2 size={14} className="text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Breakdown Section */}
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm mb-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />

          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#6d6e6b] mb-8">
                Verification for Every Sector
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Camera className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#6d6e6b] mb-2">Informal Sector Support</h4>
                    <p className="text-gray-600">
                      We understand that many African businesses operate without formal CAC registration. 
                      We use &quot;Proof of Presence&quot; — verifying your physical location, storefront, and active service delivery.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#6d6e6b] mb-2">Formal Business Audit</h4>
                    <p className="text-gray-600">
                      For registered entities, we verify government-issued IDs (NIN, Passports, Driver&apos;s Licenses) 
                      and linking them to official business documentation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Phone className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#6d6e6b] mb-2">Secure Communication</h4>
                    <p className="text-gray-600">
                      All verified businesses have a direct, validated phone line, allowing customers to 
                      reach you with confidence and zero friction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#F9FAFB] p-8 rounded-3xl border border-gray-100 shadow-inner"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#6d6e6b]">The Trust Score</h3>
                  <p className="text-sm text-gray-500">How we measure business integrity</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Identity Verification', value: 95, color: 'bg-green-500' },
                  { label: 'Business Longevity', value: 80, color: 'bg-blue-500' },
                  { label: 'Customer Reviews', value: 90, color: 'bg-purple-500' },
                  { label: 'Response Rate', value: 85, color: 'bg-orange-500' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-[#6d6e6b]">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-600">Overall Trust Level</span>
                <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  Gold Standard
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ/Other Aspects */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-[#6d6e6b] text-center mb-12">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is verification mandatory?",
                a: "No, but verified businesses get 10x more visibility and higher ranking in search results."
              },
              {
                q: "How long does verification take?",
                a: "Standard verification takes 24-48 hours once all documents are submitted."
              },
              {
                q: "What if I don't have a CAC certificate?",
                a: "You can still verify as an informal business using our physical presence validation tools."
              }
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-gray-100 cursor-pointer transition-all">
                <summary className="font-bold text-[#6d6e6b] flex items-center justify-between">
                  {faq.q}
                  <ChevronDown className="text-gray-400" size={20} />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#6d6e6b] to-[#4a4b49] rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Build Your Trust?</h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses already growing their credibility on Africa&apos;s most secure verification network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-[#76bc68] hover:bg-[#609b53] text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-[#76bc68]/20" asChild>
                <Link href="/register">Start Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-10 h-14 rounded-2xl font-bold text-lg" asChild>
                <Link href="/search" className="flex items-center gap-2">
                  <Search size={20} />
                  Browse Businesses
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

