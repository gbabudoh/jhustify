'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Shield, CheckCircle2, Clock, AlertCircle, Plus, MessageSquare, Search, User, Mail, Phone, MapPin, ShieldCheck, TrendingUp, Users, Star, Activity, BarChart3, Calendar, CreditCard, Settings, Bell, Award, Globe, Zap, Target, Briefcase, FileText, Heart, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';

interface Business {
  _id: string;
  id?: string;
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

interface Message {
  _id: string;
  businessId: {
    _id: string;
    businessName: string;
    category: string;
  };
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication immediately
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    if (parsedUser.role === 'CONSUMER') {
      fetchMessages(token);
    } else {
      fetchBusinesses(token, parsedUser.id || parsedUser._id);
    }
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

      // Remove from state
      setBusinesses(businesses.filter(b => (b.id || b._id) !== businessId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete business');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-50';
      case 'IN_REVIEW':
        return 'text-blue-600 bg-blue-50';
      case 'SUBMITTED':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 size={20} />;
      case 'IN_REVIEW':
        return <Clock size={20} />;
      case 'SUBMITTED':
        return <Clock size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#465362]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#465362]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Consumer Dashboard
  if (user?.role === 'CONSUMER') {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#465362] mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600">Manage your inquiries and find verified businesses</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#C2EABD] bg-opacity-20 rounded-lg">
                    <MessageSquare className="text-[#465362]" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Messages Sent</p>
                    <p className="text-2xl font-bold text-[#465362]">{messages.length}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#C2EABD] bg-opacity-20 rounded-lg">
                    <Search className="text-[#465362]" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Find Businesses</p>
                    <Button variant="ghost" size="sm" asChild className="mt-2">
                      <Link href="/search">Search Now</Link>
                    </Button>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#C2EABD] bg-opacity-20 rounded-lg">
                    <User className="text-[#465362]" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="text-lg font-semibold text-[#465362]">Consumer</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#465362] mb-4">Your Messages</h2>
              {messages.length === 0 ? (
                <Card className="bg-gradient-to-br from-white to-[#F5F5F5]">
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="text-[#465362]" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#465362] mb-3">
                      Start Your First Conversation
                    </h3>
                    <p className="text-gray-600 mb-2 max-w-md mx-auto">
                      Browse thousands of verified businesses and send direct messages to connect with the right partners.
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                      All businesses are verified for your peace of mind
                    </p>
                    <Button variant="primary" size="lg" asChild>
                      <Link href="/search" className="flex items-center gap-2">
                        <Search size={20} />
                        Find Verified Businesses
                      </Link>
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card key={msg._id} hover>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <Building2 className="text-[#465362] mt-1" size={20} />
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#465362] mb-1">
                                {msg.businessId?.businessName || 'Business'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1">
                                {msg.businessId?.category || 'Category'}
                              </p>
                            </div>
                          </div>
                          <div className="ml-8">
                            <p className="font-medium text-[#465362] mb-1">{msg.subject}</p>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{msg.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-1 rounded-full ${
                                msg.status === 'READ' ? 'bg-green-50 text-green-600' :
                                msg.status === 'REPLIED' ? 'bg-blue-50 text-blue-600' :
                                'bg-yellow-50 text-yellow-600'
                              }`}>
                                {msg.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/business/${msg.businessId?._id}`}>
                            View Business
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Card className="bg-gradient-to-r from-[#C2EABD] to-[#D9F8D4] border-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#465362] mb-2">
                    Discover Verified Businesses
                  </h3>
                  <p className="text-gray-700">
                    Search through thousands of verified businesses across Africa. Connect with trusted partners for your needs.
                  </p>
                </div>
                <Button variant="primary" size="lg" asChild>
                  <Link href="/search">
                    <Search className="mr-2" size={20} />
                    Start Searching
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Business Owner Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#465362] to-[#6B7280] rounded-xl flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#465362] mb-1">
                      Welcome back, {user?.name}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <ShieldCheck className="text-green-500" size={16} />
                      Manage your verified businesses
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Last login: Today
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" className="bg-gradient-to-r from-[#465362] to-[#6B7280] hover:from-[#5A6774] hover:to-[#7A8289]" asChild>
                  <Link href="/verify" className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Business
                  </Link>
                </Button>
                <Button variant="outline" className="border-[#465362] text-[#465362] hover:bg-[#465362] hover:text-white" asChild>
                  <Link href="/pricing" className="flex items-center gap-2">
                    <CreditCard size={20} />
                    Pricing
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Building2 className="text-white" size={24} />
                  </div>
                  <span className="text-blue-600 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-1">{businesses.length}</h3>
                <p className="text-blue-700 text-sm">Total Businesses</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <span className="text-green-600 text-sm font-medium">Active</span>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-1">
                  {businesses.filter(b => b.verificationStatus === 'VERIFIED').length}
                </h3>
                <p className="text-green-700 text-sm">Verified</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Eye className="text-white" size={24} />
                  </div>
                  <span className="text-purple-600 text-sm font-medium">+24%</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-1">0</h3>
                <p className="text-purple-700 text-sm">Profile Views</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-white" size={24} />
                  </div>
                  <span className="text-orange-600 text-sm font-medium">New</span>
                </div>
                <h3 className="text-2xl font-bold text-orange-900 mb-1">0</h3>
                <p className="text-orange-700 text-sm">Messages</p>
              </div>
            </Card>
          </div>

          {/* Your Businesses Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#465362]">Your Businesses</h2>
              <Button variant="primary" asChild>
                <Link href="/verify" className="flex items-center gap-2">
                  <Plus size={16} />
                  Add New Business
                </Link>
              </Button>
            </div>
            {businesses.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-[#F5F5F5]">
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] flex items-center justify-center mx-auto mb-6">
                    <Building2 className="text-[#465362]" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#465362] mb-3">
                    No Businesses Yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Get started by creating your first business listing. It's free and takes just a few minutes!
                  </p>
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/verify" className="flex items-center gap-2">
                      <Plus size={20} />
                      Create Your First Business
                    </Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => {
                  const businessId = business.id || business._id;
                  const isVerified = business.verificationStatus === 'VERIFIED' || business.trustBadgeType === 'VERIFIED';
                  const canUpgrade = !isVerified && business.verificationTier === 'BASIC';
                  
                  return (
                    <Card key={businessId} hover className="flex flex-col overflow-hidden">
                      {/* Business Image */}
                      {business.businessRepresentativePhoto && (
                        <div className="w-full h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={business.businessRepresentativePhoto}
                            alt={business.businessName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#465362] mb-1">
                              {business.businessName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                          </div>
                          {business.trustBadgeActive && business.trustBadgeType && (
                            <TrustBadge type={business.trustBadgeType} size="sm" />
                          )}
                        </div>
                        
                        {/* Business Information */}
                        <div className="space-y-2 mb-4 text-sm">
                          {business.contactPersonName && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <User size={14} />
                              <span>{business.contactPersonName}</span>
                            </div>
                          )}
                          {business.contactNumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone size={14} />
                              <span>{business.contactNumber}</span>
                            </div>
                          )}
                          {business.country && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={14} />
                              <span>{business.city ? `${business.city}, ` : ''}{business.country}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Status Information */}
                        <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Status</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              business.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                              business.verificationStatus === 'IN_REVIEW' ? 'bg-blue-100 text-blue-700' :
                              business.verificationStatus === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {business.verificationStatus}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Tier</span>
                            <span className="text-xs font-semibold text-[#465362] capitalize">
                              {business.verificationTier}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                          {canUpgrade && (
                            <Button variant="primary" size="sm" className="w-full" asChild>
                              <Link href={`/dashboard/business/${businessId}/upgrade`}>
                                <Award size={14} className="mr-1" />
                                Upgrade to Verified
                              </Link>
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                              <Link href={`/business/${businessId}`}>
                                <Eye size={14} className="mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                              <Link href={`/dashboard/business/${businessId}/edit`}>
                                <Settings size={14} className="mr-1" />
                                Edit
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteBusiness(businessId, business.businessName)}
                              disabled={deletingId === businessId}
                            >
                              {deletingId === businessId ? (
                                <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#465362] to-[#6B7280] rounded-xl flex items-center justify-center">
                    <Zap className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#465362]">Quick Actions</h3>
                    <p className="text-gray-600 text-sm">Get started quickly</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/verify" className="flex items-center gap-2">
                      <Plus size={16} />
                      Add New Business
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/search" className="flex items-center gap-2">
                      <Search size={16} />
                      Find Businesses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/messages" className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      View Messages
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#465362]">Verification Status</h3>
                    <p className="text-gray-600 text-sm">Track your progress</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Businesses Verified</span>
                    <span className="text-sm font-semibold text-green-600">
                      {businesses.filter(b => b.verificationStatus === 'VERIFIED').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {businesses.filter(b => ['SUBMITTED', 'IN_REVIEW'].includes(b.verificationStatus)).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Trust Score</span>
                    <span className="text-sm font-semibold text-blue-600">New</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#465362]">Analytics</h3>
                    <p className="text-gray-600 text-sm">Performance insights</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Eye size={14} />
                      Profile Views
                    </span>
                    <span className="text-sm font-semibold text-purple-600">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Heart size={14} />
                      Trust Points
                    </span>
                    <span className="text-sm font-semibold text-red-600">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Target size={14} />
                      Conversion Rate
                    </span>
                    <span className="text-sm font-semibold text-green-600">0%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#465362] flex items-center gap-2">
                    <Activity className="text-blue-500" size={20} />
                    Recent Activity
                  </h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="text-blue-600" size={16} />
                    </div>
                    <div className="flex-1">
                      {businesses.length === 0 ? (
                        <>
                          <p className="text-sm text-gray-800">No recent business activity</p>
                          <p className="text-xs text-gray-500">Start by adding your first business</p>
                        </>
                      ) : (
                        businesses.slice(0, 3).map((business) => (
                          <div key={business._id} className="mb-3 last:mb-0">
                            <p className="text-sm text-gray-800 font-medium">{business.businessName}</p>
                            <p className="text-xs text-gray-500">
                              {business.verificationStatus} • {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#465362] flex items-center gap-2">
                    <Bell className="text-orange-500" size={20} />
                    Notifications
                  </h3>
                  <Button variant="ghost" size="sm">Mark All Read</Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="text-orange-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Welcome to Jhustify!</p>
                      <p className="text-xs text-gray-500">Get started by verifying your business</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

