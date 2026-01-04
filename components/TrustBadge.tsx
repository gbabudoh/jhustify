'use client';

import { CheckCircle2, Building2, Store, ShieldCheck } from 'lucide-react';

interface TrustBadgeProps {
  type?: 'INFORMAL' | 'FORMAL' | 'VERIFIED' | 'COMMUNITY_TRUSTED';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TrustBadge({ type = 'INFORMAL', size = 'md', className = '' }: TrustBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const badgeConfig = {
    INFORMAL: {
      bg: 'bg-gray-100 text-gray-700 border border-gray-200',
      icon: Store,
      label: 'Informal',
      title: 'Informal Business - Not Registered',
    },
    FORMAL: {
      bg: 'bg-blue-600 text-white border border-blue-700 shadow-md',
      icon: Building2,
      label: 'VERIFIED FORMAL',
      title: 'Formal Business - Verified Registration',
    },
    COMMUNITY_TRUSTED: {
      bg: 'bg-[#5BB318] text-white border border-[#4da114] shadow-md',
      icon: CheckCircle2,
      label: 'COMMUNITY TRUSTED',
      title: 'Community Trusted Business - High Ratings & Proof of Presence',
    },
    VERIFIED: {
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-indigo-700 shadow-lg',
      icon: ShieldCheck,
      label: 'JHUSTIFY VERIFIED',
      title: 'Verified Business - Fully Verified by Jhustify',
    },
  };

  const config = badgeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${config.bg}
        ${sizeClasses[size]}
        ${className}
      `}
      title={config.title}
    >
      <IconComponent size={iconSizes[size]} className="fill-current" />
      <span>{config.label}</span>
    </div>
  );
}

