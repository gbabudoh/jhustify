'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, MousePointer } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  costPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  clickCount: number;
  impressionCount: number;
  createdAt: string;
}

export default function AdminBannersPage() {
  const router = useRouter();
  const toast = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'MAIN_LEFT',
    costPrice: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
          toast.error('Access denied. Admin privileges required.');
          router.push('/');
          return false;
        }
        return true;
      }
      router.push('/login');
      return false;
    };

    if (checkAdmin()) {
      fetchBanners();
    }
  }, [router]);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/banners?all=true', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }

      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      toast.error('Failed to load banners');
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.imageUrl || !formData.position || !formData.costPrice || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      const method = editingBanner ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save banner');
      }

      toast.success(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
      setShowModal(false);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save banner');
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      position: banner.position,
      costPrice: banner.costPrice.toString(),
      startDate: new Date(banner.startDate).toISOString().slice(0, 16),
      endDate: new Date(banner.endDate).toISOString().slice(0, 16),
      isActive: banner.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
      console.error('Error deleting banner:', error);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/banners/${banner._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update banner');
      }

      toast.success(`Banner ${!banner.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to update banner');
      console.error('Error updating banner:', error);
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'MAIN_LEFT',
      costPrice: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      MAIN_LEFT: 'Main Left',
      TOP_RIGHT: 'Top Right',
      MIDDLE_RIGHT: 'Middle Right',
      BOTTOM_RIGHT: 'Bottom Right',
    };
    return labels[position] || position;
  };

  const isCurrentlyActive = (banner: Banner) => {
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return banner.isActive && start <= now && end >= now;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#465362] mb-2">Banner Management</h1>
              <p className="text-gray-600">Create and manage homepage banners</p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <Plus className="mr-2" size={20} />
              Create Banner
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#465362]"></div>
            </div>
          ) : banners.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">No banners yet. Create your first banner to get started.</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  <Plus className="mr-2" size={20} />
                  Create First Banner
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <Card key={banner._id} hover>
                  <div className="relative mb-4">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      {isCurrentlyActive(banner) ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Live
                        </span>
                      ) : banner.isActive ? (
                        <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                          Scheduled
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#465362] mb-2">{banner.title}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Position:</span> {getPositionLabel(banner.position)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cost:</span> ${banner.costPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span>{' '}
                      {new Date(banner.startDate).toLocaleDateString()} -{' '}
                      {new Date(banner.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#D6D9DD]">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <TrendingUp size={16} />
                      <span>{banner.impressionCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MousePointer size={16} />
                      <span>{banner.clickCount}</span>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      {banner.clickCount > 0
                        ? `${((banner.clickCount / banner.impressionCount) * 100).toFixed(1)}% CTR`
                        : '0% CTR'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(banner)} className="flex-1">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={banner.isActive ? 'ghost' : 'secondary'}
                      size="sm"
                      onClick={() => toggleActive(banner)}
                    >
                      {banner.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(banner._id)}>
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#465362] mb-6">
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D6D9DD] focus:border-[#465362] focus:ring-2 focus:ring-[#C2EABD]"
                  rows={3}
                />
              </div>

              <Input
                label="Image URL *"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                placeholder="https://example.com/banner.jpg"
              />

              <Input
                label="Link URL"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="https://example.com"
              />

              <Select
                label="Position *"
                options={[
                  { value: 'MAIN_LEFT', label: 'Main Left (Large)' },
                  { value: 'TOP_RIGHT', label: 'Top Right (Small)' },
                  { value: 'MIDDLE_RIGHT', label: 'Middle Right (Small)' },
                  { value: 'BOTTOM_RIGHT', label: 'Bottom Right (Small)' },
                ]}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />

              <Input
                label="Cost Price ($) *"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Start Date *"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
                <Input
                  label="End Date *"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#465362] border-gray-300 rounded focus:ring-[#465362]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#D6D9DD]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
