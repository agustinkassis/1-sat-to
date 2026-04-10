'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

import { HistoricalDataPoint } from '@/lib/types';

interface PriceChartProps {
  data: HistoricalDataPoint[];
  isLoading?: boolean;
  onHover?: (point: HistoricalDataPoint | null) => void;
}

export function PriceChart({ data, isLoading, onHover }: PriceChartProps) {
  const { chartData, isPositive } = useMemo(() => {
    if (!data.length) return { chartData: [], isPositive: true };

    const chartData = data.map((point) => ({
      time: point.time,
      value: point.value,
    }));

    const isPositive = data[data.length - 1].value >= data[0].value;

    return { chartData, isPositive };
  }, [data]);

  const lineColor = isPositive ? '#05df72' : '#ff6467';
  const gradientId = isPositive ? 'priceGradientUp' : 'priceGradientDown';

  const [activePoint, setActivePoint] = useState<any>(null);
  const [tooltipX, setTooltipX] = useState(0);

  if (isLoading || !chartData.length) {
    return (
      <div className='absolute z-0 bottom-0 w-full h-[80vh] flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-neutral-500/30 border-t-neutral-900 rounded-full animate-spin' />
      </div>
    );
  }

  if (!isLoading && chartData.length === 0) {
    return (
      <div className='absolute z-0 bottom-0 flex flex-col items-center justify-center w-full h-[80vh] px-4 text-center'>
        <div className='text-2xl mb-4'>⚠️</div>
        <p className='text-foreground text-lg font-medium'>No se pudieron obtener datos históricos</p>
        <p className='text-muted-foreground mt-2 max-w-sm'>
          Estamos teniendo problemas con nuestro proveedor. Intenta recargar en unos minutos.
        </p>
      </div>
    );
  }

  return (
    <div className='absolute z-0 bottom-0 w-full h-[65vh] p-2 md:p-4'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          onMouseMove={(e: any) => {
            if (
              e?.activePayload?.[0]?.payload &&
              typeof e.activePayload[0].payload.value === 'number' &&
              Number.isFinite(e.activePayload[0].payload.value)
            ) {
              const p = e.activePayload[0].payload;
              onHover?.({ time: p.time, value: p.value });

              // Guardamos posición X para colocar el tooltip arriba
              if (e.chartX) {
                setTooltipX(e.chartX);
                setActivePoint(p);
              }
            }
          }}
          onMouseLeave={() => {
            onHover?.(null);
            setActivePoint(null);
            setTooltipX(0);
          }}
        >
          <defs>
            <linearGradient id='priceGradientUp' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#05df72' stopOpacity={0.25} />
              <stop offset='100%' stopColor='#05df72' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='priceGradientDown' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#ff6467' stopOpacity={0.25} />
              <stop offset='100%' stopColor='#ff6467' stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />

          {/* Línea vertical verde (antes era blanca) + sin tooltip flotante default */}
          <Tooltip cursor={{ stroke: 'oklch(0.269 0 0)', strokeWidth: 2 }} content={() => null} />

          <Area
            type='monotone'
            dataKey='value'
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            activeDot={{ r: 6, fill: lineColor, stroke: '#111', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Tooltip personalizado: siempre arriba de la línea, NO sigue el mouse */}
      {activePoint && tooltipX > 0 && (
        <div
          className='absolute z-50 top-14 p-0.5 bg-radial-[at_25%_25%] from-neutral-600/20 to-neutral-100/20 to-75% rounded-full'
          style={{
            left: `${Math.max(20, tooltipX - 40)}px`,
          }}
        >
          <div className='px-4 py-2 bg-background/20 backdrop-blur-md rounded-full shadow-2xl shadow-black text-sm text-foreground pointer-events-none'>
            <p className='text-sm text-foreground whitespace-nowrap'>
              {new Date(activePoint.time * 1000)
                .toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                .toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
