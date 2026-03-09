'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Scale, 
  AlertTriangle, 
  Lock, 
  RefreshCw, 
  Mail,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms', icon: CheckCircle },
  { id: 'service', title: '2. Description of Service', icon: Briefcase },
  { id: 'trust-sign', title: '3. Jhustify Trust Sign', icon: ShieldCheck },
  { id: 'responsibilities', title: '4. Business Responsibilities', icon: Users },
  { id: 'payments', title: '5. Subscription & Payments', icon: CreditCard },
  { id: 'disputes', title: '6. Dispute Resolution', icon: Scale },
  { id: 'liability', title: '7. Limitation of Liability', icon: AlertTriangle },
  { id: 'data', title: '8. Data Protection', icon: Lock },
  { id: 'changes', title: '9. Changes to Terms', icon: RefreshCw },
  { id: 'contact', title: '10. Contact', icon: Mail },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  // Handle scroll spy for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      
      const currentScrollPosition = window.scrollY + 200; // offset for header

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= currentScrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset for sticky header
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <Header />
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#d3f5ce] to-[#D9F8D4] pt-20 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#a8d59d]/20 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6"
          >
            <FileText size={40} className="text-[#6d6e6b]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#6d6e6b] mb-4 tracking-tight"
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-700 font-medium"
          >
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
          
          {/* Table of Contents - Sticky Sidebar */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-28">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
                Table of Contents
              </h3>
              <nav className="space-y-1 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(section.id, e)}
                      className={`relative flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 text-sm font-medium z-10 ${
                        isActive 
                          ? 'text-[#465362] bg-[#d3f5ce]/40 font-bold' 
                          : 'text-gray-500 hover:text-[#465362] hover:bg-gray-100'
                      }`}
                    >
                      {/* Active indicator dot */}
                      <span className={`absolute left-[11px] w-2 h-2 rounded-full -translate-x-1/2 transition-colors duration-300 ${
                        isActive ? 'bg-[#a8d59d] ring-4 ring-[#F5F5F5]' : 'bg-transparent'
                      }`} />
                      <section.icon size={16} className={isActive ? 'text-[#a8d59d]' : 'text-gray-400'} />
                      {section.title}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                <Mail size={24} className="mx-auto text-gray-400 mb-2" />
                <h4 className="font-semibold text-[#465362] mb-1">Have questions?</h4>
                <p className="text-xs text-gray-500 mb-3">Our support team is here to help clarify any terms.</p>
                <Link href={'/contact'} className="text-[#a8d59d] font-semibold text-sm hover:underline">
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="lg:w-3/4">
            <Card className="p-8 md:p-12 !rounded-3xl shadow-sm border border-gray-100 bg-white">
              <div className="prose prose-lg max-w-none text-gray-600">
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                  
                  {/* Section 1 */}
                  <section id="acceptance" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6 relative">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                        <CheckCircle size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">1. Acceptance of Terms</h2>
                    </div>
                    <p className="leading-relaxed">
                      By accessing and using Jhustify, you accept and agree to be bound by the terms and provision of this agreement. 
                      If you do not agree to these Terms of Service, please do not use our platform. These terms constitute a legally binding agreement between you and Jhustify regarding your use of our services.
                    </p>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 2 */}
                  <section id="service" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
                        <Briefcase size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">2. Description of Service</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      Jhustify is a highly advanced business verification and trust platform focused on African businesses. We provide:
                    </p>
                    <ul className="space-y-3 mt-4 text-gray-700 marker:text-[#a8d59d] grid md:grid-cols-2 gap-x-6">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Business verification services for both formal and informal sectors.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>A searchable, AI-driven directory of verified businesses.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Proprietary Trust Badges and immutable verification credentials.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Secure communication tools connecting buyers and sellers.</span>
                      </li>
                    </ul>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 3 */}
                  <section id="trust-sign" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500">
                        <ShieldCheck size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">3. Jhustify Trust Sign</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      The Jhustify Trust Sign is our premium verification standard. Earning and displaying this badge confirms that we have vetted your identity and operations. It indicates:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Verified operational contact data</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Geo-verified physical storefront or operational base</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Authenticity of legal incorporation (Formal) or community proof of presence (Informal)</li>
                    </ul>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                      <p className="text-amber-800 text-sm m-0">
                        <strong>Important Liability Disclaimer:</strong> The Jhustify Trust Sign does <em>NOT</em> absolutely guarantee product/service quality, immediate financial stability, external legal compliance, or mediation of failed commercial transactions. Buyers must still exercise due diligence.
                      </p>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 4 */}
                  <section id="responsibilities" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500">
                        <Users size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">4. Business Responsibilities</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      To maintain a high-trust ecosystem, verified businesses on the Jhustify platform agree to strictly adhere to the following covenants:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Accuracy</h4>
                        <p className="text-sm text-gray-600">Provide flawlessly accurate and truthful corporate information.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Maintenance</h4>
                        <p className="text-sm text-gray-600">Proactively maintain and update contact information immediately upon changes.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Cooperation</h4>
                        <p className="text-sm text-gray-600">Cooperate wholly with random manual audit processes initiated by Jhustify.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Compliance</h4>
                        <p className="text-sm text-gray-600">Operate strictly within the confines of applicable local and international commercial law.</p>
                      </div>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 5 */}
                  <section id="payments" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500">
                        <CreditCard size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">5. Subscription & Payments</h2>
                    </div>
                    <p className="leading-relaxed mb-6">
                      Jhustify offers a competitive and transparent tiered structure designed to scale with your business natively:
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="flex-1 border-2 border-gray-100 rounded-2xl p-5 hover:border-[#a8d59d] transition-colors">
                        <h4 className="font-bold text-lg mb-2">Basic Tier</h4>
                        <p className="font-mono text-[#a8d59d] font-bold text-xl mb-3">Free Forever</p>
                        <p className="text-sm">Standard directory placement, limited inbox, and community badge eligibility.</p>
                      </div>
                      <div className="flex-1 border-2 border-[#a8d59d] bg-[#d3f5ce]/10 rounded-2xl p-5 shadow-sm">
                        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                          <span className="bg-[#a8d59d] text-white text-[10px] font-bold px-2 py-1 rounded-full">POPULAR</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Premium Verified</h4>
                        <p className="font-mono text-[#6d6e6b] font-bold text-xl mb-3">₦1,200 <span className="text-sm font-sans font-normal">/ year</span></p>
                        <p className="text-sm">Full verification suite, Trust Sign, analytics dashboard, priority ranking, and unlimited lead processing.</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      Subscriptions are billed annually. You may cancel renewal at any time; however, active subscription fees are non-refundable. Basic listings permanently remain free. We support payments across the continent via Debit/Credit, Mobile Money (M-Pesa, MTN MoMo), and direct bank rails.
                    </p>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 6 */}
                  <section id="disputes" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
                        <Scale size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">6. Dispute Resolution</h2>
                    </div>
                    <p className="leading-relaxed">
                      While Jhustify intrinsically facilitates verification, we do not formally mediate B2B or B2C commerce disputes. By maintaining the Trust Sign, businesses submit to platform integrity standards. Should a Verified business be formally accused of fraud, Jhustify retains the absolute right to suspend the badge pending an internal compliance investigation. Verified businesses defaulting on compliance risk permanent de-platforming.
                    </p>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 7 */}
                  <section id="liability" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                        <AlertTriangle size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">7. Limitation of Liability</h2>
                    </div>
                    <p className="leading-relaxed">
                      Jhustify shall unequivocally not be held liable for any direct, indirect, incidental, special, consequential, or exemplary damages emerging from:
                    </p>
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-600">
                      <li>Bilateral or multilateral transactions executed between platform users.</li>
                      <li>Fraudulent misrepresentation of identity or capacity bypassed by document forgeries.</li>
                      <li>Unscheduled service downtime resulting in loss of potential leads.</li>
                      <li>Decisions, contracts, or capital allocations made strictly reliant upon a Jhustify Verification Status.</li>
                    </ul>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 8 */}
                  <section id="data" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-500">
                        <Lock size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">8. Data Protection</h2>
                    </div>
                    <p className="leading-relaxed">
                      We treat your commercial identity data with military-grade encryption workflows in compliance with the NDPR and other pan-African data protection regimes. By initiating verification, you explicitly consent to the cryptographic storage and processing parameters as strictly defined within our Privacy Policy.
                    </p>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 9 */}
                  <section id="changes" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0 text-cyan-500">
                        <RefreshCw size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">9. Changes to Terms</h2>
                    </div>
                    <p className="leading-relaxed">
                      Jhustify architecture and operations iterate rapidly. We reserve the unequivocal right to modify, append, or overhaul these binding terms at our discretion. Significant policy updates will trigger a dashboard alert. Continued utilization of the platform post-amendment constitutes full legal acceptance.
                    </p>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 10 */}
                  <section id="contact" className="scroll-mt-32 pb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                        <Mail size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-[#465362] m-0">10. Contact legal</h2>
                    </div>
                    <p className="leading-relaxed">
                      For corporate inquiries, compliance questions, or rigorous clarification on these binding agreements, dispatch an encrypted trace to:
                      <br/>
                      <a href="mailto:legal@jhustify.com" className="inline-flex items-center gap-2 mt-4 text-[#a8d59d] font-bold hover:text-[#8ac57a] transition-colors">
                        legal@jhustify.com <ChevronRight size={16} />
                      </a>
                    </p>
                  </section>

                </motion.div>
                
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
