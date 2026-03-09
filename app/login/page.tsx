'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import Header from '@/components/Header';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const redirect = searchParams?.get('redirect') || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('auth-change'));
      }

      toast.success('Welcome back! Redirecting...', 2000);

      // Small delay to show toast before redirect
      setTimeout(() => {
        // Redirect based on user role or redirect parameter
        if (redirect) {
          router.push(redirect);
        } else if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') {
          router.push('/admin/dashboard');
        } else if (data.user?.role === 'BUSINESS_OWNER') {
          router.push('/user/business/dashboard');
        } else if (data.user?.role === 'CONSUMER') {
          router.push('/user/consumer/dashboard');
        } else {
          router.push('/');
        }
      }, 500);
    } catch {
      const errorMsg = 'An error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#d3f5ce]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#D9F8D4]/30 rounded-full blur-[80px]"></div>
      </div>

      <Header />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 relative overflow-hidden">
            {/* Top decorative element */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#6d6e6b] to-[#6B7280]"></div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#6d6e6b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:rotate-6 transition-transform duration-300">
                <ShieldCheck size={32} className="text-[#d3f5ce]" />
              </div>
              <h1 className="text-3xl font-black text-[#6d6e6b] mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 font-medium tracking-tight">Sign in to your Jhustify account</p>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-[#6d6e6b] uppercase tracking-widest opacity-70">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-bold text-[#6d6e6b] hover:text-[#a8d59d] transition-colors uppercase tracking-widest opacity-60 hover:opacity-100"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#6d6e6b] hover:bg-[#343e49] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#6d6e6b]/10 hover:shadow-xl hover:shadow-[#6d6e6b]/20 relative overflow-hidden"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 absolute right-8" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
              <p className="text-sm text-gray-500 font-medium">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#6d6e6b] font-bold hover:text-[#a8d59d] transition-colors underline-offset-4 hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-1.5 grayscale">
              <Globe size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Global Reach</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Secure Access</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] relative z-10">
        &copy; 2026 Jhustify Platform &bull; Built for Trust
      </footer>
    </div>
  );
}

