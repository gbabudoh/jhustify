'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Globe, Search, Users, BarChart, Target } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function BusinessVisibility() {
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
              <TrendingUp className="text-[#465362]" size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#465362] mb-6 leading-tight">
              Business Visibility
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              A centralized, Africa-focused directory increasing visibility for SMEs that lack robust online presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Globe className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Africa-Wide Reach</h3>
                <p className="text-gray-600">
                  Connect with customers across the entire African continent through our centralized directory platform.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Search className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Enhanced Discoverability</h3>
                <p className="text-gray-600">
                  Get found easily by customers searching for verified businesses in your industry and location.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Users className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">SME Focus</h3>
                <p className="text-gray-600">
                  Specifically designed to help small and medium enterprises compete in the digital marketplace.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <BarChart className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Growth Analytics</h3>
                <p className="text-gray-600">
                  Track your business visibility and customer engagement with comprehensive analytics tools.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Target className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Targeted Exposure</h3>
                <p className="text-gray-600">
                  Reach the right customers with our intelligent matching and recommendation system.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <TrendingUp className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Digital Presence</h3>
                <p className="text-gray-600">
                  Establish a strong online presence even without technical expertise or large marketing budgets.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#465362] mb-4">
                Why Business Visibility Matters
              </h2>
              <p className="text-lg text-gray-600">
                In today's digital economy, being visible means being viable
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#465362] mb-2">80%</div>
                <p className="text-gray-600">of customers research businesses online before making decisions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#465362] mb-2">3x</div>
                <p className="text-gray-600">increase in customer inquiries for businesses with strong online presence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Button Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center">
              <Button 
                variant="primary" 
                size="lg" 
                className="min-w-[260px] px-10 py-5 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl bg-[#465362] hover:bg-[#3a4550] text-white"
                asChild
              >
                <Link href="/verify" className="flex items-center justify-center gap-2">
                  Get Listed Now
                  <TrendingUp size={20} className="transition-transform group-hover:translate-x-1" />
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
