'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Mail, User, Building2, MessageSquare, LogIn, ArrowLeft, Star } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import TrustBadge from '@/components/TrustBadge';
import Button from '@/components/ui/Button';
import RatingDisplay from '@/components/RatingDisplay';
import RatingForm from '@/components/RatingForm';

interface Business {
  _id?: string;
  id?: string;
  businessName: string;
  category: string;
  classification: 'REGISTERED' | 'UNREGISTERED';
  contactPersonName: string;
  contactNumber: string;
  email: string;
  physicalAddress: string;
  city?: string;
  country?: string;
  verificationStatus: string;
  verificationTier: string;
  trustBadgeActive: boolean;
  trustBadgeType?: 'INFORMAL' | 'FORMAL' | 'VERIFIED';
  businessRepresentativePhoto?: string;
  averageRating?: number;
  ratingCount?: number;
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
  const [ratings, setRatings] = useState<any[]>([]);
  const [ratingStats, setRatingStats] = useState<any>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState<any>(null);
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBusiness();
      fetchRatings();
    }
    checkAuth();
  }, [params.id]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      checkUserRating();
    }
  }, [isAuthenticated, params.id]);

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
      
      if (!response.ok) {
        console.error('Business fetch error:', data.error);
        setBusiness(null);
        return;
      }
      
      setBusiness(data.business);
    } catch (error) {
      console.error('Error fetching business:', error);
      setBusiness(null);
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
          businessId: business.id || business._id,
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

  const fetchRatings = async () => {
    if (!params.id) return;
    setLoadingRatings(true);
    try {
      const response = await fetch(`/api/ratings?businessId=${params.id}&limit=10`);
      const data = await response.json();
      if (response.ok) {
        setRatings(data.ratings || []);
        setRatingStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoadingRatings(false);
    }
  };

  const checkUserRating = async () => {
    if (!params.id || !isAuthenticated || userRole !== 'CONSUMER') return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ratings?businessId=${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.ratings) {
        const tokenData = JSON.parse(atob(token!.split('.')[1]));
        const userRating = data.ratings.find((r: any) => r.userId === tokenData.userId);
        if (userRating) {
          setUserRating(userRating);
        }
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const handleRatingSuccess = () => {
    setShowRatingForm(false);
    fetchRatings();
    checkUserRating();
    if (business) {
      fetchBusiness();
    }
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
          {/* Back to Listing Button */}
          <div className="mb-4">
            <Link href="/search">
              <button className="flex items-center gap-2 text-[#465362] hover:text-[#2d3748] transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Business Listings</span>
              </button>
            </Link>
          </div>
          
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {/* Business Representative Photo */}
                  {business.businessRepresentativePhoto ? (
                    <div className="flex-shrink-0">
                      <img
                        src={business.businessRepresentativePhoto}
                        alt={business.contactPersonName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#D6D9DD]"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#A0D995] flex items-center justify-center border-2 border-[#D6D9DD]">
                      <User className="text-[#465362]" size={32} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl font-bold text-[#465362]">{business.businessName}</h1>
                      {business.trustBadgeActive && (
                        <TrustBadge type={business.trustBadgeType} size="md" />
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mt-2">{business.category}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#F5F5F5] text-[#465362]">
                        {business.classification === 'REGISTERED' ? 'Formal Business' : 'Informal Business'}
                      </span>
                      {business.averageRating !== undefined && business.averageRating > 0 && (
                        <RatingDisplay
                          average={business.averageRating}
                          count={business.ratingCount || 0}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#465362] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#465362]">Address</p>
                    <p className="text-gray-600">{business.physicalAddress}</p>
                    {(business.city || business.country) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {business.city ? `${business.city}, ` : ''}{business.country}
                      </p>
                    )}
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
                {business.verificationTier === 'PREMIUM' && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-[#465362] mt-1" size={20} />
                    <div>
                      <p className="font-medium text-[#465362]">Email</p>
                      <p className="text-gray-600">{business.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <User className="text-[#465362] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-[#465362]">Contact Person</p>
                    <p className="text-gray-600">{business.contactPersonName}</p>
                  </div>
                </div>
              </div>
            </div>

            {business.verificationStatus === 'VERIFIED' && (
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

          {/* Ratings Section */}
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#465362]">Customer Ratings</h2>
              {isAuthenticated && userRole === 'CONSUMER' && !showRatingForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRatingForm(true)}
                >
                  {userRating ? 'Update Rating' : 'Rate This Business'}
                </Button>
              )}
            </div>

            {ratingStats && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#465362]">
                      {ratingStats.average.toFixed(1)}
                    </div>
                    <RatingDisplay
                      average={ratingStats.average}
                      count={ratingStats.count}
                      size="sm"
                      showCount={false}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {ratingStats.count} {ratingStats.count === 1 ? 'rating' : 'ratings'}
                    </p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingStats.distribution[star] || 0;
                      const percentage = ratingStats.count > 0 ? (count / ratingStats.count) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600 w-8">{star}</span>
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {showRatingForm && isAuthenticated && userRole === 'CONSUMER' && (
              <div className="mb-6">
                <RatingForm
                  businessId={params.id as string}
                  existingRating={userRating}
                  onSuccess={handleRatingSuccess}
                  onCancel={() => setShowRatingForm(false)}
                />
              </div>
            )}

            {loadingRatings ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#465362]"></div>
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating: any) => (
                  <div key={rating.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#A0D995] flex items-center justify-center">
                          <User size={16} className="text-[#465362]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#465362]">{rating.userName}</p>
                          <RatingDisplay
                            average={rating.rating}
                            count={0}
                            size="sm"
                            showCount={false}
                          />
                        </div>
                      </div>
                      {rating.verified && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          (consumer)
                        </span>
                      )}
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700 mt-2">{rating.comment}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No ratings yet. Be the first to rate this business!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

