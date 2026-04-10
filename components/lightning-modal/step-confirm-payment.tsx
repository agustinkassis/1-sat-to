'use client';

import { LoaderCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { LightningPlan } from '@/types';
import { DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { CurrencySelector } from '../currency-selector';
import { useState } from 'react';

interface StepConfirmPaymentProps {
  plan: LightningPlan;
  onConfirm: (currency: string) => void;
  onBack: () => void;
  isGenerating?: boolean;
  currency: string;
}

export function StepConfirmPayment({ plan, onConfirm, onBack, isGenerating, currency }: StepConfirmPaymentProps) {
  const [currentCurrency, setCurrentCurrency] = useState<string>(currency);

  const networkFee = Math.ceil(plan.price * 0.015); // 1.5% fee
  const total = plan.price;

  return (
    <>
      <DialogHeader className='flex-row items-center justify-between'>
        <DialogTitle className='text-base font-semibold text-white'>Revisar pago</DialogTitle>
        <DialogClose asChild>
          <Button variant='secondary' size='icon'>
            <X />
          </Button>
        </DialogClose>
      </DialogHeader>
      <DialogBody>
        <div className='space-y-4'>
          <div className='flex items-center justify-between text-foreground'>
            <p>Moneda</p>
            <div className='flex items-center gap-2'>
              <CurrencySelector currentCurrency={currentCurrency} onCurrencyChange={setCurrentCurrency} />
            </div>
          </div>
          <div className='flex items-center justify-between text-foreground'>
            <p>Total</p>
            <div className='flex items-center gap-1'>
              <p className='font-bold'>
                ${total}
                {/* <span className='text-muted-foreground'>,00</span> */}
              </p>
              <span className='text-muted-foreground'>{currentCurrency}</span>
            </div>
          </div>
          <p className='text-center text-xs text-muted-foreground'>
            Al hacer clic en "Confirmar", creará una única factura de pago compatible con{' '}
            <span className='text-foreground'>Bitcoin</span> mediante{' '}
            <span className='text-foreground'>Lightning Network</span>.
          </p>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className='flex-1' variant='secondary' onClick={onBack} disabled={isGenerating}>
          Volver
        </Button>
        <Button className='flex-1' onClick={() => onConfirm(currentCurrency)} disabled={isGenerating}>
          {isGenerating ? <LoaderCircle className='size-4 animate-spin' /> : 'Confirmar'}
        </Button>
      </DialogFooter>
    </>
  );
}
