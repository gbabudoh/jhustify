'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Search, Filter, Building2, MapPin, Phone, Mail, ShieldCheck, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TrustBadge from '@/components/TrustBadge';
import Link from 'next/link';

interface Business {
  id: string;
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
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminBusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userStr || !token) {
        router.push('/admin/login');
        return false;
      }
      
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
          router.push('/');
          return false;
        }
        return true;
      } catch (e) {
        router.push('/admin/login');
        return false;
      }
    };

    if (checkAdmin()) {
      fetchBusinesses();
    }
  }, [router, page, statusFilter, tierFilter, search]);

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (statusFilter) params.append('verificationStatus', statusFilter);
      if (tierFilter) params.append('verificationTier', tierFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/businesses?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/businesses?businessId=${businessId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchBusinesses();
      } else {
        alert('Failed to delete business');
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Error deleting business');
    }
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBusiness) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      businessId: editingBusiness.id,
      verificationStatus: formData.get('verificationStatus'),
      verificationTier: formData.get('verificationTier'),
      trustBadgeActive: formData.get('trustBadgeActive') === 'on',
      trustBadgeType: formData.get('trustBadgeType') || undefined,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingBusiness(null);
        fetchBusinesses();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update business');
      }
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Error updating business');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-700';
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-700';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'UNVERIFIED': return 'bg-gray-100 text-gray-700';
      case 'SUSPENDED': return 'bg-red-100 text-red-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'PREMIUM': return 'bg-purple-100 text-purple-700';
      case 'VERIFIED': return 'bg-blue-100 text-blue-700';
      case 'BASIC': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#465362] mb-2">Manage Businesses</h1>
              <p className="text-gray-600">View and manage all business listings</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/admin')}>
              Back to Dashboard
            </Button>
          </div>

          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by business name, category, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'VERIFIED', label: 'Verified' },
                  { value: 'IN_REVIEW', label: 'In Review' },
                  { value: 'SUBMITTED', label: 'Submitted' },
                  { value: 'UNVERIFIED', label: 'Unverified' },
                  { value: 'SUSPENDED', label: 'Suspended' },
                  { value: 'REJECTED', label: 'Rejected' },
                ]}
              />
              <Select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Tiers' },
                  { value: 'PREMIUM', label: 'Premium' },
                  { value: 'VERIFIED', label: 'Verified' },
                  { value: 'BASIC', label: 'Basic' },
                ]}
              />
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#465362]"></div>
            </div>
          ) : (
            <>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#D6D9DD]">
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Business</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Tier</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Owner</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#465362]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses.map((business) => (
                        <tr key={business.id} className="border-b border-[#D6D9DD] hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Building2 size={18} className="text-gray-400" />
                              <div>
                                <div className="font-medium text-[#465362]">{business.businessName}</div>
                                {business.trustBadgeActive && business.trustBadgeType && (
                                  <TrustBadge type={business.trustBadgeType} size="sm" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{business.category}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <MapPin size={14} />
                              <span>{business.city ? `${business.city}, ` : ''}{business.country}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(business.verificationStatus)}`}>
                              {business.verificationStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(business.verificationTier)}`}>
                              {business.verificationTier}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {business.owner ? (
                              <div className="text-sm">
                                <div className="font-medium text-[#465362]">{business.owner.name}</div>
                                <div className="text-gray-500 text-xs">{business.owner.email}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/business/${business.id}`}
                                target="_blank"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye size={18} />
                              </Link>
                              <button
                                onClick={() => handleEdit(business)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(business.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {showEditModal && editingBusiness && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#465362] mb-4">Edit Business</h2>
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <Input
                        defaultValue={editingBusiness.businessName}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                      <Select
                        name="verificationStatus"
                        defaultValue={editingBusiness.verificationStatus}
                        options={[
                          { value: 'UNVERIFIED', label: 'Unverified' },
                          { value: 'SUBMITTED', label: 'Submitted' },
                          { value: 'IN_REVIEW', label: 'In Review' },
                          { value: 'VERIFIED', label: 'Verified' },
                          { value: 'SUSPENDED', label: 'Suspended' },
                          { value: 'REJECTED', label: 'Rejected' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification Tier</label>
                      <Select
                        name="verificationTier"
                        defaultValue={editingBusiness.verificationTier}
                        options={[
                          { value: 'BASIC', label: 'Basic' },
                          { value: 'VERIFIED', label: 'Verified' },
                          { value: 'PREMIUM', label: 'Premium' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trust Badge Type</label>
                      <Select
                        name="trustBadgeType"
                        defaultValue={editingBusiness.trustBadgeType || ''}
                        options={[
                          { value: '', label: 'None' },
                          { value: 'INFORMAL', label: 'Informal' },
                          { value: 'FORMAL', label: 'Formal' },
                          { value: 'VERIFIED', label: 'Verified' },
                        ]}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="trustBadgeActive"
                        id="trustBadgeActive"
                        defaultChecked={editingBusiness.trustBadgeActive}
                        className="w-4 h-4 text-[#465362] border-gray-300 rounded focus:ring-[#465362]"
                      />
                      <label htmlFor="trustBadgeActive" className="text-sm font-medium text-gray-700">
                        Trust Badge Active
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button type="submit" variant="primary">Update</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowEditModal(false);
                      setEditingBusiness(null);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

