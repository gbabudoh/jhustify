'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence, Variants, Easing } from 'framer-motion';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "circOut" as Easing }
  }
};

export default function BusinessSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string; email?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

    setUser(parsedUser);
    setName(parsedUser.name || '');
    setEmail(parsedUser.email || '');
    setLoading(false);
    
    // Fetch fresh user data from API
    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
      }
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update local storage
        const updatedUser = { ...user, name, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#5BB318]/20 border-t-[#5BB318] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#465362] selection:text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#5BB318]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#465362]/5 rounded-full blur-[120px]" />
      </div>

      <Header />
      
      <main className="relative container mx-auto px-4 py-12 md:py-20">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#465362]/5 rounded-full text-[#465362] text-xs font-black uppercase tracking-widest border border-[#465362]/10 mb-6">
              <ShieldCheck size={14} className="text-[#5BB318]" />
              Account Settings
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#465362] tracking-tighter mb-4">
              Manage your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#465362] to-[#5BB318]">Profile</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Update your personal details, secure your account, and manage notifications.
            </p>
          </motion.div>

          {/* Success/Error Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${
                  message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Navigation */}
            <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">
              <Card className="p-6 border-none bg-white !rounded-[32px] shadow-sm">
                <div className="flex items-center gap-4 mb-8 p-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#465362] to-[#1e293b] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-[#465362] leading-tight">{user?.name}</h3>
                    <p className="text-xs font-bold text-[#5BB318] uppercase tracking-wider mt-1">Business Owner</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Personal Profile', icon: User },
                    { id: 'security', label: 'Security & Password', icon: Lock },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'profile' | 'security' | 'notifications')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                        activeTab === tab.id 
                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' 
                        : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                        <span className="font-bold text-sm">{tab.label}</span>
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-100 !text-gray-600 hover:!bg-gray-50 justify-start gap-3 h-12 rounded-2xl"
                    onClick={() => router.push('/user/business/dashboard')}
                  >
                    <LayoutDashboard size={18} />
                    Back to Dashboard
                  </Button>
                </div>
              </Card>

              {/* Quick Info Card */}
              <Card className="p-8 border-none bg-gradient-to-br from-[#5BB318] to-[#2D5A27] !rounded-[32px] text-white shadow-xl shadow-[#5BB318]/20">
                <Building2 size={32} className="mb-4 opacity-50" />
                <h4 className="text-xl font-black mb-2 leading-tight">Verified Business Authority</h4>
                <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">
                  Your profile is linked to your business listings. Keep your information up to date to maintain trust with your customers.
                </p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Trust Score</span>
                        <span>85%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[85%]"></div>
                    </div>
                </div>
              </Card>
            </motion.div>

            {/* Main Content Area */}
            <motion.div variants={itemVariants} className="lg:col-span-8">
              <Card className="p-10 border-none bg-white !rounded-[40px] shadow-sm min-h-[600px]">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-[#465362] mb-2">Personal Information</h2>
                      <p className="text-gray-500 font-medium text-sm">Update your name and primary contact email.</p>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5BB318] transition-colors">
                              <User size={18} />
                            </span>
                            <Input 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-12 !bg-gray-50 focus:!bg-white h-14 !rounded-2xl border-transparent focus:border-[#5BB318] transition-all"
                              placeholder="Your full name"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5BB318] transition-colors">
                              <Mail size={18} />
                            </span>
                            <Input 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-12 !bg-gray-50 focus:!bg-white h-14 !rounded-2xl border-transparent focus:border-[#5BB318] transition-all"
                              placeholder="your@email.com"
                              type="email"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          isLoading={isSaving}
                          className="bg-gray-900 hover:bg-black text-white px-10 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/10 transition-all"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-[#465362] mb-2">Account Security</h2>
                      <p className="text-gray-500 font-medium text-sm">Ensure your account stays safe by using a strong password.</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5BB318] transition-colors">
                              <Lock size={18} />
                            </span>
                            <Input 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="pl-12 !bg-gray-50 focus:!bg-white h-14 !rounded-2xl border-transparent focus:border-[#5BB318] transition-all"
                              placeholder="••••••••"
                              type="password"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                            <Input 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="!bg-gray-50 focus:!bg-white h-14 !rounded-2xl border-transparent focus:border-[#5BB318] transition-all"
                              placeholder="••••••••"
                              type="password"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <Input 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="!bg-gray-50 focus:!bg-white h-14 !rounded-2xl border-transparent focus:border-[#5BB318] transition-all"
                              placeholder="••••••••"
                              type="password"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          isLoading={isSaving}
                          className="bg-gray-900 hover:bg-black text-white px-10 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/10 transition-all"
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-[#465362] mb-2">Notifications</h2>
                      <p className="text-gray-500 font-medium text-sm">Choose what updates you want to receive.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: 'Email Alerts', description: 'Receive emails about new messages and leads.', defaultChecked: true },
                        { title: 'Verification Updates', description: 'Get notified about changes to your business verification status.', defaultChecked: true },
                        { title: 'Platform News', description: 'Hear about new features and updates on Jhustify.', defaultChecked: false },
                        { title: 'Marketing', description: 'Receive promotional offers and tips for business growth.', defaultChecked: false },
                      ].map((item, i) => (
                        <label key={i} className="flex items-center justify-between p-6 border border-gray-100 rounded-[24px] hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="space-y-1">
                            <p className="font-black text-[#465362] group-hover:text-black transition-colors">{item.title}</p>
                            <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 rounded-full bg-gray-100 border border-gray-200 cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-all peer-checked:left-7 peer-checked:bg-[#5BB318] shadow-sm"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
