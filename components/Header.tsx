'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, X, LogOut, LogIn, LayoutDashboard, ShieldCheck, ChevronDown, Bell, Settings, Home, TrendingUp, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const getRoleBadge = () => {
    if (userRole === 'BUSINESS_OWNER') return 'Business';
    if (userRole === 'CONSUMER') return 'Consumer';
    if (userRole === 'ADMIN') return 'Admin';
    if (userRole === 'TRUST_TEAM') return 'Trust Team';
    return '';
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-[#dcdcdc]/80 shadow-lg' : 'bg-white border-b border-[#dcdcdc]/50 shadow-sm'}`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md">
              <span className="text-[#465362] font-bold text-xl">J</span>
            </div>
            <span className="text-xl font-bold text-[#465362] transition-colors duration-300 group-hover:text-[#5A6774]">Jhustify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                isActive('/') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/search"
              className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                isActive('/search') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
              }`}
            >
              <Search size={18} />
              <span>Search Businesses</span>
            </Link>
            {isLoggedIn && (
              <>
                {userRole === 'BUSINESS_OWNER' && (
                  <Link
                    href="/verify"
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                      isActive('/verify') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
                    }`}
                  >
                    <ShieldCheck size={18} />
                    <span>Get Verified</span>
                  </Link>
                )}
                {userRole === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                      isActive('/admin') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
                    }`}
                  >
                    <Settings size={18} />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                    isActive('/dashboard') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/messages"
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                    isActive('/messages') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
                  }`}
                >
                  <MessageSquare size={18} />
                  <span>Messages</span>
                </Link>
              </>
            )}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/register"
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] ${
                    isActive('/register') ? 'text-[#465362] bg-[#F5F5F5]' : 'text-gray-600 hover:text-[#465362]'
                  }`}
                >
                  <User size={18} />
                  <span>Create Account</span>
                </Link>
                <Button variant="primary" size="sm" className="bg-gradient-to-r from-[#465362] to-[#6B7280] hover:from-[#5A6774] hover:to-[#7A8289] transition-all duration-300 transform hover:scale-105" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn size={16} />
                    Sign In
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-[#F5F5F5] transition-all duration-300 transform hover:scale-105"
                  >
                    <Bell className="text-gray-600" size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#D6D9DD] py-2 z-50">
                      <div className="px-4 py-3 border-b border-[#D6D9DD]">
                        <h3 className="font-semibold text-[#465362] flex items-center gap-2">
                          <Bell size={18} />
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="text-green-600" size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#465362]">Welcome to Jhustify!</p>
                              <p className="text-xs text-gray-600 mt-1">Get started by verifying your business</p>
                              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="text-blue-600" size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#465362]">New feature available</p>
                              <p className="text-xs text-gray-600 mt-1">Check out our enhanced dashboard</p>
                              <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-[#D6D9DD]">
                        <Button variant="outline" size="sm" className="w-full">
                          View all notifications
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center shadow-md">
                    <User size={18} className="text-[#465362]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#465362]">{userName}</p>
                    <p className="text-xs text-gray-500">{getRoleBadge()}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#D6D9DD] py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#D6D9DD]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center">
                          <User size={20} className="text-[#465362]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#465362]">{userName}</p>
                          <p className="text-xs text-gray-500">{getRoleBadge()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-all duration-200"
                    >
                      <LayoutDashboard size={18} className="text-gray-500" />
                      <span>Dashboard</span>
                      <ArrowRight size={14} className="ml-auto text-gray-400" />
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-all duration-200"
                    >
                      <MessageSquare size={18} className="text-gray-500" />
                      <span>Messages</span>
                      <ArrowRight size={14} className="ml-auto text-gray-400" />
                    </Link>
                    {userRole === 'BUSINESS_OWNER' && (
                      <Link
                        href="/verify"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-all duration-200"
                      >
                        <ShieldCheck size={18} className="text-gray-500" />
                        <span>Get Verified</span>
                        <ArrowRight size={14} className="ml-auto text-gray-400" />
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-all duration-200"
                    >
                      <Settings size={18} className="text-gray-500" />
                      <span>Settings</span>
                      <ArrowRight size={14} className="ml-auto text-gray-400" />
                    </Link>
                    <div className="border-t border-[#D6D9DD] my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F5F5F5] transition-all duration-300 transform hover:scale-105"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} className="text-[#465362]" /> : <Menu size={24} className="text-[#465362]" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-[#D6D9DD] pt-4 animate-in slide-in-from-top duration-300">
            {isLoggedIn && (
              <div className="px-4 py-3 bg-gradient-to-r from-[#F5F5F5] to-[#E8E8E8] rounded-lg mb-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center shadow-md">
                    <User size={20} className="text-[#465362]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#465362]">{userName}</p>
                    <p className="text-xs text-gray-500">{getRoleBadge()}</p>
                  </div>
                </div>
              </div>
            )}
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#465362] hover:bg-[#F5F5F5] transition-all duration-200 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#465362] hover:bg-[#F5F5F5] transition-all duration-200 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={20} />
              <span>Search Businesses</span>
            </Link>
            {isLoggedIn ? (
              <>
                {userRole === 'BUSINESS_OWNER' && (
                  <Link
                    href="/verify"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#465362] hover:bg-[#F5F5F5] transition-all duration-200 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShieldCheck size={20} />
                    <span>Get Verified</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#465362] hover:bg-[#F5F5F5] transition-all duration-200 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#465362] hover:bg-[#F5F5F5] transition-all duration-200 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </Link>
                <div className="border-t border-[#D6D9DD] my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-lg w-full text-left cursor-pointer"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#465362] hover:bg-[#F5F5F5] transition-all duration-200 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Create Account</span>
                </Link>
                <Button variant="primary" size="sm" className="w-full mt-3 bg-gradient-to-r from-[#465362] to-[#6B7280] hover:from-[#5A6774] hover:to-[#7A8289] transition-all duration-300 transform hover:scale-105" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                    <LogIn size={16} />
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

