'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Search, Filter, User as UserIcon, Mail, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUSINESS_OWNER' | 'CONSUMER' | 'ADMIN' | 'TRUST_TEAM';
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
      fetchUsers();
    }
  }, [router, page, roleFilter, search]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
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

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
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
      const token = localStorage.getItem('token');
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700';
      case 'TRUST_TEAM': return 'bg-purple-100 text-purple-700';
      case 'BUSINESS_OWNER': return 'bg-blue-100 text-blue-700';
      case 'CONSUMER': return 'bg-green-100 text-green-700';
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
              <h1 className="text-3xl font-bold text-[#465362] mb-2">Manage Users</h1>
              <p className="text-gray-600">View and manage all platform users</p>
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
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Roles' },
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'TRUST_TEAM', label: 'Trust Team' },
                  { value: 'BUSINESS_OWNER', label: 'Business Owner' },
                  { value: 'CONSUMER', label: 'Consumer' },
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
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#465362]">Joined</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#465362]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-[#D6D9DD] hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <UserIcon size={18} className="text-gray-400" />
                              <span className="font-medium text-[#465362]">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
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

          {showEditModal && editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-[#465362] mb-4">Edit User</h2>
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <Input
                        name="name"
                        defaultValue={editingUser.name}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        name="email"
                        type="email"
                        defaultValue={editingUser.email}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <Select
                        name="role"
                        defaultValue={editingUser.role}
                        options={[
                          { value: 'BUSINESS_OWNER', label: 'Business Owner' },
                          { value: 'CONSUMER', label: 'Consumer' },
                          { value: 'ADMIN', label: 'Admin' },
                          { value: 'TRUST_TEAM', label: 'Trust Team' },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button type="submit" variant="primary">Update</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
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

