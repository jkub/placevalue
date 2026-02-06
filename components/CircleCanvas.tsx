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

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const squareSize = 4;
    const gap = 1;
    const cellSize = squareSize + gap; // total space per square
    const maxSquares = 10000;

    // Set canvas width to container width
    const canvasWidth = container.offsetWidth;
    const columnsWide = Math.floor(canvasWidth / cellSize);
    const rowsNeeded = Math.ceil(maxSquares / columnsWide);
    const canvasHeight = rowsNeeded * cellSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate total squares to fill
    const total = (digits.thousands * 1000) + (digits.hundreds * 100) + (digits.tens * 10) + digits.ones;

    // Draw grid of squares, filling columns left to right, top to bottom within each column
    let squareIndex = 0;
    for (let col = 0; col < columnsWide; col++) {
      for (let row = 0; row < rowsNeeded; row++) {
        if (squareIndex >= total) break;

        const x = col * cellSize;
        const y = row * cellSize;

        // Determine color based on which range this square falls in
        let color = '#e5e7eb'; // gray for empty

        const thousandsCount = digits.thousands * 1000;
        const hundredsStart = thousandsCount;
        const tensStart = hundredsStart + (digits.hundreds * 100);
        const onesStart = tensStart + (digits.tens * 10);

        if (squareIndex < thousandsCount) {
          color = colors.thousands;
        } else if (squareIndex < hundredsStart + (digits.hundreds * 100)) {
          color = colors.hundreds;
        } else if (squareIndex < tensStart + (digits.tens * 10)) {
          color = colors.tens;
        } else if (squareIndex < onesStart + digits.ones) {
          color = colors.ones;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, squareSize, squareSize);

        squareIndex++;
      }
      if (squareIndex >= total) break;
    }
  }, [digits]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full border-2 border-gray-200 rounded-xl bg-gray-50 block"
      />
    </div>
  );
};

export default CircleCanvas;
