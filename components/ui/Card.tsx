'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -6, boxShadow: "0 20px 40px rgba(211,245,206,0.15)" } : {}}
      className={`
        bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-[#d3f5ce]/50 p-6
        transition-all duration-500
        ${hover ? 'hover:shadow-[0_20px_40px_rgba(211,245,206,0.2)] hover:border-[#d3f5ce]' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

