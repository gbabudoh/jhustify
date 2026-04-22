'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle2, MapPin, Shield, Building2, User, Phone, Mail, ArrowRight, Loader2, Globe, FileText, Camera, Clock } from 'lucide-react';
import Header from '@/components/Header';
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
    yearsInOperation: '',
    paymentMethods: [] as string[],
    instagram: '',
    facebook: '',
    linkedin: '',
    whatsapp: '',
    identityDocumentType: '' as import('@prisma/client').IdentityDocType | '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({
    businessRepresentativePhoto: null as File | null,
    nationalId: null as File | null,
    registrationDoc: null as File | null,
    proofVideo: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = (fileType: 'businessRepresentativePhoto' | 'nationalId' | 'registrationDoc' | 'proofVideo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles(prev => ({ ...prev, [fileType]: file }));
    
    // Create preview for photo
    if (fileType === 'businessRepresentativePhoto' && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'businessRepresentativePhoto' && !file) {
      setPhotoPreview(null);
    }
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
    
    if (formData.classification === 'UNREGISTERED') {
      handleFinalSubmit(e);
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

      // Validate required photo (only for registered businesses)
      if (formData.classification === 'REGISTERED' && !selectedFiles.businessRepresentativePhoto) {
        setError('Business representative photo is required for registered businesses');
        setLoading(false);
        return;
      }

      // Validate registration doc for formal businesses
      if (formData.classification === 'REGISTERED' && !selectedFiles.registrationDoc) {
        setError('Registration document is required for formal businesses');
        setLoading(false);
        return;
      }

      // Upload business representative photo if provided
      let photoUrl = null;
      if (selectedFiles.businessRepresentativePhoto) {
        const photoFormData = new FormData();
        photoFormData.append('file', selectedFiles.businessRepresentativePhoto);
        photoFormData.append('fileType', 'business-representative-photo');

        const photoUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: photoFormData,
        });

        const photoData = await photoUploadResponse.json();
        if (!photoUploadResponse.ok) {
          setError(photoData.error || 'Failed to upload photo');
          setLoading(false);
          return;
        }
        photoUrl = photoData.url;
      }

      // Upload registration document if formal business
      let registrationDocUrl = null;
      if (formData.classification === 'REGISTERED' && selectedFiles.registrationDoc) {
        const docFormData = new FormData();
        docFormData.append('file', selectedFiles.registrationDoc);
        docFormData.append('fileType', 'registration-document');

        const docUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: docFormData,
        });

        const docData = await docUploadResponse.json();
        if (!docUploadResponse.ok) {
          setError(docData.error || 'Failed to upload registration document');
          setLoading(false);
          return;
        }
        registrationDocUrl = docData.url;
      }

      // Upload national ID if provided
      let nationalIdUrl = null;
      if (selectedFiles.nationalId) {
        const idFormData = new FormData();
        idFormData.append('file', selectedFiles.nationalId);
        idFormData.append('fileType', 'national-id');

        const idUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: idFormData,
        });

        const idData = await idUploadResponse.json();
        if (!idUploadResponse.ok) {
          setError(idData.error || 'Failed to upload identity document');
          setLoading(false);
          return;
        }
        nationalIdUrl = idData.url;
      }

      // Create business with photo URL
      const businessResponse = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          businessRepresentativePhoto: photoUrl,
          yearsInOperation: formData.yearsInOperation ? parseInt(formData.yearsInOperation) : undefined,
          paymentMethods: formData.paymentMethods,
          socialLinks: {
            instagram: formData.instagram,
            facebook: formData.facebook,
            linkedin: formData.linkedin,
            whatsapp: formData.whatsapp,
          }
        }),
      });

      const businessData = await businessResponse.json();
      if (!businessResponse.ok) {
        setError(businessData.error || 'Failed to create business');
        return;
      }

      // If formal business OR national ID provided, create/update verification record
      if (registrationDocUrl || nationalIdUrl) {
        const verificationResponse = await fetch('/api/verification/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessId: businessData.business.id,
            classification: formData.classification,
            registrationDocSecureLink: registrationDocUrl,
            nationalIdSecureLink: nationalIdUrl,
            identityDocumentType: formData.identityDocumentType || null,
            geoCoordinates: null, // Can be added later
          }),
        });

        if (!verificationResponse.ok) {
          const vError = await verificationResponse.json();
          console.error('Failed to create verification record:', vError.error);
        }
      }

      router.push(`/dashboard/business/${businessData.business.id}/verify`);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('An unknown error occurred');
      console.error('Submit error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#d3f5ce]/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-50/50 rounded-full blur-[100px]"></div>
        </div>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[#6d6e6b]" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Synchronizing</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#d3f5ce]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#D9F8D4]/30 rounded-full blur-[80px]"></div>
        </div>

        <Header />
        
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 relative overflow-hidden text-center">
              {/* Top decorative element */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#6d6e6b] to-[#6B7280]"></div>
              
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Shield className="text-gray-300" size={40} />
              </div>
              
              <h2 className="text-3xl font-black text-[#6d6e6b] mb-4 tracking-tight">Access Denied</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                You need to have an active account to verify your business on Jhustify.
              </p>
              
              <div className="flex flex-col gap-4">
                <Link href="/register">
                  <button className="w-full bg-[#6d6e6b] hover:bg-[#343e49] text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-[#6d6e6b]/10 hover:shadow-xl hover:shadow-[#6d6e6b]/20">
                    Create New Account
                  </button>
                </Link>
                <Link href="/login">
                  <button className="w-full bg-white border border-gray-100 text-[#6d6e6b] py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#d3f5ce]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#D9F8D4]/30 rounded-full blur-[80px]"></div>
      </div>

      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-start p-4 py-12 relative z-10">
        <div className="w-full max-w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Progress Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#6d6e6b] mb-3 tracking-tight">Jhustify Verification</h1>
            <p className="text-gray-500 font-medium tracking-tight">Earn your trust badge in two simple steps</p>
          </div>

          {/* New Custom Stepper */}
          <div className="flex items-center justify-center mb-12 px-8">
            <div className="flex items-center w-full max-w-[320px]">
              {/* Step 1 Circle */}
              <div className="relative flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl overflow-hidden ${
                  step >= 1 ? 'bg-[#6d6e6b] text-white scale-110 rotate-3' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > 1 ? <CheckCircle2 size={24} className="text-[#d3f5ce]" /> : <Building2 size={24} />}
                </div>
                <span className={`absolute -bottom-7 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  step >= 1 ? 'text-[#6d6e6b]' : 'text-gray-400'
                }`}>Profile</span>
              </div>

              {/* Progress Line */}
              <div className="flex-1 h-[2px] mx-4 bg-gray-100 overflow-hidden">
                <div 
                  className="h-full bg-[#6d6e6b] transition-all duration-700 ease-out"
                  style={{ width: step > 1 ? '100%' : '0%' }}
                />
              </div>

              {/* Step 2 Circle */}
              <div className="relative flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl overflow-hidden ${
                  step >= 2 ? 'bg-[#6d6e6b] text-white scale-110 -rotate-3' : 'bg-gray-100 text-gray-400 border border-white'
                }`}>
                  <Shield size={24} className={step >= 2 ? 'text-[#d3f5ce]' : ''} />
                </div>
                <span className={`absolute -bottom-7 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  step >= 2 ? 'text-[#6d6e6b]' : 'text-gray-400'
                }`}>Proof</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 relative overflow-hidden mb-12">
            {/* Top decorative element */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#6d6e6b] to-[#6B7280]"></div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Shield size={16} />
                </div>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#6d6e6b]/5 rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-[#6d6e6b]" />
                    </div>
                    <h3 className="text-sm font-black text-[#6d6e6b] uppercase tracking-widest">Core Business Data</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                      Business Entity Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                        placeholder="e.g. Leksol Business Consult"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        Industry Category
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 px-4 outline-none text-[#6d6e6b] font-medium appearance-none ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        >
                          <option value="">Choose Industry</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                          <ArrowRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        Registration Type
                      </label>
                      <div className="relative">
                        <select
                          value={formData.classification}
                          onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                          required
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 px-4 outline-none text-[#6d6e6b] font-medium appearance-none ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        >
                          <option value="">Select Tier</option>
                          <option value="REGISTERED">Formal (Registered)</option>
                          <option value="UNREGISTERED">Informal (Not Registered)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                          <ArrowRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        Years in Operation
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Clock size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                        </div>
                        <input
                          type="number"
                          value={formData.yearsInOperation}
                          onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                          placeholder="e.g. 2"
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#6d6e6b]/5 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-[#6d6e6b]" />
                    </div>
                    <h3 className="text-sm font-black text-[#6d6e6b] uppercase tracking-widest">Public Representative</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                      Primary Contact Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={formData.contactPersonName}
                        onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                        required
                        placeholder="Full Legal Name"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        Direct Phone
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                        </div>
                        <input
                          type="tel"
                          value={formData.contactNumber}
                          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                          required
                          placeholder="+234..."
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        Official Email
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="business@example.com"
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Representative Photo Upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                      Profile Display Photo
                    </label>
                    <div className={`relative group border-2 border-dashed rounded-3xl p-8 transition-all duration-500 overflow-hidden bg-gray-50/50 ${
                      photoPreview ? 'border-[#a8d59d]/40 bg-[#D9F8D4]/5' : 'border-gray-100 hover:border-[#6d6e6b]/30 hover:bg-gray-50'
                    }`}>
                      {photoPreview ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-2xl mb-4 border-4 border-white animate-in zoom-in-75 duration-500">
                            <Image 
                              src={photoPreview} 
                              fill 
                              className="object-cover" 
                              alt="Preview" 
                              unoptimized={photoPreview.startsWith('data:')}
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Camera className="text-white" size={24} />
                            </div>
                          </div>
                          <p className="text-xs font-bold text-[#a8d59d] uppercase tracking-widest mb-4">Photo Ready</p>
                          <button
                            type="button"
                            onClick={() => document.getElementById('businessRepresentativePhoto')?.click()}
                            className="bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#6d6e6b] border border-gray-100 shadow-sm hover:shadow-md transition-all"
                          >
                            Change Photo
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex flex-col items-center cursor-pointer"
                          onClick={() => document.getElementById('businessRepresentativePhoto')?.click()}
                        >
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
                            <Camera className="text-gray-300" size={32} />
                          </div>
                          <h4 className="text-sm font-bold text-[#6d6e6b] uppercase tracking-wider mb-1">Click to Capture</h4>
                          <p className="text-[10px] text-gray-500 font-medium tracking-tight">Support JPG, PNG (Max 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="businessRepresentativePhoto"
                        onChange={handleFileChange('businessRepresentativePhoto')}
                        required={formData.classification === 'REGISTERED'}
                      />
                    </div>
                  </div>
                </div>

                  <div className="space-y-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-[#6d6e6b]/5 rounded-lg flex items-center justify-center">
                        <MapPin size={16} className="text-[#6d6e6b]" />
                      </div>
                      <h3 className="text-sm font-black text-[#6d6e6b] uppercase tracking-widest">Physical Location</h3>
                    </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                      Operating Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={formData.physicalAddress}
                        onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                        required
                        placeholder="Shop No, Street, Landmark"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        Operational Hub (Country)
                      </label>
                      <div className="relative">
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 px-4 outline-none text-[#6d6e6b] font-medium appearance-none ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        >
                          <option value="">Choose Country</option>
                          {sortedAfricanCountries.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                          <Globe size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                        City/Town
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin size={18} className="text-gray-400 group-focus-within:text-[#6d6e6b] transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Lagos"
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none text-[#6d6e6b] font-medium placeholder:text-gray-400 ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit" 
                    className="w-full bg-[#6d6e6b] hover:bg-[#343e49] text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#6d6e6b]/10 hover:shadow-xl hover:shadow-[#6d6e6b]/20 relative overflow-hidden"
                  >
                    <span>{formData.classification === 'UNREGISTERED' ? 'Complete Account Creation' : 'Proceed to Documents'}</span>
                    <ArrowRight size={18} className={`translate-x-0 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 absolute right-8 ${formData.classification === 'UNREGISTERED' ? 'hidden' : ''}`} />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#6d6e6b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
                    <Shield size={32} className="text-[#d3f5ce]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#6d6e6b] mb-2 tracking-tight">Technical Proof</h3>
                  <p className="text-gray-500 font-medium tracking-tight">
                    {formData.classification === 'REGISTERED' 
                      ? 'Upload official registration papers for the Blue Badge'
                      : 'Informal listings bypass document checks for now'}
                  </p>
                </div>

                <div className="space-y-8">
                  {formData.classification === 'REGISTERED' ? (
                    <div className="space-y-6">
                      {/* Registration Doc Upload */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                          Official Certificate (CAC/Tax)
                        </label>
                        <div className={`relative group border-2 border-dashed rounded-[32px] p-10 transition-all duration-500 overflow-hidden bg-gray-50/50 ${
                          selectedFiles.registrationDoc ? 'border-[#a8d59d]/40 bg-[#D9F8D4]/5' : 'border-gray-100 hover:border-[#6d6e6b]/30 hover:bg-gray-50'
                        }`}>
                          <div className="flex flex-col items-center cursor-pointer" onClick={() => document.getElementById('registrationDoc')?.click()}>
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-all duration-500 ${
                              selectedFiles.registrationDoc ? 'bg-[#a8d59d] text-white animate-bounce' : 'bg-white text-gray-300'
                            }`}>
                              {selectedFiles.registrationDoc ? <CheckCircle2 size={36} /> : <FileText size={36} />}
                            </div>
                            
                            {selectedFiles.registrationDoc ? (
                              <div className="text-center animate-in zoom-in-95">
                                <h4 className="text-base font-bold text-[#6d6e6b] mb-1">Document Linked</h4>
                                <p className="text-xs text-[#a8d59d] font-bold uppercase tracking-widest mb-6">✓ {selectedFiles.registrationDoc.name}</p>
                                <button
                                  type="button"
                                  className="bg-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#6d6e6b] border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                >
                                  Switch File
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <h4 className="text-lg font-black text-[#6d6e6b] uppercase tracking-wide mb-2">Upload Credentials</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[240px] mx-auto mb-8">
                                  Drag and drop your certificate here or <span className="text-[#6d6e6b] font-bold underline underline-offset-4">browse files</span>
                                </p>
                                <div className="flex items-center justify-center gap-1.5 opacity-60">
                                  <span className="bg-gray-200 px-2 py-1 rounded text-[9px] font-bold">PDF</span>
                                  <span className="bg-gray-200 px-2 py-1 rounded text-[9px] font-bold">JPG</span>
                                  <span className="bg-gray-200 px-2 py-1 rounded text-[9px] font-bold">MAX 10MB</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            id="registrationDoc"
                            onChange={handleFileChange('registrationDoc')}
                            required
                          />
                        </div>
                      </div>

                      {/* Identity Document Type */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                          Type of Identity Token
                        </label>
                        <select
                          value={formData.identityDocumentType}
                          onChange={(e) => setFormData({ ...formData, identityDocumentType: e.target.value as import('@prisma/client').IdentityDocType })}
                          className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#6d6e6b] transition-all duration-300 rounded-2xl py-3.5 px-4 outline-none text-[#6d6e6b] font-medium appearance-none ring-0 focus:ring-4 focus:ring-[#6d6e6b]/5"
                        >
                          <option value="">Select ID Type</option>
                          <option value="NIN">NIN (National ID)</option>
                          <option value="PASSPORT">International Passport</option>
                          <option value="DRIVING_LICENSE">Driver&apos;s License</option>
                        </select>
                      </div>

                      {/* Optional National ID */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#6d6e6b] ml-1 uppercase tracking-widest opacity-70">
                          National Identity Token (Optional)
                        </label>
                        <div 
                          className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group cursor-pointer"
                          onClick={() => document.getElementById('nationalId')?.click()}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                            selectedFiles.nationalId ? 'bg-[#a8d59d] text-white' : 'bg-white text-gray-300 group-hover:text-[#6d6e6b]'
                          }`}>
                            <Shield size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-[#6d6e6b] uppercase tracking-widest">
                              {selectedFiles.nationalId ? 'ID Successfully Added' : 'Add Legal Identity'}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium truncate">
                              {selectedFiles.nationalId ? selectedFiles.nationalId.name : 'Passport, NIN, or Driver\'s License'}
                            </p>
                          </div>
                          <div className="text-gray-300">
                            <ArrowRight size={18} className={selectedFiles.nationalId ? 'hidden' : 'group-hover:translate-x-1 transition-transform'} />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="nationalId"
                            onChange={handleFileChange('nationalId')}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6d6e6b] to-[#2d3748] opacity-[0.03] rounded-[32px]"></div>
                      <div className="relative p-10 border border-gray-100 rounded-[32px] bg-white/40 shadow-sm text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                        <h4 className="text-xl font-black text-[#6d6e6b] uppercase tracking-tight mb-4">Not Registered Verified Ready</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[320px] mx-auto">
                          You&apos;re listing as an entity that is not yet registered. You&apos;ll earn the Green Badge based on <span className="text-[#a8d59d] font-bold">Community Trust</span> and reviews.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-5 pt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="flex-1 bg-white border border-gray-100 text-[#6d6e6b] py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300"
                  >
                    Adjust Details
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] bg-[#6d6e6b] hover:bg-[#343e49] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg shadow-[#6d6e6b]/10 hover:shadow-xl hover:shadow-[#6d6e6b]/20"
                  >
                    {loading ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : (
                      <>
                        <Shield size={22} className="text-[#d3f5ce]" />
                        <span>Submit Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Sub-links */}
          <div className="flex flex-col items-center gap-6">
            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-[#6d6e6b] transition-colors">
              Access Merchant Dashboard
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] relative z-10">
        &copy; 2026 Jhustify Platform &bull; Built for Trust
      </footer>
    </div>
  );
}

