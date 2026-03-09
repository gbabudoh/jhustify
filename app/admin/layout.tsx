'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Mail, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Search,
  Package,
  Briefcase,
  Command,
  Globe,
  Zap,
  UserCheck,
  UserPlus,
  ShieldAlert
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, tag: 'Live' },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Registered Businesses', href: '/admin/users?role=BUSINESS_OWNER', icon: UserCheck },
  { name: 'Consumer Accounts', href: '/admin/users?role=CONSUMER', icon: UserPlus },
  { name: 'Super Admin Access', href: '/admin/users?role=SUPER_ADMIN', icon: ShieldAlert },
  { name: 'Product Business', href: '/admin/businesses/product', icon: Package },
  { name: 'Service Business', href: '/admin/businesses/service', icon: Briefcase },
  { name: 'Financials & Subs', href: '/admin/finance', icon: CreditCard },
  { name: 'Communications', href: '/admin/communications', icon: Mail },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Skip layout rendering on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const handleAuth = async () => {
      if (!isLoginPage) {
        const userStr = localStorage.getItem('admin-user');
        const token = localStorage.getItem('admin-token');
        
        if (!userStr || !token) {
          router.push('/admin/login');
          return;
        }
        
        try {
          const user = JSON.parse(userStr);
          const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
          const isInitialAdmin = user.email === 'adminacess1@jhustify.com';

          if (!isAdmin && !isInitialAdmin) {
            router.push('/');
            return;
          }
          setAdminUser(user);
        } catch {
          router.push('/admin/login');
        }
      }
    };

    handleAuth();
  }, [pathname, router, isLoginPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrolled(scrollRef.current.scrollTop > 20);
      }
    };
    
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#1A1C1E]/10 border-t-[#5BB318] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#5BB318]/20 selection:text-[#1A1C1E]">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#0F1113] text-white shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col border-r border-white/5 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center justify-between px-8 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#5BB318] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-11 h-11 bg-gradient-to-br from-[#d3f5ce] to-[#5BB318] rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10 shadow-lg shadow-[#5BB318]/20">
                <ShieldCheck className="text-[#0F1113]" size={24} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter text-white block leading-none">Jhustify</span>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1 block">Console v2.0</span>
            </div>
          </Link>
          <button 
            className="lg:hidden w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-8 px-5 space-y-8 custom-scrollbar">
          <div>
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-6 px-4 flex items-center gap-2">
              <Command size={12} className="text-gray-700" />
              Core Navigation
            </div>
            
            <div className="space-y-1.5">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                      isActive 
                        ? 'bg-[#5BB318]/5 text-[#5BB318]' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 relative z-10">
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isActive ? 'bg-[#5BB318]/10 text-[#5BB318]' : 'bg-transparent text-gray-500 group-hover:text-gray-300'
                      }`}>
                        <link.icon size={20} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{link.name}</span>
                    </div>
                    {link.tag && (
                      <span className="relative z-10 text-[9px] font-black bg-[#5BB318]/10 text-[#5BB318] px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#5BB318]/20">
                        {link.tag}
                      </span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeNavIndicator" 
                        className="absolute inset-y-0 left-0 w-1 bg-[#5BB318] rounded-r-full"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-6 px-4 flex items-center gap-2">
              <Globe size={12} className="text-gray-700" />
              Quick Actions
            </div>
            <div className="px-4 py-6 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#5BB318]/20 blur-3xl rounded-full group-hover:bg-[#5BB318]/30 transition-all" />
              <p className="text-xs font-bold text-gray-400 mb-3 relative z-10">Production Node</p>
              <h4 className="text-sm font-black text-white mb-4 relative z-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5BB318] animate-pulse" />
                System Balanced
              </h4>
              <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all relative z-10 border border-white/10">
                 Platform Log
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 shrink-0">
          <div className="bg-[#1A1C1E] border border-white/5 rounded-[32px] p-5 shadow-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-[#5BB318] rounded-[18px] blur-lg opacity-0 group-hover/avatar:opacity-30 transition-opacity" />
                <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#5BB318] to-emerald-700 flex items-center justify-center text-white font-black text-lg relative z-10 shadow-lg border border-white/10">
                  {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#5BB318] border-2 border-[#1A1C1E] rounded-full z-20" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate tracking-tight">{adminUser?.name || 'God Admin'}</p>
                <p className="text-[9px] font-bold text-gray-500 truncate uppercase mt-0.5">{adminUser?.role?.replace('_', ' ') || 'Admin'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border border-transparent hover:border-rose-500/20"
            >
              <LogOut size={14} /> Exit Console
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72 overflow-hidden">
        {/* Top Header */}
        <header className={`h-22 sticky top-0 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 shrink-0 z-40 transition-all duration-300 ${
          scrolled ? 'border-b border-gray-100/50 shadow-sm h-20' : 'h-24'
        }`}>
          <div className="flex items-center gap-6">
            <button 
              className="p-3 -ml-3 rounded-2xl text-gray-600 hover:bg-gray-100 lg:hidden transition-all active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3.5 px-6 py-3.5 bg-gray-50/50 rounded-3xl text-gray-400 group focus-within:ring-4 focus-within:ring-[#5BB318]/5 focus-within:bg-white focus-within:text-[#1A1C1E] border border-transparent focus-within:border-gray-100 transition-all w-80 lg:w-[480px]">
              <Search size={18} className="group-focus-within:text-[#5BB318] transition-colors" />
              <input 
                type="text" 
                placeholder="Deep search for businesses, users, transactions..." 
                className="bg-transparent border-none outline-none w-full text-xs font-bold text-gray-700 placeholder:text-gray-400 placeholder:font-bold"
              />
              <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg text-[9px] font-black text-gray-400">
                <Command size={10} />
                K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#5BB318] shadow-[0_0_8px_#5BB318]" />
                  <span className="text-sm font-black text-[#1A1C1E] tracking-tight">Active Node</span>
                </div>
             </div>

             <div className="w-px h-10 bg-gray-100 mx-2 hidden lg:block" />

            <button className="relative p-3.5 text-gray-500 hover:text-[#1A1C1E] hover:bg-gray-50 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-gray-100 group">
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-5 h-5 bg-[#5BB318] text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            </button>
            
            <div className="w-px h-10 bg-gray-100 mx-2 sm:hidden md:block" />

            <div className="flex items-center gap-3 bg-gray-950 p-1.5 pr-5 rounded-[40px] border border-gray-900 shadow-xl shadow-black/5 group cursor-pointer hover:bg-black transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d3f5ce] to-[#5BB318] flex items-center justify-center text-gray-950 font-black shadow-inner">
                {adminUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block">
                <p className="text-[11px] font-black text-white leading-tight">{adminUser?.name || 'Administrator'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Zap size={10} className="text-[#5BB318]" />
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Performance+</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar"
        >
          <div className="p-6 lg:p-12 min-h-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
        aside.custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
        aside.custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
