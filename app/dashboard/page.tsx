'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Shield, CheckCircle2, Clock, AlertCircle, Plus, MessageSquare, Search, User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';

interface Business {
  _id: string;
  businessName: string;
  verificationStatus: string;
  verificationTier: string;
  trustBadgeActive: boolean;
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
      const response = await fetch('/api/business?ownerId=' + userId, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
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
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#465362] mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600">Manage your verified businesses</p>
            </div>
            <Button variant="primary" asChild>
              <Link href="/verify">
                <Plus className="mr-2" size={20} />
                Add Business
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
                  Ready to Get Verified?
                </h3>
                <p className="text-gray-600 mb-2 max-w-md mx-auto">
                  Add your first business and earn the Jhustify Trust Sign to build credibility with customers across Africa.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Verification takes just a few minutes and boosts your visibility by up to 3x
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/verify" className="flex items-center gap-2">
                      <ShieldCheck size={20} />
                      Start Verification
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card key={business._id} hover>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-[#465362] flex-1">
                      {business.businessName}
                    </h3>
                    {business.trustBadgeActive && (
                      <TrustBadge type="BASIC" size="sm" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(business.verificationStatus)}`}>
                      {getStatusIcon(business.verificationStatus)}
                      {business.verificationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/business/${business._id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/business/${business._id}`}>Manage</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

