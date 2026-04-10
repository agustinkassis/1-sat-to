'use client';

import Link from 'next/link';
import { ArrowUpRight, Calculator, Gift, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavDockProps {
  onCalculatorClick: () => void;
  onThemeClick?: () => void;
  onInfoClick: () => void;
  onDonationClick: () => void;
}

export function NavDock({ onCalculatorClick, onThemeClick, onInfoClick, onDonationClick }: NavDockProps) {
  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center gap-1 pb-8 px-4'>
      <div className='w-auto p-0.5 bg-radial-[at_25%_25%] from-neutral-600/20 to-neutral-100/20 to-75% rounded-full'>
        <div className='relative z-0 flex items-center gap-2 p-2 bg-background/20 backdrop-blur-sm rounded-full shadow-2xl shadow-black'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-lg' onClick={onInfoClick}>
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Información</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-lg' onClick={onCalculatorClick}>
                <Calculator />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Calculadora</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-lg' onClick={onDonationClick}>
                <Gift />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Donación</p>
            </TooltipContent>
          </Tooltip>

          {/* <Button variant='ghost' size='icon-lg' onClick={onThemeClick}>
          <Palette />
        </Button> */}
        </div>
      </div>
      <div className='relative z-10'>
        <span className='text-sm text-muted-foreground'>by</span>
        <Button variant='link' asChild>
          <Link href='https://www.jonallamas.com/?utm_source=1-sat-to.vercel.app' target='_blank'>
            @unllamas <ArrowUpRight className='text-muted-foreground' />
          </Link>
        </Button>
      </div>
    </div>
  );
}
