export interface PriceData {
  btcPrice: number;
  satPrice: number;
  satsPerUnit: number;
  currency: string;
  timestamp: number;
}

export interface HistoricalDataPoint {
  time: number;
  value: number;
}

export type Timeframe = '3m' | '6m' | '1y' | '5y';

export type Theme = 'midnight' | 'aurora' | 'cosmos' | 'ember' | 'ocean' | 'matrix';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
  { code: 'BRL', name: 'Real Brasileño', symbol: '$', flag: '🇧🇷' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'PEN', name: 'Sol Peruano', symbol: '$', flag: '🇵🇪' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
];

export const DEFAULT_CURRENCY = 'MXN';

export const TIMEFRAME_CONFIG: Record<
  Timeframe,
  { label: string; textLabel: string; daysBack: number; intervalMinutes: number }
> = {
  '3m': { label: '3M', textLabel: '3 meses', daysBack: 90, intervalMinutes: 480 },
  '6m': { label: '6M', textLabel: '6 meses', daysBack: 180, intervalMinutes: 720 },
  '1y': { label: '1A', textLabel: '1 año', daysBack: 365, intervalMinutes: 1440 },
  '5y': { label: '5A', textLabel: '5 años', daysBack: 1825, intervalMinutes: 4320 },
};
