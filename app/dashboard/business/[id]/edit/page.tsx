'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
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
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

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
        const business = data.business;

        setFormData({
          businessName: business.businessName || '',
          category: business.category || '',
          contactPersonName: business.contactPersonName || '',
          contactNumber: business.contactNumber || '',
          email: business.email || '',
          physicalAddress: business.physicalAddress || '',
          country: business.country || '',
          city: business.city || '',
        });

        if (business.businessRepresentativePhoto) {
          setPhotoPreview(business.businessRepresentativePhoto);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load business');
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

      // Upload new photo if selected
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
          throw new Error('Failed to upload photo');
        }

        const uploadData = await uploadResponse.json();
        photoUrl = uploadData.url;
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
    } catch (err: any) {
      setError(err.message || 'Failed to update business');
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

                {/* Business Representative Photo */}
                <div>
                  <label className="block text-sm font-medium text-[#465362] mb-2">
                    Business Representative Photo
                  </label>
                  <div className="border-2 border-dashed border-[#D6D9DD] rounded-xl p-6 text-center hover:border-[#465362] hover:bg-[#F5F5F5] transition-all duration-200">
                    {photoPreview ? (
                      <div className="mb-4">
                        <img
                          src={photoPreview}
                          alt="Business representative preview"
                          className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#C2EABD] flex items-center justify-center mx-auto mb-3">
                        <Upload className="text-[#465362]" size={20} />
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
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                    </label>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setPhotoPreview(null);
                          setSelectedPhoto(null);
                        }}
                      >
                        <X size={14} className="mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
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

