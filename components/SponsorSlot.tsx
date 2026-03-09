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
    logo: "/images/partners/standard-trust-bank.png",
    offer: "Specializing in Informal Sector Micro-loans.",
    cta: "Apply Now"
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-white border-2 border-dashed border-[#d3f5ce] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 group transition-all"
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
              <span className="text-[10px] bg-[#d3f5ce] text-[#6d6e6b] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Partner of the Month
              </span>
              <span className="text-sm font-bold text-[#6d6e6b]">{sponsor.name}</span>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {sponsor.offer} {category && `Helping ${category} businesses grow.`}
            </p>
          </div>
        </div>

        <button className="whitespace-nowrap px-6 py-2 bg-[#6d6e6b] text-white rounded-xl text-sm font-semibold hover:bg-[#343e49] transition-all shadow-md group-hover:shadow-lg">
          {sponsor.cta}
        </button>
      </motion.div>
    </div>
  );
}
