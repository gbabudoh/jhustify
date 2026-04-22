'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, MessageSquare, MapPin, ShieldCheck, Trash2, Zap, Star, ArrowRight, TrendingUp, BarChart3, Users, Sparkles, LayoutDashboard, Settings, Eye } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';

interface Business {
  id: string;
  businessName: string;
  category?: string;
  classification?: string;
  contactPersonName?: string;
  contactNumber?: string;
  email?: string;
  physicalAddress?: string;
  country?: string;
  city?: string;
  businessRepresentativePhoto?: string;
  verificationStatus: string;
  verificationTier: string;
  trustBadgeActive: boolean;
  trustBadgeType?: 'INFORMAL' | 'FORMAL' | 'VERIFIED';
  verificationId?: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string; role?: string } | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState({ totalListings: 0, verifiedListings: 0, totalViews: 0, activeLeads: 0 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'BUSINESS_OWNER') {
        router.push('/');
        return;
    }

    setIsAuthenticated(true);
    setUser(parsedUser);
    fetchBusinesses(token, parsedUser.id);
    fetchStats(token, parsedUser.id);
  }, [router]);

  const fetchBusinesses = async (token: string, userId: string) => {
    try {
      if (!userId) {
        console.error('User ID is missing');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/business?ownerId=${encodeURIComponent(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch businesses:', errorData.error || response.statusText);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (token: string, userId: string) => {
    try {
      const response = await fetch(`/api/user/business/stats?ownerId=${encodeURIComponent(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeleteBusiness = async (businessId: string, businessName: string) => {
    if (!confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(businessId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete businesses');
        return;
      }

      const response = await fetch(`/api/business/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete business');
      }

      setBusinesses(businesses.filter(b => b.id !== businessId));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete business';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#5BB318]/20 border-t-[#5BB318] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#465362] selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#5BB318]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-[#465362]/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#C2EABD]/10 rounded-full blur-[80px] animate-pulse delay-1000"></div>
      </div>

      <Header />
      
      <main className="relative container mx-auto px-4 py-12 md:py-20">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20"
          >
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#465362]/5 rounded-full text-[#465362] text-xs font-black uppercase tracking-widest border border-[#465362]/10 mx-auto lg:mx-0">
                <LayoutDashboard size={14} className="animate-pulse" />
                Business Dashboard
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#465362] leading-[0.95] tracking-tighter">
                Manage your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#465362] to-[#5BB318]">
                   Business Data
                </span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Welcome back, {user?.name?.split(' ')[0] || 'Partner'}. Monitor your performance, manage listings, and grow your reach across the continent.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end gap-4">
               <Button variant="primary" className="bg-[#5BB318] hover:bg-[#4da114] text-white h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#5BB318]/20 group transition-all" asChild>
                  <Link href="/verify" className="flex items-center gap-2">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    New Listing
                  </Link>
               </Button>
               <Button variant="outline" className="border-2 border-gray-100 !text-black !bg-white hover:!bg-white hover:!text-green-800 h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/5" asChild>
                  <Link href="/pricing" className="flex items-center gap-2">
                    <Zap size={18} className="text-amber-500 fill-amber-500" />
                    Upgrade Tier
                  </Link>
               </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { label: 'Total Listings', value: statsLoading ? '...' : stats.totalListings, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Verified Status', value: statsLoading ? '...' : stats.verifiedListings, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Profile Views', value: statsLoading ? '...' : stats.totalViews.toLocaleString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Active Leads', value: statsLoading ? '...' : stats.activeLeads, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <Card key={i} className="p-8 border-none bg-white !rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-[#465362] tracking-tighter">{stat.value}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Businesses List */}
          <motion.div variants={itemVariants} className="mb-32">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-[#465362] tracking-tighter">Your Portfolio</h2>
                <p className="text-gray-500 font-medium">Manage and optimize your active business presence.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <BarChart3 size={16} className="text-[#5BB318]" />
                <span className="text-xs font-black text-[#465362] uppercase tracking-widest">{businesses.length} Active</span>
              </div>
            </div>

            {businesses.length === 0 ? (
              <motion.div variants={itemVariants}>
                <Card className="bg-white border-dashed border-2 border-gray-100 !rounded-[64px] overflow-hidden group">
                  <div className="text-center py-32 px-6 relative">
                    <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 max-w-lg mx-auto">
                      <div className="w-24 h-24 bg-[#F8FAFC] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
                        <Building2 className="text-gray-300" size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-[#465362] mb-4 tracking-tight">No listings found</h3>
                      <p className="text-gray-500 text-lg mb-12 font-medium">
                        You haven&apos;t established your presence on Jhustify yet. Let&apos;s get your first business verified.
                      </p>
                      <Button variant="primary" className="bg-[#465362] hover:bg-[#343e49] text-white rounded-[24px] px-12 py-5 text-lg font-black tracking-tight shadow-xl shadow-[#465362]/20" asChild>
                        <Link href="/verify">Create Your First Listing</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {/* Get Jhustified CTA */}
                {businesses.some(b => b.verificationTier !== 'PREMIUM') && (
                  <motion.div
                    variants={itemVariants}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#5BB318] to-blue-600 rounded-[48px] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Card className="relative p-1 border-none bg-white !rounded-[48px] overflow-hidden shadow-2xl shadow-black/5">
                      <div className="bg-gradient-to-br from-white via-white to-blue-50/50 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                          <div className="w-20 h-20 bg-[#465362] rounded-[28px] flex items-center justify-center shrink-0 shadow-2xl shadow-[#465362]/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Star className="text-white fill-[#5BB318]" size={36} />
                          </div>
                          <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                              <h3 className="text-3xl font-black text-[#465362] tracking-tighter">Become Jhustified</h3>
                              <span className="px-3 py-1 bg-[#5BB318]/10 rounded-full text-[10px] font-black text-[#5BB318] border border-[#5BB318]/20 uppercase tracking-[0.2em]">PRO</span>
                            </div>
                            <p className="text-gray-500 font-medium text-lg max-w-xl">
                              Unlock our highest trust tier to access elite features: rich media galleries, verified social links, and the prestigious golden badge.
                            </p>
                          </div>
                        </div>
                        <Button className="bg-[#465362] hover:bg-black text-white px-10 py-6 rounded-[24px] font-black text-sm uppercase tracking-widest group shadow-2xl shadow-[#465362]/30" asChild>
                          <Link href="/pricing" className="flex items-center gap-3">
                            Upgrade Portfolio <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {businesses.map((business) => (
                      <motion.div
                        key={business.id}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card hover className="flex flex-col bg-white border-2 border-gray-50 shadow-sm !rounded-[48px] overflow-hidden transition-all duration-500 hover:border-[#5BB318]/20 hover:shadow-2xl hover:shadow-black/5 group">
                          <div className="h-56 bg-gray-100 relative overflow-hidden">
                            {business.businessRepresentativePhoto ? (
                              <Image
                                src={business.businessRepresentativePhoto}
                                alt={business.businessName}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#465362]/5 to-[#5BB318]/5">
                                <Building2 className="text-[#465362]/10" size={80} />
                              </div>
                            )}
                            <div className="absolute top-6 right-6">
                              <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/50">
                                <TrustBadge 
                                  type={business.verificationTier === 'PREMIUM' ? 'JHUSTIFIED' : (business.trustBadgeType || 'INFORMAL')} 
                                  size="sm" 
                                />
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-6">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                                 business.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/80 text-white border-emerald-400/50' : 
                                 'bg-amber-500/80 text-white border-amber-400/50'
                               }`}>
                                 {business.verificationStatus}
                               </span>
                            </div>
                          </div>

                          <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-6">
                              <h3 className="text-2xl font-black text-[#465362] mb-1 truncate leading-tight group-hover:text-[#5BB318] transition-colors">
                                {business.businessName}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{business.category}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{business.verificationTier}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-500 font-medium mb-8 bg-gray-50/50 px-4 py-3 rounded-2xl border border-gray-100">
                              <MapPin size={18} className="text-[#5BB318]" />
                              <span className="text-sm truncate">{business.city}, {business.country}</span>
                            </div>

                            <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-2 pt-6 border-t border-gray-100">
                              <Button variant="outline" className="h-10 rounded-xl border-gray-100 bg-gray-50/50 text-[#465362] hover:bg-[#465362] hover:text-white hover:border-[#465362] transition-all text-[10px] font-black uppercase tracking-tight group/manage p-0" asChild>
                                <Link href={`/dashboard/business/${business.id}/edit`} className="flex flex-col items-center justify-center gap-1 w-full">
                                  <Settings size={14} className="group-hover/manage:rotate-90 transition-transform duration-500" />
                                  <span>Manage</span>
                                </Link>
                              </Button>
                              <Button variant="outline" className="h-10 rounded-xl border-gray-100 text-blue-600 bg-blue-50/50 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all text-[10px] font-black uppercase tracking-tight group/stats p-0" asChild>
                                <Link href={`/user/business/analytics/${business.id}`} className="flex flex-col items-center justify-center gap-1 w-full">
                                  <TrendingUp size={14} />
                                  <span>Stats</span>
                                </Link>
                              </Button>
                              <Button variant="outline" className="h-10 rounded-xl border-gray-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-[10px] font-black uppercase tracking-tight group/view p-0" asChild>
                                <Link href={`/business/${business.id}`} className="flex flex-col items-center justify-center gap-1 w-full">
                                  <Eye size={14} />
                                  <span>View</span>
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                className="h-10 rounded-xl border-none bg-red-500 text-white hover:bg-red-600 transition-all text-[10px] font-black uppercase tracking-tight flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-500/10 group/del p-0"
                                onClick={() => handleDeleteBusiness(business.id, business.businessName)}
                                disabled={deletingId === business.id}
                              >
                                <Trash2 size={14} className={deletingId === business.id ? 'animate-pulse' : 'group-hover/del:scale-110 transition-transform'} />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions / Ecosystem */}
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="p-12 bg-[#465362] border-none !rounded-[64px] text-white relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#5BB318] rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                            <Sparkles className="text-[#5BB318]" size={24} />
                         </div>
                         <h3 className="text-3xl font-black tracking-tighter">Verified Growth</h3>
                      </div>
                      <p className="text-gray-300 font-medium text-lg mb-10 max-w-xl leading-relaxed">
                        Jhustify isn&apos;t just a directory; it&apos;s a trust network. Businesses with verified physical scans see up to **300% more inquiries**.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-6">
                          <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-start gap-5 hover:bg-white/10 transition-colors">
                              <div className="w-12 h-12 bg-[#5BB318]/20 rounded-2xl flex items-center justify-center shrink-0 border border-[#5BB318]/30">
                                  <ShieldCheck className="text-[#5BB318]" size={24} />
                              </div>
                              <div>
                                  <h4 className="font-black text-sm mb-1 uppercase tracking-widest text-[#5BB318]">Trust Tier 2</h4>
                                  <p className="text-xs text-gray-400 font-medium leading-relaxed">Verify your government identity to unlock direct messaging.</p>
                              </div>
                          </div>
                          <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-start gap-5 hover:bg-white/10 transition-colors">
                              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/30">
                                  <Users className="text-blue-400" size={24} />
                              </div>
                              <div>
                                  <h4 className="font-black text-sm mb-1 uppercase tracking-widest text-blue-400">Collaborate</h4>
                                  <p className="text-xs text-gray-400 font-medium leading-relaxed">Connect with other verified suppliers across Africa.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-10 bg-white border-2 border-gray-50 shadow-sm !rounded-[64px] h-full flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-8 border border-blue-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <MessageSquare className="text-blue-600" size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-[#465362] mb-4 tracking-tighter">Support Elite</h3>
                  <p className="text-gray-500 font-medium mb-12 leading-relaxed">
                    Our dedicated Trust Team is on standby to help you navigate the verification process.
                  </p>
                  <Button variant="outline" className="w-full rounded-[24px] font-black h-16 border-2 border-gray-100 text-[#465362] hover:bg-gray-50 transition-all text-lg" asChild>
                      <Link href="/contact">Elite Support</Link>
                  </Button>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
