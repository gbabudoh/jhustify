'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';
import { sortedAfricanCountries } from '@/lib/data/africanCountries';

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

export default function SearchPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [classification, setClassification] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

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

  useEffect(() => {
    fetchBusinesses();
  }, [searchQuery, category, classification, country, city]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (category) params.append('category', category);
      if (classification) params.append('classification', classification);
      if (country) params.append('country', country);
      if (city) params.append('city', city);
      params.append('verificationStatus', 'VERIFIED');

      const response = await fetch(`/api/business?${params.toString()}`);
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#465362] mb-8">
            Search Verified Businesses
          </h1>

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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="Country"
                  options={[
                    { value: '', label: 'All African Countries' },
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
                <p className="text-gray-600">No businesses found. Try adjusting your search criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link key={business._id} href={`/business/${business._id}`}>
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-[#465362] flex-1">
                        {business.businessName}
                      </h3>
                      {business.trustBadgeActive && (
                        <TrustBadge type={business.trustBadgeType} size="sm" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{business.physicalAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} />
                        <span>{business.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <span>{business.email}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#D6D9DD]">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#F5F5F5] text-[#465362]">
                        {business.classification === 'REGISTERED' ? 'Formal' : 'Informal'}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

