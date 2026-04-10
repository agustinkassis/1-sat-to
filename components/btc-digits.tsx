'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';

interface BtcDigitsProps {
  sats: number;
  isActive?: boolean;
}

export function BtcDigits({ sats, isActive = true }: BtcDigitsProps) {
  const digits = useMemo(() => {
    const satsInt = Math.max(0, Math.floor(sats || 0));
    const btcStr = (satsInt / 100_000_000).toFixed(8);
    const [intPart, decPart] = btcStr.split('.');

    const fullDigits = intPart + decPart;
    let firstNonZero = -1;
    for (let i = 0; i < fullDigits.length; i++) {
      if (fullDigits[i] !== '0') {
        firstNonZero = i;
        break;
      }
    }

    const getDigitClass = (globalIdx: number) => {
      if (firstNonZero === -1) return 'text-foreground/20';
      return globalIdx >= firstNonZero ? 'text-foreground' : 'text-foreground/20';
    };

    const getSepClass = () => {
      if (firstNonZero !== -1 && firstNonZero < intPart.length) return 'text-foreground';
      return 'text-foreground/20';
    };

    return { intPart, decPart, getDigitClass, getSepClass, intLen: intPart.length };
  }, [sats]);

  return (
    <div className='flex items-baseline gap-0 text-[28px] font-bold tabular-nums tracking-tight'>
      {/* Integer part */}
      {digits.intPart.split('').map((d, i) => (
        <span key={`int-${i}`} className={cn(digits.getDigitClass(i), !isActive && 'text-foreground/20')}>
          {d}
        </span>
      ))}

      {/* Comma separator */}
      <span className={cn('mx-px', digits.getSepClass(), !isActive && 'text-foreground/20')}>,</span>

      {/* Decimal group 1: d1 d2 */}
      {digits.decPart
        .slice(0, 2)
        .split('')
        .map((d, i) => (
          <span
            key={`dec1-${i}`}
            className={cn(digits.getDigitClass(digits.intLen + i), !isActive && 'text-foreground/20')}
          >
            {d}
          </span>
        ))}

      {/* Space */}
      <span className='w-2' />

      {/* Decimal group 2: d3 d4 d5 */}
      {digits.decPart
        .slice(2, 5)
        .split('')
        .map((d, i) => (
          <span
            key={`dec2-${i}`}
            className={cn(digits.getDigitClass(digits.intLen + 2 + i), !isActive && 'text-foreground/20')}
          >
            {d}
          </span>
        ))}

      {/* Space */}
      <span className='w-2' />

      {/* Decimal group 3: d6 d7 d8 */}
      {digits.decPart
        .slice(5, 8)
        .split('')
        .map((d, i) => (
          <span
            key={`dec3-${i}`}
            className={cn(digits.getDigitClass(digits.intLen + 5 + i), !isActive && 'text-foreground/20')}
          >
            {d}
          </span>
        ))}
    </div>
  );
}
