
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // Rating out of 100
  className?: string;
  totalStars?: number;
}

export function StarRating({ rating, className, totalStars = 5 }: StarRatingProps) {
  const starPercentage = (rating / 100) * totalStars;
  const fullStars = Math.floor(starPercentage);
  const hasHalfStar = starPercentage - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5 text-yellow-500", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="h-5 w-5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-current" />
      ))}
    </div>
  );
}
