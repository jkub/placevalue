'use client';

import React, { useState } from 'react';
import VisualDisplay from '../components/VisualDisplay';
import CircleCanvas from '../components/CircleCanvas';
import { DigitState } from '../types';

export default function Home() {
  const [digits, setDigits] = useState<DigitState>({
    thousands: 1,
    hundreds: 2,
    tens: 3,
    ones: 4
  });

  const total = (digits.thousands * 1000) + (digits.hundreds * 100) + (digits.tens * 10) + digits.ones;

  const handleUpdateDigit = (place: keyof DigitState, val: number) => {
    setDigits(prev => ({ ...prev, [place]: val }));
  };

  const updateFromTotal = (newTotal: number) => {
    const capped = Math.max(0, Math.min(9999, newTotal));
    setDigits({
      thousands: Math.floor(capped / 1000) % 10,
      hundreds: Math.floor(capped / 100) % 10,
      tens: Math.floor(capped / 10) % 10,
      ones: capped % 10
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-kids text-blue-600 drop-shadow-sm mb-2">
          Place Value!
        </h1>
        <p className="text-lg text-blue-800 font-semibold">Explore how big numbers are made!</p>
      </header>

      <main className="w-full flex flex-col gap-10">
        <section className="flex flex-col items-center">
          <div className="text-gray-400 font-kids text-xl">Your Total Number Is:</div>
          
          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => updateFromTotal(total - 1)}
              disabled={total <= 0}
              className="w-16 h-16 rounded-full bg-blue-100 border-b-4 border-blue-300 text-blue-600 text-3xl flex items-center justify-center hover:bg-blue-200 active:translate-y-1 active:border-b-0 transition-all pop-animation disabled:opacity-30 disabled:cursor-not-allowed"
              title="Minus One"
            >
              <i className="fas fa-minus"></i>
            </button>

            <div className="text-7xl font-kids text-gray-800 tracking-widest bg-gray-50 px-10 py-4 rounded-3xl border-2 border-dashed border-gray-200 min-w-[240px]">
                {total.toLocaleString()}
            </div>

            <button 
              onClick={() => updateFromTotal(total + 1)}
              disabled={total >= 9999}
              className="w-16 h-16 rounded-full bg-blue-100 border-b-4 border-blue-300 text-blue-600 text-3xl flex items-center justify-center hover:bg-blue-200 active:translate-y-1 active:border-b-0 transition-all pop-animation disabled:opacity-30 disabled:cursor-not-allowed"
              title="Plus One"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <CircleCanvas digits={digits} />
        </section>

        <section>
          <VisualDisplay 
            digits={digits} 
            onUpdateDigit={handleUpdateDigit}
          />
        </section>
      </main>
    </div>
  );
}