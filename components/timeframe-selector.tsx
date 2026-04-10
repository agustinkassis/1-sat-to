'use client';

import { Timeframe, TIMEFRAME_CONFIG } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeframeSelectorProps {
  current: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({ current, onChange }: TimeframeSelectorProps) {
  const timeframes = Object.entries(TIMEFRAME_CONFIG) as [Timeframe, (typeof TIMEFRAME_CONFIG)['3m']][];

  return (
    <div className='relative z-10 px-5 pb-2 flex justify-center'>
      <div className='w-auto p-0.5 bg-radial-[at_25%_25%] from-neutral-600/20 to-neutral-100/20 to-75% backdrop-blur-sm rounded-full'>
        <div className='flex gap-1 w-fit p-2 bg-background/0 backdrop-blur-xl rounded-full shadow-2xl shadow-black'>
          {timeframes.map(([key, config]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button size='icon' onClick={() => onChange(key)} variant={current === key ? 'default' : 'ghost'}>
                  {config.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>{config?.textLabel}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
