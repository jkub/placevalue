import React, { useState } from 'react';
import { COLORS } from '../constants';
import { PlaceValue } from '../types';

interface DigitBoxProps {
  type: PlaceValue;
  value: number;
  label: string;
  onChange: (val: number) => void;
}

const DigitBox: React.FC<DigitBoxProps> = ({ type, value, label, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorSet = COLORS[type];

  const handleDigitSelect = (digit: number) => {
    onChange(digit);
    setIsOpen(false);
  };

  const placeValues: Record<string, number> = {
    thousands: 1000,
    hundreds: 100,
    tens: 10,
    ones: 1
  };

  const value_number = placeValues[type];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`font-kids text-lg uppercase tracking-widest ${colorSet.text} text-center`}>
        <div>{label}</div>
        <div className="text-sm font-bold">{value_number}</div>
      </div>
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
    </div>
  );
};

export default DigitBox;