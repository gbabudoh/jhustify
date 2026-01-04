'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Landmark, Sprout, Settings, Laptop, Truck, Heart, Music } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { id: 'retail', name: 'Retail', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', count: '1,240+' },
  { id: 'finance', name: 'Finance', icon: Landmark, color: 'bg-green-50 text-green-600', count: '450+' },
  { id: 'agri', name: 'Agriculture', icon: Sprout, color: 'bg-emerald-50 text-emerald-600', count: '890+' },
  { id: 'tech', name: 'Technology', icon: Laptop, color: 'bg-indigo-50 text-indigo-600', count: '320+' },
  { id: 'logistics', name: 'Logistics', icon: Truck, color: 'bg-orange-50 text-orange-600', count: '670+' },
  { id: 'services', name: 'Services', icon: Settings, color: 'bg-purple-50 text-purple-600', count: '1,560+' },
  { id: 'health', name: 'Health', icon: Heart, color: 'bg-red-50 text-red-600', count: '210+' },
  { id: 'entertainment', name: 'Creative', icon: Music, color: 'bg-pink-50 text-pink-600', count: '430+' },
];

export default function CategoryExplorer() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#465362] mb-3">Explore by Category</h2>
            <p className="text-gray-500 max-w-lg">
              Find exactly what you need across hundreds of sectors, with real-time verification status for every listing.
            </p>
          </div>
          <Link href="/search" className="text-[#465362] font-semibold hover:underline flex items-center gap-1">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                href={`/search?category=${cat.id}`}
                className="block p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#465362] mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{cat.count} listings this week</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
