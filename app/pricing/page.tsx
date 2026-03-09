'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id?: string; name?: string; role?: string } | null>(null);
  const [business, setBusiness] = useState<{ id: string; businessName: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.role === 'BUSINESS_OWNER') {
          fetchUserBusiness(parsedUser.id, token);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchUserBusiness = async (userId: string, token: string) => {
    try {
      const response = await fetch(`/api/business?ownerId=${encodeURIComponent(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.businesses && data.businesses.length > 0) {
          setBusiness(data.businesses[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching business:', err);
    }
  };

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (user.role !== 'BUSINESS_OWNER') {
      setError('Only business owners can upgrade their tier.');
      return;
    }

    if (!business) {
      router.push('/verify'); // Redirect to create a business if none found
      return;
    }

    setLoading(tier);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: business.id,
          tier: tier === 'Premium Features' ? 'PREMIUM' : 'VERIFIED',
        }),
      });

      const data = await response.json();

      if (response.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError(data.error || 'Failed to initialize payment. Please try again.');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // African currency equivalents (approximate, based on current exchange rates)
  const currencyEquivalents = [
    { code: 'NGN', symbol: '₦', amount: '1,200', country: 'Nigeria' },
    { code: 'ZAR', symbol: 'R', amount: '28', country: 'South Africa' },
    { code: 'KES', symbol: 'KSh', amount: '250', country: 'Kenya' },
    { code: 'GHS', symbol: 'GHS', amount: '22', country: 'Ghana' },
    { code: 'TZS', symbol: 'TSh', amount: '3,800', country: 'Tanzania' },
    { code: 'UGX', symbol: 'USh', amount: '6,000', country: 'Uganda' },
    { code: 'ETB', symbol: 'Br', amount: '85', country: 'Ethiopia' },
    { code: 'XOF', symbol: 'CFA', amount: '1,200', country: 'West Africa' },
  ];

  const tiers = [
    {
      name: 'Basic Listing',
      price: 'Free',
      period: 'Forever',
      description: 'Free basic listing for your business',
      features: [
        'Business listing',
        'Basic profile',
        'Public visibility',
        'Customer messages (limited)',
        'Search visibility',
        'Informal or Formal badge',
        'Mobile number verification',
        'Business representative photo',
      ],
      badge: null,
      badgeNote: 'Informal badge (free) or Formal badge (requires registration docs)',
      cta: 'Get Started',
      variant: 'outline' as const,
      showCurrencies: false,
    },
    {
      name: 'Premium Features',
      price: '₦1,200',
      period: 'year',
      description: 'Verified listing with all premium features',
      features: [
        'Everything in Basic',
        'Verified Badge',
        'Full verification process',
        'Identity verification (Passport/NIN/Driving License)',
        'Business bank verification',
        'Priority in search results',
        'Enhanced profile features',
        'Unlimited messages',
        'Analytics dashboard',
        'Priority support',
        'Advanced lead tracking',
        'Top placement in search',
        'Verified contact information',
      ],
      badge: 'VERIFIED' as const,
      cta: 'Get Premium',
      variant: 'primary' as const,
      popular: true,
      showCurrencies: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#d3f5ce] to-[#D9F8D4] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#6d6e6b] mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-700">
                Start with a free basic listing, or upgrade to premium features for ₦1,200/year.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full flex flex-col shadow-lg border-2 ${tier.popular ? 'border-[#5BB318] ring-4 ring-[#5BB318]/5 relative scale-105 z-10' : 'border-transparent'}`}
                  hover
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#5BB318] text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-3xl font-black text-[#465362] tracking-tighter">{tier.name}</h3>
                        {tier.badge && (
                          <TrustBadge type={tier.badge} size="sm" />
                        )}
                      </div>
                      <p className="text-gray-500 font-medium mb-6 leading-relaxed">{tier.description}</p>
                      {tier.badgeNote && (
                        <p className="text-xs text-gray-400 mb-4 italic font-bold uppercase tracking-wider">{tier.badgeNote}</p>
                      )}
                      <div className="flex items-baseline gap-2 mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <span className="text-5xl font-black text-[#465362] tracking-tighter">{tier.price}</span>
                        {tier.period && (
                          <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">/ {tier.period}</span>
                        )}
                      </div>
                      
                      {tier.showCurrencies && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pan-African Availability</p>
                          <div className="grid grid-cols-2 gap-3">
                            {currencyEquivalents.map((currency) => (
                              <div key={currency.code} className="flex flex-col p-2 bg-gray-50/50 rounded-xl border border-gray-100">
                                <span className="text-sm font-black text-[#465362]">{currency.symbol}{currency.amount}</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{currency.code}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-4 mb-10">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 group/item">
                          <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-100 transition-colors">
                            <CheckCircle2 className="text-[#5BB318]" size={14} />
                          </div>
                          <span className="text-gray-600 font-medium text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    {error && tier.popular && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}
                    
                    <Button
                      variant={tier.variant}
                      className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                        tier.popular 
                          ? 'bg-[#465362] hover:bg-black text-white shadow-xl shadow-[#465362]/20 translate-y-0 hover:-translate-y-1' 
                          : 'bg-white border-2 border-gray-100 text-[#465362] hover:bg-gray-50 translate-y-0 hover:-translate-y-1'
                      }`}
                      onClick={() => tier.price === 'Free' ? router.push('/verify') : handleUpgrade(tier.name)}
                      disabled={loading === tier.name}
                    >
                      {loading === tier.name ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" />
                          Initializing...
                        </div>
                      ) : (
                        tier.cta
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#6d6e6b] text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-semibold text-[#6d6e6b] mb-2">
                  What&apos;s included in the verification process?
                </h3>
                <p className="text-gray-600">
                  Focus on building trust and growing your business while keeping all your hard-earned revenue. 
                  Our transparent verification costs ensure you know exactly what you&apos;re getting. Our verification process includes checking your 
                  contact information (phone, email), verifying your business location, and reviewing your registration 
                  documents (for formal businesses) or proof of presence (for informal businesses).
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-[#6d6e6b] mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes! You can start with a free basic listing and upgrade to premium features at any time. 
                  Changes will be reflected immediately.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-[#6d6e6b] mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept major credit cards, debit cards, and local payment methods including mobile money 
                  (M-Pesa, MTN MoMo) and bank transfers across Africa.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-[#6d6e6b] mb-2">
                  What is the pricing structure?
                </h3>
                <p className="text-gray-600">
                  Basic listing is completely free forever. Premium features including verification badges, analytics 
                  dashboard, unlimited messages, priority support, and advanced lead tracking are available for 
                  ₦1,200 per year (or equivalent in your local currency).
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-[#d3f5ce] to-[#D9F8D4] border-none">
            <h2 className="text-3xl font-bold text-[#6d6e6b] mb-4">
              Ready to Get Verified?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Join thousands of verified businesses across Africa. Start your verification today.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              className="min-w-[240px] px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
              asChild
            >
              <Link href="/verify">Start Verification</Link>
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
