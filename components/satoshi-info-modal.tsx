'use client';

import { X } from 'lucide-react';

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
import { Card, CardContent } from '@/components/ui/card';
import { Satoshi } from '@/components/icon/satoshi';

interface SatoshiInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SatoshiInfoModal({ open, onOpenChange }: SatoshiInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm' showCloseButton={false}>
        <DialogHeader className='flex-row items-center justify-between'>
          <DialogTitle className='text-base font-semibold text-foreground'>¿Qué es un Satoshi?</DialogTitle>
          <DialogClose asChild>
            <Button variant='secondary' size='icon'>
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>

        <DialogBody>
          <p className='text-muted-foreground leading-relaxed'>
            Un <span className='text-foreground font-semibold'>Satoshi</span> (o SAT) es la unidad más pequena de
            Bitcoin. Lleva el nombre de <span className='text-foreground font-semibold'>Satoshi Nakamoto</span>, el
            creador de Bitcoin.
          </p>

          {/* <div className='w-auto p-0.5 bg-radial-[at_25%_25%] from-neutral-600/20 to-neutral-100/20 to-75% rounded-xl'> */}
          <Card className='bg-background/20 backdrop-blur-sm shadow-2xl shadow-black'>
            <CardContent className='text-center'>
              <div className='inline-flex items-center text-foreground text-xl'>
                <Satoshi className='size-5 text-foreground' />
                {Number(100000000).toLocaleString('es-ES')} <span className='ml-1 text-muted-foreground'>SATs</span>
              </div>
              <p className='text-muted-foreground text-md'>= 1 Bitcoin</p>
            </CardContent>
          </Card>
          {/* </div> */}
        </DialogBody>
        <DialogFooter>
          <p className='text-muted-foreground leading-relaxed text-center text-xs'>
            Al igual que un peso se divide en centavos, Bitcoin se divide en Satoshis. Esto permite realizar
            microtransacciones y facilita el uso diario en la red Lightning Network.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
