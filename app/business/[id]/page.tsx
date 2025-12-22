'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Mail, User, Building2, MessageSquare, LogIn } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import TrustBadge from '@/components/TrustBadge';
import Button from '@/components/ui/Button';

interface Business {
  _id: string;
  businessName: string;
  category: string;
  classification: 'REGISTERED' | 'UNREGISTERED';
  contactPersonName: string;
  contactNumber: string;
  email: string;
  physicalAddress: string;
  verificationStatus: string;
  verificationTier: string;
  trustBadgeActive: boolean;
  trustBadgeType?: 'BASIC' | 'GOLD';
}

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [message, setMessage] = useState({ phone: '', subject: '', message: '' });

  useEffect(() => {
    if (params.id) {
      fetchBusiness();
    }
    checkAuth();
  }, [params.id]);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAuthenticated(true);
          setUserRole(user.role);
        } catch (e) {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  };

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/business/${params.id}`);
      const data = await response.json();
      setBusiness(data.business);
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessageError('');
    setMessageSuccess(false);

    if (!isAuthenticated || userRole !== 'CONSUMER') {
      setMessageError('Please log in with a consumer account to send messages.');
      return;
    }

    if (!business) {
      setMessageError('Business information not available.');
      return;
    }

    if (!message.subject.trim() || !message.message.trim()) {
      setMessageError('Please fill in all required fields.');
      return;
    }

    setSendingMessage(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: business._id,
          subject: message.subject.trim(),
          message: message.message.trim(),
          phone: message.phone.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessageError(data.error || 'Failed to send message. Please try again.');
        return;
      }

      setMessageSuccess(true);
      setMessage({ phone: '', subject: '', message: '' });
      setShowContactForm(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setMessageSuccess(false), 5000);
    } catch (error) {
      setMessageError('An error occurred. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleContactClick = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(`/business/${params.id}`));
      return;
    }
    
    if (userRole !== 'CONSUMER') {
      setMessageError('Only consumer accounts can send messages to businesses. Please log in with a consumer account.');
      return;
    }

    setShowContactForm(!showContactForm);
  };

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

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600">Business not found.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-[#465362]">{business.businessName}</h1>
                  {business.trustBadgeActive && (
                    <TrustBadge type={business.trustBadgeType} size="md" />
                  )}
                </div>
                <p className="text-lg text-gray-600 mb-2">{business.category}</p>
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#F5F5F5] text-[#465362] mb-4">
                  {business.classification === 'REGISTERED' ? 'Formal Business' : 'Informal Business'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#465362] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#465362]">Address</p>
                    <p className="text-gray-600">{business.physicalAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-[#465362] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#465362]">Phone</p>
                    <p className="text-gray-600">{business.contactNumber}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-[#465362] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#465362]">Email</p>
                    <p className="text-gray-600">{business.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-[#465362] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#465362]">Contact Person</p>
                    <p className="text-gray-600">{business.contactPersonName}</p>
                  </div>
                </div>
              </div>
            </div>

            {business.trustBadgeActive && (
              <div className="mt-6 pt-6 border-t border-[#D6D9DD]">
                <div className="bg-[#C2EABD] bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm text-[#465362] font-medium mb-1">
                    ✓ Verified Business
                  </p>
                  <p className="text-xs text-gray-600">
                    This business has been verified by Jhustify. Contact information and location have been confirmed.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              {!isAuthenticated ? (
                <div className="bg-[#C2EABD] bg-opacity-20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-[#465362] mb-3">
                    Create a free consumer account to contact this business directly through Jhustify.
                  </p>
                  <div className="flex gap-3">
                    <Link href={`/register?role=CONSUMER&redirect=${encodeURIComponent(`/business/${params.id}`)}`}>
                      <Button variant="primary" size="sm">
                        <LogIn className="mr-2" size={16} />
                        Create Consumer Account
                      </Button>
                    </Link>
                    <Link href={`/login?redirect=${encodeURIComponent(`/business/${params.id}`)}`}>
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : userRole !== 'CONSUMER' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 mb-3">
                    You're logged in as a business owner. To contact businesses, please log in with a consumer account.
                  </p>
                  <Link href={`/login?redirect=${encodeURIComponent(`/business/${params.id}`)}`}>
                    <Button variant="ghost" size="sm">
                      Switch Account
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleContactClick}
                  className="w-full md:w-auto"
                >
                  <MessageSquare className="mr-2" size={20} />
                  Send Message
                </Button>
              )}
            </div>
          </Card>

          {showContactForm && isAuthenticated && userRole === 'CONSUMER' && (
            <Card>
              <h2 className="text-xl font-semibold text-[#465362] mb-4">Contact Business</h2>
              
              {messageSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  Message sent successfully! The business owner will receive your message.
                </div>
              )}

              {messageError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {messageError}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4">
                <input
                  type="tel"
                  placeholder="Your Phone (Optional)"
                  value={message.phone}
                  onChange={(e) => setMessage({ ...message, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D6D9DD] focus:border-[#465362] focus:ring-2 focus:ring-[#C2EABD]"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={message.subject}
                  onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D6D9DD] focus:border-[#465362] focus:ring-2 focus:ring-[#C2EABD]"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={message.message}
                  onChange={(e) => setMessage({ ...message, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D6D9DD] focus:border-[#465362] focus:ring-2 focus:ring-[#C2EABD]"
                  required
                />
                <div className="flex gap-4">
                  <Button type="submit" variant="primary" isLoading={sendingMessage} disabled={sendingMessage}>
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => {
                    setShowContactForm(false);
                    setMessageError('');
                    setMessageSuccess(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

