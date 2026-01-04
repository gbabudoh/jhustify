'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Shield, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'ADMIN') {
            router.push('/admin');
          }
        } catch (e) {
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

      // Check if user is admin
      if (data.user?.role !== 'ADMIN') {
        setError('Access denied. Admin privileges required.');
        // Clear any stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('auth-change'));

      // Redirect to admin dashboard
      const redirect = searchParams.get('redirect') || '/admin';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-center">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#465362] mb-4 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Admin
            </Link>
          </div>

          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#465362] to-[#6B7280] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-[#465362] mb-2">Admin Login</h1>
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
                className="w-full bg-gradient-to-r from-[#465362] to-[#6B7280] hover:from-[#5A6774] hover:to-[#7A8289]"
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
                <Link href="/login" className="text-[#465362] hover:underline font-medium">
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

