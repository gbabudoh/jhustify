'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // We use the pathname as the key so Framer Motion knows when to animate a new page in
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        mass: 0.5 
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
