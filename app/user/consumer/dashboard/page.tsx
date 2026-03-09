'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Building2, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Users,
  Compass,
  ArrowUpRight,
  Filter,
  ShoppingBag,
  Banknote,
  Sprout,
  Monitor,
  Truck,
  Briefcase,
  Stethoscope,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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

interface Message {
  id: string;
  businessId: {
    id: string;
    businessName: string;
    category: string;
  };
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ConsumerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string; role?: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'CONSUMER') {
        router.push('/');
        return;
    }

    setIsAuthenticated(true);
    setUser(parsedUser);
    fetchMessages(token);
  }, [router]);

  const fetchMessages = async (token: string) => {
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#465362]/10 border-t-[#465362] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#465362] rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  const readMessagesCount = messages.filter(m => m.status === 'REPLIED' || m.status === 'READ').length;

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
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20"
          >
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#465362]/5 rounded-full text-[#465362] text-xs font-black uppercase tracking-widest border border-[#465362]/10">
                <Sparkles size={14} className="animate-bounce" />
                Consumer Dashboard
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#465362] leading-[0.95] tracking-tighter">
                Welcome back, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#465362] to-[#5BB318]">
                  {user?.name ? user.name.split(' ')[0] : 'Member'}
                </span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
                Explore a curated marketplace of verified African businesses and manage your inquiries with ease.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
               {[
                 { label: 'Total inquiries', value: messages.length, icon: MessageSquare, color: 'bg-blue-500' },
                 { label: 'Responses', value: readMessagesCount, icon: TrendingUp, color: 'bg-[#5BB318]' }
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 min-w-[220px]"
                 >
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/5`}>
                       <stat.icon className="text-white" size={24} />
                    </div>
                    <div>
                       <div className="text-3xl font-black text-[#465362] leading-none mb-1">{stat.value}</div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
                    </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
          >
             {/* Search Card */}
             <div className="group relative">
                <Card className="p-10 bg-white border-gray-100 !rounded-[48px] h-full flex flex-col justify-between hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border-2">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
                        <Search className="text-[#5BB318]" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-[#465362] mb-4 tracking-tight leading-tight">Find Verified <br />Businesses</h3>
                    <p className="text-[#465362] font-medium mb-12">Browse our high-trust directory to find reliable partners across the continent.</p>
                  </div>
                  <Button variant="primary" className="w-full bg-[#5BB318] hover:bg-[#4da114] text-white border-transparent rounded-2xl h-14 text-lg font-black tracking-tight" asChild>
                      <Link href="/search" className="flex items-center justify-center gap-2">
                        Explore Marketplace <ArrowUpRight size={20} />
                      </Link>
                  </Button>
                </Card>
             </div>

             {/* Trust Card */}
             <div className="group relative">
                <Card className="p-10 bg-white border-gray-100 !rounded-[48px] h-full flex flex-col justify-between hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border-2">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
                        <ShieldCheck className="text-[#5BB318]" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-[#465362] mb-4 tracking-tight leading-tight">Built on <br />Transparency</h3>
                    <p className="text-gray-500 font-medium mb-12">Learn how our multi-step verification process keeps the marketplace secure.</p>
                  </div>
                  <Link href="/trust-transparency" className="group/link text-base font-black text-[#465362] flex items-center gap-2 hover:gap-4 transition-all">
                      The Jhustify Standard <ArrowRight size={20} className="text-[#5BB318]" />
                  </Link>
                </Card>
             </div>

             {/* Saved Items Card */}
             <div className="group relative">
                <Card className="p-10 bg-[#F8FAFC] border-dashed border-2 border-gray-200 !rounded-[48px] h-full flex flex-col justify-between">
                  <div className="relative z-10 opacity-50">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 border border-gray-200">
                        <Star className="text-amber-400" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-[#465362] mb-4 tracking-tight leading-tight">Your Saved <br />Partners</h3>
                    <p className="text-gray-500 font-medium mb-12">Keep track of the businesses that matter most to your current projects.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full w-fit">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#465362]">Coming Early 2026</span>
                  </div>
                </Card>
             </div>
          </motion.div>

          {/* Explore by Category Section */}
          <motion.div variants={itemVariants} className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-[#465362] tracking-tighter mb-4">Explore by Category</h2>
                <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                  Find exactly what you need across hundreds of sectors, with real-time verification status for every listing.
                </p>
              </div>
              <Button variant="outline" className="border-2 border-gray-200 text-[#465362] hover:bg-gray-50 rounded-2xl px-8 h-14 text-lg font-black tracking-tight" asChild>
                <Link href="/search">View All Categories</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {[
                { name: 'Retail', icon: ShoppingBag, count: '1,240+', color: 'bg-blue-50 text-blue-600' },
                { name: 'Finance', icon: Banknote, count: '450+', color: 'bg-emerald-50 text-emerald-600' },
                { name: 'Agriculture', icon: Sprout, count: '890+', color: 'bg-green-50 text-green-600' },
                { name: 'Technology', icon: Monitor, count: '320+', color: 'bg-purple-50 text-purple-600' },
                { name: 'Logistics', icon: Truck, count: '670+', color: 'bg-orange-50 text-orange-600' },
                { name: 'Services', icon: Briefcase, count: '1,560+', color: 'bg-indigo-50 text-indigo-600' },
                { name: 'Health', icon: Stethoscope, count: '210+', color: 'bg-rose-50 text-rose-600' },
                { name: 'Creative', icon: Palette, count: '430+', color: 'bg-pink-50 text-pink-600' },
              ].map((cat, idx) => (
                <Link 
                  key={idx}
                  href={`/search?category=${cat.name}`}
                  className="group relative bg-white border-2 border-gray-50 rounded-[40px] p-8 hover:border-[#5BB318]/20 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                >
                  <div className={`w-20 h-20 ${cat.color} rounded-[28px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon size={36} />
                  </div>
                  <h4 className="text-2xl font-black text-[#465362] tracking-tight mb-2 group-hover:text-[#5BB318] transition-colors">{cat.name}</h4>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">{cat.count} listings</p>
                  
                  {/* Subtle decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Messages Section */}
          <motion.div variants={itemVariants} className="mb-32">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-black text-[#465362] tracking-tighter mb-2">Recent Inquiries</h2>
                  <p className="text-gray-500 font-medium">Your ongoing conversations with business partners.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500">
                    <Filter size={14} /> Filter
                  </div>
                  {messages.length > 0 && (
                    <Link href="/messages" className="text-sm font-black text-[#465362] hover:text-[#5BB318] transition-colors uppercase tracking-widest bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                      All Messages
                    </Link>
                  )}
                </div>
             </div>

             {messages.length === 0 ? (
                <div className="bg-white rounded-[64px] py-32 text-center border-2 border-dashed border-gray-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[#5BB318]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <div className="relative z-10 max-w-lg mx-auto px-6">
                     <div className="w-24 h-24 bg-[#F8FAFC] rounded-[32px] flex items-center justify-center border border-gray-100 mx-auto mb-8 shadow-inner">
                        <Compass className="text-gray-300" size={48} />
                     </div>
                     <h3 className="text-3xl font-black text-[#465362] mb-4 tracking-tight">No conversations yet</h3>
                     <p className="text-gray-500 font-medium mb-12 text-lg">
                       Start reaching out to verified businesses to see your conversation history here.
                     </p>
                     <Button variant="primary" className="bg-[#465362] hover:bg-[#343e49] text-white rounded-[24px] px-12 py-5 text-lg font-black tracking-tight shadow-xl shadow-[#465362]/20" asChild>
                        <Link href="/search">Find Your First Partner</Link>
                     </Button>
                   </div>
                </div>
             ) : (
                <div className="grid gap-6">
                   <AnimatePresence>
                     {messages.slice(0, 5).map((msg, i) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card hover className="p-8 bg-white border-none !rounded-[40px] transition-all hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] relative group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-20 h-20 bg-[#F8FAFC] rounded-[32px] flex items-center justify-center border border-gray-100 shrink-0 group-hover:bg-[#465362] group-hover:border-[#465362] transition-colors duration-500">
                                     <Building2 className="text-gray-400 group-hover:text-white transition-colors duration-500" size={32} />
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                       <h4 className="text-2xl font-black text-[#465362] leading-none mb-1 group-hover:text-[#5BB318] transition-colors">{msg.businessId?.businessName}</h4>
                                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">•</span>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-[#5BB318]">{msg.businessId?.category}</span>
                                     </div>
                                     <p className="text-lg text-gray-500 font-medium truncate max-w-md">{msg.subject}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-8">
                                  <div className="text-right hidden sm:block">
                                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Initiated</p>
                                     <div className="flex items-center justify-end gap-2 text-[#465362] font-black">
                                       <Clock size={14} className="text-[#5BB318]" />
                                       {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                     </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-center sm:items-end gap-2">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                                      msg.status === 'REPLIED' ? 'bg-[#5BB318]/10 text-[#5BB318] border-[#5BB318]/20' : 
                                      msg.status === 'READ' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                      'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                      {msg.status.replace('_', ' ')}
                                    </span>
                                  </div>

                                  <Link href={`/messages?id=${msg.id}`}>
                                    <div className="w-14 h-14 rounded-[24px] bg-[#F8FAFC] border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#465362] group-hover:text-white group-hover:border-[#465362] group-hover:scale-110 transition-all duration-500 shadow-sm">
                                        <ArrowUpRight size={24} />
                                    </div>
                                  </Link>
                               </div>
                            </div>
                          </Card>
                        </motion.div>
                     ))}
                   </AnimatePresence>
                </div>
             )}
          </motion.div>

          {/* Discover Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[64px] p-12 md:p-20 border border-gray-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#C2EABD]/10 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="w-40 h-40 bg-gray-50 rounded-[48px] flex items-center justify-center shrink-0 border border-gray-100">
                <Users size={80} className="text-[#5BB318]/20" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-4xl font-black text-[#465362] tracking-tighter mb-6">Want to help build <br />the network?</h3>
                <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">
                  Join our community of reviewers and help verified businesses grow by sharing your honest experiences.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button variant="primary" className="bg-[#5BB318] hover:bg-[#4da114] rounded-2xl px-10 py-4 font-black">Become a Verified Contributor</Button>
                  <Button variant="ghost" className="text-[#465362] font-black">Learn More</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
