'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2 } from 'lucide-react';

export default function FundTracker() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    fundAmount: 0,
    activeBanners: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/fund/tracker');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch fund stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return null;

  return (
    <section className="bg-[#465362] py-10 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Our Social Impact Model
            </h2>
            <p className="text-gray-300">
              We reinvest 20% of all ad revenue directly into helping informal businesses register and formalize their operations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="w-10 h-10 bg-[#C2EABD] rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="text-[#465362]" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${stats.fundAmount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Formalization Fund
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="w-10 h-10 bg-[#D9F8D4] rounded-lg flex items-center justify-center mb-3">
                <Building2 className="text-[#465362]" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {Math.floor(stats.fundAmount / 50)}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Businesses Funded
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hidden md:block">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3">
                <Users className="text-[#465362]" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                98%
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
