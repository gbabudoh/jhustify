'use client';

import { useState } from 'react';
import { Mail, Send, Filter, Users, ShieldAlert, CheckCircle2, CheckCheck, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCommunications() {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simulate API broadcast dispatch
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setSubject('');
      setMessage('');
      setTargetAudience('');
      
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1C1E] tracking-tight mb-2">Communications Hub</h1>
          <p className="text-gray-500 font-medium">Manage automated campaigns, platform broadcasts, and transactional email templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('compose')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm border ${
              activeTab === 'compose' 
              ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-lg shadow-[#1A1C1E]/20' 
              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3"><Send size={18} /> Compose Broadcast</div>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm border ${
              activeTab === 'history' 
              ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-lg shadow-[#1A1C1E]/20' 
              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3"><Mail size={18} /> Campaign History</div>
          </button>

          <div className="pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Quick Stats</h4>
            <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-3">
              <span className="text-xs text-gray-500 font-bold mb-1 block">Emails Sent (30d)</span>
              <span className="text-2xl font-black tracking-tight text-[#1A1C1E]">142.5K</span>
              <div className="flex items-center gap-1 mt-2 text-xs font-bold text-green-600 bg-green-50 w-max px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> 99.8% Delivery Rate
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'compose' ? (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-none shadow-sm !rounded-3xl p-8 relative overflow-hidden">
                  {/* Success Overlay */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#d3f5ce]/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8 rounded-3xl"
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#5BB318]/20">
                          <CheckCheck size={40} className="text-[#5BB318]" />
                        </div>
                        <h2 className="text-3xl font-black text-[#2e5e0c] mb-2 tracking-tight">Campaign Dispatched!</h2>
                        <p className="text-[#3f7d12] font-medium max-w-sm">
                          Your broadcast has been successfully queued in the mailing service and is currently being delivered to the target audience.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-[#f4f7fe] text-[#4318FF] rounded-2xl">
                      <Send size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#1A1C1E]">New Platform Broadcast</h2>
                      <p className="text-sm font-medium text-gray-500">Send an email globally to a specific segment of users.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Target Audience</label>
                      <Select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        required
                        options={[
                          { value: '', label: 'Select Target Segment' },
                          { value: 'ALL_USERS', label: 'All Platform Users (~150k)' },
                          { value: 'BUSINESS_ONLY', label: 'Registered Businesses Only (~45k)' },
                          { value: 'CONSUMER_ONLY', label: 'Consumer Accounts Only (~105k)' },
                          { value: 'PREMIUM_BUSINESS', label: 'Premium Subscribed Businesses (~1.2k)' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Subject Line</label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. System Maintenance Notice"
                        required
                        className="font-medium text-lg placeholder:text-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Message Body (Markdown Supported)</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={10}
                        required
                        placeholder="Type your broadcast message here..."
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium text-gray-700 outline-none transition-all focus:bg-white focus:border-[#a8d59d] focus:ring-4 focus:ring-[#d3f5ce]/50 resize-y"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Powered by AWS SES Integration</span>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={isSending}
                        className="px-8 py-3.5 rounded-xl shadow-lg shadow-[#1A1C1E]/15"
                      >
                        <Send size={18} className="mr-2" /> Dispatch Campaign
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-none shadow-sm !rounded-3xl p-0 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-lg font-black text-[#1A1C1E]">Campaign Dispatch History</h2>
                    <Button variant="outline" size="sm" className="rounded-xl border-gray-200 bg-white">
                      <Filter size={16} className="mr-2" /> Filter
                    </Button>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {/* Simulated History Items */}
                    <div className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-4 cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-[#d3f5ce] flex items-center justify-center shrink-0 border border-[#a8d59d]">
                        <CheckCheck size={20} className="text-[#5BB318]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[#1A1C1E] group-hover:text-blue-600 transition-colors">Q3 Platform Updates & Feature Releases</h4>
                          <span className="text-xs font-bold text-gray-400">Oct 12, 10:45 AM</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-500 font-medium">To: Premium Businesses</span>
                          <span className="flex items-center text-xs font-bold text-gray-400"><Users size={12} className="mr-1" /> 1,204 delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-4 cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-[#d3f5ce] flex items-center justify-center shrink-0 border border-[#a8d59d]">
                        <CheckCheck size={20} className="text-[#5BB318]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[#1A1C1E] group-hover:text-blue-600 transition-colors">Important: Updated Terms of Service</h4>
                          <span className="text-xs font-bold text-gray-400">Sep 01, 09:00 AM</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-500 font-medium">To: All Platform Users</span>
                          <span className="flex items-center text-xs font-bold text-gray-400"><Users size={12} className="mr-1" /> 148,930 delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-4 cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                        <ShieldAlert size={20} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[#1A1C1E] group-hover:text-blue-600 transition-colors">Security Incident Advisory</h4>
                          <span className="text-xs font-bold text-gray-400">Aug 15, 02:30 PM</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-500 font-medium">To: All Businesses</span>
                          <span className="flex items-center text-xs font-bold text-red-500"><AlertTriangle size={12} className="mr-1" /> Critical Notice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
