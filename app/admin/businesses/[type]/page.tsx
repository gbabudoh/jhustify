'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, Trash2, Search, Eye, X, ArrowLeft, Package, Briefcase } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
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

export default function CategoricalBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string; // 'product' or 'service'
  const isProduct = type === 'product';
  const businessType = isProduct ? 'PRODUCT' : 'SERVICE';

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<'REGISTERED' | 'UNREGISTERED'>('REGISTERED');
  const [page] = useState(1);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        businessType: businessType,
      });
      
      if (search) queryParams.append('search', search);

      const response = await fetch(`/api/admin/businesses?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = (await response.json()) as { 
          businesses: Business[]; 
          pagination?: { pages: number };
        };
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [page, businessType, search]);

  useEffect(() => {
    const checkAdmin = () => {
      const userStr = localStorage.getItem('admin-user');
      const token = localStorage.getItem('admin-token');
      
      if (!userStr || !token) {
        router.push('/admin/login');
        return false;
      }
      
      const user = JSON.parse(userStr);
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/');
        return false;
      }
      return true;
    };

    if (checkAdmin()) {
      fetchBusinesses();
    }
  }, [router, fetchBusinesses]);

  const handleDelete = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/admin/businesses?businessId=${businessId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchBusinesses();
      }
    } catch (error) {
      console.error('Error deleting business:', error);
    }
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
      businessType: businessType, // Use the constant defined at the component level
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
      }
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const filteredBusinesses = businesses.filter(b => b.classification === classificationFilter);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-3">
                <Link href="/admin/dashboard" className="hover:text-blue-700 transition-colors">Infrastructure</Link>
                <X size={10} className="text-gray-300" />
                <span className="text-gray-400">Categorical Management</span>
              </div>
              <h1 className="text-5xl font-black text-[#1A1C1E] tracking-tighter leading-none mb-3">
                {isProduct ? 'Product Businesses' : 'Service Businesses'}
              </h1>
              <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
                Refining administrative control for {isProduct ? 'good-based commercial entities' : 'professional service providers'}.
              </p>
            </div>
            <Button variant="outline" className="!rounded-3xl font-black border-gray-200 h-14 px-8" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft size={16} className="mr-3 text-blue-500" />
              Back to Dashboard
            </Button>
          </div>

          {/* Formal | Informal Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex p-1.5 bg-gray-200/50 backdrop-blur-md rounded-3xl w-full md:w-fit shadow-inner border border-white/50">
              <button
                onClick={() => setClassificationFilter('REGISTERED')}
                className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-500 ${
                  classificationFilter === 'REGISTERED' 
                  ? 'bg-white text-[#1A1C1E] shadow-2xl scale-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 scale-95 opacity-60'
                }`}
              >
                Formal
              </button>
              <button
                onClick={() => setClassificationFilter('UNREGISTERED')}
                className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-500 ${
                  classificationFilter === 'UNREGISTERED' 
                  ? 'bg-white text-[#1A1C1E] shadow-2xl scale-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 scale-95 opacity-60'
                }`}
              >
                Not Registered
              </button>
            </div>
            
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-all" size={20} />
              <Input
                placeholder="Search by title or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-14 !rounded-2xl !py-4 font-bold text-sm bg-white border-gray-100 h-14 shadow-sm"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing Node Records...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Card className="overflow-hidden !p-0 !rounded-[2rem] shadow-xl shadow-blue-900/5 border-none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="text-left py-6 px-8 font-black text-[#6d6e6b] text-[10px] uppercase tracking-widest">Business Detail</th>
                        <th className="text-left py-6 px-4 font-black text-[#6d6e6b] text-[10px] uppercase tracking-widest">Category</th>
                        <th className="text-left py-6 px-4 font-black text-[#6d6e6b] text-[10px] uppercase tracking-widest">Status</th>
                        <th className="text-left py-6 px-4 font-black text-[#6d6e6b] text-[10px] uppercase tracking-widest">Pricing Tier</th>
                        <th className="text-right py-6 px-8 font-black text-[#6d6e6b] text-[10px] uppercase tracking-widest">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredBusinesses.map((business) => (
                        <tr key={business.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                                {isProduct ? <Package size={22} /> : <Briefcase size={22} />}
                              </div>
                              <div>
                                <div className="font-black text-[#1A1C1E] tracking-tight">{business.businessName}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{business.city}, {business.country}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase">
                              {business.category}
                            </span>
                          </td>
                          <td className="py-6 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                              business.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {business.verificationStatus}
                            </span>
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">
                              {business.verificationTier}
                            </span>
                          </td>
                          <td className="py-6 px-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditingBusiness(business); setShowEditModal(true); }} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                <Edit size={18} />
                              </button>
                              <Link href={`/business/${business.id}`} target="_blank" className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                <Eye size={18} />
                              </Link>
                              <button onClick={() => handleDelete(business.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBusinesses.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-30">
                              <Search size={48} />
                              <p className="font-black uppercase tracking-widest text-[10px]">No matches found in database</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Simplified for the categorical view) */}
      {showEditModal && editingBusiness && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <Card className="max-w-xl w-full !rounded-[2.5rem] p-10 bg-white">
            <h2 className="text-3xl font-black text-[#1A1C1E] tracking-tighter mb-8 leading-none">Modify Registry</h2>
            <form onSubmit={handleUpdate} className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <Select
                  label="Audit Status"
                  name="verificationStatus"
                  defaultValue={editingBusiness.verificationStatus}
                  options={[
                    { value: 'UNVERIFIED', label: 'Unverified' },
                    { value: 'SUBMITTED', label: 'Submitted' },
                    { value: 'IN_REVIEW', label: 'In Review' },
                    { value: 'VERIFIED', label: 'Verified' },
                  ]}
                />
                <Select
                  label="Pricing Tier"
                  name="verificationTier"
                  defaultValue={editingBusiness.verificationTier}
                  options={[
                    { value: 'BASIC', label: 'Basic' },
                    { value: 'VERIFIED', label: 'Verified' },
                    { value: 'PREMIUM', label: 'Premium' },
                  ]}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" className="flex-1 !rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]">Save Record</Button>
                <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)} className="px-8 !rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]">Abort</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
