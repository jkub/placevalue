
import React, { useState, useEffect, useRef } from 'react';
import { DigitState } from '../types';

interface VisualDisplayProps {
  digits: DigitState;
}

const VisualDisplay: React.FC<VisualDisplayProps> = ({ digits }) => {
  const [displayDigits, setDisplayDigits] = useState<DigitState>(digits);
  const [mergingColumn, setMergingColumn] = useState<string | null>(null);
  const [splittingColumn, setSplittingColumn] = useState<string | null>(null);
  const prevDigitsRef = useRef<DigitState>(digits);

  useEffect(() => {
    const prev = prevDigitsRef.current;
    const currentTotal = (digits.thousands * 1000) + (digits.hundreds * 100) + (digits.tens * 10) + digits.ones;
    const prevTotal = (prev.thousands * 1000) + (prev.hundreds * 100) + (prev.tens * 10) + prev.ones;

    if (Math.abs(currentTotal - prevTotal) === 1) {
      handleStepTransition(prev, digits);
    } else {
      setDisplayDigits(digits);
    }
    
    prevDigitsRef.current = digits;
  }, [digits]);

  const handleStepTransition = async (oldVal: DigitState, newVal: DigitState) => {
    const isIncrement = ((newVal.thousands * 1000) + (newVal.hundreds * 100) + (newVal.tens * 10) + newVal.ones) > 
                        ((oldVal.thousands * 1000) + (oldVal.hundreds * 100) + (oldVal.tens * 10) + oldVal.ones);

    if (isIncrement) {
      let temp = { ...oldVal };
      temp.ones += 1;
      setDisplayDigits(temp);

      // Carry Logic
      if (temp.ones === 10) {
        await new Promise(r => setTimeout(r, 600));
        setMergingColumn('ones'); // All 10 ones will merge
        await new Promise(r => setTimeout(r, 500));
        temp.ones = 0;
        temp.tens += 1;
        setDisplayDigits({ ...temp });
        setMergingColumn(null);

        if (temp.tens === 10) {
          await new Promise(r => setTimeout(r, 600));
          setMergingColumn('tens');
          await new Promise(r => setTimeout(r, 500));
          temp.tens = 0;
          temp.hundreds += 1;
          setDisplayDigits({ ...temp });
          setMergingColumn(null);

          if (temp.hundreds === 10) {
            await new Promise(r => setTimeout(r, 600));
            setMergingColumn('hundreds');
            await new Promise(r => setTimeout(r, 500));
            temp.hundreds = 0;
            temp.thousands += 1;
            setDisplayDigits({ ...temp });
            setMergingColumn(null);
          }
        }
      }
    } else {
      // Borrow Logic
      let temp = { ...oldVal };
      if (temp.ones === 0) {
        if (temp.tens > 0) {
          setSplittingColumn('tens'); // Only the last ten will animate
          await new Promise(r => setTimeout(r, 500));
          temp.tens -= 1;
          temp.ones = 10;
          setDisplayDigits({ ...temp });
          setSplittingColumn(null);
        } else if (temp.hundreds > 0) {
          setSplittingColumn('hundreds');
          await new Promise(r => setTimeout(r, 500));
          temp.hundreds -= 1;
          temp.tens = 10;
          setDisplayDigits({ ...temp });
          setSplittingColumn(null);
          await new Promise(r => setTimeout(r, 400));
          setSplittingColumn('tens');
          await new Promise(r => setTimeout(r, 500));
          temp.tens -= 1;
          temp.ones = 10;
          setDisplayDigits({ ...temp });
          setSplittingColumn(null);
        }
      }
      await new Promise(r => setTimeout(r, 100));
      temp.ones = Math.max(0, temp.ones - 1);
      setDisplayDigits({ ...temp });
    }
  };

  const renderThousands = () => {
    return Array.from({ length: displayDigits.thousands }).map((_, i) => {
      const isLast = i === displayDigits.thousands - 1;
      const shouldAnimate = mergingColumn === 'thousands' || (splittingColumn === 'thousands' && isLast);
      
      return (
        <div key={`th-${i}`} className={`relative w-24 h-24 mb-8 mr-8 mt-6 block-unit ${shouldAnimate ? 'animate-collapse' : ''}`}>
          <div className="absolute w-full h-6 bg-indigo-400 border-[1px] border-indigo-800 -top-6 skew-x-[-45deg] origin-bottom grid grid-cols-10 grid-rows-10 gap-[1px] p-[1px]">
            {Array.from({ length: 100 }).map((_, j) => <div key={j} className="bg-indigo-200 opacity-40"></div>)}
          </div>
          <div className="absolute w-6 h-full bg-indigo-700 border-[1px] border-indigo-900 -right-6 skew-y-[-45deg] origin-left grid grid-cols-10 grid-rows-10 gap-[1px] p-[1px]">
            {Array.from({ length: 100 }).map((_, j) => <div key={j} className="bg-indigo-300 opacity-30"></div>)}
          </div>
          <div className="absolute inset-0 bg-indigo-500 border-[1px] border-indigo-800 z-10 grid grid-cols-10 grid-rows-10 gap-[1px] p-[1px]">
            {Array.from({ length: 100 }).map((_, j) => <div key={j} className="bg-indigo-300 opacity-60 rounded-[0.5px] app-countable"></div>)}
          </div>
        </div>
      );
    });
  };

  const renderHundreds = () => {
    return Array.from({ length: displayDigits.hundreds }).map((_, i) => {
      const isLast = i === displayDigits.hundreds - 1;
      const shouldAnimate = mergingColumn === 'hundreds' || (splittingColumn === 'hundreds' && isLast);
      
      return (
        <div key={`h-${i}`} className={`w-24 h-24 bg-emerald-500 border-2 border-emerald-700 rounded grid grid-cols-10 grid-rows-10 gap-[1px] p-[1px] shadow-md block-unit ${shouldAnimate ? 'animate-collapse' : ''}`}>
          {Array.from({ length: 100 }).map((_, j) => (
              <div key={j} className="bg-emerald-200 opacity-60 rounded-[0.5px] app-countable"></div>
          ))}
        </div>
      );
    });
  };

  const renderTens = () => {
    return (
      <div className="flex flex-col gap-2 items-center w-full">
        {Array.from({ length: displayDigits.tens }).map((_, i) => {
          const isLast = i === displayDigits.tens - 1;
          const shouldAnimate = mergingColumn === 'tens' || (splittingColumn === 'tens' && isLast);

          return (
            <div key={`t-${i}`} className={`w-full max-w-[180px] h-6 bg-amber-500 border-2 border-amber-700 rounded flex flex-row shadow-sm overflow-hidden block-unit ${shouldAnimate ? 'animate-collapse' : ''}`}>
               {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="flex-1 border-r border-amber-700 last:border-r-0 bg-amber-200 opacity-50 app-countable"></div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderOnes = () => {
    return (
      <div className="flex flex-col gap-1 items-center">
        {Array.from({ length: displayDigits.ones }).map((_, i) => {
          const isLast = i === displayDigits.ones - 1;
          const shouldAnimate = mergingColumn === 'ones' || (splittingColumn === 'ones' && isLast);

          return (
            <div key={`o-${i}`} className={`w-6 h-6 bg-rose-500 border-2 border-rose-700 rounded shadow-sm flex items-center justify-center block-unit ${shouldAnimate ? 'animate-collapse' : ''}`}>
              <div className="w-2 h-2 bg-rose-200 opacity-50 rounded-full app-countable"></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full p-8 bg-white rounded-[3rem] border-4 border-blue-100 shadow-inner min-h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center border-r-2 border-blue-50 last:border-0 px-4">
            <h3 className="font-kids text-indigo-700 mb-8 bg-indigo-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase">Thousands</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                {displayDigits.thousands > 0 ? renderThousands() : <span className="text-gray-300 italic text-sm mt-4">Zero Thousands</span>}
            </div>
        </div>
        <div className="flex flex-col items-center border-r-2 border-blue-50 last:border-0 px-4">
            <h3 className="font-kids text-emerald-700 mb-8 bg-emerald-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase">Hundreds</h3>
            <div className="flex flex-wrap gap-4 justify-center">
                {displayDigits.hundreds > 0 ? renderHundreds() : <span className="text-gray-300 italic text-sm mt-4">Zero Hundreds</span>}
            </div>
        </div>
        <div className="flex flex-col items-center border-r-2 border-blue-50 last:border-0 px-4">
            <h3 className="font-kids text-amber-700 mb-8 bg-amber-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase">Tens</h3>
            <div className="flex justify-center w-full">
                {displayDigits.tens > 0 ? renderTens() : <span className="text-gray-300 italic text-sm mt-4">Zero Tens</span>}
            </div>
        </div>
        <div className="flex flex-col items-center px-4">
            <h3 className="font-kids text-rose-700 mb-8 bg-rose-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase">Ones</h3>
            <div className="flex justify-center w-full">
                {displayDigits.ones > 0 ? renderOnes() : <span className="text-gray-300 italic text-sm mt-4">Zero Ones</span>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDisplay;
