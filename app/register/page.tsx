'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';
import PasswordStrength from '@/components/ui/PasswordStrength';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'BUSINESS_OWNER' as 'BUSINESS_OWNER' | 'CONSUMER'
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check for role in URL params
    const roleParam = searchParams?.get('role');
    if (roleParam === 'CONSUMER') {
      setFormData(prev => ({ ...prev, role: 'CONSUMER' }));
    }
  }, [searchParams]);
  
  const redirect = searchParams?.get('redirect') || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match';
      toast.error(msg);
      return;
    }

    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || 'Registration failed';
        toast.error(msg);
        return;
      }

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('auth-change'));
      }

      toast.success('Account created successfully!', 2000);

      // Small delay for toast
      setTimeout(() => {
        if (redirect) {
          router.push(redirect);
        } else if (formData.role === 'CONSUMER') {
          router.push('/');
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } catch {
      const msg = 'An error occurred. Please try again.';
      toast.error(msg);
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

      <main className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
        <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 relative overflow-hidden">
            {/* Top decorative element */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#6d6e6b] to-[#6B7280]"></div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#6d6e6b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:rotate-6 transition-transform duration-300">
                <ShieldCheck size={32} className="text-[#d3f5ce]" />
              </div>
              <h1 className="text-3xl font-black text-[#6d6e6b] mb-2 tracking-tight">Create Account</h1>
              <p className="text-gray-500 font-medium tracking-tight">Join Jhustify and start building trust</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'BUSINESS_OWNER' })}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden ${
                    formData.role === 'BUSINESS_OWNER'
                      ? 'border-[#6d6e6b] bg-[#6d6e6b]/5'
                      : 'border-gray-100 bg-gray-50/50 hover:border-[#6d6e6b]/30'
                  }`}
                >
                  <Briefcase size={20} className={formData.role === 'BUSINESS_OWNER' ? 'text-[#6d6e6b]' : 'text-gray-400'} />
                  <div className="mt-2 text-sm font-bold text-[#6d6e6b] uppercase tracking-wider">Business</div>
                  <div className="text-[10px] text-gray-500 font-medium leading-tight mt-1">List & verify your services</div>
                  {formData.role === 'BUSINESS_OWNER' && (
                    <div className="absolute top-2 right-2 text-[#a8d59d]">
                      <CheckCircle2 size={16} fill="currentColor" stroke="white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'CONSUMER' })}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden ${
                    formData.role === 'CONSUMER'
                      ? 'border-[#6d6e6b] bg-[#6d6e6b]/5'
                      : 'border-gray-100 bg-gray-50/50 hover:border-[#6d6e6b]/30'
                  }`}
                >
                  <Users size={20} className={formData.role === 'CONSUMER' ? 'text-[#6d6e6b]' : 'text-gray-400'} />
                  <div className="mt-2 text-sm font-bold text-[#6d6e6b] uppercase tracking-wider">Consumer</div>
                  <div className="text-[10px] text-gray-500 font-medium leading-tight mt-1">Search & contact pros</div>
                  {formData.role === 'CONSUMER' && (
                    <div className="absolute top-2 right-2 text-[#a8d59d]">
                      <CheckCircle2 size={16} fill="currentColor" stroke="white" />
                    </div>
                  )}
                </button>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                  Password
                </label>
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
                <PasswordStrength password={formData.password} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 absolute right-8" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
              <p className="text-sm text-gray-500 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-[#6d6e6b] font-bold hover:text-[#a8d59d] transition-colors underline-offset-4 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#6d6e6b] hover:text-[#a8d59d] transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">
              <ArrowLeft size={14} />
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] relative z-10">
        &copy; 2026 Jhustify Platform &bull; Built for Trust
      </footer>
    </div>
  );
}
