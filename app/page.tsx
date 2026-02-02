'use client';

import React, { useState } from 'react';
import DigitBox from '../components/DigitBox';
import VisualDisplay from '../components/VisualDisplay';
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
          Magic Place Value!
        </h1>
        <p className="text-lg text-blue-800 font-semibold">Explore how big numbers are made!</p>
      </header>

      <main className="w-full flex flex-col gap-10">
        <section className="bg-white p-8 rounded-[3rem] card-shadow flex flex-col items-center gap-6 border-4 border-blue-50">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <DigitBox 
              type="thousands" 
              label="Thousands" 
              value={digits.thousands} 
              onChange={(v) => handleUpdateDigit('thousands', v)} 
            />
            <DigitBox 
              type="hundreds" 
              label="Hundreds" 
              value={digits.hundreds} 
              onChange={(v) => handleUpdateDigit('hundreds', v)} 
            />
            <DigitBox 
              type="tens" 
              label="Tens" 
              value={digits.tens} 
              onChange={(v) => handleUpdateDigit('tens', v)} 
            />
            <DigitBox 
              type="ones" 
              label="Ones" 
              value={digits.ones} 
              onChange={(v) => handleUpdateDigit('ones', v)} 
            />
          </div>

          <div className="mt-4 text-center">
            <div className="text-gray-400 font-kids text-xl mb-4">Your Total Number Is:</div>
            
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
          </div>
        </section>

        <section>
          <VisualDisplay digits={digits} />
        </section>
      </main>
    </div>
  );
}