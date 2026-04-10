'use server';

import { PriceData, HistoricalDataPoint, Timeframe, TIMEFRAME_CONFIG } from '@/lib/types';

const SATS_PER_BTC = 100_000_000;

export async function getPrice(currency: string = 'MXN'): Promise<PriceData | null> {
  const endpoints = [
    {
      url: `https://api.yadio.io/exrates/BTC`,
      parse: (d: Record<string, number>) => d[currency],
    },
    {
      url: `https://api.yadio.io/convert/1/BTC/${currency}`,
      parse: (d: { result?: number; rate?: number }) => d.result || d.rate,
    },
  ];

  for (const ep of endpoints) {
    try {
      const resp = await fetch(ep.url, {
        next: { revalidate: 60 },
        headers: { Accept: 'application/json' },
      });
      if (!resp.ok) continue;

      const data = await resp.json();
      const btcPrice = ep.parse(data);

      if (btcPrice && btcPrice > 0) {
        return {
          btcPrice,
          satPrice: btcPrice / SATS_PER_BTC,
          satsPerUnit: SATS_PER_BTC / btcPrice,
          currency,
          timestamp: Date.now(),
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function dedup(data: HistoricalDataPoint[]): HistoricalDataPoint[] {
  const seen = new Map<number, HistoricalDataPoint>();
  for (const p of data) {
    if (!seen.has(p.time)) seen.set(p.time, p);
  }
  return Array.from(seen.values()).sort((a, b) => a.time - b.time);
}

/**
 * CryptoCompare
 * - Datos reales del mercado
 * - Sin restricciones geográficas
 * - Historia completa (5 años en una sola llamada)
 */
export async function getHistoricalData(
  currency: string = 'MXN',
  timeframe: Timeframe = '3m',
): Promise<HistoricalDataPoint[]> {
  const { daysBack } = TIMEFRAME_CONFIG[timeframe];

  // Limit seguro (2000 = máximo gratuito y cubre 5+ años)
  const limit = Math.min(2000, daysBack + 30);
  const toTs = Math.floor(Date.now() / 1000);

  const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=${currency.toUpperCase()}&limit=${limit}&toTs=${toTs}`;

  try {
    const resp = await fetch(url, {
      next: { revalidate: 300 }, // cache 5 minutos
      headers: { Accept: 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = await resp.json();

    if (!json?.Data?.Data || !Array.isArray(json.Data.Data)) {
      throw new Error('Respuesta inválida de CryptoCompare');
    }

    const formatted: HistoricalDataPoint[] = json.Data.Data.map((d: any) => ({
      time: d.time,
      value: (d.close || 0) / SATS_PER_BTC,
    })).filter((d: any) => Number.isFinite(d.value) && d.value > 0);

    return dedup(formatted);
  } catch (error) {
    console.error(`[getHistoricalData] Error CryptoCompare BTC/${currency}:`, error);
    return [];
  }
}
