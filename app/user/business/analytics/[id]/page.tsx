'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  TrendingUp, 
  Eye, 
  Star, 
  ShieldCheck, 
  ArrowLeft, 
  Calendar,
  LayoutDashboard,
  BarChart3,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface AnalyticsData {
  totalViews: number;
  trustScore: number;
  averageRating: number;
  totalReviews: number;
  viewsTrend: { date: string; views: number }[];
  memberSince: string;
}

export default function BusinessAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/business/${businessId}/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [businessId, router]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Link 
                href="/user/business/dashboard" 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#5BB318] font-black uppercase tracking-widest text-[10px] mb-6 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
              <h1 className="text-5xl font-black text-[#465362] tracking-tighter leading-none mb-3">
                Business Analytics
              </h1>
              <p className="text-gray-500 font-medium">Performance metrics and trust indicators for your entity.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <Calendar size={18} className="text-blue-500" />
              <span className="text-xs font-black text-[#465362] uppercase tracking-widest">Last 7 Days</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Visibility', value: data.totalViews, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Trust Score', value: `${data.trustScore}%`, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Avg Rating', value: data.averageRating, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Total Reviews', value: data.totalReviews, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <Card key={i} className="p-8 border-none bg-white !rounded-[32px] shadow-sm group">
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-[#465362] tracking-tighter">{stat.value}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* View Trends Chart (Simplified Visualization) */}
            <Card className="lg:col-span-2 p-10 border-none bg-white !rounded-[48px] shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-[#465362] tracking-tighter flex items-center gap-2">
                  <TrendingUp className="text-blue-500" /> Visibility Trends
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engagement Node</span>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 mt-8">
                {data.viewsTrend.map((day, i) => {
                  const maxViews = Math.max(...data.viewsTrend.map(d => d.views));
                  const height = maxViews > 0 ? (day.views / maxViews) * 100 : 5;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full relative">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl md:rounded-t-2xl group-hover:from-blue-700 group-hover:to-blue-500 transition-all relative"
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#465362] text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {day.views}
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Trust Breakdown */}
            <Card className="p-10 border-none bg-white !rounded-[48px] shadow-sm">
              <h3 className="text-2xl font-black text-[#465362] tracking-tighter mb-8 flex items-center gap-2">
                <Award className="text-emerald-500" /> Trust Matrix
              </h3>
              
              <div className="space-y-8">
                {[
                  { label: 'Document Validation', score: data.trustScore > 70 ? 100 : 50, color: 'bg-emerald-500' },
                  { label: 'Physical Scan', score: data.trustScore > 80 ? 100 : 0, color: 'bg-blue-500' },
                  { label: 'Community Rating', score: data.averageRating * 20, color: 'bg-amber-500' },
                  { label: 'Operational Age', score: 40, color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[10px] font-black text-[#465362]">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Next Step to Growth</p>
                <p className="text-xs text-emerald-600 font-bold leading-relaxed mb-4">
                  Businesses with a physical scan badge receive 4.5x more trust inquiries.
                </p>
                <Button className="w-full h-10 !rounded-xl !text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" asChild>
                  <Link href="/verify">Scan Business Now</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
