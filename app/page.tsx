import Image from 'next/image';
import { Shield, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Hero from '@/components/Hero';
import FundTracker from '@/components/FundTracker';
import SponsorSlot from '@/components/SponsorSlot';
import CategoryExplorer from '@/components/CategoryExplorer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Status Indicators & Impact Tracker */}
      <FundTracker />

      {/* Contextual Ad Slot */}
      <SponsorSlot />

      {/* Category Explorer */}
      <CategoryExplorer />

      {/* Top-Rated Informal Businesses Spotlight */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#465362]">Rising Stars</h2>
              <p className="text-gray-500">Top-rated informal businesses earning their community trust badges.</p>
            </div>
            <Link href="/search?classification=UNREGISTERED" className="text-sm font-bold bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-all">
              See All
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mocking some rising stars for visual impact */}
            {[1, 2, 3].map((i) => (
              <Card key={i} hover className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image 
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt={`Rising Star Business ${i}`} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#5BB318] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1 shadow-lg backdrop-blur-sm bg-opacity-90">
                      <Star size={10} fill="white" /> Community Trusted
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#465362]">Artisan Workshop {i}</h3>
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <Star size={14} fill="currentColor" className="mr-1" /> 4.9
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">Providing high-quality handcrafted furniture and home decor since 2018.</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 font-mono">Lagos, Nigeria</span>
                    <Link href="/search" className="text-[#465362] hover:text-[#5BB318] transition-colors">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Features (Redesigned) */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#465362] mb-6">
              The Jhustify Trust System
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We bridge the gap between formal compliance and community reputation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Shield className="text-blue-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#465362] mb-2">Blue Badge: Verified Formal</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reserved for businesses with verified legal registration and compliance documents. The gold standard for international B2B partnerships.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                  <Star className="text-green-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#465362] mb-2">Green Badge: Community Trusted</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Earned by informal businesses through consistent 4.5+ star ratings and &quot;Proof of Presence&quot; verification. Real data built on reputation.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#C2EABD]/20 p-8 rounded-3xl border border-[#C2EABD]/30 aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -rotate-3 border border-white/60 rounded-3xl m-10" />
              <div className="relative z-10 text-center p-6 bg-white rounded-2xl shadow-xl w-64 border border-gray-100">
                <div className="w-16 h-16 bg-[#C2EABD] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield size={32} className="text-[#465362]" />
                </div>
                <div className="font-bold text-gray-800 text-lg">Verified Business</div>
                <div className="text-[10px] text-gray-400 mt-1">TRUST SCORE: 98/100</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
