'use client';

import { useEffect, useState } from 'react';

import { Check, X } from 'lucide-react';

import type { PaymentStep } from '@/types';
import { Button } from '@/components/ui/button';
import { QRCodeDisplay } from './qr-code-display';
import { DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useLightning } from '@/context/lightning-context';
import { Satoshi } from '../icon/satoshi';

interface StepGenerateQRProps {
  onBack?: () => void;
  onNext?: () => void | undefined;
}

export function StepGenerateQR({ onBack, onNext }: StepGenerateQRProps) {
  const [copied, setCopied] = useState(false);

  const { invoice, amount, isPaid, error } = useLightning();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(invoice as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (isPaid || error) {
      onNext?.();
    }
  }, [isPaid, error]);

  return (
    <>
      <DialogHeader className='flex-row items-center justify-between'>
        <DialogTitle className='text-base font-semibold text-white'>Escanear y pagar</DialogTitle>
        <DialogClose asChild>
          <Button variant='secondary' size='icon'>
            <X />
          </Button>
        </DialogClose>
      </DialogHeader>

      {!error && (
        <>
          <DialogBody className='gap-2'>
            <QRCodeDisplay value={invoice as string} />
            <div className='inline-flex items-center gap-2 px-4 text-sm text-muted-foreground'>
              {invoice ? (
                <div className='flex items-center justify-between w-full'>
                  <div className='inline-flex items-center gap-2'>
                    <div className='size-2 bg-blue-500 rounded-full animate-pulse' />
                    <p>Esperando pago de...</p>
                  </div>
                  <div className='inline-flex items-center'>
                    <Satoshi className='size-4 text-foreground' />
                    <p className='text-foreground'>{amount.toLocaleString()}</p>
                    <p className='ml-1'>SAT</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className='size-2 bg-orange-500 rounded-full animate-pulse' />
                  <p>Generando invoice...</p>
                </>
              )}
            </div>
          </DialogBody>

          <DialogFooter>
            <Button className='flex-1' variant='secondary' onClick={onBack}>
              Volver
            </Button>
            <Button className='flex-1' variant='outline' onClick={handleCopy} disabled={!!copied || !invoice}>
              {copied ? <Check className='size-4' /> : <>Copiar</>}
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
}
