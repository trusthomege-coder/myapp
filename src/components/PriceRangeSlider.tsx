import React, { useState, useCallback } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
  collapsed?: boolean;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1000,
  formatValue = (val) => `$${val.toLocaleString()}`,
  className = '',
  collapsed = false,
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  const getPercentage = useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const getValueFromPercentage = useCallback((percentage: number) => {
    const val = min + (percentage / 100) * (max - min);
    return Math.round(val / step) * step;
  }, [min, max, step]);

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const slider = document.getElementById('price-range-slider');
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValueFromPercentage(percentage);

    if (isDragging === 'min') {
      const newMin = Math.min(newValue, value[1] - step);
      onChange([Math.max(min, newMin), value[1]]);
    } else {
      const newMax = Math.max(newValue, value[0] + step);
      onChange([value[0], Math.min(max, newMax)]);
    }
  }, [isDragging, value, onChange, getValueFromPercentage, min, max, step]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className={`w-full ${className}`}>
      {collapsed ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-gray-700">
              {formatValue(value[0])} - {formatValue(value[1])}
            </span>
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
          <p className="text-xs text-gray-500">Select your budget range</p>
        </div>
      )}

      {/* Slider Track - показывается только если expanded */}
      {isExpanded && (
        <div className={`${collapsed ? 'mt-4' : ''}`}>
          <div className="relative mb-6">
        <div
          id="price-range-slider"
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        >
          {/* Active Range */}
          <div
            className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          {/* Min Handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-md hover:shadow-lg transition-all duration-200 ${
              isDragging === 'min' ? 'scale-110 cursor-grabbing' : ''
            }`}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown('min')}
          >
            <div className="absolute inset-1 bg-orange-500 rounded-full opacity-60" />
          </div>

          {/* Max Handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-md hover:shadow-lg transition-all duration-200 ${
              isDragging === 'max' ? 'scale-110 cursor-grabbing' : ''
            }`}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown('max')}
          >
            <div className="absolute inset-1 bg-orange-500 rounded-full opacity-60" />
          </div>
        </div>

        {/* Range Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Minimum</span>
          <span>Maximum</span>
        </div>
      </div>

          {/* Value Inputs */}
          <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Min Price
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatValue(value[0])}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Max Price
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatValue(value[1])}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
            />
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default PriceRangeSlider;