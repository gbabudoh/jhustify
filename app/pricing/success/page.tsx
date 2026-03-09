'use client';

import { useEffect, useState, Suspense, useRef, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface BusinessInfo {
  id: string;
  businessName: string;
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const hasVerified = useRef(false);

  // Initialize state based on reference
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    reference ? 'verifying' : 'error'
  );
  const [message, setMessage] = useState(
    reference ? 'Verifying your payment...' : 'No transaction reference found.'
  );
  const [business, setBusiness] = useState<BusinessInfo | null>(null);

  useEffect(() => {
    if (!reference || hasVerified.current) return;
    hasVerified.current = true;

    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/payments/paystack/verify?reference=${reference}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (cancelled) return;

        if (response.ok && data.success) {
          startTransition(() => {
            setStatus('success');
            setMessage('Your account has been successfully upgraded to Premium!');
            setBusiness(data.business);
          });
        } else {
          startTransition(() => {
            setStatus('error');
            setMessage(data.error || 'Failed to verify payment. If your account was debited, please contact support.');
          });
        }
      } catch (err) {
        console.error('Verification error:', err);
        if (cancelled) return;
        startTransition(() => {
          setStatus('error');
          setMessage('An unexpected error occurred during verification.');
        });
      }
    };

    verifyPayment();

    return () => { cancelled = true; };
  }, [reference]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-12 text-center !rounded-[64px] border-none shadow-2xl bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5BB318]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#465362]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {status === 'verifying' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto border border-gray-100 shadow-inner">
                <Loader2 size={48} className="text-[#5BB318] animate-spin" />
              </div>
              <h1 className="text-4xl font-black text-[#465362] tracking-tighter">Verifying Payment</h1>
              <p className="text-gray-500 font-medium text-lg">{message}</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-100 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#465362] tracking-tighter">Congratulations!</h1>
                <p className="text-gray-500 font-medium text-lg px-4">{message}</p>
              </div>

              {business && (
                <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 mb-8 max-w-md mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#465362] rounded-xl flex items-center justify-center text-white shrink-0">
                      <Building2 size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Business</p>
                      <h3 className="font-black text-[#465362] truncate">{business.businessName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-500">New Tier</span>
                    <span className="px-3 py-1 bg-[#5BB318] text-white text-[10px] font-black rounded-full uppercase tracking-widest">Premium Elite</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" className="flex-1 bg-[#465362] hover:bg-black text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 group" asChild>
                  <Link href="/user/business/dashboard">
                    Go to Dashboard <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center mx-auto border border-rose-100 shadow-lg shadow-rose-500/10">
                <AlertCircle size={48} className="text-rose-500" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-[#465362] tracking-tighter">Verification Failed</h1>
                <p className="text-gray-500 font-medium text-lg px-4">{message}</p>
              </div>
              <div className="pt-4 space-y-4">
                <Button variant="outline" className="w-full h-16 rounded-[24px] border-2 border-gray-100 font-black text-xs uppercase tracking-widest text-[#465362] hover:bg-gray-50" onClick={() => router.push('/pricing')}>
                  Try Again
                </Button>
                <Button variant="outline" className="w-full h-16 rounded-[24px] border-none font-black text-xs uppercase tracking-widest text-gray-400 hover:text-[#465362]" asChild>
                  <Link href="/contact">Support Center</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <Suspense fallback={
          <div className="flex justify-center items-center p-20">
            <Loader2 size={48} className="animate-spin text-[#5BB318]" />
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
