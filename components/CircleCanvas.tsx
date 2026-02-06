import React, { useEffect, useRef } from 'react';
import { DigitState } from '../types';

interface CircleCanvasProps {
  digits: DigitState;
}

const CircleCanvas: React.FC<CircleCanvasProps> = ({ digits }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = {
    thousands: '#6366f1', // indigo-500
    hundreds: '#10b981', // emerald-500
    tens: '#f59e0b',     // amber-500
    ones: '#f43f5e'      // rose-500
  };

  // Simple hash function to generate a seed from a string
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Seeded random number generator (Linear Congruential Generator)
  const SeededRandom = (seed: number) => {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas width to container width
    canvas.width = container.offsetWidth;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const circleRadius = 2.5;
    const padding = 10;

    // Draw circles for each place value with deterministic placement
    const drawCircles = (count: number, color: string, colorName: string) => {
      // Create a seeded random generator for this color
      const seed = hashString(colorName);
      const rand = SeededRandom(seed);

      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const x = padding + rand() * (canvas.width - padding * 2);
        const y = padding + rand() * (canvas.height - padding * 2);
        
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw in order: thousands, hundreds, tens, ones
    drawCircles(digits.thousands * 1000, colors.thousands, 'thousands');
    drawCircles(digits.hundreds * 100, colors.hundreds, 'hundreds');
    drawCircles(digits.tens * 10, colors.tens, 'tens');
    drawCircles(digits.ones, colors.ones, 'ones');
  }, [digits]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        height={250}
        className="w-full border-2 border-gray-200 rounded-xl bg-white block"
      />
    </div>
  );
};

export default CircleCanvas;
