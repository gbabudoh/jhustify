import Image from 'next/image';
import { Shield, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Hero from '@/components/Hero';
import SponsorSlot from '@/components/SponsorSlot';
import CategoryExplorer from '@/components/CategoryExplorer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Contextual Ad Slot */}
      <SponsorSlot />

      {/* Category Explorer */}
      <CategoryExplorer />

      {/* Featured Businesses Spotlight */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#6d6e6b]">Featured on Jhustify</h2>
              <p className="text-gray-500">Discover top-rated formal and informal businesses trusted by the community.</p>
            </div>
            <Link href="/search" className="text-sm font-bold bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-all">
              See All
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mocking some rising stars for visual impact */}
            {[
              { id: 1, name: 'Adaora Crafts', category: 'Handmade Jewelry', img: '/images/avatars/adaora.png' },
              { id: 2, name: 'Kojo Woodworks', category: 'Artisan Furniture', img: '/images/avatars/kojo.png' },
              { id: 3, name: 'Amina Textiles', category: 'Traditional Fabrics', img: '/images/avatars/amina.png' },
            ].map((business) => (
              <Card key={business.id} hover className="overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Round thumbnail image */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d3f5ce] shadow-md shrink-0">
                      <Image 
                        src={business.img} 
                        alt={business.name} 
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[#6d6e6b] truncate">{business.name}</h3>
                        <span className="bg-[#a8d59d] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1 shrink-0">
                          <Star size={8} fill="white" /> Trusted
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{business.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <Star size={14} fill="currentColor" className="mr-1" /> 4.9
                      <span className="text-gray-400 font-normal ml-2">(127 reviews)</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">Providing high-quality handcrafted products with authentic African craftsmanship since 2018.</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 font-mono">Lagos, Nigeria</span>
                    <Link href="/search" className="text-[#6d6e6b] hover:text-[#a8d59d] transition-colors">
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
            <h2 className="text-3xl md:text-5xl font-bold text-[#6d6e6b] mb-6">
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
                  <h3 className="text-xl font-bold text-[#6d6e6b] mb-2">Blue Badge: Verified Formal</h3>
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
                  <h3 className="text-xl font-bold text-[#6d6e6b] mb-2">Green Badge: Community Trusted</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Earned by informal businesses through consistent 4.5+ star ratings and &quot;Proof of Presence&quot; verification. Real data built on reputation.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#d3f5ce]/20 p-8 rounded-3xl border border-[#d3f5ce]/30 aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -rotate-3 border border-white/60 rounded-3xl m-10" />
              <div className="relative z-10 text-center p-6 bg-white rounded-2xl shadow-xl w-64 border border-gray-100">
                <div className="w-16 h-16 bg-[#d3f5ce] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield size={32} className="text-[#6d6e6b]" />
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
