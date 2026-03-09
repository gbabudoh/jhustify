'use client';

import { Home, Search, MessageSquare, UserCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    // Center Floating Action Button placeholder
    { name: 'Verify', path: '/verify', icon: PlusCircle, isFloating: true },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Dashboard', path: '/dashboard', icon: UserCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 pb-safe z-50">
      <div className="flex items-center justify-around px-2 h-16">
        {tabs.map((tab, idx) => {
          const isActive = pathname === tab.path;

          if (tab.isFloating) {
            return (
              <div key={idx} className="relative -top-5 flex-shrink-0">
                <Link href={tab.path}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-gray-900/30 border-4 border-white"
                  >
                    <tab.icon size={24} strokeWidth={2} />
                  </motion.div>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              href={tab.path}
              className={`flex flex-col items-center justify-center w-16 h-full text-xs font-medium transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative mb-1">
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
