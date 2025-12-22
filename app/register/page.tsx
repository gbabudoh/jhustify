'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordStrength from '@/components/ui/PasswordStrength';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'BUSINESS_OWNER' as 'BUSINESS_OWNER' | 'CONSUMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check for role in URL params
    const roleParam = searchParams?.get('role');
    if (roleParam === 'CONSUMER') {
      setFormData(prev => ({ ...prev, role: 'CONSUMER' }));
    }
  }, [searchParams]);
  
  const redirect = searchParams?.get('redirect') || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('auth-change'));
      }

      // Redirect based on redirect parameter, role, or default
      if (redirect) {
        router.push(redirect);
      } else if (formData.role === 'CONSUMER') {
        router.push('/');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <h1 className="text-3xl font-bold text-[#465362] mb-2">Create Account</h1>
            <p className="text-gray-600 mb-6">Join Jhustify and start building trust</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'BUSINESS_OWNER' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.role === 'BUSINESS_OWNER'
                        ? 'border-[#465362] bg-[#C2EABD] bg-opacity-20'
                        : 'border-[#D6D9DD] hover:border-[#465362]'
                    }`}
                  >
                    <div className="font-semibold text-[#465362]">For Business</div>
                    <div className="text-xs text-gray-600 mt-1">List & verify your business</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'CONSUMER' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.role === 'CONSUMER'
                        ? 'border-[#465362] bg-[#C2EABD] bg-opacity-20'
                        : 'border-[#D6D9DD] hover:border-[#465362]'
                    }`}
                  >
                    <div className="font-semibold text-[#465362]">For Consumer</div>
                    <div className="text-xs text-gray-600 mt-1">Contact verified businesses</div>
                  </button>
                </div>
              </div>
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
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
                <PasswordStrength password={formData.password} />
              </div>
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#465362] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

