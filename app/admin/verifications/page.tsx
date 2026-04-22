'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Eye, 
  X, 
  ArrowLeft, 
  FileText, 
  Video, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  User as UserIcon
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Link from 'next/link';

interface Verification {
  id: string;
  verificationId: string;
  businessId: string;
  status: string;
  classification: string;
  nationalIdSecureLink?: string;
  identityDocumentType?: string;
  registrationDocSecureLink?: string;
  proofOfPresenceVideoLink?: string;
  proofOfPresencePhotos: string[];
  businessBankName?: string;
  reviewerNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  business: {
    id: string;
    businessName: string;
    classification: string;
    owner: {
      name: string;
      email: string;
    };
  };
  reviewer?: {
    name: string;
  };
}

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('SUBMITTED');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [tierUpdate, setTierUpdate] = useState('VERIFIED');

  const fetchVerifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/verifications?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setVerifications(data.verifications || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchVerifications();
  }, [router, fetchVerifications]);

  const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED' | 'IN_REVIEW') => {
    if (!selectedVerification) return;

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationId: selectedVerification.id,
          status,
          reviewerNotes,
          tierUpdate: status === 'APPROVED' ? tierUpdate : undefined
        }),
      });

      if (response.ok) {
        setIsReviewing(false);
        setSelectedVerification(null);
        fetchVerifications();
      } else {
        alert('Failed to update verification');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Error updating verification');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-700';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-3">
                <Link href="/admin" className="hover:text-blue-700 transition-colors">Infrastructure</Link>
                <X size={10} className="text-gray-300" />
                <span className="text-gray-400">Trust Queue</span>
              </div>
              <h1 className="text-5xl font-black text-[#1A1C1E] tracking-tighter leading-none mb-3">Verification Queue</h1>
              <p className="text-gray-500 font-bold text-lg max-w-2xl">Manual review of business credentials and proof of presence nodes.</p>
            </div>
            <Button variant="outline" className="!rounded-3xl font-black uppercase tracking-widest text-[10px] h-14 px-8" onClick={() => router.push('/admin')}>
              <ArrowLeft size={16} className="mr-3 text-blue-500" />
              Infrastructure Overview
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="flex p-1.5 bg-gray-200/50 rounded-2xl w-full md:w-fit">
              {['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                    statusFilter === status 
                    ? 'bg-white text-[#1A1C1E] shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Trust Nodes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {verifications.length === 0 ? (
                <Card className="py-20 text-center !rounded-3xl border-dashed border-2">
                  <ShieldCheck size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold">No verifications found in this sector.</p>
                </Card>
              ) : (
                verifications.map((v) => (
                  <Card key={v.id} className="!p-6 !rounded-[2rem] hover:shadow-xl transition-all border-none group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <FileText size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-[#1A1C1E] tracking-tight">{v.business.businessName}</h3>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${getStatusBadgeColor(v.status)}`}>
                              {v.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-bold">
                            <span className="flex items-center gap-1"><UserIcon size={12} className="text-gray-300" /> {v.business.owner.name}</span>
                            <span className="text-gray-300">|</span>
                            <span className="uppercase tracking-widest text-[10px] text-blue-500">{v.classification}</span>
                            <span className="text-gray-300">|</span>
                            <span>ID: {v.verificationId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block mr-4">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Submitted On</p>
                          <p className="text-xs font-bold text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button 
                          variant="primary" 
                          className="!rounded-2xl !py-4 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100"
                          onClick={() => {
                            setSelectedVerification(v);
                            setReviewerNotes(v.reviewerNotes || '');
                            setIsReviewing(true);
                          }}
                        >
                          Review Credentials
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                    page === p 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewing && selectedVerification && (
        <div className="fixed inset-0 bg-[#0A0B0C]/80 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto !rounded-[2.5rem] shadow-2xl relative p-8 md:p-12">
            <button 
              onClick={() => setIsReviewing(false)}
              className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <X size={24} className="text-gray-400" />
            </button>

            <div className="mb-10">
              <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                <ShieldCheck size={14} />
                Credentials Audit Mode
              </div>
              <h2 className="text-4xl font-black text-[#1A1C1E] tracking-tighter leading-none mb-2">
                Reviewing {selectedVerification.business.businessName}
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                Classification: <span className="text-blue-500">{selectedVerification.classification}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Documents Column */}
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" />
                    Identity Documents
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedVerification.nationalIdSecureLink ? (
                      <Link 
                        href={selectedVerification.nationalIdSecureLink} 
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                            <Eye size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#1A1C1E] uppercase tracking-widest">National ID / Passport</p>
                            <p className="text-[10px] text-gray-400 font-bold">{selectedVerification.identityDocumentType || 'NOT SPECIFIED'}</p>
                          </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-300" />
                      </Link>
                    ) : (
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-400 text-xs font-bold flex items-center gap-2">
                        <XCircle size={16} /> Identity document missing
                      </div>
                    )}

                    {selectedVerification.classification === 'REGISTERED' && (
                      selectedVerification.registrationDocSecureLink ? (
                        <Link 
                          href={selectedVerification.registrationDocSecureLink} 
                          target="_blank"
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                              <Eye size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-[#1A1C1E] uppercase tracking-widest">Registration Document</p>
                              <p className="text-[10px] text-gray-400 font-bold">Formal Sector Credentials</p>
                            </div>
                          </div>
                          <ExternalLink size={16} className="text-gray-300" />
                        </Link>
                      ) : (
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-400 text-xs font-bold flex items-center gap-2">
                          <XCircle size={16} /> Registration document missing
                        </div>
                      )
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Video size={14} className="text-emerald-500" />
                    Proof of Presence (Informal)
                  </h4>
                  <div className="space-y-4">
                    {selectedVerification.proofOfPresenceVideoLink ? (
                      <div className="rounded-2xl overflow-hidden border border-gray-100 bg-black aspect-video relative group">
                        <video 
                          src={selectedVerification.proofOfPresenceVideoLink} 
                          controls 
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                        <Video size={32} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No presence video recorded</p>
                      </div>
                    )}

                    {selectedVerification.proofOfPresencePhotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedVerification.proofOfPresencePhotos.map((photo, i) => (
                          <Link key={i} href={photo} target="_blank" className="rounded-2xl overflow-hidden border border-gray-100 aspect-square group relative">
                            <img src={photo} alt="Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Camera size={24} className="text-white" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                        <Camera size={32} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No presence photos available</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Action Column */}
              <div className="space-y-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    Review Parameters
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Assigned Trust Tier</label>
                      <Select 
                        value={tierUpdate}
                        onChange={(e) => setTierUpdate(e.target.value)}
                        className="!rounded-2xl !py-4 font-black uppercase tracking-widest text-[11px] bg-white border-gray-100 h-16 shadow-sm"
                        options={[
                          { value: 'BASIC', label: 'Basic' },
                          { value: 'VERIFIED', label: 'Verified' },
                          { value: 'PREMIUM', label: 'Premium' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Auditor Notes</label>
                      <textarea 
                        className="w-full !rounded-2xl p-4 font-bold text-sm bg-white border border-gray-100 focus:ring-2 focus:ring-blue-500/20 outline-none h-40 transition-all"
                        placeholder="Detail any discrepancies or validation notes here..."
                        value={reviewerNotes}
                        onChange={(e) => setReviewerNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="primary" 
                      className="!py-6 !rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1"
                      onClick={() => handleUpdateStatus('APPROVED')}
                    >
                      <CheckCircle size={18} className="mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="!py-6 !rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] border-red-100 text-red-500 hover:bg-red-50 shadow-xl shadow-red-500/5 transition-all hover:-translate-y-1"
                      onClick={() => handleUpdateStatus('REJECTED')}
                    >
                      <XCircle size={18} className="mr-2" /> Reject
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full !py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-600"
                    onClick={() => handleUpdateStatus('IN_REVIEW')}
                  >
                    Set to In-Review Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
