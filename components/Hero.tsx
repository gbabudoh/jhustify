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
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#C2EABD]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-[#D9F8D4]/50 rounded-full blur-2xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-[#465362] mb-6 tracking-tight"
          >
            Mapping Africa&apos;s <span className="text-[#5BB318]">Trust Economy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Find 10,000+ Verified & Community-Reviewed Businesses. From established corporations to grassroots artisans.
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
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2EABD] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 w-full md:w-auto">
              <div className="relative w-1/2 md:w-40">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-[#C2EABD] text-sm text-gray-700"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="REGISTERED">Formal</option>
                  <option value="UNREGISTERED">Informal</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative w-1/2 md:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2EABD] text-sm text-gray-700"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-[#465362] text-white font-semibold rounded-xl hover:bg-[#343e49] transition-all transform active:scale-95 shadow-lg"
            >
              Search
            </button>
          </form>

          {/* Quick Action CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => router.push('/register?type=provider')}
              className="px-6 py-2.5 bg-[#C2EABD] text-[#465362] font-medium rounded-full hover:bg-[#b0dfa7] transition-colors"
            >
              List Your Business (Free)
            </button>
            <button 
              onClick={() => router.push('/search')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              Find a Trusted Service
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
