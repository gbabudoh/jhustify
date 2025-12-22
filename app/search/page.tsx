'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Building2, User } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TrustBadge from '@/components/TrustBadge';
import RatingDisplay from '@/components/RatingDisplay';
import Link from 'next/link';
import { sortedAfricanCountries } from '@/lib/data/africanCountries';

interface Business {
  _id: string;
  id?: string;
  businessName: string;
  category: string;
  classification: 'REGISTERED' | 'UNREGISTERED';
  contactPersonName: string;
  contactNumber: string;
  email: string;
  physicalAddress: string;
  city?: string;
  country: string;
  verificationStatus: string;
  verificationTier: string;
  trustBadgeActive: boolean;
  trustBadgeType?: 'INFORMAL' | 'FORMAL' | 'VERIFIED';
  businessRepresentativePhoto?: string;
  averageRating?: number;
  ratingCount?: number;
}

export default function SearchPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [classification, setClassification] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Services', label: 'Services' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
  ];

  // Debounce search query for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchBusinesses();
  }, [debouncedSearchQuery, category, classification, country, city, verificationStatus]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchQuery.trim()) params.append('search', debouncedSearchQuery.trim());
      if (category) params.append('category', category);
      if (classification) params.append('classification', classification);
      if (country) params.append('country', country);
      if (city.trim()) params.append('city', city.trim());
      if (verificationStatus) params.append('verificationStatus', verificationStatus);

      const response = await fetch(`/api/business?${params.toString()}`);
      const data = await response.json();
      
      // Always try to use the businesses array from the response
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#465362] mb-2">
            Search Businesses
          </h1>
          <p className="text-gray-600 mb-8">
            Find businesses across Africa. Verified businesses appear first.
          </p>

          {/* Search Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-[#D6D9DD] p-6 mb-8">
            <div className="space-y-4">
              {/* Search Bar - Full Width */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search by name, category, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select
                  label="Verification Status"
                  options={[
                    { value: '', label: 'All Businesses' },
                    { value: 'VERIFIED', label: 'Verified Only' },
                    { value: 'UNVERIFIED', label: 'Unverified' },
                    { value: 'IN_REVIEW', label: 'In Review' },
                  ]}
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                />
                <Select
                  label="Country"
                  options={[
                    { value: '', label: 'All Countries' },
                    ...sortedAfricanCountries.map(c => ({ value: c.name, label: c.name }))
                  ]}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <Select
                  label="Category"
                  options={categories}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Select
                  label="Business Type"
                  options={[
                    { value: '', label: 'All Types' },
                    { value: 'REGISTERED', label: 'Registered (Formal)' },
                    { value: 'UNREGISTERED', label: 'Unregistered (Informal)' },
                  ]}
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                />
                <Input
                  label="City (Optional)"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-[#D6D9DD] p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#D6D9DD]">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">No businesses found.</p>
                <p className="text-sm text-gray-500">
                  {debouncedSearchQuery || category || classification || country || city || verificationStatus
                    ? 'Try adjusting your search criteria or clearing filters.'
                    : 'Start by searching for a business name, category, or location.'}
                </p>
              </div>
            </Card>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Found {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
                {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <Link key={business._id || business.id} href={`/business/${business.id || business._id}`}>
                    <Card hover className="h-full transition-all hover:shadow-lg">
                      <div className="flex items-start gap-3 mb-3">
                        {/* Business Representative Photo */}
                        {business.businessRepresentativePhoto ? (
                          <div className="flex-shrink-0">
                            <img
                              src={business.businessRepresentativePhoto}
                              alt={business.contactPersonName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#D6D9DD]"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#C2EABD] to-[#A0D995] flex items-center justify-center border-2 border-[#D6D9DD]">
                            <User className="text-[#465362]" size={24} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-semibold text-[#465362] flex-1 truncate">
                              {business.businessName}
                            </h3>
                            {business.trustBadgeActive && (
                              <TrustBadge type={business.trustBadgeType} size="sm" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{business.category}</p>
                          {business.averageRating !== undefined && business.averageRating > 0 && (
                            <div className="mt-2">
                              <RatingDisplay
                                average={business.averageRating}
                                count={business.ratingCount || 0}
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span className="truncate">
                            {business.city ? `${business.city}, ` : ''}{business.country}
                          </span>
                        </div>
                        {business.physicalAddress && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span className="truncate text-xs">{business.physicalAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} />
                          <span>{business.contactNumber}</span>
                        </div>
                        {business.email && business.verificationTier === 'PREMIUM' && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={16} />
                            <span className="truncate">{business.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#D6D9DD] flex items-center justify-between">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#F5F5F5] text-[#465362]">
                          {business.classification === 'REGISTERED' ? 'Formal' : 'Informal'}
                        </span>
                        {business.verificationStatus === 'VERIFIED' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

