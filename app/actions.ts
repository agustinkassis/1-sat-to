'use server';

import { PriceData, HistoricalDataPoint, Timeframe, TIMEFRAME_CONFIG } from '@/lib/types';

const SATS_PER_BTC = 100_000_000;
const YADIO_MAX_HISTORY_DAYS = 365;
const BINANCE_KLINE_LIMIT = 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type YadioExratesResponse = {
  BTC?: Record<string, number>;
  timestamp?: number;
};

type YadioConvertResponse = {
  result?: number;
  rate?: number;
  timestamp?: number;
};

type YadioHistoricalPoint = {
  date?: string;
  avg24h?: number;
  price?: number;
  usdbtc?: number;
};

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

const BINANCE_SYMBOLS: Partial<Record<string, string>> = {
  ARS: 'BTCARS',
  BRL: 'BTCBRL',
  MXN: 'BTCMXN',
  USD: 'BTCUSD',
};

export async function getPrice(currency: string = 'MXN'): Promise<PriceData | null> {
  const normalizedCurrency = currency.toUpperCase();
  const endpoints = [
    {
      url: `https://api.yadio.io/exrates/BTC`,
      parse: (d: YadioExratesResponse) => d.BTC?.[normalizedCurrency],
    },
    {
      url: `https://api.yadio.io/convert/1/BTC/${normalizedCurrency}`,
      parse: (d: YadioConvertResponse) => d.result || d.rate,
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
          currency: normalizedCurrency,
          timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
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

function parseYadioDate(date: string): number | null {
  const [month, day, year] = date.split('/').map(Number);
  if (!month || !day || !year) return null;

  return Math.floor(Date.UTC(year, month - 1, day) / 1000);
}

function formatYadioHistoricalData(data: YadioHistoricalPoint[]): HistoricalDataPoint[] {
  return dedup(
    data
      .map((point) => {
        const time = point.date ? parseYadioDate(point.date) : null;
        const btcPrice = point.avg24h ?? point.price ?? point.usdbtc;

        if (!time || !btcPrice || !Number.isFinite(btcPrice) || btcPrice <= 0) {
          return null;
        }

        return {
          time,
          value: btcPrice / SATS_PER_BTC,
        };
      })
      .filter((point): point is HistoricalDataPoint => point !== null),
  );
}

function isBinanceKline(value: unknown): value is BinanceKline {
  return Array.isArray(value) && typeof value[0] === 'number' && typeof value[4] === 'string';
}

function formatBinanceHistoricalData(data: BinanceKline[]): HistoricalDataPoint[] {
  return dedup(
    data
      .map((point) => {
        const btcPrice = Number(point[4]);

        if (!Number.isFinite(btcPrice) || btcPrice <= 0) {
          return null;
        }

        return {
          time: Math.floor(point[0] / 1000),
          value: btcPrice / SATS_PER_BTC,
        };
      })
      .filter((point): point is HistoricalDataPoint => point !== null),
  );
}

async function getYadioHistoricalData(currency: string, range: number): Promise<HistoricalDataPoint[]> {
  const url = `https://api.yadio.io/hist/${range}/${currency}`;

  const resp = await fetch(url, {
    next: { revalidate: 300 }, // cache 5 minutos
    headers: { Accept: 'application/json' },
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }

  const json = await resp.json();

  if (!Array.isArray(json)) {
    throw new Error('Respuesta inválida de Yadio');
  }

  return formatYadioHistoricalData(json);
}

async function getBinanceHistoricalData(currency: string, daysBack: number): Promise<HistoricalDataPoint[]> {
  const symbol = BINANCE_SYMBOLS[currency];
  if (!symbol) return [];

  const endTime = Date.now();
  let startTime = endTime - daysBack * DAY_MS;
  const klines: BinanceKline[] = [];

  for (let page = 0; page < 3 && startTime < endTime; page += 1) {
    const url = new URL('https://api.binance.com/api/v3/klines');
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', '1d');
    url.searchParams.set('startTime', String(startTime));
    url.searchParams.set('endTime', String(endTime));
    url.searchParams.set('limit', String(BINANCE_KLINE_LIMIT));

    const resp = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = await resp.json();
    if (!Array.isArray(json)) return [];

    const pageKlines = json.filter(isBinanceKline);
    if (!pageKlines.length) break;

    klines.push(...pageKlines);

    const lastOpenTime = pageKlines[pageKlines.length - 1][0];
    const nextStartTime = lastOpenTime + DAY_MS;
    if (nextStartTime <= startTime || pageKlines.length < BINANCE_KLINE_LIMIT) break;

    startTime = nextStartTime;
  }

  return formatBinanceHistoricalData(klines);
}

export async function getHistoricalData(
  currency: string = 'MXN',
  timeframe: Timeframe = '3m',
): Promise<HistoricalDataPoint[]> {
  const { daysBack } = TIMEFRAME_CONFIG[timeframe];
  const normalizedCurrency = currency.toUpperCase();
  const range = Math.min(YADIO_MAX_HISTORY_DAYS, daysBack);

  if (daysBack > YADIO_MAX_HISTORY_DAYS) {
    try {
      const binanceData = await getBinanceHistoricalData(normalizedCurrency, daysBack);
      if (binanceData.length > 0) return binanceData;
    } catch (error) {
      console.error(`[getHistoricalData] Error Binance BTC/${normalizedCurrency}:`, error);
    }
  }

  try {
    return await getYadioHistoricalData(normalizedCurrency, range);
  } catch (error) {
    console.error(`[getHistoricalData] Error Yadio BTC/${normalizedCurrency}:`, error);
    return [];
  }
}
