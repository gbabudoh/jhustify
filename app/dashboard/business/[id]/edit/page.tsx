'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, X, Plus, Zap } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { sortedAfricanCountries } from '@/lib/data/africanCountries';

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    contactPersonName: '',
    contactNumber: '',
    email: '',
    physicalAddress: '',
    country: '',
    city: '',
    businessType: 'PRODUCT' as 'PRODUCT' | 'SERVICE',
    businessDescription: '',
    yearsInOperation: 0,
    socialLinks: {
      instagram: '',
      whatsapp: '',
      facebook: '',
      linkedin: '',
    },
    paymentMethods: [] as string[],
    offeredItems: [] as string[],
    verificationTier: 'BASIC',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);

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

  const availablePaymentMethods = [
    'Mobile Money', 'Bank Transfer', 'Cash', 'POS', 'Card'
  ];

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/business/${businessId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch business');
        }

        const data = await response.json();
        const b = data.business;

        setFormData({
          businessName: b.businessName || '',
          category: b.category || '',
          contactPersonName: b.contactPersonName || '',
          contactNumber: b.contactNumber || '',
          email: b.email || '',
          physicalAddress: b.physicalAddress || '',
          country: b.country || '',
          city: b.city || '',
          businessType: (b.businessType as 'PRODUCT' | 'SERVICE') || 'PRODUCT',
          businessDescription: b.businessDescription || '',
          yearsInOperation: b.yearsInOperation || 0,
          socialLinks: {
             instagram: b.socialLinks?.instagram || '',
             whatsapp: b.socialLinks?.whatsapp || '',
             facebook: b.socialLinks?.facebook || '',
             linkedin: b.socialLinks?.linkedin || '',
          },
          paymentMethods: b.paymentMethods || [],
          offeredItems: b.offeredItems || [],
          verificationTier: b.verificationTier || 'BASIC',
        });

        if (b.businessRepresentativePhoto) {
          setPhotoPreview(b.businessRepresentativePhoto);
        }
        if (b.mediaGallery) {
          setGalleryPreviews(b.mediaGallery);
        }
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to load business');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const isPro = formData.verificationTier === 'PREMIUM';
    const limit = isPro ? 10 : 1;

    if (files.length + galleryPreviews.length > limit) {
      alert(`Your current tier allows up to ${limit} gallery images. Upgrade to Pro for more!`);
      return;
    }

    setSelectedGalleryFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    // Also need to handle removing from selectedGalleryFiles if it was newly added
    // Simplify for now: if index < current gallery length - new files length...
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      let photoUrl = photoPreview;

      // Upload new primary photo if selected
      if (selectedPhoto) {
        const photoFormData = new FormData();
        photoFormData.append('file', selectedPhoto);
        photoFormData.append('fileType', 'business-representative-photo');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: photoFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload primary photo');
        }

        const uploadData = await uploadResponse.json();
        photoUrl = uploadData.url;
      }

      // Upload new gallery photos
      const newGalleryUrls = [...galleryPreviews.filter(p => !p.startsWith('data:'))];
      for (const file of selectedGalleryFiles) {
        const gFormData = new FormData();
        gFormData.append('file', file);
        gFormData.append('fileType', 'media-gallery');

        const gUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: gFormData,
        });

        if (gUploadResponse.ok) {
          const gUploadData = await gUploadResponse.json();
          newGalleryUrls.push(gUploadData.url);
        }
      }

      // Update business
      const updateResponse = await fetch(`/api/business/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          businessRepresentativePhoto: photoUrl,
          mediaGallery: newGalleryUrls,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update business');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to update business');
    } finally {
      setSaving(false);
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
            <h1 className="text-3xl font-bold text-[#465362]">Edit Business</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
              Business updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-[#465362] mb-6">Business Information</h2>
              
              <div className="space-y-6">
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
                      { value: 'PRODUCT', label: 'Product based' },
                      { value: 'SERVICE', label: 'Service based' },
                    ]}
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as 'PRODUCT' | 'SERVICE' })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Person Name"
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                    required
                  />
                  <Input
                    label="Contact Number"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

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
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                {/* Years in Operation */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Years in Operation"
                    type="number"
                    min="0"
                    value={formData.yearsInOperation}
                    onChange={(e) => setFormData({ ...formData, yearsInOperation: parseInt(e.target.value) || 0 })}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#465362]">Payment Methods Accepted</label>
                    <div className="flex flex-wrap gap-2">
                      {availablePaymentMethods.map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => {
                            const current = formData.paymentMethods;
                            setFormData({
                              ...formData,
                              paymentMethods: current.includes(method) 
                                ? current.filter(m => m !== method) 
                                : [...current, method]
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            formData.paymentMethods.includes(method)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Description */}
                <div>
                  <label className="block text-sm font-medium text-[#465362] mb-2">Business Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-[#D6D9DD] focus:border-[#465362] focus:ring-2 focus:ring-[#C2EABD] transition-all h-32"
                    placeholder="Tell customers about your business history, values, and what makes you unique..."
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  />
                </div>

                {/* Social Links - PREMIUM ONLY */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#465362] uppercase tracking-widest">Social Presence</h3>
                    {formData.verificationTier !== 'PREMIUM' && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> Pro Feature
                      </span>
                    )}
                  </div>
                  
                  {formData.verificationTier === 'PREMIUM' ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Instagram URL"
                        placeholder="https://instagram.com/..."
                        value={formData.socialLinks.instagram}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, instagram: e.target.value } 
                        })}
                      />
                      <Input
                        label="WhatsApp Number"
                        placeholder="+234..."
                        value={formData.socialLinks.whatsapp}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, whatsapp: e.target.value } 
                        })}
                      />
                      <Input
                        label="Facebook URL"
                        placeholder="https://facebook.com/..."
                        value={formData.socialLinks.facebook}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, facebook: e.target.value } 
                        })}
                      />
                      <Input
                        label="LinkedIn URL"
                        placeholder="https://linkedin.com/..."
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, linkedin: e.target.value } 
                        })}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                      <Zap className="text-amber-400 mx-auto mb-3" size={32} />
                      <h4 className="text-[#465362] font-bold mb-2">Unlock Social Links</h4>
                      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                        Upgrade to **Pro** to add Instagram, WhatsApp, and Facebook links to your public profile.
                      </p>
                      <Link href={`/dashboard/business/${businessId}/upgrade`}>
                        <Button type="button" variant="outline" size="sm" className="font-bold">
                          Go Pro for 1,200 NGN
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Specialized Content: Products/Services - PREMIUM ONLY */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#465362] uppercase tracking-widest">
                      {formData.businessType === 'PRODUCT' ? 'Products Sold' : 'Services Offered'}
                    </h3>
                    {formData.verificationTier === 'PREMIUM' ? (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFormData({ ...formData, offeredItems: [...formData.offeredItems, ''] })}
                      >
                        <Plus size={16} className="mr-1" /> Add Item
                      </Button>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> Pro Feature
                      </span>
                    )}
                  </div>

                  {formData.verificationTier === 'PREMIUM' ? (
                    <div className="space-y-3">
                      {formData.offeredItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            placeholder={formData.businessType === 'PRODUCT' ? "e.g., Hardwood Chairs" : "e.g., Interior Design"}
                            value={item}
                            onChange={(e) => {
                              const newItems = [...formData.offeredItems];
                              newItems[idx] = e.target.value;
                              setFormData({ ...formData, offeredItems: newItems });
                            }}
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                offeredItems: formData.offeredItems.filter((_, i) => i !== idx)
                              });
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      {formData.offeredItems.length === 0 && (
                        <p className="text-xs text-gray-400 italic">No items listed. Click &quot;Add Item&quot; to showcase what you offer.</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                      <Plus className="text-gray-300 mx-auto mb-3" size={32} />
                      <h4 className="text-[#465362] font-bold mb-2">Showcase Your {formData.businessType === 'PRODUCT' ? 'Products' : 'Services'}</h4>
                      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                        Upgrade to **Pro** to list individual products or services and help customers find exactly what they need.
                      </p>
                      <Link href={`/dashboard/business/${businessId}/upgrade`}>
                        <Button type="button" variant="outline" size="sm" className="font-bold">
                          Activate Catalog Mode
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Visual Identity: Photo & Gallery - PREMIUM ONLY */}
                <div className="pt-6 border-t border-gray-100 space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#465362] uppercase tracking-widest">Visual Identity</h3>
                    {formData.verificationTier !== 'PREMIUM' && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> Pro Feature
                      </span>
                    )}
                  </div>

                  {formData.verificationTier === 'PREMIUM' ? (
                    <>
                      {/* Business Representative Photo */}
                      <div>
                        <label className="block text-sm font-medium text-[#465362] mb-2">
                          Business Representative Photo
                        </label>
                        <div className="border-2 border-dashed border-[#D6D9DD] rounded-xl p-6 text-center hover:border-[#465362] hover:bg-[#F5F5F5] transition-all duration-200">
                          {photoPreview ? (
                            <div className="mb-4">
                              <Image
                                src={photoPreview}
                                alt="Business representative preview"
                                width={500}
                                height={300}
                                className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                              <Upload className="text-blue-600" size={20} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="businessPhoto"
                            onChange={handlePhotoChange}
                          />
                          <label htmlFor="businessPhoto" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              {photoPreview ? 'Change Main Photo' : 'Upload Main Photo'}
                            </Button>
                          </label>
                        </div>
                      </div>

                      {/* Media Gallery */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-[#465362]">
                            Media Gallery
                          </label>
                          <span className="text-[10px] font-black uppercase text-gray-400">
                            {galleryPreviews.length} / 10 Images
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          {galleryPreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                              <Image
                                src={preview}
                                alt={`Gallery ${idx}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          {galleryPreviews.length < 10 && (
                            <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                              <Plus className="text-gray-300" size={24} />
                              <span className="text-[10px] font-bold text-gray-400 mt-1">Add Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleGalleryChange}
                                multiple
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-3xl p-10 text-center border border-dashed border-gray-200">
                      <div className="flex justify-center -space-x-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2 transform -rotate-6">
                           <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse"></div>
                        </div>
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-2xl flex items-center justify-center p-2 z-10">
                           <Upload className="text-blue-500" size={32} />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2 transform rotate-6">
                           <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse"></div>
                        </div>
                      </div>
                      <h4 className="text-[#465362] text-xl font-black mb-2">Build Your Visual Brand</h4>
                      <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                        Pro accounts can upload a primary representative photo and a 10-image gallery to build trust and showcase their products.
                      </p>
                      <Link href={`/dashboard/business/${businessId}/upgrade`}>
                        <Button type="button" variant="primary" className="font-bold shadow-lg shadow-blue-600/20">
                          Upgrade to Upload Photos
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Card>

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
                isLoading={saving}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

