'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, X, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react';
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
  const userMenuRef = useRef<HTMLDivElement>(null);

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
          } catch (e) {
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
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
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
    <header className="sticky top-0 z-50 bg-white border-b border-[#D6D9DD] shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center">
              <span className="text-[#465362] font-bold text-xl">J</span>
            </div>
            <span className="text-xl font-bold text-[#465362]">Jhustify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className={`text-sm font-medium transition-colors ${
                isActive('/search') ? 'text-[#465362]' : 'text-gray-600 hover:text-[#465362]'
              }`}
            >
              Search Businesses
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/verify"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/verify') ? 'text-[#465362]' : 'text-gray-600 hover:text-[#465362]'
                  }`}
                >
                  Get Verified
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-[#465362]' : 'text-gray-600 hover:text-[#465362]'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/register"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/register') ? 'text-[#465362]' : 'text-gray-600 hover:text-[#465362]'
                  }`}
                >
                  Create Account
                </Link>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center">
                    <User size={18} className="text-[#465362]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#465362]">{userName}</p>
                    <p className="text-xs text-gray-500">{getRoleBadge()}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#D6D9DD] py-2 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <Link
                      href="/verify"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors"
                    >
                      <ShieldCheck size={18} />
                      Get Verified
                    </Link>
                    <div className="border-t border-[#D6D9DD] my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-[#D6D9DD] pt-4">
            {isLoggedIn && (
              <div className="px-4 py-3 bg-[#F5F5F5] rounded-lg mb-3">
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
            )}
            <Link
              href="/search"
              className="block py-2 text-sm font-medium text-gray-600 hover:text-[#465362]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Businesses
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/verify"
                  className="block py-2 text-sm font-medium text-gray-600 hover:text-[#465362]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Verified
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm font-medium text-gray-600 hover:text-[#465362]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-[#D6D9DD] my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 w-full text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="block py-2 text-sm font-medium text-gray-600 hover:text-[#465362]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
                <Button variant="primary" size="sm" className="w-full mt-2" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

