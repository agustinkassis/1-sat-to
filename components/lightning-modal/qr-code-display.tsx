'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LoaderCircle } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 280 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className='w-auto p-2 bg-black border border-border/60 rounded-2xl'>
      <div className='flex items-center justify-center py-8 md:py-12 px-4 border bg-radial-[at_25%_25%] from-neutral-900 to-white to-75% backdrop-blur-sm shadow-lg shadow-black rounded-xl'>
        {value ? (
          <QRCodeSVG size={220} value={value.toUpperCase()} />
        ) : (
          <div className='relative flex justify-center items-center w-55 h-55'>
            <LoaderCircle className='size-4 animate-spin text-black' />
          </div>
        )}
      </div>
    </div>
  );
}
