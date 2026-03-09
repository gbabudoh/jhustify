'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Lock, Database, Globe, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'integrations'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A1C1E] tracking-tight mb-2">Platform Settings</h1>
        <p className="text-gray-500 font-medium">Configure global application parameters, security policies, and third-party integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm border ${
              activeTab === 'general' 
              ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-lg shadow-[#1A1C1E]/20' 
              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
            }`}
          >
            <SettingsIcon size={18} /> General Setup
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm border ${
              activeTab === 'security' 
              ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-lg shadow-[#1A1C1E]/20' 
              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
            }`}
          >
            <Shield size={18} /> Security & Access
          </button>

          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm border ${
              activeTab === 'integrations' 
              ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-lg shadow-[#1A1C1E]/20' 
              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
            }`}
          >
            <Globe size={18} /> Integrations & APIs
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm !rounded-3xl p-8 relative overflow-hidden">
            
            {/* Success Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#1A1C1E] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50 font-bold text-sm border border-gray-700"
                >
                  <CheckCircle2 size={16} className="text-[#a8d59d]" /> Settings saved successfully
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSaveSettings}>
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-[#1A1C1E]">General Platform Setup</h2>
                    <p className="text-sm font-medium text-gray-500">Manage overarching application variables.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Platform Name</label>
                      <Input defaultValue="Jhustify" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Support Email Contact</label>
                      <Input defaultValue="support@jhustify.com" type="email" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Platform Description (SEO Meta)</label>
                    <textarea 
                      defaultValue="Jhustify is a disruptive marketplace bridging the gap between consumers and both informal and formal sectors."
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium text-gray-700 outline-none transition-all focus:bg-white focus:border-[#a8d59d] focus:ring-4 focus:ring-[#d3f5ce]/50 resize-y"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Contact Details Visibility</label>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="visibility" defaultChecked className="w-4 h-4 text-[#1A1C1E] focus:ring-[#1A1C1E]" />
                        <div>
                          <p className="font-bold text-[#1A1C1E]">Public (Everyone)</p>
                          <p className="text-xs text-gray-500 font-medium">Any visitor can view business contact numbers.</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="visibility" className="w-4 h-4 text-[#1A1C1E] focus:ring-[#1A1C1E]" />
                        <div>
                          <p className="font-bold text-[#1A1C1E]">Registered Users Only</p>
                          <p className="text-xs text-gray-500 font-medium">Only logged-in consumers can view contact numbers.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-[#1A1C1E]">Security & Access Control</h2>
                    <p className="text-sm font-medium text-gray-500">Configure authentication flows and data protection.</p>
                  </div>
                  
                  <div>
                    <label className="flex flex-row items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                          <Lock size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1C1E]">Force Two-Factor Authentication (2FA)</p>
                          <p className="text-xs text-gray-500 font-medium">Require all Admin and Trust Team members to use 2FA.</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A1C1E] bg-[#1A1C1E] right-0 ring-4 ring-[#1A1C1E]/20" />
                        <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A1C1E] cursor-pointer"></label>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex flex-row items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1C1E]">Strict Password Complexity</p>
                          <p className="text-xs text-gray-500 font-medium">Require 12+ characters, symbols, and numbers for all users.</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A1C1E] bg-[#1A1C1E] right-0 ring-4 ring-[#1A1C1E]/20" />
                        <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A1C1E] cursor-pointer"></label>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-row items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                          <Database size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1C1E]">Automated Daily Backups</p>
                          <p className="text-xs text-gray-500 font-medium">Snapshot the entire MongoDB cluster to cold storage nightly.</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle3" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A1C1E] bg-[#1A1C1E] right-0 ring-4 ring-[#1A1C1E]/20" />
                        <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A1C1E] cursor-pointer"></label>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-[#1A1C1E]">Integrations & External APIs</h2>
                    <p className="text-sm font-medium text-gray-500">Manage API keys and external service connections.</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="p-5 border border-[#a8d59d] bg-[#d3f5ce]/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#1A1C1E] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#5BB318]"></div> Paystack Payment Gateway</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5BB318] bg-[#d3f5ce] px-2 py-1 rounded-md">Connected</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Public Key</label>
                          <div className="bg-white border border-gray-200 p-2.5 rounded-xl font-mono text-sm text-gray-600 flex justify-between items-center shadow-sm">
                            pk_live_***********************************809a
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Secret Key</label>
                          <div className="bg-white border border-gray-200 p-2.5 rounded-xl font-mono text-sm text-gray-600 flex justify-between items-center shadow-sm">
                            sk_live_***********************************991c
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 border border-gray-200 rounded-2xl opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#1A1C1E] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> AWS SES (Email Service)</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Connected</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Access Key ID</label>
                          <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-xl font-mono text-sm text-gray-600">
                            AKIAIOSFODNN7EXAMPLE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  isLoading={isSaving}
                  className="px-8 py-3.5 rounded-xl shadow-lg shadow-[#1A1C1E]/15"
                >
                  Save Configuration
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
