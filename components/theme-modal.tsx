'use client';

import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTheme, THEMES } from '@/lib/theme-context';
import { Theme } from '@/lib/types';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ThemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const THEME_PREVIEWS: Record<Theme, React.CSSProperties> = {
  midnight: { background: '#0a0a0a' },
  aurora: {
    background: '#0a0a0a',
    backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(120, 50, 255, 0.3), transparent),
      radial-gradient(ellipse 60% 50% at 70% 0%, rgba(249, 115, 22, 0.2), transparent)`,
  },
  cosmos: {
    background: '#0a0a0a',
    backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(1.5px 1.5px at 80% 20%, rgba(249, 115, 22, 0.6), transparent),
      radial-gradient(1px 1px at 40% 50%, rgba(255, 255, 255, 0.3), transparent)`,
  },
  ember: {
    background: 'linear-gradient(160deg, #0a0a0a 0%, #1a0800 50%, #0a0a0a 100%)',
  },
  ocean: {
    background: '#0a0a0a',
    backgroundImage: 'radial-gradient(ellipse 100% 70% at 50% 120%, rgba(6, 78, 140, 0.25), transparent)',
  },
  matrix: {
    backgroundColor: '#050a05',
    backgroundImage: `linear-gradient(rgba(0, 255, 65, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 65, 0.08) 1px, transparent 1px)`,
    backgroundSize: '8px 8px',
  },
};

export function ThemeModal({ open, onOpenChange }: ThemeModalProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm' showCloseButton={false}>
        <DialogHeader className='h-auto flex-row items-center justify-between'>
          <DialogTitle className='text-base font-semibold text-white'>Apariencia</DialogTitle>
          <DialogClose asChild>
            <Button variant='ghost' size='icon' className='rounded-lg hover:bg-neutral-800 text-neutral-400'>
              <X className='w-5 h-5' />
            </Button>
          </DialogClose>
        </DialogHeader>

        <DialogBody className='grid grid-cols-2 gap-2'>
          {THEMES.map(({ name, label }) => (
            <button
              key={name}
              onClick={() => setTheme(name)}
              className={cn(
                'rounded-xl border-2 p-2.5 text-center transition-all cursor-pointer',
                theme === name
                  ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                  : 'border-white/6 hover:border-orange-500/40',
              )}
            >
              <div
                className='w-full h-14 rounded-lg mb-2 border border-white/4 overflow-hidden'
                style={THEME_PREVIEWS[name]}
              />
              <span className='text-[11px] font-medium text-neutral-300'>{label}</span>
            </button>
          ))}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
