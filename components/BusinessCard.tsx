'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, BadgeCheck, Sparkles, Briefcase, ArrowUpRight } from 'lucide-react';

interface BusinessCardProps {
  business: {
    _id?: string;
    id?: string;
    businessName: string;
    category: string;
    classification: 'REGISTERED' | 'UNREGISTERED';
    city?: string;
    country: string;
    averageRating?: number;
    ratingCount?: number;
    trustBadgeType?: 'INFORMAL' | 'FORMAL' | 'VERIFIED' | 'COMMUNITY_TRUSTED';
    businessRepresentativePhoto?: string;
    contactNumber?: string;
  };
  compact?: boolean;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const isFormal = business.classification === 'REGISTERED';
  const hasHighRating = (business.averageRating || 0) >= 4.5;
  const businessId = business._id || business.id;
  
  const showBlueBadge = isFormal || business.trustBadgeType === 'FORMAL' || business.trustBadgeType === 'VERIFIED';
  const showGreenBadge = !isFormal && (hasHighRating || business.trustBadgeType === 'COMMUNITY_TRUSTED');

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Card Content */}
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 ring-2 ring-gray-100 group-hover:ring-[#5BB318]/30 transition-all">
              <Image
                src={business.businessRepresentativePhoto || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                alt={business.businessName}
                fill
                className="object-cover rounded-full"
                sizes="56px"
              />
            </div>
            {/* Status Dot */}
            {(showBlueBadge || showGreenBadge) && (
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white ${showBlueBadge ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                {showBlueBadge ? (
                  <BadgeCheck size={12} className="text-white" />
                ) : (
                  <Sparkles size={10} className="text-white" />
                )}
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/business/${businessId}`}>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#5BB318] transition-colors line-clamp-1 mb-1">
                {business.businessName}
              </h3>
            </Link>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              {business.averageRating ? (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star size={12} fill="#f59e0b" className="text-amber-500" />
                  <span className="text-xs font-bold text-amber-700">
                    {business.averageRating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  New listing
                </span>
              )}
              
              {/* Trust Badge Text */}
              {showBlueBadge && (
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                  Verified
                </span>
              )}
              {showGreenBadge && (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                  Trusted
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
          <span className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-gray-400" />
            <span className="font-medium">{business.category}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span>{business.city ? `${business.city}, ` : ''}{business.country}</span>
          </span>
        </div>
        
        {/* CTA Button */}
        <Link href={`/business/${businessId}`}>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-[#5BB318] text-white rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer group/btn">
            <span>View Profile</span>
            <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}
