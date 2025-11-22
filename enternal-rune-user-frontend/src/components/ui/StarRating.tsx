import React from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'

interface StarRatingProps {
  rating: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  onHover?: (rating: number) => void
  onLeave?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  interactive = false,
  onRatingChange,
  onHover,
  onLeave,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg', 
    lg: 'text-xl'
  }

  return (
    <div className={`flex gap-1 ${interactive ? 'cursor-pointer' : ''} ${className}`}>
      {[1, 2, 3, 4, 5].map(star => {
        const isFilled = star <= rating
        return (
          <span
            key={star}
            className={`${sizeClasses[size]} ${interactive ? 'hover:scale-110 transition-transform' : ''} ${
              isFilled ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && onHover && onHover(star)}
            onMouseLeave={() => interactive && onLeave && onLeave()}
          >
            {isFilled ? <FaStar /> : <FaRegStar />}
          </span>
        )
      })}
    </div>
  )
}