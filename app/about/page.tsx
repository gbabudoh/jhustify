'use client';

import { motion, Variants } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Globe, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Heart,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Link from 'next/link';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <Header />
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#d3f5ce] to-[#D9F8D4] pt-24 pb-20 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#a8d59d]/20 rounded-full blur-2xl"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-white rounded-3xl shadow-md flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-300"
          >
            <ShieldCheck size={48} className="text-[#a8d59d]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-[#6d6e6b] mb-6 tracking-tight leading-tight"
          >
            Building Africa&apos;s <br className="hidden md:block"/> Trust Economy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            The unified gateway to Africa&apos;s real economy. Bridging the gap between formal and informal commerce.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Split Section */}
      <section className="container mx-auto px-4 py-20 -mt-10 relative z-20">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8"
        >
          {/* Mission Card */}
          <motion.div variants={fadeInUp}>
            <Card className="p-10 h-full border-none shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300 !rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 shadow-sm">
                <Target size={32} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#465362] mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Jhustify exists to radically bridge the trust gap in African commerce. We fiercely believe that every business, whether operating from a high-rise corporate office or a dynamic local market stall, deserves the opportunity to build verifiable credibility, access capital, and scale globally.
              </p>
            </Card>
          </motion.div>

          {/* Vision Card */}
          <motion.div variants={fadeInUp}>
            <Card className="p-10 h-full border-none shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300 !rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 shadow-sm">
                <Globe size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#465362] mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the unassailable baseline standard for business identity verification across the African continent. We envision a near future where the Jhustify Trust Sign functions as the ultimate catalyst for frictionless, confident B2B and B2C transactions across borders.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#465362] mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">The foundational principles that drive our engineering, our policy, and our team.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover className="p-8 border-none shadow-lg bg-gray-50 group transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#465362] mb-3">Trust First</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Absolute transparency and mathematical reliability govern every line of code we ship.</p>
            </Card>
            
            <Card hover className="p-8 border-none shadow-lg bg-gray-50 group transition-all duration-300 hover:-translate-y-2 lg:translate-y-4">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#465362] mb-3">Radical Inclusivity</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Dignifying and serving the vibrant informal markets with the exact same vigor as formal corporations.</p>
            </Card>

            <Card hover className="p-8 border-none shadow-lg bg-gray-50 group transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-6 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#465362] mb-3">Hyper Local</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Architected specifically for the extreme nuances, challenges, and beauty of the true African market.</p>
            </Card>

            <Card hover className="p-8 border-none shadow-lg bg-gray-50 group transition-all duration-300 hover:-translate-y-2 lg:translate-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-6 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#465362] mb-3">Relentless Innovation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Constantly iterating on trust algorithms to stay ahead of fraud and lower barriers to entry.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Real Impact Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Abstract dark decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#a8d59d]/10 to-transparent"></div>
        <div className="absolute -left-40 -top-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Verifying the Heartbeat of Output
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Jhustify isn&apos;t just a directory; it&apos;s a massive digital infrastructure project making business transactions safer, highly transparent, and universally accessible continent-wide.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d3f5ce]/20 text-[#d3f5ce] flex items-center justify-center"><TrendingUp size={16}/></span>
                  <span className="font-medium text-gray-200">Stimulating cross-border trade flow</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d3f5ce]/20 text-[#d3f5ce] flex items-center justify-center"><CheckCircle2 size={16}/></span>
                  <span className="font-medium text-gray-200">Decimating online marketplace fraud</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d3f5ce]/20 text-[#d3f5ce] flex items-center justify-center"><Users size={16}/></span>
                  <span className="font-medium text-gray-200">Digitizing millions of offline artisans</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center transform translate-y-8">
                <div className="text-4xl font-extrabold text-[#d3f5ce] mb-2">10k+</div>
                <div className="text-sm text-gray-400 font-medium">Verified Entities</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl font-extrabold text-blue-400 mb-2">99%</div>
                <div className="text-sm text-gray-400 font-medium">Fraud Prevention</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center transform translate-y-8">
                <div className="text-4xl font-extrabold text-amber-400 mb-2">15+</div>
                <div className="text-sm text-gray-400 font-medium">Countries Mapped</div>
              </div>
              <div className="bg-[#a8d59d] text-gray-900 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(168,213,157,0.3)]">
                <div className="text-4xl font-extrabold mb-2 text-[#465362]">$0</div>
                <div className="text-sm font-bold text-[#465362]/80">Basic Listing Cost</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#d3f5ce] to-[#D9F8D4] border-none !rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Decors */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Globe size={32} className="text-[#a8d59d]" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#465362] mb-6">
                Ready to Join the Movement?
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Whether you&apos;re an ambitious business owner securing your credibility or a consumer seeking vetted reliability, Jhustify is your platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#465362] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  Get Verified Now <ChevronRight size={20} className="ml-2" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#465362] font-bold rounded-2xl shadow-md border hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  Search Verified Businesses
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
