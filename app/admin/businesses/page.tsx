'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Search, Building2, MapPin, ShieldCheck, Eye, X, ArrowLeft } from 'lucide-react';
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
  businessType: 'PRODUCT' | 'SERVICE';
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
  const [typeFilter, setTypeFilter] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        businessType: typeFilter,
      });
      if (statusFilter) params.append('verificationStatus', statusFilter);
      if (tierFilter) params.append('verificationTier', tierFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/businesses?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = (await response.json()) as { 
          businesses: Business[]; 
          pagination?: { pages: number };
        };
        setBusinesses(data.businesses || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error: unknown) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, tierFilter, search]);

  useEffect(() => {
    const checkAdmin = () => {
      const userStr = localStorage.getItem('admin-user');
      const token = localStorage.getItem('admin-token');
      
      if (!userStr || !token) {
        router.push('/admin/login');
        return false;
      }
      
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          router.push('/');
          return false;
        }
        return true;
      } catch {
        router.push('/admin/login');
        return false;
      }
    };

    if (checkAdmin()) {
      fetchBusinesses();
    }
  }, [router, fetchBusinesses]);

  const handleDelete = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('admin-token');
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
      verificationStatus: formData.get('verificationStatus') as string,
      verificationTier: formData.get('verificationTier') as string,
      trustBadgeActive: formData.get('trustBadgeActive') === 'on',
      trustBadgeType: (formData.get('trustBadgeType') as string) || undefined,
      businessType: formData.get('businessType') as string,
    };

    try {
      const token = localStorage.getItem('admin-token');
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

  // Split businesses into Formal and Informal for the current type
  const formalBusinesses = businesses.filter(b => b.classification === 'REGISTERED');
  const informalBusinesses = businesses.filter(b => b.classification === 'UNREGISTERED');

  const BusinessTable = ({ data, title }: { data: Business[], title: string }) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-8 rounded-full ${title.includes('Formal') ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
        <h2 className="text-xl font-bold text-[#6d6e6b]">{title}</h2>
        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {data.length}
        </span>
      </div>
      
      {data.length === 0 ? (
        <Card className="py-10 text-center !rounded-2xl border-dashed border-2">
          <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium tracking-tight">No {title.toLowerCase()} found.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden !p-0 !rounded-2xl shadow-sm border-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[#D6D9DD]">
                  <th className="text-left py-4 px-6 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Business</th>
                  <th className="text-left py-4 px-4 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Category</th>
                  <th className="text-left py-4 px-4 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Location</th>
                  <th className="text-left py-4 px-4 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Tier</th>
                  <th className="text-left py-4 px-4 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Owner</th>
                  <th className="text-right py-4 px-6 font-bold text-[#6d6e6b] text-xs uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((business) => (
                  <tr key={business.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <div className="font-extrabold text-[#1A1C1E] tracking-tight">{business.businessName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {business.trustBadgeActive && business.trustBadgeType && (
                              <TrustBadge type={business.trustBadgeType} size="sm" />
                            )}
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                              SYS-REF: {business.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                        {business.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                        <MapPin size={14} className="text-blue-500" />
                        <span>{business.city ? `${business.city}, ` : ''}{business.country}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none ${getStatusBadgeColor(business.verificationStatus)} shadow-sm`}>
                        {business.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none ${getTierBadgeColor(business.verificationTier)} shadow-sm`}>
                        {business.verificationTier}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {business.owner ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-[#1A1C1E] tracking-tight">{business.owner.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold lowercase">{business.owner.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs font-black uppercase tracking-widest">Orphaned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/business/${business.id}`}
                          target="_blank"
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95"
                          title="View Site"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleEdit(business)}
                          className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-95"
                          title="Modify"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(business.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
                          title="Purge"
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-blue-100 selection:text-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-3">
                <Link href="/admin" className="hover:text-blue-700 transition-colors">Infrastructure</Link>
                <X size={10} className="text-gray-300" />
                <span className="text-gray-400">Entities</span>
              </div>
              <h1 className="text-5xl font-black text-[#1A1C1E] tracking-tighter leading-none mb-3">Manage Businesses</h1>
              <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">System-wide audit and categorization of commercial entities and service providers.</p>
            </div>
            <Button variant="outline" className="!rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-all border-gray-200 h-14 px-8" onClick={() => router.push('/admin')}>
              <ArrowLeft size={16} className="mr-3 text-blue-500" />
              Infrastructure Overview
            </Button>
          </div>

          {/* Classification Toggles */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex p-1.5 bg-gray-200/50 backdrop-blur-md rounded-3xl w-full md:w-fit shadow-inner border border-white/50">
              <button
                onClick={() => setTypeFilter('PRODUCT')}
                className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-500 ${
                  typeFilter === 'PRODUCT' 
                  ? 'bg-white text-[#1A1C1E] shadow-2xl scale-100 translate-z-10' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 scale-95 opacity-60'
                }`}
              >
                Product Focused
              </button>
              <button
                onClick={() => setTypeFilter('SERVICE')}
                className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-500 ${
                  typeFilter === 'SERVICE' 
                  ? 'bg-white text-[#1A1C1E] shadow-2xl scale-100 translate-z-10' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 scale-95 opacity-60'
                }`}
              >
                Service Oriented
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400 bg-white/50 px-6 py-3 rounded-2xl border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Database Sync Active</span>
            </div>
          </div>

          {/* Universal Filters */}
          <Card className="mb-12 !rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border-none overflow-visible p-6 bg-white/80 backdrop-blur-xl border border-white/20 relative z-10">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-all duration-300" size={20} />
                <Input
                  placeholder="Query global records by title, vertical, or stakeholder credentials..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-14 !rounded-[1.5rem] !py-4 font-bold text-sm bg-gray-50/50 border-gray-100 hover:bg-white focus:bg-white transition-all shadow-none h-16"
                />
              </div>
              <div className="grid grid-cols-2 md:flex gap-4">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="!rounded-2xl !py-4 font-black uppercase tracking-widest text-[10px] bg-white border-gray-100 h-16 shadow-lg shadow-gray-100/50"
                  options={[
                    { value: '', label: 'Audit Status' },
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
                  className="!rounded-2xl !py-4 font-black uppercase tracking-widest text-[10px] bg-white border-gray-100 h-16 shadow-lg shadow-gray-100/50"
                  options={[
                    { value: '', label: 'Access Tier' },
                    { value: 'PREMIUM', label: 'Premium' },
                    { value: 'VERIFIED', label: 'Verified' },
                    { value: 'BASIC', label: 'Basic' },
                  ]}
                />
                <Button 
                  variant="ghost" 
                  className="px-8 !rounded-2xl text-gray-400 hover:text-red-500 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-red-50/50"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                    setTierFilter('');
                  }}
                >
                  Reset Parameters
                </Button>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
              <div className="w-16 h-16 border-[6px] border-blue-50 border-t-blue-600 rounded-full animate-spin shadow-xl shadow-blue-500/20"></div>
              <p className="text-[#1A1C1E] font-black uppercase tracking-[0.3em] text-[10px]">Accessing Encrypted Nodes...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <BusinessTable 
                data={formalBusinesses} 
                title={`${typeFilter === 'PRODUCT' ? 'Product Focus' : 'Service Oriented'} — Formal Entities`} 
              />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16"></div>
              <BusinessTable 
                data={informalBusinesses} 
                title={`${typeFilter === 'PRODUCT' ? 'Product Focus' : 'Service Oriented'} — Informal Entities`} 
              />

              {totalPages > 1 && (
                <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-10">
                  <Button
                    variant="outline"
                    className="!rounded-3xl px-10 h-14 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-100 transition-all active:scale-95 disabled:opacity-30"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous Page
                  </Button>
                  
                  <div className="flex items-center gap-6 bg-white p-3 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Node Registry</span>
                    <div className="flex items-center gap-2 pr-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 ${
                            page === p 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-300 scale-110' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-200/50 text-[10px] uppercase'
                          }`}
                        >
                          {p.toString().padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="!rounded-3xl px-10 h-14 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-100 transition-all active:scale-95 disabled:opacity-30"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* System Control Matrix (Edit Modal) */}
          {showEditModal && editingBusiness && (
            <div className="fixed inset-0 bg-[#0A0B0C]/80 backdrop-blur-2xl flex items-center justify-center z-[100] animate-in fade-in duration-500 overflow-y-auto p-4 py-20">
              <Card className="max-w-2xl w-full !rounded-[3rem] shadow-2xl border-none p-10 bg-white relative">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                      <ShieldCheck size={14} />
                      Administrative Override Module
                    </div>
                    <h2 className="text-4xl font-black text-[#1A1C1E] tracking-tighter leading-none mb-3">Modify Registry</h2>
                    <p className="text-gray-400 font-bold">Synchronizing system records for <span className="text-blue-600 underline underline-offset-4 decoration-2">@{editingBusiness.businessName}</span></p>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="p-4 hover:bg-gray-100 rounded-[1.5rem] transition-all active:scale-90 text-gray-300 hover:text-gray-900">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">Audit Status</label>
                      <Select
                        name="verificationStatus"
                        defaultValue={editingBusiness.verificationStatus}
                        className="!rounded-2xl !py-4 bg-gray-50/50 border-gray-100 font-black uppercase tracking-widest text-[11px] h-16 group-hover:bg-gray-100/50 transition-all"
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
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">Access Privilege</label>
                      <Select
                        name="verificationTier"
                        defaultValue={editingBusiness.verificationTier}
                        className="!rounded-2xl !py-4 bg-gray-50/50 border-gray-100 font-black uppercase tracking-widest text-[11px] h-16 group-hover:bg-gray-100/50 transition-all"
                        options={[
                          { value: 'BASIC', label: 'Basic' },
                          { value: 'VERIFIED', label: 'Verified' },
                          { value: 'PREMIUM', label: 'Premium' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">Operational Logic</label>
                      <Select
                        name="businessType"
                        defaultValue={editingBusiness.businessType}
                        className="!rounded-2xl !py-4 bg-gray-50/50 border-gray-100 font-black uppercase tracking-widest text-[11px] h-16 group-hover:bg-gray-100/50 transition-all"
                        options={[
                          { value: 'PRODUCT', label: 'Product Focused' },
                          { value: 'SERVICE', label: 'Service Oriented' },
                        ]}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">Trust Certification</label>
                      <Select
                        name="trustBadgeType"
                        defaultValue={editingBusiness.trustBadgeType || ''}
                        className="!rounded-2xl !py-4 bg-gray-50/50 border-gray-100 font-black uppercase tracking-widest text-[11px] h-16 group-hover:bg-gray-100/50 transition-all"
                        options={[
                          { value: '', label: 'NULL' },
                          { value: 'INFORMAL', label: 'Informal' },
                          { value: 'FORMAL', label: 'Formal' },
                          { value: 'VERIFIED', label: 'Verified' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50/50 rounded-[2.5rem] flex items-center justify-between border border-gray-100/50 shadow-inner">
                    <div>
                      <label htmlFor="trustBadgeActive" className="text-[11px] font-black text-[#1A1C1E] uppercase tracking-widest block mb-1">Visual Verification Layer</label>
                      <p className="text-[10px] font-bold text-gray-400">Deploy verified status badge across client nodes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="trustBadgeActive"
                        id="trustBadgeActive"
                        defaultChecked={editingBusiness.trustBadgeActive}
                        className="sr-only peer"
                      />
                      <div className="w-16 h-9 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-7 after:w-7 after:transition-all duration-500 peer-checked:bg-blue-600 shadow-sm shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" variant="primary" className="flex-[2] !py-6 !rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/40 hover:-translate-y-1 transition-all">
                      Push Changes to Mainframe
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 !py-6 !rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-all" onClick={() => {
                      setShowEditModal(false);
                      setEditingBusiness(null);
                    }}>
                      Abort Procedure
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

