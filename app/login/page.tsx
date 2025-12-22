'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const redirect = searchParams?.get('redirect') || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('auth-change'));
      }

      toast.success('Welcome back! Redirecting...', 2000);

      // Small delay to show toast before redirect
      setTimeout(() => {
        // Redirect based on user role or redirect parameter
        if (redirect) {
          router.push(redirect);
        } else if (data.user?.role === 'CONSUMER') {
          router.push('/');
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } catch (error) {
      const errorMsg = 'An error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <h1 className="text-3xl font-bold text-[#465362] mb-2">Welcome Back</h1>
            <p className="text-gray-600 mb-6">Sign in to your Jhustify account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <div className="text-right mt-2">
                  <Link href="/forgot-password" className="text-sm text-[#465362] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#465362] font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

