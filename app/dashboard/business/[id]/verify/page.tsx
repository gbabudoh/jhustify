'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Clock, AlertCircle, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';

export default function BusinessVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch business details
        const businessResponse = await fetch(`/api/business/${businessId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!businessResponse.ok) {
          const errorData = await businessResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch business: ${businessResponse.status} ${businessResponse.statusText}`);
        }

        const businessData = await businessResponse.json();
        
        if (!businessData.business) {
          throw new Error('Business data not found in response');
        }
        
        setBusiness(businessData.business);

        // Fetch verification status if exists
        if (businessData.business.verificationId) {
          const verificationResponse = await fetch(`/api/verification/status?verificationId=${businessData.business.verificationId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (verificationResponse.ok) {
            const verificationData = await verificationResponse.json();
            setVerification(verificationData.verification);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId, router]);

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

  if (error || !business) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <div className="text-center py-8">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-[#465362] mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error || 'Business not found'}</p>
              <Button variant="primary" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'IN_REVIEW':
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'IN_REVIEW':
      case 'SUBMITTED':
        return <Clock size={20} className="text-blue-600" />;
      case 'REJECTED':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Shield size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card className="mb-6 bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] border-none">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#465362] mb-2">
                  Business Listing Created Successfully!
                </h1>
                <div className="text-gray-700">
                  Your business <strong>{business.businessName}</strong> has been listed.
                  {business.trustBadgeType && (
                    <span className="ml-2 inline-block">
                      <TrustBadge type={business.trustBadgeType} size="sm" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Business Details */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-[#465362] mb-4">Business Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Business Name</p>
                <p className="font-medium text-[#465362]">{business.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium text-[#465362]">{business.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-medium text-[#465362]">
                  {business.classification === 'REGISTERED' ? 'Formal' : 'Informal'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(business.verificationStatus)}`}>
                  {getStatusIcon(business.verificationStatus)}
                  {business.verificationStatus}
                </span>
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          {verification ? (
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-[#465362] mb-4">Verification Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(verification.status)}
                    <div>
                      <p className="font-medium text-[#465362]">Verification ID</p>
                      <p className="text-sm text-gray-600">{verification.verificationId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(verification.status)}`}>
                    {verification.status}
                  </span>
                </div>

                {verification.progressPercent !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-[#465362]">{verification.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#465362] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${verification.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {verification.nextStep && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Next Step</p>
                    <p className="text-sm text-blue-700">{verification.nextStep}</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-[#465362] mb-4">Verification</h2>
              <div className="text-center py-8">
                <Shield className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-6">
                  {business.classification === 'REGISTERED' && business.trustBadgeType === 'FORMAL'
                    ? 'Your formal business has been listed with a Formal badge. Upgrade to Verified badge for premium features.'
                    : 'Your business has been listed. Upgrade to Verified badge for premium features and full verification.'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/pricing">Upgrade to Verified</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/business/${businessId}`}>View Business Page</Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="primary" className="flex-1" asChild>
              <Link href={`/business/${businessId}`}>View Business Page</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

