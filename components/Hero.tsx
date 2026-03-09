'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sector, setSector] = useState('ALL');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (sector !== 'ALL') params.set('classification', sector);
    if (location) params.set('location', location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative bg-white pt-20 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Decorative Background Elements - Refined for blending */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#d3f5ce]/40 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#d3f5ce]/20 via-[#F5F5F5]/50 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-extrabold text-[#6d6e6b] mb-6 tracking-tight leading-[1.1]"
          >
            Mapping Africa&apos;s <span className="bg-gradient-to-r from-[#6d6e6b] to-[#a8d59d] bg-clip-text text-transparent">Trust Economy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Find 10,000+ Verified & Community-Reviewed Businesses. <br className="hidden md:block" /> From established corporations to grassroots artisans.
          </motion.p>
        </div>

        {/* Action-Oriented Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <form 
            onSubmit={handleSearch}
            className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-2 md:gap-4"
          >
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or services..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#d3f5ce] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-40 border-b border-gray-100 md:border-b-0 md:border-r">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-[#d3f5ce] text-sm text-gray-700"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="REGISTERED">Formal</option>
                  <option value="UNREGISTERED">Informal</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative w-full md:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#d3f5ce] text-sm text-gray-700"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-[#6d6e6b] text-white font-semibold rounded-xl hover:bg-[#343e49] transition-all transform active:scale-95 shadow-lg"
            >
              Search
            </button>
          </form>

          {/* Quick Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={() => router.push('/register?type=provider')}
              className="w-full sm:w-auto px-6 py-3 md:py-2.5 bg-[#d3f5ce] text-[#6d6e6b] font-medium rounded-full md:rounded-xl hover:bg-[#b0dfa7] transition-colors"
            >
              List Your Business (Free)
            </button>
            <button 
              onClick={() => router.push('/search')}
              className="w-full sm:w-auto px-6 py-3 md:py-2.5 bg-gray-100 text-gray-700 font-medium rounded-full md:rounded-xl hover:bg-gray-200 transition-colors"
            >
              Find a Trusted Service
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
