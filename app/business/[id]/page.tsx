'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Building2, MessageSquare, ArrowLeft, Star, Instagram, Linkedin, Facebook, CreditCard, Clock, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import TrustBadge from '@/components/TrustBadge';
import Button from '@/components/ui/Button';
import RatingDisplay from '@/components/RatingDisplay';
import RatingForm from '@/components/RatingForm';
import RichMediaGallery from '@/components/RichMediaGallery';
import FormalizationProgress from '@/components/FormalizationProgress';

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
  trustBadgeType?: 'INFORMAL' | 'FORMAL' | 'VERIFIED' | 'COMMUNITY_TRUSTED';
  businessRepresentativePhoto?: string;
  averageRating?: number;
  ratingCount?: number;
  // Rich Data Fields
  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    linkedin?: string;
  };
  paymentMethods?: string[];
  yearsInOperation?: number;
  trustScore?: number;
  formalizationProgress?: number;
  mediaGallery?: string[];
}

interface Rating {
  id: string;
  _id?: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  verified?: boolean;
  sentimentSummary?: string;
}

interface RatingStats {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [message, setMessage] = useState({ phone: '', subject: '', message: '' });
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [loadingRatings, setLoadingRatings] = useState(false);

  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAuthenticated(true);
          setUserRole(user.role);
          setUserId(user.id || user._id);
        } catch {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserId(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
      }
    }
  }, []);

  const fetchBusiness = useCallback(async () => {
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
  }, [params.id]);

  const fetchRatings = useCallback(async () => {
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
  }, [params.id]);

  const checkUserRating = useCallback(async () => {
    if (!params.id || !isAuthenticated || userRole !== 'CONSUMER' || !userId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ratings?businessId=${params.id}&userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.ratings && data.ratings.length > 0) {
        setUserRating(data.ratings[0]);
      } else {
        setUserRating(null);
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  }, [params.id, isAuthenticated, userRole, userId]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (params.id) {
      fetchBusiness();
      fetchRatings();
    }
  }, [params.id, fetchBusiness, fetchRatings]);

  useEffect(() => {
    checkUserRating();
  }, [checkUserRating]);

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

    if (!message.subject || !message.message) {
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
          subject: message.subject,
          message: message.message,
          phone: message.phone || undefined,
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
    } catch {
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
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Media & Core Info */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-0 overflow-hidden border-none shadow-xl">
                <RichMediaGallery images={business.mediaGallery || []} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-4xl font-black text-[#465362] mb-2">{business.businessName}</h1>
                      <div className="flex items-center gap-4 text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Building2 size={16} /> {business.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={16} /> {business.yearsInOperation || 2}+ Years in Operation</span>
                      </div>
                    </div>
                    {business.trustBadgeActive && (
                      <TrustBadge type={business.trustBadgeType} size="lg" />
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                          <MapPin size={18} className="text-[#465362]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Location</p>
                          <p className="text-[#465362] font-semibold">{business.physicalAddress}</p>
                          <p className="text-sm text-gray-500">{business.city}, {business.country}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                          <Phone size={18} className="text-[#465362]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Contact</p>
                          <p className="text-[#465362] font-semibold">{business.contactNumber}</p>
                          <p className="text-sm text-gray-500">{business.contactPersonName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                          <CreditCard size={18} className="text-[#465362]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Payments</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(business.paymentMethods || ['Mobile Money', 'Cash']).map((method, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#465362] border border-gray-100 uppercase">
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                          <Globe size={18} className="text-[#465362]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Social Presence</p>
                          <div className="flex gap-3 mt-1">
                            {business.socialLinks?.instagram && (
                              <a 
                                href={business.socialLinks.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-pink-600 hover:scale-110 transition-transform"
                                title="Instagram"
                              >
                                <Instagram size={20} />
                              </a>
                            )}
                            {business.socialLinks?.facebook && (
                              <a 
                                href={business.socialLinks.facebook} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:scale-110 transition-transform"
                                title="Facebook"
                              >
                                <Facebook size={20} />
                              </a>
                            )}
                            {business.socialLinks?.linkedin && (
                              <a 
                                href={business.socialLinks.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-800 hover:scale-110 transition-transform"
                                title="LinkedIn"
                              >
                                <Linkedin size={20} />
                              </a>
                            )}
                            {(!business.socialLinks || (!business.socialLinks.instagram && !business.socialLinks.facebook && !business.socialLinks.linkedin)) && (
                              <span className="text-xs text-gray-400 italic">No social links added</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Area */}
              <div className="flex flex-col md:flex-row gap-4">
                {!isAuthenticated ? (
                  <div className="bg-[#C2EABD] bg-opacity-20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 w-full">
                    <div className="flex-1">
                      <p className="text-[#465362] font-bold mb-1">Unlock Direct Contact</p>
                      <p className="text-sm text-gray-600">Create a consumer account to message this business and access premium features.</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/register?role=CONSUMER&redirect=${encodeURIComponent(`/business/${params.id}`)}`}>
                        <Button variant="primary">Register Now</Button>
                      </Link>
                      <Link href={`/login?redirect=${encodeURIComponent(`/business/${params.id}`)}`}>
                        <Button variant="ghost">Sign In</Button>
                      </Link>
                    </div>
                  </div>
                ) : userRole !== 'CONSUMER' ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 w-full">
                    <p className="text-amber-800 font-bold mb-1">Business Account View</p>
                    <p className="text-sm text-amber-700 mb-4">You are viewing this as a business representative. Switch to a consumer account to interact.</p>
                    <Link href={`/login?redirect=${encodeURIComponent(`/business/${params.id}`)}`}>
                      <button className="text-sm font-bold text-amber-900 underline underline-offset-4">Switch Account</button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full">
                    <Button 
                      variant="primary" 
                      onClick={handleContactClick} 
                      className="flex-1 py-4 text-lg font-bold shadow-xl shadow-[#5BB318]/20"
                    >
                      <MessageSquare className="mr-2" size={24} />
                      Fast Contact
                    </Button>
                    <a 
                      href={business.contactNumber ? `https://wa.me/${business.contactNumber.replace(/\+/g, '')}` : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full py-4 text-lg font-bold border-2 border-gray-200">
                        WhatsApp Now
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Status & Impact */}
            <div className="space-y-8">
              {/* Trust Card */}
              <Card className="bg-gradient-to-br from-[#465362] to-[#2d3748] border-none text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#C2EABD] text-[#465362] text-[10px] font-black px-2 py-0.5 rounded uppercase">Verified by Jhustify</span>
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Trust Score</div>
                  <div className="text-5xl font-black mb-4">{business.trustScore || 85}<span className="text-2xl text-[#C2EABD]">/100</span></div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    Based on physical presence, community ratings, and operational years. High scores unlock Blue Badge status.
                  </p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/20">
                    How is this calculated?
                  </button>
                </div>
              </Card>

              {/* Road to Formalization */}
              <FormalizationProgress progress={business.formalizationProgress || 35} />

              {/* Contextual Sidebar Ad (Soft Ad) */}
              <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-100 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ExternalLink size={32} className="text-gray-300" />
                </div>
                <span className="text-[10px] font-black text-[#5BB318] uppercase tracking-widest mb-2">Partner Connection</span>
                <p className="font-bold text-[#465362] mb-1">Need Capital to Grow?</p>
                <p className="text-xs text-gray-500 mb-6">Standard Trust Bank offers special rates for Jhustify-verified businesses.</p>
                <button className="w-full py-3 bg-[#465362] text-white rounded-xl text-sm font-bold hover:bg-[#343e49] transition-all">
                  Apply for Micro-loan
                </button>
              </div>
            </div>
          </div>

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
                  existingRating={userRating ? { rating: userRating.rating, comment: userRating.comment } : undefined}
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
                {ratings.map((rating: Rating, index: number) => (
                  <div key={rating._id || rating.id || `rating-${index}`} className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-[#465362] border border-gray-100 uppercase text-xs">
                          {(rating.userName || 'U').substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[#465362]">{rating.userName || 'Anonymous User'}</p>
                          <div className="flex items-center gap-2">
                            <RatingDisplay
                              average={rating.rating}
                              count={0}
                              size="sm"
                              showCount={false}
                            />
                            <span className="text-[10px] text-gray-400 font-mono">
                              {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {rating.verified && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#5BB318] bg-[#D9F8D4] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          <ShieldCheck size={10} /> Verified Purchase
                        </div>
                      )}
                    </div>

                    {rating.comment && (
                      <div className="space-y-3">
                        <p className="text-gray-600 leading-relaxed italic">&quot;{rating.comment}&quot;</p>
                        
                        {/* AI Sentiment Summary */}
                        {rating.sentimentSummary && (
                          <div className="bg-[#465362]/5 p-3 rounded-2xl border border-[#465362]/10">
                            <div className="text-[9px] font-black text-[#465362] uppercase tracking-widest mb-1 flex items-center gap-1">
                              AI Insight
                            </div>
                            <p className="text-xs text-gray-500 italic">
                              {rating.sentimentSummary}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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

