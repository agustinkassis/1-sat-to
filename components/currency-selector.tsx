'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { SUPPORTED_CURRENCIES } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CurrencySelectorProps {
  currentCurrency: string;
}

export function CurrencySelector({ currentCurrency }: CurrencySelectorProps) {
  const current = SUPPORTED_CURRENCIES.find((c) => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary'>
          {current.flag} {current.code}
          <ChevronDown className='w-4 h-4 text-muted-foreground' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {SUPPORTED_CURRENCIES.map((currency) => (
          <DropdownMenuItem key={currency.code} asChild>
            <Link href={`/${currency?.code}`}>
              <span className='mr-2'>{currency.flag}</span>
              <span className='flex-1'>{currency.name}</span>
              <span className='text-muted-foreground text-xs'>{currency.code}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
