'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface RadioOneProps {
  title: string;
  options: RadioOption[];
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioOne: React.FC<RadioOneProps> = ({
  title,
  options,
  name,
  selectedValue,
  onChange,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRadioChange = (value: string) => {
    if (selectedValue === value) {
      onChange('');
    } else {
      onChange(value);
    }
  };

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
      <div className={clsx(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="pt-3 space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <input
                type="radio"
                name={name}
                id={option.id}
                value={option.value}
                checked={selectedValue === option.value}
                onClick={() => handleRadioChange(option.value)}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadioOne;