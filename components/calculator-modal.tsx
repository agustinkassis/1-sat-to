'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowUpDown, X } from 'lucide-react';

import { PriceData, SUPPORTED_CURRENCIES } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BtcDigits } from '@/components/btc-digits';
import { Dollar } from '@/components/icon/dollar';
import { Bitcoin } from '@/components/icon/bitcoin';

interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  price: PriceData | null;
}

export function formatFiat(value: number, locale: string = 'es-ES'): string {
  return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CalculatorModal({ open, onOpenChange, price }: CalculatorModalProps) {
  const [satsOnTop, setSatsOnTop] = useState(false);
  const [satsValue, setSatsValue] = useState('');
  const [fiatValue, setFiatValue] = useState('');
  const satsInputRef = useRef<HTMLInputElement>(null);
  const fiatInputRef = useRef<HTMLInputElement>(null);

  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === price?.currency) || SUPPORTED_CURRENCIES[0];
  const satPrice = price?.satPrice || 0;
  const satsPerUnit = price?.satsPerUnit || 0;

  // Calculate conversions
  const satsNum = parseFloat(satsValue) || 0;
  const fiatNum = parseFloat(fiatValue) || 0;

  const fiatResult = satsOnTop ? satsNum * satPrice : fiatNum;
  const satsResult = satsOnTop ? satsNum : Math.round(fiatNum * satsPerUnit);

  const handleSwitch = useCallback(() => {
    setSatsOnTop((prev) => !prev);
    setSatsValue('');
    setFiatValue('');
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (satsOnTop) {
          satsInputRef.current?.focus();
        } else {
          fiatInputRef.current?.focus();
        }
      }, 100);
    }
  }, [open, satsOnTop]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm' showCloseButton={false}>
        <DialogHeader className='h-auto flex-row items-center justify-between'>
          <DialogTitle className='text-base font-semibold text-white'>Calculadora</DialogTitle>
          <DialogClose asChild>
            <Button variant='secondary' size='icon'>
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>

        <DialogBody className='gap-0'>
          {/* Top input area */}
          <div className='w-auto p-1 bg-black border border-border/60 rounded-2xl'>
            {satsOnTop ? (
              <div
                className='flex flex-col justify-center min-h-20 px-4 bg-radial-[at_25%_25%] from-neutral-600/20 to-neutral-100/20 to-75% border border-white/60 backdrop-blur-sm shadow-lg shadow-black rounded-xl cursor-text'
                onClick={() => satsInputRef.current?.focus()}
              >
                <div className='flex justify-between w-full text-sm'>
                  <p>Bitcoin</p>
                  <p className='text-muted-foreground'>(BTC)</p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-white'>
                    <Bitcoin className='size-6' />
                  </span>
                  <input
                    ref={satsInputRef}
                    type='number'
                    value={satsValue}
                    onChange={(e) => setSatsValue(e.target.value)}
                    className='absolute opacity-0 w-0 h-0'
                    min='0'
                    max='100000000'
                    autoFocus
                  />
                  <BtcDigits sats={satsNum} isActive />
                </div>
              </div>
            ) : (
              <div className='flex flex-col justify-center min-h-20 px-4 bg-radial-[at_25%_25%] from-neutral-600/20 to-neutral-100/20 to-75% border border-white/60 backdrop-blur-sm shadow-lg shadow-black rounded-xl cursor-text'>
                <div className='flex justify-between w-full text-sm'>
                  <p>{currency.name}</p>
                  <p className='text-muted-foreground'>({currency.code})</p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-white'>
                    <Dollar />
                  </span>
                  <input
                    ref={fiatInputRef}
                    type='number'
                    value={fiatValue}
                    onChange={(e) => setFiatValue(e.target.value)}
                    placeholder='0,00'
                    min='0'
                    max='100000000'
                    autoFocus
                    className='bg-transparent border-none outline-none text-white text-[28px] font-bold tabular-nums w-full caret-transparent placeholder:text-foreground/20'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Switch button */}
          <div className='relative z-10 flex justify-center -my-5'>
            <div className='p-1 bg-black rounded-full'>
              <Button variant='secondary' size='icon' onClick={handleSwitch}>
                <ArrowUpDown className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {/* Bottom output area */}
          <div className='w-auto p-1 bg-black border border-border/60 rounded-2xl'>
            {satsOnTop ? (
              <div className='flex flex-col justify-center min-h-20 px-4 backdrop-blur-sm shadow-lg shadow-black rounded-xl cursor-text'>
                <div className='flex justify-between w-full text-sm'>
                  <p>{currency.name}</p>
                  <p className='text-muted-foreground'>({currency.code})</p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-white'>
                    <Dollar />
                  </span>
                  <span
                    className={`text-[28px] font-bold tabular-nums ${fiatResult > 0 ? 'text-foreground' : 'text-foreground/20'}`}
                  >
                    {fiatResult > 0 ? `${formatFiat(fiatResult)}` : '0,00'}
                  </span>
                </div>
              </div>
            ) : (
              <div className='flex flex-col justify-center min-h-20 px-4 backdrop-blur-sm shadow-lg shadow-black rounded-xl cursor-text'>
                <div className='flex justify-between w-full text-sm'>
                  <p>Bitcoin</p>
                  <p className='text-muted-foreground'>(BTC)</p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-white'>
                    <Bitcoin className='size-6' />
                  </span>
                  <BtcDigits sats={satsResult} isActive={satsResult > 0} />
                </div>
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <div className='flex justify-between items-center w-full'>
            <p className='text-muted-foreground text-xs'>Tasa actual</p>
            <p className='text-foreground text-sm font-semibold'>
              1 <span className='text-muted-foreground'>BTC</span> = {currency.symbol}
              {formatFiat(satPrice * 100000000)} <span className='text-muted-foreground'>{currency.code}</span>
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
