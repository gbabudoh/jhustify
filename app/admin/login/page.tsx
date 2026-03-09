'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in as admin
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('admin-user');
      const token = localStorage.getItem('admin-token');
      
      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            router.push('/admin/dashboard');
          }
        } catch {
          // Invalid user data, continue with login
        }
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Check if user is admin or super admin
      if (data.user?.role !== 'ADMIN' && data.user?.role !== 'SUPER_ADMIN') {
        setError('Access denied. Admin privileges required.');
        // Clear admin keys
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        return;
      }

      // Store admin specifically
      localStorage.setItem('admin-token', data.token);
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('auth-change'));

      // Redirect to admin dashboard
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-center">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#6d6e6b] mb-4 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Admin
            </Link>
          </div>

          <Card className="p-8">
            <div className="text-center mb-6">
              <Image 
                src="/logo.png" 
                alt="Jhustify Logo" 
                width={160} 
                height={60} 
                className="mx-auto mb-6 object-contain"
                priority
              />
              <h1 className="text-3xl font-bold text-[#6d6e6b] mb-2">Admin Login</h1>
              <p className="text-gray-600">Sign in to access the admin panel</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@jhustify.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-gradient-to-r from-[#6d6e6b] to-[#6B7280] hover:from-[#5A6774] hover:to-[#7A8289]"
                isLoading={loading}
                disabled={loading}
              >
                <LogIn className="mr-2" size={18} />
                Sign In to Admin Panel
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#D6D9DD]">
              <p className="text-sm text-center text-gray-600">
                Not an admin?{' '}
                <Link href="/login" className="text-[#6d6e6b] hover:underline font-medium">
                  Regular Login
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Security Notice:</strong> This page is restricted to administrators only. 
                Unauthorized access attempts may be logged.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

