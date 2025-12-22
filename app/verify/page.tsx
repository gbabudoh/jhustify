'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Upload, MapPin, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { sortedAfricanCountries } from '@/lib/data/africanCountries';

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    classification: '',
    contactPersonName: '',
    contactNumber: '',
    email: '',
    physicalAddress: '',
    country: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({
    nationalId: null as File | null,
    registrationDoc: null as File | null,
    proofVideo: null as File | null,
  });

  const handleFileChange = (fileType: 'nationalId' | 'registrationDoc' | 'proofVideo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles(prev => ({ ...prev, [fileType]: file }));
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);
    } else {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    }
  }, []);

  const categories = [
    { value: 'Retail', label: 'Retail' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Services', label: 'Services' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check each field and provide specific error messages
    const missingFields: string[] = [];
    
    if (!formData.businessName || formData.businessName.trim() === '') {
      missingFields.push('Business Name');
    }
    if (!formData.category || formData.category === '') {
      missingFields.push('Category');
    }
    if (!formData.classification || formData.classification === '') {
      missingFields.push('Business Type');
    }
    if (!formData.contactPersonName || formData.contactPersonName.trim() === '') {
      missingFields.push('Contact Person Name');
    }
    if (!formData.contactNumber || formData.contactNumber.trim() === '') {
      missingFields.push('Contact Number');
    }
    if (!formData.email || formData.email.trim() === '') {
      missingFields.push('Email');
    }
    if (!formData.physicalAddress || formData.physicalAddress.trim() === '') {
      missingFields.push('Physical Address');
    }
    if (!formData.country || formData.country === '') {
      missingFields.push('Country');
    }
    
    if (missingFields.length > 0) {
      setError(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setStep(2);
    setError('');
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Create business first
      const businessResponse = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const businessData = await businessResponse.json();
      if (!businessResponse.ok) {
        setError(businessData.error || 'Failed to create business');
        return;
      }

      router.push(`/dashboard/business/${businessData.business.id}/verify`);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <div className="text-center py-8">
                <Shield className="mx-auto text-gray-400 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-[#465362] mb-2">Authentication Required</h2>
                <p className="text-gray-600 mb-6">
                  You need to create an account and login before you can verify your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/register">Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#465362] mb-3">Get Verified</h1>
            <p className="text-lg text-gray-600">Start your journey to earning the Jhustify Trust Sign</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#D6D9DD] -z-10">
                <div 
                  className="h-full bg-[#465362] transition-all duration-500"
                  style={{ width: step >= 2 ? '100%' : '0%' }}
                ></div>
              </div>
              
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= 1 
                    ? 'bg-[#465362] text-white shadow-lg scale-110' 
                    : 'bg-[#D6D9DD] text-gray-600'
                }`}>
                  {step > 1 ? <CheckCircle2 size={24} /> : '1'}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  step >= 1 ? 'text-[#465362]' : 'text-gray-600'
                }`}>
                  Basic Info
                </span>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= 2 
                    ? 'bg-[#465362] text-white shadow-lg scale-110' 
                    : 'bg-[#D6D9DD] text-gray-600'
                }`}>
                  {step > 2 ? <CheckCircle2 size={24} /> : '2'}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  step >= 2 ? 'text-[#465362]' : 'text-gray-600'
                }`}>
                  Documents
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <Card className="shadow-lg">
              <div className="mb-6 pb-4 border-b border-[#D6D9DD]">
                <h2 className="text-2xl font-bold text-[#465362] mb-2">Business Information</h2>
                <p className="text-gray-600">Tell us about your business to get started</p>
              </div>
              
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* Business Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#465362] mb-3">Business Details</h3>
                  <Input
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      options={[
                        { value: '', label: 'Select a category' },
                        ...categories
                      ]}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                    <Select
                      label="Business Type"
                      options={[
                        { value: '', label: 'Select business type' },
                        { value: 'REGISTERED', label: 'Registered (Formal)' },
                        { value: 'UNREGISTERED', label: 'Unregistered (Informal)' },
                      ]}
                      value={formData.classification}
                      onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 pt-4 border-t border-[#D6D9DD]">
                  <h3 className="text-lg font-semibold text-[#465362] mb-3">Contact Information</h3>
                  <Input
                    label="Contact Person Name"
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Contact Number"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4 pt-4 border-t border-[#D6D9DD]">
                  <h3 className="text-lg font-semibold text-[#465362] mb-3">Location</h3>
                  <Input
                    label="Physical Address"
                    value={formData.physicalAddress}
                    onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      label="Country"
                      options={[
                        { value: '', label: 'Select your country' },
                        ...sortedAfricanCountries.map(c => ({ value: c.name, label: c.name }))
                      ]}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                    <Input
                      label="City (Optional)"
                      placeholder="Enter city name"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D6D9DD]">
                  <Button type="submit" variant="primary" className="w-full py-3 text-lg font-semibold shadow-lg hover:shadow-xl">
                    Continue to Documents
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-lg">
              <div className="mb-6 pb-4 border-b border-[#D6D9DD]">
                <h2 className="text-2xl font-bold text-[#465362] mb-2">Upload Documents</h2>
                <p className="text-gray-600">
                  {formData.classification === 'REGISTERED'
                    ? 'Please upload your registration documents and National ID for verification'
                    : 'Please upload proof of presence (video/photos) and National ID for verification'}
                </p>
              </div>
              
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* National ID Upload */}
                <div className="border-2 border-dashed border-[#D6D9DD] rounded-xl p-8 text-center hover:border-[#465362] hover:bg-[#F5F5F5] transition-all duration-200">
                  <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                    <Upload className="text-[#465362]" size={28} />
                  </div>
                  <h3 className="font-semibold text-[#465362] mb-2">National ID</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload a clear photo of your National ID card</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="nationalId"
                    onChange={handleFileChange('nationalId')}
                  />
                  <label htmlFor="nationalId" className="cursor-pointer">
                    <Button type="button" variant="outline" size="md">
                      {selectedFiles.nationalId ? 'Change File' : 'Choose File'}
                    </Button>
                  </label>
                  {selectedFiles.nationalId && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium truncate">
                        ✓ {selectedFiles.nationalId.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {(selectedFiles.nationalId.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}
                </div>

                {/* Conditional Uploads */}
                {formData.classification === 'REGISTERED' && (
                  <div className="border-2 border-dashed border-[#D6D9DD] rounded-xl p-8 text-center hover:border-[#465362] hover:bg-[#F5F5F5] transition-all duration-200">
                    <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                      <Upload className="text-[#465362]" size={28} />
                    </div>
                    <h3 className="font-semibold text-[#465362] mb-2">Registration Document</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload your business registration certificate or tax ID</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      id="registrationDoc"
                      onChange={handleFileChange('registrationDoc')}
                    />
                    <label htmlFor="registrationDoc" className="cursor-pointer">
                      <Button type="button" variant="outline" size="md">
                        {selectedFiles.registrationDoc ? 'Change File' : 'Choose File'}
                      </Button>
                    </label>
                    {selectedFiles.registrationDoc && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium truncate">
                          ✓ {selectedFiles.registrationDoc.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {(selectedFiles.registrationDoc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {formData.classification === 'UNREGISTERED' && (
                  <div className="border-2 border-dashed border-[#D6D9DD] rounded-xl p-8 text-center hover:border-[#465362] hover:bg-[#F5F5F5] transition-all duration-200">
                    <div className="w-16 h-16 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-4">
                      <Upload className="text-[#465362]" size={28} />
                    </div>
                    <h3 className="font-semibold text-[#465362] mb-2">Proof of Presence Video</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload a short video showing you and your business location</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id="proofVideo"
                      onChange={handleFileChange('proofVideo')}
                    />
                    <label htmlFor="proofVideo" className="cursor-pointer">
                      <Button type="button" variant="outline" size="md">
                        {selectedFiles.proofVideo ? 'Change File' : 'Choose File'}
                      </Button>
                    </label>
                    {selectedFiles.proofVideo && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium truncate">
                          ✓ {selectedFiles.proofVideo.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {(selectedFiles.proofVideo.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-[#D6D9DD]">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setStep(1)} 
                    className="flex-1 py-3"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1 py-3 text-lg font-semibold shadow-lg hover:shadow-xl" 
                    isLoading={loading}
                  >
                    Submit for Verification
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

