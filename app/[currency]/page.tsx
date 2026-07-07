import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getPrice, getHistoricalData } from '@/app/actions';

import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '@/lib/types';

import { SatTracker } from '@/components/sat-tracker';

interface PageProps {
  params: Promise<{ currency: string }>;
}

export default async function Page({ params }: PageProps) {
  const { currency } = await params;

  const resolvedCurrency = (currency || DEFAULT_CURRENCY).toUpperCase();
  const isSupportedCurrency = SUPPORTED_CURRENCIES.some(
    (supportedCurrency) => supportedCurrency.code === resolvedCurrency,
  );

  if (!isSupportedCurrency) {
    notFound();
  }

  // Fetch en paralelo en el servidor
  const [price, historicalData] = await Promise.all([
    getPrice(resolvedCurrency),
    getHistoricalData(resolvedCurrency, '3m'),
  ]);

  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='w-8 h-8 border-4 border-neutral-500/30 border-t-neutral-900 rounded-full animate-spin' />
        </div>
      }
    >
      <SatTracker currency={resolvedCurrency} initialPrice={price} initialHistoricalData={historicalData} />
    </Suspense>
  );
}
