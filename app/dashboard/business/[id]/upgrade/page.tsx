'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, CreditCard, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TrustBadge from '@/components/TrustBadge';

export default function UpgradeBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [business, setBusiness] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  
  // Form data for verification documents
  const [formData, setFormData] = useState({
    identityDocumentType: '' as 'PASSPORT' | 'NIN' | 'DRIVING_LICENSE' | '',
    businessBankName: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState({
    identityDocument: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
          throw new Error('Failed to fetch business');
        }

        const businessData = await businessResponse.json();
        setBusiness(businessData.business);

        // Pre-populate form with existing business data
        if (businessData.business.businessRepresentativePhoto) {
          setPhotoPreview(businessData.business.businessRepresentativePhoto);
        }

        // Check if verification already exists
        const verificationResponse = await fetch(`/api/verification/status?businessId=${businessId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (verificationResponse.ok) {
          const verificationData = await verificationResponse.json();
          if (verificationData.verification) {
            setVerification(verificationData.verification);
            
            // Pre-populate with existing verification data
            if (verificationData.verification.identityDocumentType) {
              setFormData(prev => ({
                ...prev,
                identityDocumentType: verificationData.verification.identityDocumentType,
              }));
            }
            if (verificationData.verification.businessBankName) {
              setFormData(prev => ({
                ...prev,
                businessBankName: verificationData.verification.businessBankName,
              }));
            }
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

  const handleFileChange = (fileType: 'identityDocument') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Validate required fields
      if (!formData.identityDocumentType) {
        setError('Please select an identity document type');
        setSubmitting(false);
        return;
      }

      if (!selectedFiles.identityDocument && !verification?.nationalIdSecureLink) {
        setError('Please upload an identity document');
        setSubmitting(false);
        return;
      }

      if (!formData.businessBankName) {
        setError('Please enter your business bank name');
        setSubmitting(false);
        return;
      }

      let identityDocUrl = verification?.nationalIdSecureLink;

      // Upload identity document if new one is selected
      if (selectedFiles.identityDocument) {
        const docFormData = new FormData();
        docFormData.append('file', selectedFiles.identityDocument);
        docFormData.append('fileType', 'identity-document');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: docFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload identity document');
        }

        const uploadData = await uploadResponse.json();
        identityDocUrl = uploadData.url;
      }

      // Create or update verification for premium upgrade
      const verificationResponse = await fetch('/api/verification/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: businessId,
          businessName: business.businessName,
          classification: business.classification,
          contactPersonName: business.contactPersonName,
          nationalIdSecureLink: identityDocUrl,
          identityDocumentType: formData.identityDocumentType,
          businessBankName: formData.businessBankName,
          registrationDocSecureLink: business.classification === 'REGISTERED' ? (verification?.registrationDocSecureLink || null) : undefined,
          geoAddress: business.physicalAddress,
          geoCoordinates: null,
        }),
      });

      if (!verificationResponse.ok) {
        const errorData = await verificationResponse.json();
        throw new Error(errorData.error || 'Failed to submit verification');
      }

      // Update business to PREMIUM tier (payment will be processed separately)
      const updateResponse = await fetch(`/api/business/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationTier: 'PREMIUM',
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update business tier');
      }

      // TODO: Process payment for premium upgrade (₦1,200/month)
      // After payment confirmation, activate the Verified badge
      // For now, redirect to verification page to show status
      router.push(`/dashboard/business/${businessId}/verify?upgrade=success`);
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade business');
    } finally {
      setSubmitting(false);
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
            <div className="text-center py-8">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-[#465362] mb-2">Business Not Found</h2>
              <Button variant="primary" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const hasExistingDocs = verification?.nationalIdSecureLink || verification?.registrationDocSecureLink;
  const needsIdentityDoc = !selectedFiles.identityDocument && !verification?.nationalIdSecureLink;
  const needsBankInfo = !formData.businessBankName;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#465362]">Upgrade to Verified</h1>
              <p className="text-gray-600 mt-1">
                Complete verification to get the Verified badge for <strong>{business.businessName}</strong>
              </p>
            </div>
          </div>

          {/* Current Status */}
          <Card className="mb-6 bg-gradient-to-br from-[#C2EABD] to-[#D9F8D4] border-none">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Shield size={32} className="text-[#465362]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#465362] mb-2">Current Status</h2>
                <div className="flex items-center gap-3">
                  {business.trustBadgeType && (
                    <TrustBadge type={business.trustBadgeType} size="md" />
                  )}
                  <span className="text-gray-700">→</span>
                  <TrustBadge type="VERIFIED" size="md" />
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Upgrade to Verified badge for ₦1,200/month
                </p>
              </div>
            </div>
          </Card>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Existing Business Information */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-[#465362] mb-4">Your Business Information</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Business Name</p>
                <p className="font-medium text-[#465362]">{business.businessName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Category</p>
                <p className="font-medium text-[#465362]">{business.category}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Contact Person</p>
                <p className="font-medium text-[#465362]">{business.contactPersonName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Contact Number</p>
                <p className="font-medium text-[#465362]">{business.contactNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 mb-1">Location</p>
                <p className="font-medium text-[#465362]">
                  {business.physicalAddress}, {business.city ? `${business.city}, ` : ''}{business.country}
                </p>
              </div>
              {business.businessRepresentativePhoto && (
                <div className="md:col-span-2">
                  <p className="text-gray-600 mb-2">Business Representative Photo</p>
                  <img
                    src={business.businessRepresentativePhoto}
                    alt="Business representative"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Verification Requirements */}
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-[#465362] mb-4">Verification Requirements</h2>
              <p className="text-gray-600 mb-6">
                Complete the following to upgrade to Verified badge. Your existing information has been pre-filled.
              </p>

              <div className="space-y-6">
                {/* Identity Document */}
                <div>
                  <label className="block text-sm font-medium text-[#465362] mb-2">
                    Identity Document <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Select document type' },
                      { value: 'PASSPORT', label: 'Passport' },
                      { value: 'NIN', label: 'National Identification Number (NIN)' },
                      { value: 'DRIVING_LICENSE', label: 'Driving License' },
                    ]}
                    value={formData.identityDocumentType}
                    onChange={(e) => setFormData({ ...formData, identityDocumentType: e.target.value as any })}
                    required
                  />
                  
                  {formData.identityDocumentType && (
                    <div className="mt-4 border-2 border-dashed border-[#D6D9DD] rounded-xl p-6 text-center hover:border-[#465362] hover:bg-[#F5F5F5] transition-all duration-200">
                      {verification?.nationalIdSecureLink && !selectedFiles.identityDocument && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={16} />
                            <span className="text-sm font-medium">Document already uploaded</span>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="identityDocument"
                        onChange={handleFileChange('identityDocument')}
                        required={needsIdentityDoc}
                      />
                      <label htmlFor="identityDocument" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          {selectedFiles.identityDocument ? 'Change Document' : verification?.nationalIdSecureLink ? 'Replace Document' : 'Upload Document'}
                        </Button>
                      </label>
                      {selectedFiles.identityDocument && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 font-medium truncate">
                            ✓ {selectedFiles.identityDocument.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Business Bank Name */}
                <div>
                  <Input
                    label="Business Bank Name"
                    value={formData.businessBankName}
                    onChange={(e) => setFormData({ ...formData, businessBankName: e.target.value })}
                    placeholder="Enter your business bank name"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The bank where your business account is registered
                  </p>
                </div>

                {/* Phone Verification */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-1">Phone Verification Required</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        You'll need to verify your phone number ({business.contactNumber}) via SMS to complete the upgrade.
                      </p>
                      <p className="text-xs text-blue-600">
                        Phone verification will be required after document submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Summary */}
            <Card className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <h2 className="text-xl font-bold text-[#465362] mb-4">Upgrade Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Verified Badge Subscription</span>
                  <span className="font-bold text-[#465362]">₦1,200/month</span>
                </div>
                <div className="pt-3 border-t border-yellow-200">
                  <p className="text-sm text-gray-600">
                    Includes: Verified badge, priority placement, analytics, unlimited messages, and all premium features.
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting}
                disabled={needsIdentityDoc || needsBankInfo}
              >
                <CreditCard size={16} className="mr-2" />
                Complete Upgrade & Pay
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

