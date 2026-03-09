'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Zap, Globe, ShieldCheck, Download,
  RefreshCcw, Wallet, BarChart3, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Updated Pricing Data
const PRICING = {
  BASIC: { label: 'Daily Free', price: 0, description: 'Basic listing for all entities' },
  PRO: { label: 'Pro Account', price: 1200, unit: 'NGN', interval: 'monthly' }
};

// Conversions for 1200 NGN (Approximate)
const CONVERSIONS = [
  { country: 'Ghana', code: 'GHS', amount: 12.5 },
  { country: 'Kenya', code: 'KES', amount: 105.0 },
  { country: 'South Africa', code: 'ZAR', amount: 15.2 },
  { country: 'Egypt', code: 'EGP', amount: 38.4 },
  { country: 'CFA Zone', code: 'XOF', amount: 485.0 }
];

const MOCK_TRANSACTIONS = [
  { id: 'TXN-9021', business: 'Leksol Consulting', amount: 1200, type: 'Subscription', plan: 'Pro', status: 'success', date: 'Just now', ref: 'BST-45912-PAY' },
  { id: 'TXN-9020', business: 'Adaora Designs', amount: 1200, type: 'Subscription', plan: 'Pro', status: 'success', date: '12 mins ago', ref: 'BST-45911-PAY' },
  { id: 'TXN-9019', business: 'TechHub Africa', amount: 0, type: 'Listing', plan: 'Free', status: 'success', date: '45 mins ago', ref: 'LST-00014-FR' },
  { id: 'TXN-9018', business: 'Kojo Carpentry', amount: 1200, type: 'Subscription', plan: 'Pro', status: 'failed', date: '2 hours ago', ref: 'BST-45910-PAY' },
  { id: 'TXN-9017', business: 'Ngozi Gourmet', amount: 1200, type: 'Subscription', plan: 'Pro', status: 'success', date: '5 hours ago', ref: 'BST-45909-PAY' },
];

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'failed': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <Zap className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Initializing Financial Core...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <Globe size={14} />
            Global Revenue Interface
          </div>
          <h1 className="text-5xl font-black text-[#1A1C1E] tracking-tighter leading-tight mb-2">Finance Engine</h1>
          <p className="text-gray-500 font-bold text-lg">Cross-border subscription auditing and gateway instrumentation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-14 !rounded-2xl border-gray-200 bg-white font-black uppercase tracking-widest text-[10px] px-8 shadow-sm hover:shadow-md transition-all">
            <Download size={16} className="mr-3 text-blue-500" />
            Export Audit
          </Button>
          <Button variant="primary" className="h-14 !rounded-2xl bg-[#1A1C1E] font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-black/10 hover:-translate-y-1 transition-all">
            <RefreshCcw size={16} className="mr-3 text-blue-300" />
            Sync Gateway
          </Button>
        </div>
      </div>

      {/* Modern KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: '₦4.8M', change: '+22.4%', icon: Wallet, color: 'blue' },
          { label: 'Pro Accounts', value: '2,842', change: '+12.1%', icon: Zap, color: 'amber' },
          { label: 'Approval Rate', value: '98.2%', change: '+0.4%', icon: ShieldCheck, color: 'emerald' },
          { label: 'Avg Latency', value: '114ms', change: '-4.2%', icon: Activity, color: 'indigo' }
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="!rounded-[2rem] border-none shadow-xl shadow-blue-900/5 p-6 bg-white group hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                  <kpi.icon size={24} />
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${kpi.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</h3>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tighter">{kpi.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Subscriptions Hub */}
          <Card className="!rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 overflow-hidden p-0 bg-white border border-white">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
              <div>
                <h2 className="text-2xl font-black text-[#1A1C1E] tracking-tight">Revenue Stream</h2>
                <p className="text-sm font-bold text-gray-400">Auditing subscription lifecycle and free tier allocations.</p>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/50 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  History
                </button>
                <button 
                  onClick={() => setActiveTab('plans')}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'plans' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Tiers
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'transactions' ? (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
                        <th className="py-6 px-8 text-left">Entity</th>
                        <th className="py-6 px-4 text-left">Plan Type</th>
                        <th className="py-6 px-4 text-left">Amount</th>
                        <th className="py-6 px-4 text-left">Internal Status</th>
                        <th className="py-6 px-8 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                      {MOCK_TRANSACTIONS.map((txn) => (
                        <tr key={txn.id} className="hover:bg-blue-50/10 transition-colors group">
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                <Building2 size={18} />
                              </div>
                              <div>
                                <div className="font-black text-[#1A1C1E] text-sm tracking-tight">{txn.business}</div>
                                <div className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">{txn.ref}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${txn.plan === 'Pro' ? 'text-blue-600' : 'text-gray-400'}`}>
                              {txn.plan}
                            </span>
                          </td>
                          <td className="py-6 px-4">
                            <span className="font-black text-[#1A1C1E]">
                              {txn.amount === 0 ? 'FREE' : `₦${txn.amount.toLocaleString()}`}
                            </span>
                          </td>
                          <td className="py-6 px-4">
                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(txn.status)}`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="py-6 px-8 text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{txn.date}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-8 grid md:grid-cols-2 gap-8"
                >
                  <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 mb-6 font-black text-xl italic">
                      B
                    </div>
                    <h3 className="text-xl font-black text-[#1A1C1E] mb-2">{PRICING.BASIC.label}</h3>
                    <p className="text-gray-400 font-medium text-sm mb-6">{PRICING.BASIC.description}</p>
                    <div className="text-4xl font-black text-[#1A1C1E] mb-8">FREE</div>
                    <div className="w-full bg-white px-6 py-4 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Standard Visibility Tier
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Growth
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 font-black text-xl italic">
                      P
                    </div>
                    <h3 className="text-xl font-black text-[#1A1C1E] mb-2">{PRICING.PRO.label}</h3>
                    <p className="text-gray-400 font-medium text-sm mb-6">Advanced metrics & boosted prominence.</p>
                    <div className="text-4xl font-black text-[#1A1C1E] mb-8">₦{PRICING.PRO.price.toLocaleString()}</div>
                    <div className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                      High Visibility Activation
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          
          {/* African Currency Exchange */}
          <Card className="!rounded-[2.5rem] border-none shadow-xl shadow-blue-900/5 p-8 bg-white text-gray-900 relative overflow-hidden border border-gray-100">
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-blue-500">
              <Globe size={200} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Regional Pricing (Pro)</h3>
              <div className="space-y-5">
                {CONVERSIONS.map((conv) => (
                  <div key={conv.code} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-500">
                        {conv.code.substring(0, 1)}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{conv.country}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{conv.code} {conv.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                Price normalized to 1,200 NGN across all regional nodes via algorithmic conversion.
              </div>
            </div>
          </Card>

          {/* Infrastructure Health */}
          <Card className="!rounded-[2.5rem] border-none shadow-xl shadow-blue-900/5 p-8 bg-white">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Gateway Protocols</h3>
            <div className="space-y-6">
              {[
                { label: 'Paystack Settlement', status: 'Healthy', val: 99, color: 'blue' },
                { label: 'Webhook Listeners', status: 'Optimal', val: 100, color: 'emerald' },
                { label: 'Currency API', status: 'Lagging', val: 84, color: 'amber' }
              ].map((sys) => (
                <div key={sys.label}>
                  <div className="flex justify-between items-end mb-3 px-1">
                    <div>
                      <p className="text-xs font-black text-[#1A1C1E] uppercase">{sys.label}</p>
                      <p className={`text-[9px] font-black uppercase text-${sys.color}-500 tracking-wider`}>{sys.status}</p>
                    </div>
                    <span className="text-xs font-black text-gray-400">{sys.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.val}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full rounded-full bg-${sys.color}-500`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analytics Snapshot */}
          <Card className="!rounded-[2.5rem] border-none shadow-xl shadow-blue-900/5 p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white group">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/20 rounded-2xl">
                <BarChart3 size={24} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Growth Index</p>
                <p className="text-xl font-black">+42.8%</p>
              </div>
            </div>
            <p className="text-sm font-bold text-white/90 leading-relaxed group-hover:-translate-y-1 transition-transform">
              Monthly compounding growth in Pro account activations detected in the West African cluster.
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}
