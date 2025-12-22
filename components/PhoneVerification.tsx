'use client';

import { useState } from 'react';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface PhoneVerificationProps {
  phoneNumber: string;
  businessId?: string;
  onVerified?: () => void;
  className?: string;
}

export default function PhoneVerification({
  phoneNumber,
  businessId,
  onVerified,
  className = '',
}: PhoneVerificationProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    setSendingCode(true);
    setError('');
    setCodeSent(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to verify your phone number');
        return;
      }

      const response = await fetch('/api/verification/phone/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          businessId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send verification code');
        return;
      }

      setCodeSent(true);
      setCountdown(60); // 60 seconds countdown

      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // In development, show the code if returned
      if (data.code && process.env.NODE_ENV === 'development') {
        setError(`Development mode: Your code is ${data.code}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to verify your phone number');
        return;
      }

      const response = await fetch('/api/verification/phone/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          code,
          businessId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid verification code');
        return;
      }

      setSuccess(true);
      if (onVerified) {
        setTimeout(() => {
          onVerified();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className={`${className}`}>
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle2 size={24} className="text-green-600" />
          <div>
            <p className="font-semibold">Phone Number Verified</p>
            <p className="text-sm text-gray-600">{phoneNumber}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="text-[#465362]" size={20} />
          <h3 className="text-lg font-semibold text-[#465362]">Verify Phone Number</h3>
        </div>
        <p className="text-sm text-gray-600">
          We'll send a verification code to <span className="font-medium">{phoneNumber}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!codeSent ? (
        <Button
          onClick={handleSendCode}
          variant="primary"
          className="w-full"
          isLoading={sendingCode}
        >
          Send Verification Code
        </Button>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <Input
            label="Enter Verification Code"
            type="text"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
              setError('');
            }}
            placeholder="000000"
            maxLength={6}
            required
            className="text-center text-2xl tracking-widest font-mono"
          />

          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Didn't receive code?{' '}
              {countdown > 0 ? (
                <span className="text-gray-400">Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-[#465362] hover:underline font-medium"
                  disabled={sendingCode}
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
            disabled={code.length !== 6}
          >
            Verify Code
          </Button>
        </form>
      )}
    </Card>
  );
}

