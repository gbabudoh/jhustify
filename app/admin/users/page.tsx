'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Edit, Trash2, Search, ShieldAlert, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUSINESS_OWNER' | 'CONSUMER' | 'ADMIN' | 'SUPER_ADMIN' | 'TRUST_TEAM';
  createdAt: string;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [terminatingUser, setTerminatingUser] = useState<User | null>(null);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  useEffect(() => {
    const role = searchParams.get('role') || '';
    setRoleFilter(role);
    setPage(1); // Reset to page 1 on filter change
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, search]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
      });
      if (roleFilter) params.append('role', roleFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      userId: editingUser.id,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    };

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  // Simulated Terminate Account Flow
  const handleTerminateClick = (user: User) => {
    setTerminatingUser(user);
    setShowTerminateModal(true);
  };

  const executeTermination = async () => {
    if (!terminatingUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users?userId=${terminatingUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setShowTerminateModal(false);
        setTerminatingUser(null);
        fetchUsers();
      } else {
        alert('Failed to terminate user.');
      }
    } catch (error) {
      console.error('Error terminating user:', error);
      alert('Network Error during termination.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-black text-white border-black';
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200';
      case 'TRUST_TEAM': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'BUSINESS_OWNER': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CONSUMER': return 'bg-[#d3f5ce] text-[#5BB318] border-[#a8d59d]';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A1C1E] tracking-tight mb-2">User Management</h1>
        <p className="text-gray-500 font-medium">Control platform access, edit roles, and manage account lifecycles.</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8 border-none shadow-sm !rounded-3xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#a8d59d] transition-all duration-300 rounded-2xl py-3 pl-12 pr-4 outline-none text-gray-700 font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-[#d3f5ce]/50"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'TRUST_TEAM', label: 'Trust Team' },
                { value: 'BUSINESS_OWNER', label: 'Business Owner' },
                { value: 'CONSUMER', label: 'Consumer' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8d59d] mb-4"></div>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Fetching Records...</p>
        </div>
      ) : (
        <Card className="border-none shadow-sm !rounded-3xl overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <th className="py-4 px-6 rounded-tl-3xl">User details</th>
                  <th className="py-4 px-6">Role / Access</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 border border-gray-200">
                            <span className="font-bold text-gray-500">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1C1E]">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-semibold text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1.5"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleTerminateClick(user)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1.5"
                          >
                            <ShieldAlert size={14} /> Terminate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl">
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-xl">
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-black text-[#1A1C1E] tracking-tight">Edit Identity</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-700 shadow-sm border border-gray-100 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <Input name="name" defaultValue={editingUser.name} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <Input name="email" type="email" defaultValue={editingUser.email} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">System Role</label>
                    <Select
                      name="role"
                      defaultValue={editingUser.role}
                      options={[
                        { value: 'BUSINESS_OWNER', label: 'Business Owner' },
                        { value: 'CONSUMER', label: 'Consumer' },
                        { value: 'ADMIN', label: 'Administrator' },
                        { value: 'SUPER_ADMIN', label: 'Super Administrator' },
                        { value: 'TRUST_TEAM', label: 'Trust Team Member' },
                      ]}
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <Button type="submit" variant="primary" className="w-full py-3.5 rounded-xl shadow-lg shadow-[#1A1C1E]/10">
                    <CheckCircle2 size={18} className="mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Terminate Account Modal */}
        {showTerminateModal && terminatingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-red-950/40 backdrop-blur-sm"
              onClick={() => setShowTerminateModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100"
            >
              <div className="p-8 text-center pt-10">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-red-50 animate-ping"></div>
                  <AlertTriangle size={36} className="relative z-10" />
                </div>
                <h2 className="text-2xl font-black text-[#1A1C1E] mb-2">Terminate Account?</h2>
                <p className="text-gray-500 font-medium mb-2">
                  You are about to permanently delete <strong className="text-gray-800">{terminatingUser.name}</strong>.
                </p>
                <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl mb-6 inline-block">
                  This action cannot be undone. All associated data will be wiped.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowTerminateModal(false)}
                    className="py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={executeTermination}
                    className="py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

