
import React from 'react';
import { LIKERT_SCALE_OPTIONS } from '../constants';

interface LikertScaleInputProps {
  questionId: string;
  currentValue: number | undefined;
  onChange: (value: number) => void;
}

const LikertScaleInput: React.FC<LikertScaleInputProps> = ({ questionId, currentValue, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 my-4">
      {LIKERT_SCALE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${currentValue === option.value 
              ? 'bg-primary text-white shadow-lg scale-105' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          aria-pressed={currentValue === option.value}
          aria-label={option.label}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LikertScaleInput;
