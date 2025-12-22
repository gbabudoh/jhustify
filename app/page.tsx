'use client';

import { motion } from 'framer-motion';
import { Search, Shield, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TrustBadge from '@/components/TrustBadge';
import BannerDisplay from '@/components/BannerDisplay';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Banner Section */}
      <BannerDisplay />

      {/* Features Section */}
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
              Why Choose Jhustify?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building trust and visibility for both formal and informal businesses across Africa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/trust-transparency" className="block">
              <Card hover className="h-full">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                    <Shield className="text-[#465362]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">Trust & Transparency</h3>
                  <p className="text-gray-600">
                    The Jhustify Trust Sign signals reliability to customers, reducing fraud risk and transaction hesitation.
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/business-visibility" className="block">
              <Card hover className="h-full">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                    <TrendingUp className="text-[#465362]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">Business Visibility</h3>
                  <p className="text-gray-600">
                    A centralized, Africa-focused directory increasing visibility for SMEs that lack robust online presence.
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/verified-communication" className="block">
              <Card hover className="h-full">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-[#465362]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#465362] mb-2">Verified Communication</h3>
                  <p className="text-gray-600">
                    Professional, traceable communication channels for customer inquiries with verified contact information.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
