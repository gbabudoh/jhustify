'use client';

import { CheckCircle2, Building2, Store, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustBadgeProps {
  type?: 'INFORMAL' | 'FORMAL' | 'VERIFIED' | 'COMMUNITY_TRUSTED' | 'JHUSTIFIED';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TrustBadge({ type = 'INFORMAL', size = 'md', className = '' }: TrustBadgeProps) {
  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
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
      label: 'Not Registered',
      title: 'Informal Business - Not Registered',
      usePremiumGlow: false,
    },
    FORMAL: {
      bg: 'bg-blue-600 text-white border border-blue-700 shadow-md',
      icon: Building2,
      label: 'VERIFIED FORMAL',
      title: 'Formal Business - Verified Registration',
      usePremiumGlow: false,
    },
    COMMUNITY_TRUSTED: {
      bg: 'bg-[#a8d59d] text-white border border-[#4da114] shadow-md',
      icon: CheckCircle2,
      label: 'COMMUNITY TRUSTED',
      title: 'Community Trusted Business - High Ratings & Proof of Presence',
      usePremiumGlow: false,
      glowColor: '',
    },
    VERIFIED: {
      bg: 'bg-gradient-to-r from-[#a8d59d] via-[#8fc982] to-[#76bc68] text-white border-2 border-[#f8f9fa] shadow-[0_0_15px_rgba(143,201,130,0.6)]',
      icon: ShieldCheck,
      label: 'JHUSTIFY VERIFIED',
      title: 'Verified Business - Fully Verified by Jhustify',
      usePremiumGlow: true,
      glowColor: 'bg-white/40',
    },
    JHUSTIFIED: {
      bg: 'bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#1D4ED8] text-white border-2 border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      icon: ShieldCheck,
      label: 'JHUSTIFIED',
      title: 'Jhustified Pro - Premium Business Status',
      usePremiumGlow: true,
      glowColor: 'bg-blue-400/50',
    },
  } as Record<string, { bg: string; icon: React.ElementType; label: string; title: string; usePremiumGlow: boolean; glowColor?: string }>;

  const config = badgeConfig[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-black cursor-pointer transition-all duration-300
        ${config.bg}
        ${sizeClasses[size]}
        ${className}
        uppercase tracking-widest
      `}
      title={config.title}
    >
      <div className="relative flex items-center justify-center">
        {config.usePremiumGlow && (
          <div className={`absolute inset-0 ${config.glowColor || 'bg-white/40'} blur-md rounded-full animate-pulse`}></div>
        )}
        <IconComponent size={iconSizes[size]} className="relative z-10 fill-current drop-shadow-sm" />
      </div>
      <span className="relative z-10 drop-shadow-sm tracking-wide">{config.label}</span>
    </motion.div>
  );
}

