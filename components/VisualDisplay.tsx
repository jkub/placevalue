
import React, { useState, useEffect, useRef } from 'react';
import { DigitState, PlaceValue } from '../types';
import DigitBox from './DigitBox';

interface VisualDisplayProps {
  digits: DigitState;
  onUpdateDigit?: (place: keyof DigitState, val: number) => void;
}

const VisualDisplay: React.FC<VisualDisplayProps> = ({ digits, onUpdateDigit }) => {
  const [displayDigits, setDisplayDigits] = useState<DigitState>(digits);
  const [mergingColumn, setMergingColumn] = useState<string | null>(null);
  const [splittingColumn, setSplittingColumn] = useState<string | null>(null);
  const prevDigitsRef = useRef<DigitState>(digits);
  const total = (digits.thousands * 1000) + (digits.hundreds * 100) + (digits.tens * 10) + digits.ones;
  const isAnimatingRef = useRef<boolean>(false);

  useEffect(() => {
    const prev = prevDigitsRef.current;
    const currentTotal = (digits.thousands * 1000) + (digits.hundreds * 100) + (digits.tens * 10) + digits.ones;
    const prevTotal = (prev.thousands * 1000) + (prev.hundreds * 100) + (prev.tens * 10) + prev.ones;
    const displayTotal = (displayDigits.thousands * 1000) + (displayDigits.hundreds * 100) + (displayDigits.tens * 10) + displayDigits.ones;

    // If there's a large jump (multiple clicks during animation), sync display and handle the transition
    if (Math.abs(currentTotal - displayTotal) > 1) {
      setDisplayDigits(digits);
      prevDigitsRef.current = digits;
      isAnimatingRef.current = false;
    } else if (Math.abs(currentTotal - prevTotal) === 1 && !isAnimatingRef.current) {
      handleStepTransition(prev, digits);
      prevDigitsRef.current = digits;
    } else if (Math.abs(currentTotal - prevTotal) !== 1) {
      setDisplayDigits(digits);
      prevDigitsRef.current = digits;
      isAnimatingRef.current = false;
    }
  }, [digits, displayDigits]);

  const handleStepTransition = async (oldVal: DigitState, newVal: DigitState) => {
    isAnimatingRef.current = true;
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
    
    isAnimatingRef.current = false;
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

  const handleCarry = (place: keyof DigitState, accumulatedDigits?: Partial<DigitState>) => {
    if (!onUpdateDigit) return;
    
    const carryChain: Record<PlaceValue, PlaceValue | null> = {
      ones: 'tens',
      tens: 'hundreds',
      hundreds: 'thousands',
      thousands: null
    };
    
    // Use accumulated changes if provided, otherwise use current state
    const currentValue = accumulatedDigits?.[place] ?? digits[place];
    const newValue = currentValue + 1;
    
    if (newValue === 10) {
      // Need to carry further
      const nextPlace = carryChain[place];
      if (nextPlace) {
        const nextAccumulated = {
          ...accumulatedDigits,
          [place]: 0,
        };
        handleCarry(nextPlace, nextAccumulated);
        return;
      }
    }
    
    // Apply all accumulated changes
    const finalChanges: Partial<DigitState> = accumulatedDigits || {};
    finalChanges[place] = newValue;
    
    (Object.keys(finalChanges) as Array<keyof DigitState>).forEach(key => {
      if (finalChanges[key] !== digits[key]) {
        onUpdateDigit(key, finalChanges[key]!);
      }
    });
  };

  const handleBorrow = (place: keyof DigitState, accumulatedDigits?: Partial<DigitState>) => {
    if (!onUpdateDigit) return;
    
    const borrowChain: Record<PlaceValue, PlaceValue | null> = {
      ones: 'tens',
      tens: 'hundreds',
      hundreds: 'thousands',
      thousands: null
    };
    
    // Use accumulated changes if provided, otherwise use current state
    const currentNextValue = accumulatedDigits?.[place] ?? digits[place];
    const newNextValue = currentNextValue - 1;
    
    if (newNextValue < 0 && place !== 'thousands') {
      // Need to borrow further from the next level up
      const borrowFrom = borrowChain[place];
      if (borrowFrom) {
        const nextAccumulated = {
          ...accumulatedDigits,
          [place]: 9,
        };
        handleBorrow(borrowFrom, nextAccumulated);
        return;
      }
    }
    
    // Apply all accumulated changes
    const finalChanges: Partial<DigitState> = accumulatedDigits || {};
    finalChanges[place] = newNextValue;
    
    (Object.keys(finalChanges) as Array<keyof DigitState>).forEach(key => {
      if (finalChanges[key] !== digits[key]) {
        onUpdateDigit(key, finalChanges[key]!);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full p-8 bg-white rounded-[3rem] border-4 border-blue-100 shadow-inner min-h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center border-r-2 border-blue-50 last:border-0 px-4 gap-6">
            {onUpdateDigit && (
              <DigitBox 
                type="thousands" 
                label="Thousands" 
                value={digits.thousands}
                total={total}
                onCarry={undefined}
                onBorrow={undefined}
                onChange={(v) => onUpdateDigit('thousands', v)} 
              />
            )}
            <h3 className="font-kids text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase text-center">
              <div>Thousands</div>
              <div className="text-xs font-bold">1000</div>
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                {digits.thousands > 0 ? renderThousands() : <span className="text-gray-300 italic text-sm mt-4">Zero Thousands</span>}
            </div>
        </div>
        <div className="flex flex-col items-center border-r-2 border-blue-50 last:border-0 px-4 gap-6">
            {onUpdateDigit && (
              <DigitBox 
                type="hundreds" 
                label="Hundreds" 
                value={digits.hundreds}
                total={total}
                onCarry={() => handleCarry('thousands')}
                onBorrow={() => handleBorrow('thousands')}
                onChange={(v) => onUpdateDigit('hundreds', v)} 
              />
            )}
            <h3 className="font-kids text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase text-center">
              <div>Hundreds</div>
              <div className="text-xs font-bold">100</div>
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
                {digits.hundreds > 0 ? renderHundreds() : <span className="text-gray-300 italic text-sm mt-4">Zero Hundreds</span>}
            </div>
        </div>
        <div className="flex flex-col items-center border-r-2 border-blue-50 last:border-0 px-4 gap-6">
            {onUpdateDigit && (
              <DigitBox 
                type="tens" 
                label="Tens" 
                value={digits.tens}
                total={total}
                onCarry={() => handleCarry('hundreds')}
                onBorrow={() => handleBorrow('hundreds')}
                onChange={(v) => onUpdateDigit('tens', v)} 
              />
            )}
            <h3 className="font-kids text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase text-center">
              <div>Tens</div>
              <div className="text-xs font-bold">10</div>
            </h3>
            <div className="flex justify-center w-full">
                {digits.tens > 0 ? renderTens() : <span className="text-gray-300 italic text-sm mt-4">Zero Tens</span>}
            </div>
        </div>
        <div className="flex flex-col items-center px-4 gap-6">
            {onUpdateDigit && (
              <DigitBox 
                type="ones" 
                label="Ones" 
                value={digits.ones}
                total={total}
                onCarry={() => handleCarry('tens')}
                onBorrow={() => handleBorrow('tens')}
                onChange={(v) => onUpdateDigit('ones', v)} 
              />
            )}
            <h3 className="font-kids text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full text-sm tracking-wider uppercase text-center">
              <div>Ones</div>
              <div className="text-xs font-bold">1</div>
            </h3>
            <div className="flex justify-center w-full">
                {digits.ones > 0 ? renderOnes() : <span className="text-gray-300 italic text-sm mt-4">Zero Ones</span>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDisplay;
