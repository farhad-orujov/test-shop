'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface PriceRangeProps {
  title: string;
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  className?: string;
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  title,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={clsx('w-full', className)}>
      {/* Title with toggle functionality */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <svg
          className={clsx(
            'w-5 h-5 text-gray-600 transition-transform duration-200',
            isExpanded ? 'rotate-180' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible options container */}
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
                Min Price
              </label>
              <input
                type="number"
                id="min-price"
                value={minPrice}
                onChange={(e) => onMinChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div className="relative flex-1">
              <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
                Max Price
              </label>
              <input
                type="number"
                id="max-price"
                value={maxPrice}
                onChange={(e) => onMaxChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;