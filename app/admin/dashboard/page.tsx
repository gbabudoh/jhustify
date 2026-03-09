'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, Building2, ShieldCheck, Mail,
  CreditCard, BarChart3, ArrowUpRight, Activity, Zap, Settings,
  TrendingUp, Target, Server, Lock
} from 'lucide-react';
import Card from '@/components/ui/Card';

interface AdminStats {
  users: number;
  businesses: number;
  verifications: number;
  messages: number;
  ratings: number;
  subscriptions: number;
  banners: number;
  revenue: number;
}

interface ActivityItem {
  type: 'BUSINESS' | 'SUBSCRIPTION' | 'USER' | 'VERIFICATION';
  text: string;
  meta: string;
  time: string;
}

// Simple Sparkline Component for visual flair
const Sparkline = ({ color }: { color: string }) => (
  <svg className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 40">
    <path
      d="M0 35 Q 20 10, 40 30 T 80 10 T 100 25"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    users: 0,
    businesses: 0,
    verifications: 0,
    messages: 0,
    ratings: 0,
    subscriptions: 0,
    banners: 0,
    revenue: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin-token');
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);

        // Fetch activities
        const actResponse = await fetch('/api/admin/activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (actResponse.ok) {
          const actData = await actResponse.json();
          setActivities(actData);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const adminModules = [
    {
      title: 'Global Cohort',
      description: 'Active platform accounts',
      icon: Users,
      href: '/admin/users',
      color: '#3B82F6', // Blue
      gradient: 'from-blue-500/10 to-blue-600/5',
      count: stats.users.toLocaleString(),
      trend: 'Live',
      trendUp: true
    },
    {
      title: 'Verified Entities',
      description: 'Formal & Informal reach',
      icon: Building2,
      href: '/admin/businesses',
      color: '#10B981', // Emerald
      gradient: 'from-emerald-500/10 to-teal-600/5',
      count: stats.businesses.toLocaleString(),
      trend: 'Live',
      trendUp: true
    },
    {
      title: 'Clearance Queries',
      description: 'Pending admin validation',
      icon: ShieldCheck,
      href: '/admin/verifications',
      color: '#F59E0B', // Amber
      gradient: 'from-amber-500/10 to-orange-600/5',
      count: stats.verifications,
      trend: `${stats.verifications} Pending`,
      trendUp: false
    },
    {
      title: 'Yield Engine',
      description: 'Active premium flow',
      icon: CreditCard,
      href: '/admin/finance',
      color: '#8B5CF6', // Purple
      gradient: 'from-purple-500/10 to-indigo-600/5',
      count: stats.subscriptions.toLocaleString(),
      trend: 'Live',
      trendUp: true
    },
  ];

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'BUSINESS': return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' };
      case 'SUBSCRIPTION': return { icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'USER': return { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'VERIFICATION': return { icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-[#5BB318]/5 border-t-[#5BB318] rounded-full animate-spin shadow-xl"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Target className="text-[#5BB318]" size={20} />
             </div>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Initializing Matrix Assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Dynamic Command Center Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
             <span className="bg-[#5BB318]/10 text-[#5BB318] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#5BB318]/20">
               Live Control
             </span>
             <span className="w-2 h-2 rounded-full bg-[#5BB318] shadow-[0_0_8px_#5BB318] animate-pulse" />
          </div>
          <h1 className="text-5xl font-black text-[#1A1C1E] mb-2 tracking-tighter leading-none">Command Center.</h1>
          <p className="text-gray-500 font-bold text-lg">System vitals and platform operations are optimal.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-white p-3 rounded-[40px] shadow-2xl shadow-black/[0.03] border border-gray-100"
        >
          <div className="px-6 py-3 bg-gray-50/80 rounded-[28px] border border-gray-100 shadow-inner">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Yield</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1A1C1E]">{formatCurrency(stats.revenue)}</span>
              <span className="text-[10px] font-bold text-[#5BB318] flex items-center gap-1">
                <TrendingUp size={10} /> Live
              </span>
            </div>
          </div>
          <Link href="/admin/finance" className="w-14 h-14 bg-[#1A1C1E] text-white rounded-[24px] flex items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 group">
            <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* KPI Intelligence Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminModules.map((module, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
            key={module.title}
          >
            <Link href={module.href}>
              <Card className="h-full bg-white border-2 border-transparent hover:border-gray-100/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 !rounded-[44px] relative overflow-hidden group p-1">
                {/* Visual Accent */}
                <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${module.gradient} blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700`}></div>
                
                <div className="relative z-10 p-7 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-white transition-colors duration-500 border border-gray-100/50">
                      <module.icon size={28} style={{ color: module.color }} />
                    </div>
                    <div className="flex flex-col items-end">
                       <div className={`flex items-center gap-1 text-[11px] font-black ${module.trendUp ? 'text-[#5BB318]' : 'text-amber-500'}`}>
                         {module.trendUp ? <TrendingUp size={12} /> : <Activity size={12} />}
                         {module.trend}
                       </div>
                       <Sparkline color={module.color} />
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-4xl font-black text-[#1A1C1E] mb-2 tracking-tighter">
                      {module.count}
                    </h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-950 transition-colors uppercase">{module.title}</p>
                    <p className="text-[11px] text-gray-400 font-bold tracking-tight">{module.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Control Surface Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Advanced System Operations */}
        <Card className="lg:col-span-2 bg-[#0F1113] border-none shadow-2xl !rounded-[56px] p-10 relative overflow-hidden">
          {/* Decorative Visuals */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(91,179,24,0.08),transparent_50%)]"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[20px] bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                  <Activity className="text-[#5BB318]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">System Matrix</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Platform Controls</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#5BB318] shadow-[0_0_8px_#5BB318]" />
                 <div className="w-2 h-2 rounded-full bg-white/10" />
                 <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-5 mb-auto">
              {[
                { label: 'Broadcaster', sub: 'Broadcast Emails', icon: Mail, href: '/admin/communications', color: 'text-blue-400' },
                { label: 'Neuralytics', sub: 'Deep Bio Metrics', icon: BarChart3, href: '/admin/analytics', color: 'text-amber-400' },
                { label: 'Toggles', sub: 'Global Modifiers', icon: Settings, href: '/admin/settings', color: 'text-gray-400' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="group bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 rounded-[32px] p-7 transition-all flex flex-col items-center text-center">
                  <div className={`p-4 rounded-2xl bg-white/5 mb-5 group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon size={28} />
                  </div>
                  <h4 className="font-black text-white text-sm mb-1 tracking-tight">{item.label}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.sub}</p>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/5">
               <div className="flex items-center gap-4">
                 <Server className="text-gray-500" size={20} />
                 <div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Main Instance</p>
                   <p className="text-xs font-bold text-white tracking-tight">aws-jhustify-node-01</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <Lock className="text-gray-500" size={20} />
                 <div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security Level</p>
                   <p className="text-xs font-bold text-[#5BB318] tracking-tight">Level 5 (Shielded)</p>
                 </div>
               </div>
               <button className="px-6 py-2 bg-[#5BB318] text-[#0F1113] text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-[#d3f5ce] transition-colors">
                  System Audit
               </button>
            </div>
          </div>
        </Card>

        {/* Real-time Event Pulse */}
        <Card className="bg-white border-none shadow-xl !rounded-[56px] p-8 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
              <Zap size={180} />
           </div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black text-[#1A1C1E] tracking-tight">Real-time Feed</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Live Traffic Pulse</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#5BB318] bg-[#5BB318]/10 px-3 py-1.5 rounded-full border border-[#5BB318]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5BB318] animate-pulse"></span>
                  Listening
                </div>
              </div>
              
              <div className="space-y-6 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {activities.length > 0 ? (
                  activities.map((log, i) => {
                    const iconConfig = getActivityIcon(log.type);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        key={i} 
                        className="flex gap-4 items-start group relative"
                      >
                        <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 ${iconConfig.bg} border border-gray-100 shadow-sm group-hover:scale-110 transition-transform`}>
                          <iconConfig.icon size={18} className={iconConfig.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-[#1A1C1E] truncate mb-0.5">{log.text}</p>
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{log.meta}</span>
                             <span className="text-[10px] font-black text-[#1A1C1E]/40 italic">{formatTime(log.time)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-40">
                    <Activity size={40} className="mb-4 text-gray-300" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">No recent activity detected</p>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50">
                <button className="w-full py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#1A1C1E] transition-all border border-gray-100/50 flex items-center justify-center gap-2 group">
                  Archive Command Hub <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>
        </Card>
      </div>

    </div>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
