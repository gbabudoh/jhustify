'use client';

import { CheckCircle2 } from 'lucide-react';

interface TrustBadgeProps {
  type?: 'BASIC' | 'GOLD';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TrustBadge({ type = 'BASIC', size = 'md', className = '' }: TrustBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const isGold = type === 'GOLD';

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${isGold ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-300' : 'bg-[#C2EABD] text-[#465362]'}
        ${sizeClasses[size]}
        ${className}
      `}
      title={isGold ? 'Premium Verified - Gold Badge' : 'Jhustify Verified - Basic Badge'}
    >
      <CheckCircle2 size={iconSizes[size]} className="fill-current" />
      <span>{isGold ? 'Premium Verified' : 'Jhustify Verified'}</span>
    </div>
  );
}

