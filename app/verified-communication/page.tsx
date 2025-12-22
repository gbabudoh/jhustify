'use client';

import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, Phone, Mail, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function VerifiedCommunication() {
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
              <CheckCircle className="text-[#465362]" size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#465362] mb-6 leading-tight">
              Verified Communication
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Professional, traceable communication channels for customer inquiries with verified contact information.
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
                  <MessageSquare className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Secure Messaging</h3>
                <p className="text-gray-600">
                  End-to-end encrypted messaging system for safe customer communications and business inquiries.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Phone className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Verified Phone Numbers</h3>
                <p className="text-gray-600">
                  All phone numbers are verified and authenticated, ensuring customers can reach legitimate businesses.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Mail className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Authenticated Email</h3>
                <p className="text-gray-600">
                  Verified email addresses with domain authentication to prevent phishing and spam communications.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Shield className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Traceable Interactions</h3>
                <p className="text-gray-600">
                  Every communication is logged and traceable, providing accountability and dispute resolution support.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <Clock className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Response Tracking</h3>
                <p className="text-gray-600">
                  Monitor response times and customer satisfaction with comprehensive communication analytics.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mb-4">
                  <CheckCircle className="text-[#465362]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">Professional Standards</h3>
                <p className="text-gray-600">
                  Maintain professional communication standards with verified business credentials and contact information.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
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
                How Verified Communication Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple steps to secure and professional business communication
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#465362]">1</span>
                </div>
                <h3 className="text-lg font-semibold text-[#465362] mb-2">Verification</h3>
                <p className="text-gray-600">Submit your business contact information for verification</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#465362]">2</span>
                </div>
                <h3 className="text-lg font-semibold text-[#465362] mb-2">Setup</h3>
                <p className="text-gray-600">Configure your verified communication channels</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#465362]">3</span>
                </div>
                <h3 className="text-lg font-semibold text-[#465362] mb-2">Connect</h3>
                <p className="text-gray-600">Start communicating with verified customers securely</p>
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
                  Verify Communications
                  <CheckCircle size={20} className="transition-transform group-hover:translate-x-1" />
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
