'use client';

import { Button } from '@/components/ui/button';

import type { LightningPlan } from '@/types';
import { DialogBody, DialogClose, DialogHeader, DialogTitle } from '../ui/dialog';
import { X } from 'lucide-react';

interface StepSelectOptionProps {
  plans: LightningPlan[];
  onNext: (plan: LightningPlan) => void;
}

export function StepSelectOption({ plans, onNext }: StepSelectOptionProps) {
  return (
    <>
      <DialogHeader className='flex-row items-center justify-between'>
        <DialogTitle className='text-base font-semibold text-white'>Dejame un regalo de...</DialogTitle>
        <DialogClose asChild>
          <Button variant='secondary' size='icon'>
            <X />
          </Button>
        </DialogClose>
      </DialogHeader>
      {/* <div className='relative flex justify-center items-center w-full text-6xl font-semibold'>
        <div className='z-10 flex items-end h-full px-2 text-muted-foreground/20'>$</div>
        <input
          type='number'
          className='w-32 bg-transparent text-foreground placeholder:text-muted-foreground'
          placeholder='100'
          value={inputValue}
          disabled
        />
      </div> */}
      <DialogBody className='flex-row flex-wrap gap-2 justify-center'>
        {plans.map((plan: LightningPlan, index) => (
          <Button className='px-8' variant='secondary' key={index} onClick={() => onNext(plan)}>
            ${plan?.price}
          </Button>
        ))}
      </DialogBody>
    </>
  );
}
