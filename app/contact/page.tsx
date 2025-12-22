'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

export default function ContactPage() {
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
                Contact Us
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Get in touch with the Jhustify team. We're here to help you build trust and grow your business.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <h2 className="text-2xl font-bold text-[#465362] mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2EABD] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2EABD] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2EABD] focus:border-transparent outline-none transition-all"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2EABD] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#465362] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-bold text-[#465362] mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                      <Mail className="text-[#465362]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#465362] mb-1">Email</h3>
                      <p className="text-gray-600">support@jhustify.com</p>
                      <p className="text-gray-600">business@jhustify.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                      <Phone className="text-[#465362]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#465362] mb-1">Phone</h3>
                      <p className="text-gray-600">+234 123 456 7890</p>
                      <p className="text-gray-600">Mon-Fri: 9AM-6PM WAT</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-[#465362]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#465362] mb-1">Office</h3>
                      <p className="text-gray-600">
                        123 Business Avenue<br />
                        Victoria Island, Lagos<br />
                        Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-bold text-[#465362] mb-4">Business Hours</h2>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
