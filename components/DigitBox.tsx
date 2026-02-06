import React, { useState } from 'react';
import { COLORS } from '../constants';
import { PlaceValue } from '../types';

interface DigitBoxProps {
  type: PlaceValue;
  value: number;
  label: string;
  onChange: (val: number) => void;
  total?: number;
  onCarry?: () => void;
  onBorrow?: () => void;
}

const DigitBox: React.FC<DigitBoxProps> = ({ type, value, label, onChange, total = 0, onCarry, onBorrow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorSet = COLORS[type];

  const handleDigitSelect = (digit: number) => {
    onChange(digit);
    setIsOpen(false);
  };

  const carryThresholds: Record<PlaceValue, number> = {
    ones: 9999,
    tens: 9990,
    hundreds: 9900,
    thousands: 9000
  };

  const borrowThresholds: Record<PlaceValue, number> = {
    ones: 0,
    tens: 9,
    hundreds: 99,
    thousands: 999
  };

  const handleIncrement = () => {
    if (value < 9) {
      onChange(value + 1);
    } else if (value === 9 && onCarry && total < carryThresholds[type]) {
      onChange(0);
      onCarry();
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    } else if (value === 0 && onBorrow && total > borrowThresholds[type]) {
      onChange(9);
      onBorrow();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${colorSet.bg} ${colorSet.border} ${colorSet.hover} border-b-8 text-white w-24 h-32 rounded-2xl flex items-center justify-center text-6xl font-kids pop-animation relative z-10`}
        >
          {value}
        </button>

        {isOpen && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-3 shadow-2xl z-20 border-4 border-gray-100 grid grid-cols-5 gap-2 w-64 animate-pop-in">
            {[...Array(10).keys()].map((n) => (
              <button
                key={n}
                onClick={() => handleDigitSelect(n)}
                className={`w-10 h-10 rounded-lg font-kids text-xl flex items-center justify-center transition-colors ${value === n ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button 
          onClick={handleDecrement}
          disabled={value <= 0 && (!onBorrow || total <= borrowThresholds[type])}
          className="w-12 h-12 rounded-full bg-gray-100 border-b-4 border-gray-300 text-gray-600 text-xl flex items-center justify-center hover:bg-gray-200 active:translate-y-1 active:border-b-0 transition-all pop-animation disabled:opacity-30 disabled:cursor-not-allowed"
          title="Minus One"
        >
          <i className="fas fa-minus"></i>
        </button>

        <button 
          onClick={handleIncrement}
          disabled={value >= 9 && (!onCarry || total >= carryThresholds[type])}
          className="w-12 h-12 rounded-full bg-gray-100 border-b-4 border-gray-300 text-gray-600 text-xl flex items-center justify-center hover:bg-gray-200 active:translate-y-1 active:border-b-0 transition-all pop-animation disabled:opacity-30 disabled:cursor-not-allowed"
          title="Plus One"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default DigitBox;