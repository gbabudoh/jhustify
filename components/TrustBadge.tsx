'use client';

import { CheckCircle2, Building2, Store } from 'lucide-react';

interface TrustBadgeProps {
  type?: 'INFORMAL' | 'FORMAL' | 'VERIFIED';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TrustBadge({ type = 'INFORMAL', size = 'md', className = '' }: TrustBadgeProps) {
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

  const badgeConfig = {
    INFORMAL: {
      bg: 'bg-blue-100 text-blue-800 border border-blue-300',
      icon: Store,
      label: 'Informal',
      title: 'Informal Business - Unregistered',
    },
    FORMAL: {
      bg: 'bg-green-100 text-green-800 border border-green-300',
      icon: Building2,
      label: 'Formal',
      title: 'Formal Business - Registered',
    },
    VERIFIED: {
      bg: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-300',
      icon: CheckCircle2,
      label: 'Verified',
      title: 'Verified Business - Fully Verified',
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

