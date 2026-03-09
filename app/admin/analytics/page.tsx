'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, Download, Calendar, ArrowUpRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1C1E] tracking-tight mb-2">Platform Analytics</h1>
          <p className="text-gray-500 font-medium">Deep-dive into performance metrics, user growth, and business KPIs.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-white border border-gray-200 p-1 rounded-xl flex shadow-sm">
            {['7D', '30D', '90D', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === range 
                  ? 'bg-[#1A1C1E] text-white shadow-md' 
                  : 'text-gray-500 hover:text-[#1A1C1E]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" className="rounded-xl shadow-sm border-gray-200 text-gray-700 bg-white">
            <Download size={16} className="mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm !rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 text-gray-100 group-hover:scale-110 transition-transform duration-500">
            <Users size={120} />
          </div>
          <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 relative z-10">Total Active Users</h3>
          <div className="flex items-end gap-3 mb-2 relative z-10">
            <p className="text-4xl font-black text-[#1A1C1E] tracking-tight">154.2K</p>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 py-1 px-2 rounded-lg mb-1">
              <ArrowUpRight size={14} className="mr-1" /> 12.5%
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium relative z-10">Compared to previous {timeRange.toLowerCase()} period</p>
        </Card>

        <Card className="border-none shadow-sm !rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 text-gray-100 group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag size={120} />
          </div>
          <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 relative z-10">Registered Businesses</h3>
          <div className="flex items-end gap-3 mb-2 relative z-10">
            <p className="text-4xl font-black text-[#1A1C1E] tracking-tight">45.8K</p>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 py-1 px-2 rounded-lg mb-1">
              <ArrowUpRight size={14} className="mr-1" /> 8.2%
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium relative z-10">Compared to previous {timeRange.toLowerCase()} period</p>
        </Card>

        <Card className="border-none shadow-sm !rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 text-gray-100 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={120} />
          </div>
          <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 relative z-10">Platform Engagement</h3>
          <div className="flex items-end gap-3 mb-2 relative z-10">
            <p className="text-4xl font-black text-[#1A1C1E] tracking-tight">8.4M</p>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 py-1 px-2 rounded-lg mb-1">
              <ArrowUpRight size={14} className="mr-1" /> 24.1%
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium relative z-10">Total interactions/searches</p>
        </Card>

        <Card className="border-none shadow-sm !rounded-3xl p-6 bg-gradient-to-br from-[#1A1C1E] to-[#2D3135] text-white shadow-xl shadow-[#1A1C1E]/20 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-white/5">
            <BarChart3 size={120} />
          </div>
          <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest mb-2 relative z-10">Premium Conversion</h3>
          <div className="flex items-end gap-3 mb-2 relative z-10">
            <p className="text-4xl font-black text-white tracking-tight">14.2%</p>
            <span className="flex items-center text-xs font-bold text-[#d3f5ce] bg-white/10 py-1 px-2 rounded-lg mb-1 backdrop-blur-sm">
              <ArrowUpRight size={14} className="mr-1" /> 3.1%
            </span>
          </div>
          <p className="text-xs text-white/50 font-medium relative z-10">Free to premium upgrade rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area Simulated */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm !rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-lg font-black text-[#1A1C1E]">Growth Trajectory</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1A1C1E]"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Consumers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#a8d59d]"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Businesses</span>
                </div>
              </div>
            </div>

            {/* Simulated Chart Graphic Component */}
            <div className="flex-1 relative w-full flex items-end justify-between px-2 gap-2 z-10 mt-auto">
              {/* Generate 12 random-looking bars using pure CSS for fidelity */}
              {[40, 55, 45, 60, 50, 75, 65, 85, 80, 95, 85, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1A1C1E] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    Week {i + 1}: +{height}k
                  </div>
                  <div 
                    className="w-full bg-[#1A1C1E] rounded-t-sm transition-all duration-500 group-hover:bg-blue-600" 
                    style={{ height: `${height * 0.7}%` }}
                  ></div>
                  <div 
                    className="w-full bg-[#a8d59d] rounded-sm transition-all duration-500 group-hover:bg-emerald-500" 
                    style={{ height: `${height * 0.3}%` }}
                  ></div>
                </div>
              ))}
            </div>
            
            {/* Chart Grid Lines */}
            <div className="absolute inset-x-6 inset-y-24 flex flex-col justify-between pointer-events-none z-0">
              <div className="border-t border-gray-100/80 w-full"></div>
              <div className="border-t border-gray-100/80 w-full"></div>
              <div className="border-t border-gray-100/80 w-full"></div>
              <div className="border-t border-gray-100/80 w-full"></div>
              <div className="border-t border-gray-200 w-full mb-1"></div>
            </div>
          </Card>
        </div>

        {/* Side Metrics column */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm !rounded-3xl p-6 bg-gray-50 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Top Business Categories</h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-sm text-[#1A1C1E]">Retail & Fashion</span>
                  <span className="font-bold text-xs text-gray-500">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1A1C1E] h-2 rounded-full w-[42%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-sm text-[#1A1C1E]">Food & Beverage</span>
                  <span className="font-bold text-xs text-gray-500">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#465362] h-2 rounded-full w-[28%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-sm text-[#1A1C1E]">Professional Services</span>
                  <span className="font-bold text-xs text-gray-500">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full w-[18%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-sm text-[#1A1C1E]">Technology</span>
                  <span className="font-bold text-xs text-gray-500">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#a8d59d] h-2 rounded-full w-[12%]" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-sm !rounded-3xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={16} /> Recent Activity Logs
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-[#1A1C1E]">150+ New users registered</p>
                  <p className="text-xs text-gray-400 font-medium">Over the last 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-[#1A1C1E]">New algorithm deployed</p>
                  <p className="text-xs text-gray-400 font-medium">To improve local search radius</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-[#1A1C1E]">Detected 12 spam accounts</p>
                  <p className="text-xs text-gray-400 font-medium">Successfully auto-terminated</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
