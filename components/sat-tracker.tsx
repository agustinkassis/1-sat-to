'use client';

import { useState } from 'react';

import { useSatTracker } from '@/hooks/use-sat-tracker';

import { PriceData, HistoricalDataPoint } from '@/lib/types';

import { LightningProvider } from '@/context/lightning-context';

import { PriceDisplay } from '@/components/price-display';
import { PriceChart } from '@/components/price-chart';
import { TimeframeSelector } from '@/components/timeframe-selector';
import { CalculatorModal } from '@/components/calculator-modal';
import { CurrencySelector } from '@/components/currency-selector';
import { NavDock } from '@/components/nav-dock';
import { SatoshiInfoModal } from '@/components/satoshi-info-modal';
import { LightningPayModal } from '@/components/lightning-modal';

interface SatTrackerProps {
  currency: string;
  initialPrice: PriceData | null;
  initialHistoricalData: HistoricalDataPoint[];
}

export function SatTracker({ currency, initialPrice, initialHistoricalData }: SatTrackerProps) {
  const { price, historicalData, timeframe, timeframeLabel, isLoading, priceChange, changeTimeframe } = useSatTracker({
    currency,
    initialPrice,
    initialHistoricalData,
  });

  // Hover estilo Robinhood
  const [hoveredPoint, setHoveredPoint] = useState<HistoricalDataPoint | null>(null);

  const displaySatPrice = hoveredPoint?.value ?? price?.satPrice ?? 0;

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [satoshiInfoOpen, setSatoshiInfoOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  return (
    <div className='relative w-full h-screen flex flex-col overflow-hidden'>
      {/* Header with currency selector */}
      <div className='absolute top-4 right-4 z-20'>
        <CurrencySelector currentCurrency={currency} />
      </div>

      <div className='relative flex flex-col pt-24 flex-1'>
        <PriceDisplay
          price={price}
          displaySatPrice={displaySatPrice}
          priceChange={priceChange}
          timeframeLabel={timeframeLabel}
        />

        <TimeframeSelector
          current={timeframe}
          onChange={(currentTime) => {
            if (currentTime === timeframe) return;
            changeTimeframe(currentTime);
          }}
        />
      </div>

      <PriceChart data={historicalData} isLoading={isLoading} onHover={setHoveredPoint} />

      <NavDock
        onCalculatorClick={() => setCalculatorOpen(true)}
        onInfoClick={() => setSatoshiInfoOpen(true)}
        onDonationClick={() => setDonationOpen(true)}
      />

      {/* Modals */}
      <CalculatorModal open={calculatorOpen} onOpenChange={setCalculatorOpen} price={price} />
      <SatoshiInfoModal open={satoshiInfoOpen} onOpenChange={setSatoshiInfoOpen} />
      <LightningProvider lnAddress='unllamas@blink.sv'>
        <LightningPayModal open={donationOpen} onOpenChange={setDonationOpen} currency={currency} />
      </LightningProvider>
    </div>
  );
}
