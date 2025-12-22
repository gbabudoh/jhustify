'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, Users, Lock, Eye, Award } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function TrustTransparency() {
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
              Trust & Transparency
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              The Jhustify Trust Sign signals reliability to customers, reducing fraud risk and transaction hesitation.
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
                  <CheckCircle className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Verification Process</h3>
                <p className="text-gray-600">
                  Our rigorous verification process ensures that every business on Jhustify is legitimate and trustworthy.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Users className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Customer Confidence</h3>
                <p className="text-gray-600">
                  Build trust with your customers through verified credentials and transparent business practices.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Lock className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Fraud Prevention</h3>
                <p className="text-gray-600">
                  Reduce fraud risk and transaction hesitation with our comprehensive trust verification system.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Eye className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Full Transparency</h3>
                <p className="text-gray-600">
                  Complete visibility into business credentials, customer reviews, and transaction history.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Award className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Trust Badges</h3>
                <p className="text-gray-600">
                  Display your verification status prominently with our recognizable trust badges.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Shield className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Secure Transactions</h3>
                <p className="text-gray-600">
                  Every transaction is protected by our trust framework, ensuring security for both parties.
                </p>
              </div>
            </Card>
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
                  Get Verified
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
