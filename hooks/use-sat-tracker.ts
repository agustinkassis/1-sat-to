'use client';

import { useState, useEffect, useCallback } from 'react';

import { getPrice, getHistoricalData } from '@/app/actions';

import { PriceData, HistoricalDataPoint, Timeframe, TIMEFRAME_CONFIG } from '@/lib/types';

interface UseSatTrackerOptions {
  currency: string;
  initialPrice: PriceData | null;
  initialHistoricalData: HistoricalDataPoint[];
  initialTimeframe?: Timeframe;
}

export function useSatTracker({
  currency,
  initialPrice,
  initialHistoricalData,
  initialTimeframe = '3m',
}: UseSatTrackerOptions) {
  // Inicializar con la data del servidor → sin loading inicial
  const [price, setPrice] = useState<PriceData | null>(initialPrice);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(initialHistoricalData);
  const [timeframe, setTimeframe] = useState<Timeframe>(initialTimeframe);
  const [isLoading, setIsLoading] = useState(false); // false porque ya tenemos data
  const [priceChange, setPriceChange] = useState<number | null>(() => {
    // Calcular el price change inicial
    if (initialHistoricalData.length > 0 && initialPrice) {
      const firstPrice = initialHistoricalData[0].value;
      return ((initialPrice.satPrice - firstPrice) / firstPrice) * 100;
    }
    return null;
  });

  const fetchPrice = useCallback(async () => {
    const newPrice = await getPrice(currency);
    if (newPrice) {
      setPrice(newPrice);
    }
  }, [currency]);

  const fetchHistorical = useCallback(
    async (tf: Timeframe) => {
      setIsLoading(true);
      const data = await getHistoricalData(currency, tf);
      setHistoricalData(data);
      setIsLoading(false);
    },
    [currency],
  );

  // Cuando cambia la currency (navegación), re-fetch todo
  useEffect(() => {
    // Si la currency cambió respecto a la data inicial, refetch
    if (price?.currency !== currency) {
      const init = async () => {
        setIsLoading(true);
        await fetchPrice();
        await fetchHistorical(timeframe);
      };
      init();
    }
  }, [currency]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar cuando llega nueva data del servidor (navegación entre currencies)
  useEffect(() => {
    setPrice(initialPrice);
    setHistoricalData(initialHistoricalData);
    setIsLoading(false);
  }, [initialPrice, initialHistoricalData]);

  // Recalcular price change cuando cambian los datos
  useEffect(() => {
    if (historicalData.length > 0 && price) {
      const firstPrice = historicalData[0].value;
      const change = ((price.satPrice - firstPrice) / firstPrice) * 100;
      setPriceChange(change);
    }
  }, [historicalData, price]);

  // Refetch price cada minuto
  useEffect(() => {
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  // Refetch historical cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => fetchHistorical(timeframe), 300000);
    return () => clearInterval(interval);
  }, [fetchHistorical, timeframe]);

  const changeTimeframe = useCallback(
    async (tf: Timeframe) => {
      setTimeframe(tf);
      await fetchHistorical(tf);
    },
    [fetchHistorical],
  );

  return {
    price,
    historicalData,
    timeframe,
    timeframeLabel: TIMEFRAME_CONFIG[timeframe].label,
    isLoading,
    priceChange,
    changeTimeframe,
    refresh: fetchPrice,
  };
}
