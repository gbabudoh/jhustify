'use client';

import { Star } from 'lucide-react';

interface RatingDisplayProps {
  average: number;
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function RatingDisplay({
  average,
  count,
  size = 'md',
  showCount = true,
  className = '',
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const starSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const fullStars = Math.floor(average);
  const hasHalfStar = average % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={starSizes[size]}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star
              size={starSizes[size]}
              className="text-gray-300"
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star
                size={starSizes[size]}
                className="fill-yellow-400 text-yellow-400"
              />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={starSizes[size]}
            className="text-gray-300"
          />
        ))}
      </div>
      <span className={`${sizeClasses[size]} font-semibold text-gray-700`}>
        {average.toFixed(1)}
      </span>
      {showCount && count > 0 && (
        <span className={`${sizeClasses[size]} text-gray-500`}>
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
}

