'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, LogOut, UserCircle, LayoutDashboard, ShieldCheck, ChevronDown, Bell, Settings, Home, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          setIsLoggedIn(true);
          try {
            const user = JSON.parse(userStr);
            setUserName(user.name || 'User');
            setUserRole(user.role || '');
          } catch {
            setUserName('User');
            setUserRole('');
          }
        } else {
          setIsLoggedIn(false);
          setUserName('');
          setUserRole('');
        }
      }
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for same-tab login/logout
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    // Handle scroll for header effects
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]); // Re-check when route changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    setShowUserMenu(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const getRoleBadge = () => {
    if (userRole === 'BUSINESS_OWNER') return 'Business Owner';
    if (userRole === 'CONSUMER') return 'Consumer';
    if (userRole === 'ADMIN') return 'Administrator';
    if (userRole === 'SUPER_ADMIN') return 'Super Admin';
    if (userRole === 'TRUST_TEAM') return 'Trust Team';
    return '';
  };

  const getDashboardPath = () => {
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') return '/admin/dashboard';
    if (userRole === 'BUSINESS_OWNER') return '/user/business/dashboard';
    if (userRole === 'CONSUMER') return '/user/consumer/dashboard';
    return '/dashboard';
  };

  const getSettingsPath = () => {
    if (userRole === 'BUSINESS_OWNER') return '/business/settings';
    return '/settings';
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, show: true },
    { name: 'Search Businesses', path: '/search', icon: Search, show: true },
    { name: 'Get Verified', path: '/verify', icon: ShieldCheck, show: isLoggedIn && userRole === 'BUSINESS_OWNER' },
    { name: 'Dashboard', path: getDashboardPath(), icon: LayoutDashboard, show: isLoggedIn },
    { name: 'Messages', path: '/messages', icon: MessageSquare, show: isLoggedIn }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)]' : 'bg-white border-b border-gray-100 shadow-sm'}`}>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image 
                src="/logo.png" 
                alt="Jhustify" 
                width={140} 
                height={40} 
                className="drop-shadow-sm"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 relative z-10">
            {navLinks.filter(link => link.show).map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 px-3 py-2 rounded-xl overflow-hidden group ${
                  isActive(link.path) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-[#F5F5F5] rounded-xl z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <link.icon size={16} strokeWidth={isActive(link.path) ? 2 : 1.5} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>{link.name}</span>
                </span>
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block"></div>

            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/register"
                  className="relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-[#F5F5F5] group"
                >
                  <User size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                  <span>Create Account</span>
                </Link>
                <Button variant="primary" size="sm" className="bg-[#76bc68] text-white hover:bg-[#609b53] hover:shadow-lg hover:shadow-[#76bc68]/30 transition-all duration-300 rounded-xl px-5 h-9 font-bold" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <UserCircle size={16} strokeWidth={2} />
                    Sign In
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                {/* Notifications */}
                <div className="relative flex items-center" ref={notificationRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowUserMenu(false);
                    }}
                    className={`relative p-2 rounded-xl transition-colors duration-300 ${showNotifications ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                  >
                    <Bell size={18} strokeWidth={1.5} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border border-gray-100/50 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-5 py-3 border-b border-gray-100/50">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Bell size={16} strokeWidth={2} />
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          <motion.div whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }} className="px-5 py-3 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                                <CheckCircle className="text-green-600" size={16} strokeWidth={2} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Welcome to Jhustify!</p>
                                <p className="text-xs text-gray-500 mt-0.5">Get started by verifying your business</p>
                                <p className="text-[10px] uppercase font-semibold text-gray-400 mt-1.5 tracking-wider">2 hours ago</p>
                              </div>
                            </div>
                          </motion.div>
                          <motion.div whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }} className="px-5 py-3 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                <TrendingUp className="text-blue-600" size={16} strokeWidth={2} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">New feature available</p>
                                <p className="text-xs text-gray-500 mt-0.5">Check out our enhanced dashboard</p>
                                <p className="text-[10px] uppercase font-semibold text-gray-400 mt-1.5 tracking-wider">1 day ago</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100/50">
                          <Button variant="ghost" size="sm" className="w-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl">
                            Mark all as read
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User Menu */}
                <div className="relative flex items-center" ref={userMenuRef}>
                    <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowNotifications(false);
                    }}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-full transition-all duration-300 border ${showUserMenu ? 'bg-gray-50 border-gray-200' : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
                    >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center shadow-inner border border-white">
                        <User size={16} className="text-gray-600" strokeWidth={1.5} />
                    </div>
                    <div className="hidden xl:block text-left mr-1">
                        <p className="text-sm font-semibold text-gray-800 leading-none">{userName}</p>
                    </div>
                    <ChevronDown size={14} strokeWidth={2} className={`text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                    {showUserMenu && (
                        <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border border-gray-100/50 py-2 z-50 overflow-hidden"
                        >
                        <div className="px-5 py-4 border-b border-gray-100/50 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                                <User size={20} className="text-gray-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 leading-tight">{userName}</p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">{getRoleBadge()}</p>
                            </div>
                            </div>
                        </div>
                        
                        <div className="p-2">
                            {[
                                { path: getDashboardPath(), icon: LayoutDashboard, label: 'Dashboard' },
                                { path: '/messages', icon: MessageSquare, label: 'Messages' },
                                ...(userRole === 'BUSINESS_OWNER' ? [{ path: '/verify', icon: ShieldCheck, label: 'Get Verified' }] : []),
                                { path: getSettingsPath(), icon: Settings, label: 'Settings' }
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setShowUserMenu(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 group"
                                >
                                    <item.icon size={16} strokeWidth={1.5} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                        
                        <div className="px-2 pb-1">
                            <div className="h-px bg-gray-100 my-1 mx-2"></div>
                            <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200 w-full text-left cursor-pointer group"
                            >
                            <LogOut size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                            <span>Sign Out</span>
                            </button>
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Hidden now that we have bottom tabs */}
          <div className="md:hidden w-10"></div>
        </div>
      </nav>

    </header>
  );
}

