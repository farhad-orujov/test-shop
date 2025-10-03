'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface ColorOption {
  id: string;
  value: string;
  color: string; // CSS color value (hex, rgb, etc.)
}

interface ColorPickerProps {
  title: string;
  colors?: ColorOption[]; // Optional custom colors
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

// Default 6 colors - you can customize these
const defaultColors: ColorOption[] = [
  { id: 'color-1', value: 'red', color: '#EF4444' },
  { id: 'color-2', value: 'blue', color: '#3B82F6' },
  { id: 'color-3', value: 'green', color: '#10B981' },
  { id: 'color-4', value: 'yellow', color: '#F59E0B' },
  { id: 'color-5', value: 'purple', color: '#8B5CF6' },
  { id: 'color-6', value: 'pink', color: '#EC4899' }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  title,
  colors = defaultColors,
  selectedValue,
  onChange,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleColorChange = (value: string) => {
    onChange(value);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={clsx('w-full', className)}>
      {/* Title with toggle functionality */}
      <button
        onClick={toggleExpanded}
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

      {/* Collapsible color squares container */}
      <div className={clsx(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="p-4">
          <div className="flex gap-3 flex-wrap">
            {colors.map((colorOption) => (
              <button
                key={colorOption.id}
                type="button"
                onClick={() => handleColorChange(colorOption.value)}
                className={clsx(
                  'w-7 h-7 rounded-lg border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  selectedValue === colorOption.value 
                    ? 'border-gray-800 ring-2 scale-110' 
                    : 'border-gray-300 hover:border-gray-400',
                  'shadow-sm hover:shadow-md'
                )}
                style={{ backgroundColor: colorOption.color }}
                aria-label={`Select color ${colorOption.value}`}
                title={colorOption.value}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;