'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for getting started',
      features: [
        'Business listing',
        'Basic profile',
        'Public visibility',
        'Customer messages (limited)',
      ],
      badge: null,
      cta: 'Get Started',
      variant: 'outline' as const,
    },
    {
      name: 'Verified',
      price: '$5',
      period: 'per month',
      description: 'Full verification with Trust Badge',
      features: [
        'Everything in Basic',
        'Jhustify Trust Badge',
        'Full verification process',
        'Priority in search results',
        'Enhanced profile features',
        'Message tracking',
        'Verified contact information',
      ],
      badge: 'BASIC' as const,
      cta: 'Get Verified',
      variant: 'primary' as const,
      popular: true,
    },
    {
      name: 'Premium',
      price: '$15',
      period: 'per month',
      description: 'Advanced features and Gold Badge',
      features: [
        'Everything in Verified',
        'Jhustify Premium Badge',
        'Top placement in search',
        'Unlimited messages',
        'CRM integration',
        'Analytics dashboard',
        'Priority support',
        'Advanced lead tracking',
      ],
      badge: 'GOLD' as const,
      cta: 'Upgrade to Premium',
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#465362] mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-700">
                Choose the plan that's right for your business. All plans include our core verification services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full flex flex-col shadow-lg ${tier.popular ? 'ring-2 ring-[#465362] relative' : ''}`}
                  hover
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#465362] text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-[#465362]">{tier.name}</h3>
                        {tier.badge && (
                          <TrustBadge type={tier.badge} size="sm" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{tier.description}</p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-[#465362]">{tier.price}</span>
                        {tier.period && (
                          <span className="text-gray-600">/{tier.period}</span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="text-[#C2EABD] mt-0.5 flex-shrink-0" size={20} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={tier.variant}
                    className="w-full py-3 font-semibold shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <Link href="/verify">{tier.cta}</Link>
                  </Button>
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
            <h2 className="text-3xl font-bold text-[#465362] text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">
                  What's included in the verification process?
                </h3>
                <p className="text-gray-600">
                  Our verification process includes checking your contact information (phone, email), verifying your 
                  business location, and reviewing your registration documents (for formal businesses) or proof of 
                  presence (for informal businesses).
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next 
                  billing cycle.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept major credit cards, debit cards, and local payment methods including mobile money 
                  (M-Pesa, MTN MoMo) and bank transfers across Africa.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-[#465362] mb-2">
                  Is there a setup fee?
                </h3>
                <p className="text-gray-600">
                  No setup fees! The first month of Verified tier starts at just $1.00, then continues at the 
                  regular $5/month subscription rate.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] border-none">
            <h2 className="text-3xl font-bold text-[#465362] mb-4">
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

