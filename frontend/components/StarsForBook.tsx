import type { FC } from 'react'
import { Star } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";
import type { StarsForBookProps } from '@/app/interfaces';

const StarsForBook: FC<StarsForBookProps> = ({ rating, onClick }) => {
  const roundedRating = Math.round(rating)

  return (
    <div className='grid grid-cols-5' onClick={onClick}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          className={index + 1 <= roundedRating ? 'text-star' : ''}
          fill={index + 1 <= roundedRating ? '#E87400' : '#FFF'}
          key={uuidv4()}
        />
      ))}
    </div>
  )
}

export default StarsForBook;
