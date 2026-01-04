'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface SponsorSlotProps {
  category?: string;
}

export default function SponsorSlot({ category }: SponsorSlotProps) {
  // In a real app, we'd fetch the sponsor for the specific category
  const sponsor = {
    name: "Standard Trust Bank",
    logo: "https://images.unsplash.com/photo-1541354451442-952c9c83bb01?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    offer: "Specializing in Informal Sector Micro-loans.",
    cta: "Apply Now"
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-white border-2 border-dashed border-[#C2EABD] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 group transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
            <Image 
              src={sponsor.logo} 
              alt={sponsor.name} 
              fill 
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] bg-[#C2EABD] text-[#465362] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Partner of the Month
              </span>
              <span className="text-sm font-bold text-[#465362]">{sponsor.name}</span>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {sponsor.offer} {category && `Helping ${category} businesses grow.`}
            </p>
          </div>
        </div>

        <button className="whitespace-nowrap px-6 py-2 bg-[#465362] text-white rounded-xl text-sm font-semibold hover:bg-[#343e49] transition-all shadow-md group-hover:shadow-lg">
          {sponsor.cta}
        </button>
      </motion.div>
    </div>
  );
}
