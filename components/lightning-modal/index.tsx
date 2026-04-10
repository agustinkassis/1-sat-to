'use client';

import { useEffect, useState } from 'react';
import { Check, MessageCircleWarning } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StepSelectOption } from '@/components/lightning-modal/step-select-option';
import { StepConfirmPayment } from '@/components/lightning-modal/step-confirm-payment';
import { StepGenerateQR } from '@/components/lightning-modal/step-generate-qr';

import type { LightningPlan, PaymentStep } from '@/types';
import { Dialog, DialogBody, DialogContent, DialogFooter } from '../ui/dialog';
import { plans } from '@/config/plans';
import { useLightning } from '@/context/lightning-context';

interface LightningPayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
}

export function LightningPayModal({ open, onOpenChange, currency }: LightningPayModalProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedPlan, setSelectedPlan] = useState<LightningPlan | null>(null);

  const { createInvoice, status, error, clearInvoice, isPaid } = useLightning();

  const handleConfirm = async (currentCurrency: string) => {
    setStep(step + 1);
    await createInvoice(Number(selectedPlan?.price), currentCurrency);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = (toStep?: number) => {
    setStep(toStep ? toStep : step - 1);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        clearInvoice();
        setStep(1);
        onOpenChange(false);
      }}
    >
      <DialogContent className='gap-0 max-w-sm p-0' showCloseButton={false}>
        {step === 1 && (
          <StepSelectOption
            key='select'
            plans={plans}
            onNext={(plan: LightningPlan) => {
              setSelectedPlan(plan);
              handleNext();
            }}
          />
        )}

        {step === 2 && selectedPlan && (
          <StepConfirmPayment
            key='confirm'
            currency={currency}
            plan={selectedPlan}
            onConfirm={handleConfirm}
            onBack={() => {
              setSelectedPlan(null);
              handleBack();
            }}
          />
        )}

        {step === 3 && (
          <StepGenerateQR
            key='qr'
            onBack={() => {
              clearInvoice();
              handleBack();
            }}
            onNext={() => {
              handleNext();
            }}
          />
        )}

        {step === 4 && (
          <>
            <DialogBody>
              {error && (
                <div className='text-center space-y-4'>
                  <div className='w-20 h-20 mx-auto bg-red-950/20 rounded-2xl flex items-center justify-center'>
                    <MessageCircleWarning className='size-10 text-red-400' />
                  </div>
                  <div className='space-y-2'>
                    <h2 className='text-2xl font-bold text-foreground'>Ooops!</h2>
                    <p className='text-muted-foreground'>{error}.</p>
                  </div>
                </div>
              )}

              {isPaid && (
                <div className='text-center space-y-4'>
                  <div className='w-20 h-20 mx-auto bg-green-950/20 rounded-2xl flex items-center justify-center'>
                    <Check className='size-10 text-green-400' />
                  </div>
                  <div className='space-y-2'>
                    <h2 className='text-2xl font-bold text-foreground'>Confirmado!</h2>
                    <p className='text-muted-foreground'>Su pago ha sido recibido exitosamente.</p>
                  </div>
                </div>
              )}
            </DialogBody>

            <DialogFooter>
              {error && (
                <Button
                  className='w-full'
                  variant='secondary'
                  onClick={() => {
                    clearInvoice();
                    handleBack(2);
                  }}
                >
                  Volver
                </Button>
              )}
              {isPaid && (
                <Button
                  className='w-full'
                  variant='secondary'
                  onClick={() => {
                    clearInvoice();
                    setStep(1);
                    onOpenChange(false);
                  }}
                >
                  Cerrar
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
