'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Database, 
  Settings, 
  Lock, 
  Share2, 
  UserCheck, 
  Clock, 
  Cookie, 
  Baby, 
  Globe, 
  Mail,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const sections = [
  { id: 'collect', title: '1. Information We Collect', icon: Database },
  { id: 'use', title: '2. How We Use Information', icon: Settings },
  { id: 'security', title: '3. Data Security', icon: Lock },
  { id: 'sharing', title: '4. Data Sharing', icon: Share2 },
  { id: 'rights', title: '5. Your Rights', icon: UserCheck },
  { id: 'retention', title: '6. Data Retention', icon: Clock },
  { id: 'cookies', title: '7. Cookies and Tracking', icon: Cookie },
  { id: 'children', title: '8. Children&apos;s Privacy', icon: Baby },
  { id: 'international', title: '9. International Transfers', icon: Globe },
  { id: 'contact', title: '10. Contact Us', icon: Mail },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('collect');

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
            <ShieldCheck size={40} className="text-[#6d6e6b]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#6d6e6b] mb-4 tracking-tight"
          >
            Privacy Policy
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
                <h4 className="font-semibold text-[#465362] mb-1">Data Questions?</h4>
                <p className="text-xs text-gray-500 mb-3">Our privacy team is available to discuss your data rights.</p>
                <Link href={'mailto:privacy@jhustify.com'} className="text-[#a8d59d] font-semibold text-sm hover:underline">
                  Contact Privacy Team →
                </Link>
              </div>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="lg:w-3/4">
            <Card className="p-8 md:p-12 !rounded-3xl shadow-sm border border-gray-100 bg-white">
              <div className="prose prose-lg max-w-none text-gray-600">
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                  
                  {/* Section 1 */}
                  <section id="collect" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                        <Database size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">1. Information We Collect</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      We responsibly collect robust commercial and verification data that you provide directly to our platform, securely encompassing:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Business Demographics</h4>
                        <p className="text-sm text-gray-600">Corporate name, precise geo-location, category, and core operational contact details.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Identity Credentials</h4>
                        <p className="text-sm text-gray-600">Vetted national ID documentation and formal certificates of incorporation.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Media Artifacts</h4>
                        <p className="text-sm text-gray-600">Photographs and location verification videos attesting to physical business presence.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">Financial Data</h4>
                        <p className="text-sm text-gray-600">Secure banking information processed anonymously via certified third-party payment gateways.</p>
                      </div>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 2 */}
                  <section id="use" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500">
                        <Settings size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">2. How We Use Your Information</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      The core directive of our data ingestion is to generate unwavering commercial trust. We utilize your data exclusively to:
                    </p>
                    <ul className="space-y-3 mt-4 text-gray-700 marker:text-[#a8d59d]">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Perform rigorous KYC/KYB audits to issue your Jhustify Trust Sign.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Populate and rank your business entity within the global search directory.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Seamlessly execute monthly or annual subscription payments.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={20} className="text-[#a8d59d] shrink-0 mt-0.5" />
                        <span>Dispatch critical platform updates, security alerts, and lead notifications.</span>
                      </li>
                    </ul>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 3 */}
                  <section id="security" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500">
                        <Lock size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">3. Data Security</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      We architect our security protocols with zero-trust principles to fiercely defend your proprietary data assets. Our infrastructure boasts:
                    </p>
                    <div className="bg-gray-900 rounded-2xl p-6 text-gray-300 font-mono text-sm leading-relaxed overflow-hidden shadow-inner">
                      <div className="flex items-center gap-2 mb-4 text-[#a8d59d] font-sans font-bold text-xs uppercase tracking-widest">
                        <ShieldCheck size={14} /> Security Matrix Active
                      </div>
                      <p className="mb-2"><span className="text-blue-400">cryptography:</span> AES-256 state encryption at rest and TLS 1.3 in transit.</p>
                      <p className="mb-2"><span className="text-blue-400">auth_module:</span> Secure multi-factor authentication scaling architectures.</p>
                      <p className="mb-2"><span className="text-blue-400">storage_vault:</span> Highly-partitioned and sequestered document blobs.</p>
                      <p><span className="text-blue-400">compliance:</span> Relentless automated vulnerability and penetration scanning.</p>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 4 */}
                  <section id="sharing" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500">
                        <Share2 size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">4. Data Sharing</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                      <strong>We categorically refuse to sell your personal or corporate data vectors to aggregate brokers.</strong> Sharing is radically restricted exclusively to essential infrastructure partners:
                    </p>
                    <ul className="space-y-2 mb-6 text-gray-600 pl-4 border-l-2 border-amber-100">
                      <li>• PCI-DSS compliant financial gateways executing your transactions.</li>
                      <li>• Specialized KYC/KYB identity algorithms validating official government portals.</li>
                      <li>• Official law enforcement subpoenas validated by jurisdictional courts.</li>
                      <li>• Essential cloud providers strictly bound by absolute confidentiality NDAs.</li>
                    </ul>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Section 5 */}
                  <section id="rights" className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0 text-cyan-500">
                        <UserCheck size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#465362] m-0">5. Your Digital Rights</h2>
                    </div>
                    <p className="leading-relaxed mb-6">
                      In absolute synchronicity with NDPR, GDPR where applicable, and African digital sovereignty doctrines, you wield the unalienable right to:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-[#a8d59d] hover:bg-[#d3f5ce]/20 transition-colors cursor-default">Request Data Portability</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-[#a8d59d] hover:bg-[#d3f5ce]/20 transition-colors cursor-default">Execute &apos;Right to be Forgotten&apos;</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-[#a8d59d] hover:bg-[#d3f5ce]/20 transition-colors cursor-default">Amend Inaccuracies</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-[#a8d59d] hover:bg-[#d3f5ce]/20 transition-colors cursor-default">Audit Processing Scope</span>
                    </div>
                    <p className="text-sm bg-cyan-50 text-cyan-800 p-4 rounded-lg inline-block">
                      Exert these authorities instantly by transmitting a formal decree to <strong>privacy@jhustify.com</strong>.
                    </p>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Sections 6 & 7 grouped nicely */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <section id="retention" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock size={20} className="text-rose-500" />
                        <h2 className="text-xl font-bold text-[#465362] m-0">6. Data Retention</h2>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Data persists exclusively for the lifespan of active verified services required under our legal compliance obligations. Irrelevant or obsolete identity documents are algorithmically purged following strict retention schedules.
                      </p>
                    </section>
                    
                    <section id="cookies" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4">
                        <Cookie size={20} className="text-yellow-500" />
                        <h2 className="text-xl font-bold text-[#465362] m-0">7. Cookies & Tracking</h2>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We deploy encrypted micro-state tokens (cookies) to secure sessions, prevent CSRF attacks, and anonymously benchmark UX flow efficiency. You control deep tracking matrices through your local browser shields.
                      </p>
                    </section>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Sections 8 & 9 grouped nicely */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <section id="children" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4">
                        <Baby size={20} className="text-indigo-400" />
                        <h2 className="text-xl font-bold text-[#465362] m-0">8. Children&apos;s Privacy</h2>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Jhustify is an enterprise-grade commercial verification apparatus explicitly not intended for any entity under the age of 18. We deploy active deterrence against unauthorized minor data collection.
                      </p>
                    </section>
                    
                    <section id="international" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe size={20} className="text-teal-500" />
                        <h2 className="text-xl font-bold text-[#465362] m-0">9. Remote Processing</h2>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        While deeply Pan-African, our high-availability cloud nodes may replicate data off-continent to guarantee uptime. Rest assured, all encrypted packets remain shackled to robust continental data protection laws.
                      </p>
                    </section>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Section 10 */}
                  <section id="contact" className="scroll-mt-32 pb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                        <Mail size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-[#465362] m-0">10. Information & Security Contact</h2>
                    </div>
                    <p className="leading-relaxed">
                      For rapid response regarding vulnerability disclosures, compliance audits, or data rights assertions, contact our Data Protection Office instantly via:
                      <br/>
                      <a href="mailto:privacy@jhustify.com" className="inline-flex items-center gap-2 mt-4 text-[#a8d59d] font-bold hover:text-[#8ac57a] transition-colors">
                        privacy@jhustify.com <ChevronRight size={16} />
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
