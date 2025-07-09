
import React from 'react';
import { Star } from 'lucide-react';

interface UserRatingProps {
  rating: number;
  reviewCount: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserRating = ({ 
  rating, 
  reviewCount, 
  showCount = true, 
  size = 'md',
  className = '' 
}: UserRatingProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // Don't show rating if no rating or no reviews
  if (!rating || reviewCount === 0) {
    return (
      <div className={`${textSizes[size]} text-gray-500 ${className}`}>
        No reviews yet
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFullStar = starValue <= Math.floor(rating);
          const isHalfStar = starValue === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <Star 
              key={index}
              className={`${sizeClasses[size]} ${
                isFullStar 
                  ? 'text-yellow-400 fill-current' 
                  : isHalfStar 
                  ? 'text-yellow-400 fill-current opacity-50' 
                  : 'text-gray-300'
              }`}
            />
          );
        })}
      </div>
      <span className={`${textSizes[size]} text-gray-600 font-medium`}>
        {rating.toFixed(1)}
      </span>
      {showCount && (
        <span className={`${textSizes[size]} text-gray-500`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
